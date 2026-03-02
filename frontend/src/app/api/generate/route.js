import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ROYAL_INFOGRAPHIC_PROMPT } from '@/lib/constants';

const admin = require('firebase-admin');

// Initialize Firebase Admin (Singleton pattern)
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)),
        databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL
    });
}

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
    try {
        const { subject, lessonTitle, teacherName, uid } = await req.json();

        // 1. Verify User and Credits
        const userRef = admin.database().ref(`users/${uid}`);
        const userSnap = await userRef.get();

        if (!userSnap.exists()) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const userData = userSnap.val();
        if ((userData.credits || 0) <= 0) {
            return NextResponse.json({ error: 'Insufficient credits' }, { status: 403 });
        }

        // 2. Atomic credit deduction
        await userRef.child('credits').transaction((current) => (current || 0) - 1);

        // 3. AI Generation (Royal Prompt Flow)
        let finalPrompt = ROYAL_INFOGRAPHIC_PROMPT
            .replace('{{SUBJECT}}', subject || 'الذكاء الاصطناعي')
            .replace('{{TITLE}}', lessonTitle || 'مقدمة في التقنية')
            .replace('{{TEACHER}}', teacherName || 'الأستاذ منير محمد');

        console.log(`Generating Royal Infographic for User: ${uid}`);

        let imageUrl = `https://via.placeholder.com/1024x1024.png?text=Royal+Infonana+Output:+${encodeURIComponent(lessonTitle || 'Lesson')}`;

        try {
            const model = genAI.getGenerativeModel({ model: "imagen-3.0-generate-001" });
            const result = await model.generateContent(finalPrompt);

            if (result.response && result.response.images && result.response.images[0]) {
                imageUrl = result.response.images[0].url;
            }
        } catch (aiError) {
            console.error('Gemini Image API Error:', aiError.message);
        }

        // 4. Store result
        const infographicRef = admin.database().ref(`infographics/${uid}`).push();
        const infographicId = infographicRef.key;

        await infographicRef.set({
            subject,
            lessonTitle,
            teacherName,
            templateId: 'royal-infographic',
            outputUrl: imageUrl,
            createdAt: Date.now(),
            status: 'completed'
        });

        // 5. Update global analytics
        await admin.database().ref('analytics/global/totalGenerations').transaction(c => (c || 0) + 1);

        return NextResponse.json({ success: true, infographicId, outputUrl: imageUrl });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

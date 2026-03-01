import { NextResponse } from 'next/server';
const admin = require('firebase-admin');

// Initialize Firebase Admin (Singleton pattern)
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)),
        databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL
    });
}

export async function POST(req) {
    try {
        const { prompt, templateId, uid } = await req.json();

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

        // 3. AI Generation (Placeholder for OpenAI call)
        // In production, use: const response = await openai.chat.completions.create(...)
        const aiResponse = {
            imageUrl: "https://via.placeholder.com/800x1200.png?text=AI+Infographic",
            title: `Infographic: ${prompt.substring(0, 20)}`
        };

        // 4. Store result
        const infographicRef = admin.database().ref(`infographics/${uid}`).push();
        await infographicRef.set({
            prompt,
            templateId,
            outputUrl: aiResponse.imageUrl,
            createdAt: Date.now(),
            status: 'completed'
        });

        // 5. Update global analytics
        await admin.database().ref('analytics/global/totalGenerations').transaction(c => (c || 0) + 1);

        return NextResponse.json({ success: true, infographicId: infographicRef.key });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

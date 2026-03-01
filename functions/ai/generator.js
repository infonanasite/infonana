const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { OpenAI } = require('openai');

const openai = new OpenAI({
    apiKey: functions.config().openai.key
});

/**
 * Generate Infographic Cloud Function
 */
exports.generateInfographic = functions.https.onCall(async (data, context) => {
    // 1. Authenticate user
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'User must be logged in.');
    }

    const uid = context.auth.uid;
    const { prompt, templateId } = data;

    if (!prompt) {
        throw new functions.https.HttpsError('invalid-argument', 'Prompt is required.');
    }

    // 2. Access database for plan and credits
    const userRef = admin.database().ref(`users/${uid}`);
    const userSnap = await userRef.get();

    if (!userSnap.exists()) {
        throw new functions.https.HttpsError('not-found', 'User data not found.');
    }

    const userData = userSnap.val();
    const currentCredits = userData.credits || 0;

    // 3. Check credits
    if (currentCredits <= 0) {
        throw new functions.https.HttpsError('failed-precondition', 'Insufficient credits. Please upgrade your plan.');
    }

    try {
        // 4. Atomic credit deduction
        await userRef.child('credits').transaction((current) => (current || 0) - 1);

        // 5. AI API Call (Placeholder Logic)
        // In a real scenario, this would generate structure/content or an image
        console.log(`Generating infographic for prompt: ${prompt} with template: ${templateId}`);

        // Mocking AI response
        const aiResponse = {
            title: `Infographic: ${prompt.substring(0, 20)}...`,
            sections: [
                { title: "Point 1", content: "AI generated content for point 1" },
                { title: "Point 2", content: "AI generated content for point 2" }
            ],
            imageUrl: "https://via.placeholder.com/800x1200.png?text=AI+Infographic" // Placeholder
        };

        // 6. Store record in Realtime DB
        const infographicRef = admin.database().ref(`infographics/${uid}`).push();
        const infographicId = infographicRef.key;

        const infographicData = {
            id: infographicId,
            prompt,
            templateId: templateId || 'default',
            content: aiResponse,
            status: 'completed',
            createdAt: admin.database.ServerValue.TIMESTAMP,
            outputUrl: aiResponse.imageUrl
        };

        await infographicRef.set(infographicData);

        // 7. Increment usage counters atomically
        const month = new Date().toISOString().slice(0, 7); // YYYY-MM
        const usageRef = admin.database().ref(`usage/${uid}/${month}`);
        await usageRef.child('generations').transaction((current) => (current || 0) + 1);

        await admin.database().ref('analytics/global/totalGenerations').transaction((current) => (current || 0) + 1);

        return { success: true, infographicId, infographicData };

    } catch (error) {
        console.error('Generation Error:', error);
        // Refund credit if AI failed
        await userRef.child('credits').transaction((current) => (current || 0) + 1);
        throw new functions.https.HttpsError('internal', 'Failed to generate infographic.');
    }
});

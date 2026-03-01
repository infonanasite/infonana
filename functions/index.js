const admin = require('firebase-admin');
admin.initializeApp();

const { generateInfographic } = require('./ai/generator');
const { handleStripeWebhook } = require('./billing/stripe');

/**
 * AI Generation Functions
 */
exports.generateInfographic = generateInfographic;

/**
 * Billing & Subscriptions
 */
exports.stripeWebhook = handleStripeWebhook;

/**
 * Usage Tracking (Example of internal utility or additional trigger)
 */
exports.incrementDownloadCount = require('firebase-functions').https.onCall(async (data, context) => {
    if (!context.auth) throw new require('firebase-functions').https.HttpsError('unauthenticated', 'Login required');

    const { infographicId } = data;
    const uid = context.auth.uid;
    const month = new Date().toISOString().slice(0, 7);

    // Atomic increments
    const updates = {};
    updates[`usage/${uid}/${month}/downloads`] = admin.database.ServerValue.increment(1);

    return admin.database().ref().update(updates);
});

/**
 * On User Creation: Set defaults
 */
exports.onUserCreated = require('firebase-functions').auth.user().onCreate(async (user) => {
    const { uid, email } = user;

    const defaultData = {
        email: email,
        role: 'USER',
        plan: 'FREE',
        credits: 5,
        createdAt: admin.database.ServerValue.TIMESTAMP,
        subscriptionStatus: 'none'
    };

    await admin.database().ref(`users/${uid}`).set(defaultData);

    // Set default claim
    await admin.auth().setCustomUserClaims(uid, { role: 'USER' });

    // Update global analytics
    await admin.database().ref('analytics/global/totalUsers').transaction((current) => (current || 0) + 1);
});

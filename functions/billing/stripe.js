const functions = require('firebase-functions');
const admin = require('firebase-admin');
const stripe = require('stripe')(functions.config().stripe.secret_key);

/**
 * Handle Stripe Webhooks
 */
exports.handleStripeWebhook = functions.https.onRequest(async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = functions.config().stripe.webhook_secret;

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
    } catch (err) {
        console.error('Webhook signature verification failed.', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    const session = event.data.object;

    switch (event.type) {
        case 'checkout.session.completed':
            await handleCheckoutCompleted(session);
            break;
        case 'customer.subscription.updated':
            await handleSubscriptionUpdated(session);
            break;
        case 'customer.subscription.deleted':
            await handleSubscriptionDeleted(session);
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
});

async function handleCheckoutCompleted(session) {
    const userId = session.client_reference_id;
    const customerId = session.customer;
    const subscriptionId = session.subscription;

    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const planId = subscription.items.data[0].plan.id;

    const planMap = {
        [functions.config().stripe.plans.pro]: 'PRO',
        [functions.config().stripe.plans.enterprise]: 'ENTERPRISE'
    };

    const role = planMap[planId] || 'USER';

    await admin.database().ref(`users/${userId}`).update({
        stripeCustomerId: customerId,
        subscriptionStatus: 'active',
        plan: role,
        credits: role === 'PRO' ? 50 : (role === 'ENTERPRISE' ? 500 : 5)
    });

    await admin.database().ref(`subscriptions/${userId}`).set({
        stripeSubscriptionId: subscriptionId,
        plan: role,
        status: 'active',
        currentPeriodEnd: subscription.current_period_end
    });

    // Set custom claims for RBAC
    await admin.auth().setCustomUserClaims(userId, { role });
}

async function handleSubscriptionUpdated(subscription) {
    const customerId = subscription.customer;
    const userSnapshot = await admin.database().ref('users').orderByChild('stripeCustomerId').equalTo(customerId).once('value');

    if (!userSnapshot.exists()) return;

    const userId = Object.keys(userSnapshot.val())[0];
    const planId = subscription.items.data[0].plan.id;

    const planMap = {
        [functions.config().stripe.plans.pro]: 'PRO',
        [functions.config().stripe.plans.enterprise]: 'ENTERPRISE'
    };

    const role = planMap[planId] || 'USER';

    await admin.database().ref(`users/${userId}`).update({
        plan: role,
        subscriptionStatus: subscription.status
    });

    await admin.database().ref(`subscriptions/${userId}`).update({
        status: subscription.status,
        currentPeriodEnd: subscription.current_period_end
    });

    await admin.auth().setCustomUserClaims(userId, { role });
}

async function handleSubscriptionDeleted(subscription) {
    const customerId = subscription.customer;
    const userSnapshot = await admin.database().ref('users').orderByChild('stripeCustomerId').equalTo(customerId).once('value');

    if (!userSnapshot.exists()) return;

    const userId = Object.keys(userSnapshot.val())[0];

    await admin.database().ref(`users/${userId}`).update({
        plan: 'FREE',
        subscriptionStatus: 'canceled',
        credits: 5
    });

    await admin.database().ref(`subscriptions/${userId}`).update({
        status: 'canceled'
    });

    await admin.auth().setCustomUserClaims(userId, { role: 'USER' });
}

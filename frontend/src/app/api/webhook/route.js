import { NextResponse } from 'next/server';
const admin = require('firebase-admin');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)),
        databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL
    });
}

export async function POST(req) {
    const body = await req.text();
    const sig = req.headers.get('stripe-signature');
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } catch (err) {
        console.error('Webhook signature verification failed.', err.message);
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    const session = event.data.object;

    try {
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
        return NextResponse.json({ received: true });
    } catch (error) {
        console.error('Webhook processing failed:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

async function handleCheckoutCompleted(session) {
    const userId = session.client_reference_id;
    const customerId = session.customer;
    const subscriptionId = session.subscription;

    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const planId = subscription.items.data[0].plan.id;

    // Plan mapping (using environment variables for plan IDs)
    const role = planId === process.env.STRIPE_PLAN_PRO_ID ? 'PRO' :
        (planId === process.env.STRIPE_PLAN_ENTERPRISE_ID ? 'ENTERPRISE' : 'USER');

    const credits = role === 'PRO' ? 50 : (role === 'ENTERPRISE' ? 500 : 5);

    await admin.database().ref(`users/${userId}`).update({
        stripeCustomerId: customerId,
        subscriptionStatus: 'active',
        plan: role,
        credits: credits
    });

    await admin.database().ref(`subscriptions/${userId}`).set({
        stripeSubscriptionId: subscriptionId,
        plan: role,
        status: 'active',
        currentPeriodEnd: subscription.current_period_end
    });

    // Custom claims update (Server-side via Admin SDK)
    await admin.auth().setCustomUserClaims(userId, { role });
}

async function handleSubscriptionUpdated(subscription) {
    const customerId = subscription.customer;
    const userSnapshot = await admin.database().ref('users').orderByChild('stripeCustomerId').equalTo(customerId).once('value');

    if (!userSnapshot.exists()) return;

    const userId = Object.keys(userSnapshot.val())[0];
    const planId = subscription.items.data[0].plan.id;

    const role = planId === process.env.STRIPE_PLAN_PRO_ID ? 'PRO' :
        (planId === process.env.STRIPE_PLAN_ENTERPRISE_ID ? 'ENTERPRISE' : 'USER');

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

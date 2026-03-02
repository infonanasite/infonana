# 🚀 Infonana Configuration & Deployment Guide

This guide provides a step-by-step walkthrough to extract and configure every single key required for the Infonana SaaS platform.

## 📁 Environment Files

You must create a `.env.local` file in the following directories:
- `frontend/` (Main application)
- `admin-dashboard/` (Admin panel)

---

## 🔑 1. Firebase Client Configuration

These keys are required for both `frontend/` and `admin-dashboard/`.

### How to get it:
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Select your project: **Infonana Site**.
3. Click the **Gear icon (Project Settings)** > **General**.
4. Scroll down to **Your apps**, click the **Config** radio button.
5. Copy the values into your `.env.local` files:

| Variable | Value (Example) |
| :--- | :--- |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | `AIzaSy...` |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `infonana-site.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_DATABASE_URL` | `https://infonana-site-default-rtdb.firebaseio.com/` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `infonana-site` |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | `infonana-site.appspot.com` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | `1234567890` |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | `1:123456...` |

---

## 🔐 2. Server-Side Keys (Frontend Only)

These are secret keys and must **ONLY** be put in `frontend/.env.local`.

### 🛡️ Firebase Admin Service Account
1. In Firebase Console, go to **Project Settings** > **Service accounts**.
2. Click **Generate new private key** > **Generate key**.
3. A `.json` file will download.
4. Open the file, copy the **entire JSON content**, and paste it as a string:
   `FIREBASE_SERVICE_ACCOUNT_KEY='{"type": "service_account", ...}'`

### 🍌 Gemini AI (Nano Banana Pro)
1. Go to [Google AI Studio](https://aistudio.google.com/).
2. Click **Get API key** in the sidebar.
3. Create a new API key.
4. (Optional) In the sidebar, search for **Imagen 3** and ensure you have access to image models.
5. `GEMINI_API_KEY=your_key_here`

### 💳 Stripe (Payments)
1. Log in to your [Stripe Dashboard](https://dashboard.stripe.com/).
2. **Secret Key**: Go to **Developers** > **API keys** and copy the `sk_test_...` (or `sk_live_...`).
3. **Plan IDs**: Go to **Products**, create "Pro" and "Enterprise" products. Copy their **Price IDs** (e.g., `price_1P...`).
4. **Webhook Secret**: 
   - Go to **Developers** > **Webhooks**.
   - Click **Add endpoint**.
   - URL: `https://your-domain.com/api/webhook`
   - Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`.
   - After saving, click **Reveal Signing Secret** (`whsec_...`).

| Variable | Description |
| :--- | :--- |
| `STRIPE_SECRET_KEY` | Your Stripe Secret Key. |
| `STRIPE_WEBHOOK_SECRET` | Your Webhook signing secret. |
| `STRIPE_PLAN_PRO_ID` | Price ID for the Pro Plan. |
| `STRIPE_PLAN_ENTERPRISE_ID` | Price ID for the Enterprise Plan. |

---

## 🛡️ 3. Role-Based Access Control (Admin Setup)

To make yourself an **ADMIN**:
1. Go to the [Firebase Realtime Database](https://console.firebase.google.com/project/_/database).
2. Ensure you have the `database.rules.json` deployed or copied into the **Rules** tab.
3. Sign up as a user on the Infonana site.
4. Manually go to the database and find your `uid` under `users/`.
5. Add or change `"plan": "ADMIN"` for your user entry.
6. The next time you log in, the system will recognize you as an Admin in the `admin-dashboard`.

---

## 🚀 Deployment Checklist

1. [ ] Deploy Realtime Database rules (`database.rules.json`).
2. [ ] Deploy Storage rules (`storage.rules`).
3. [ ] Set all Environment Variables in Vercel/Netlify.
4. [ ] Run `npm build` to verify there are no compilation errors.
5. [ ] Configure Stripe Webhooks to point to your live site URL.

---

> [!CAUTION]
> **NEVER** share your `.env.local` or commit it to version control. If a key is leaked, revoke it immediately in the respective dashboard.

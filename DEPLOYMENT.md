# 🚀 Infonana Configuration & Deployment Guide

This guide explains how to configure all the necessary environment variables and keys for the Infonana SaaS platform.

## 📁 Environment Variable Files

You need two `.env.local` files:
1. `frontend/.env.local` - For the main user application and AI backend.
2. `admin-dashboard/.env.local` - For the administrative control panel.

---

## 🔑 1. Firebase Configuration (Both Frontends)

Get these from **Firebase Project Settings** > **General** > **Your apps**.

| Variable | Description |
| :--- | :--- |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Your public Firebase API key. |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | e.g. `your-project.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_DATABASE_URL` | e.g. `https://your-project.firebaseio.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Your unique Firebase project ID. |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | e.g. `your-project.appspot.com` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Your sender ID for notifications. |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Your Firebase App ID. |

---

## 🔐 2. Backend & Server-Side Keys (Frontend Only)

These must be kept secret and only exist in `frontend/.env.local`.

### 🛡️ Firebase Admin (Service Account)
**Required for Database & Auth Admin actions.**
1. Go to **Firebase Settings** > **Service Accounts**.
2. Click **Generate new private key**.
3. Copy the entire JSON content into the variable below.

| Variable | Value |
| :--- | :--- |
| `FIREBASE_SERVICE_ACCOUNT_KEY` | `{"type": "service_account", ...}` |

### 🍌 AI Generation (Gemini API)
**Required for Nano Banana Pro / Royal Prompt logic.**
1. Get your key from [Google AI Studio](https://aistudio.google.com/).
2. Enable **Imagen 3** (image generation) access for your key.

| Variable | Description |
| :--- | :--- |
| `GEMINI_API_KEY` | Your Gemini / Google Generative AI key. |

### 💳 Payments (Stripe)
**Required for subscriptions and billing.**
1. Get these from your [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys).

| Variable | Description |
| :--- | :--- |
| `STRIPE_SECRET_KEY` | Your Stripe Secret Key (`sk_...`). |
| `STRIPE_WEBHOOK_SECRET` | Get this after setting up a webhook to `your-site.com/api/webhook`. |
| `STRIPE_PLAN_PRO_ID` | The Price ID for your Pro plan (`price_...`). |
| `STRIPE_PLAN_ENTERPRISE_ID` | The Price ID for your Enterprise plan (`price_...`). |

---

## 🛠️ Typical Setup Command

```bash
# Clone the repository
git clone https://github.com/infonanasite/infonana.git
cd infonana

# Navigate to frontend and install
cd frontend
cp .env.example .env.local
# (Edit .env.local with your keys)
npm install
npm run dev
```

---

> [!IMPORTANT]
> **Security Warning:** Never commit your `.env.local` files to GitHub. They are already listed in `.gitignore` to keep your project safe.

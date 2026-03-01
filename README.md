# 🍌 Infonana AI - Production-Ready Infographic SaaS

![Infonana Banner](https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2000)

Infonana is a premium, AI-powered SaaS platform that transforms raw data, prompts, and articles into professional, high-impact infographics in seconds. Built with a modern tech stack focused on scalability and performance.

## 🚀 Key Features

- **🎨 AI Infographic Generation**: Powered by OpenAI to convert text/data into visual structures.
- **💎 Premium UI/UX**: High-end dark aesthetic built with Next.js, TailwindCSS, and Framer Motion.
- **💳 Stripe Subscription Suite**: Integrated Free, Pro, and Enterprise plans with usage-based gating.
- **🔐 Advanced RBAC**: Custom Firebase Claims to enforce User and Admin roles.
- **📊 Admin Dashboard**: Monitor global analytics, total revenue, and manage users via a dedicated panel.
- **⚡ Performance Optimized**: Atomic credit tracking and usage counters using Firebase Realtime Database.

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, TailwindCSS, Lucide React, Framer Motion
- **Backend**: Firebase Cloud Functions (Node.js 20)
- **Database**: Firebase Realtime Database
- **Auth**: Firebase Authentication + Custom RBAC Claims
- **Payments**: Stripe (Checkout + Webhooks + Billing Portal)
- **AI**: OpenAI API

## 📂 Project Structure

```text
/infonana/
├─ /frontend/          # Next.js User Application (Landing, Dashboard, Billing)
├─ /admin-dashboard/   # Next.js Admin Panel (Analytics, User Management)
├─ /functions/         # Firebase Cloud Functions (AI Logic, Stripe Webhooks)
├─ firebase.json       # Firebase deployment config
└─ database.rules.json # Realtime DB security rules
```

## ⚙️ Setup & Installation

### 1. Prerequisite
- Node.js 20+
- Firebase CLI (`npm install -g firebase-tools`)
- Stripe & OpenAI Accounts

### 2. Environment Configuration
Set your Firebase functions config:
```bash
firebase functions:config:set stripe.secret_key="sk_test_..." stripe.webhook_secret="whsec_..."
firebase functions:config:set openai.key="sk-..."
```

Update the Firebase config in `frontend/src/lib/firebase.js` and `admin-dashboard/src/lib/firebase.js`.

### 3. Installation
```bash
# Install root functions
cd functions && npm install

# Install frontend
cd ../frontend && npm install

# Install admin dashboard
cd ../admin-dashboard && npm install
```

### 4. Running Locally
```bash
# Frontend
cd frontend && npm run dev

# Admin Dashboard
cd admin-dashboard && npm run dev
```

## 🛡️ Security & Rules
The project uses strict Firebase Realtime Database rules defined in `database.rules.json`.
- Users can only read/write their own data.
- Admins have global read/write access.
- All critical transactions (credits, subscriptions) happen on the backend via Cloud Functions.

## 📄 License
MIT License - Created for the future of data visualization.

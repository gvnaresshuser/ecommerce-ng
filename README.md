# 🚀 Angular v21 + Express + PostgreSQL + Razorpay

## Full Stack Deployment Guide (Vercel)

This project demonstrates **Full Stack E-Commerce Deployment** using:

- Angular v21 (Standalone Components)
- Express.js (Serverless API)
- PostgreSQL (Cloud DB – Render)
- Razorpay Payment Gateway
- Vercel (Frontend + Backend Hosting)

---

# 📁 Project Structure

```
ecommerce-ng
│
├── ecommerceapp        → Angular Frontend
├── ecommerce-server    → Express Backend (Serverless)
└── README.md
```

---

# ✅ STEP 1 — Create GitHub Repository

Create new repo:

```
ecommerce-ng
```

Push project:

```bash
git init
git add .
git commit -m "initial ecommerce fullstack"
git branch -M main
git remote add origin https://github.com/gvnaresshuser/ecommerce-ng.git
git push -u origin main
```

### ⭐ After any change later

```bash
git add .
git commit -m "your message"
git push
```

---

# ✅ STEP 2 — Install Vercel CLI

```bash
npm i -g vercel
vercel login
```

---

# ✅ STEP 3 — Backend Deployment (Express Serverless)

Go to backend folder:

```bash
cd ecommerce-server
```

---

## ⭐ Express Server must be Serverless

### api/index.js

```js
import express from "express";

const app = express();

/* routes */

export default app;
```

❌ Do NOT use:

```js
app.listen(5000);
```

---

## ⭐ Backend vercel.json

Create file:

```
ecommerce-server/vercel.json
```

```json
{
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/api/index.js"
    }
  ]
}
```

---

## ⭐ Add Environment Variables (Vercel Dashboard)

Go:

```
Vercel → ecommerce-server → Settings → Environment Variables
```

Add:

```
RAZORPAY_KEY_ID
RAZORPAY_KEY_SECRET
DATABASE_URL
```

---

## ⭐ Deploy Backend

```bash
vercel
vercel --prod
```

Example Production URL:

```
https://ecommerce-server-five-eosin.vercel.app
```

👉 This is your **LIVE API URL**

---

# ✅ STEP 4 — Configure Angular Environment

### ⭐ Local Environment

`src/environments/environment.ts`

```ts
export const environment = {
  production: false,
  apiUrl: "http://localhost:5000",
  razorpayKey: "rzp_test_7loOYJatPLp2HD",
};
```

---

### ⭐ Production Environment

`src/environments/environment.prod.ts`

```ts
export const environment = {
  production: true,
  apiUrl: "https://ecommerce-server-five-eosin.vercel.app",
  razorpayKey: "rzp_test_7loOYJatPLp2HD",
};
```

---

# ✅ STEP 5 — Angular Production Replacement

Already configured in `angular.json`:

```json
"fileReplacements": [
  {
    "replace": "src/environments/environment.ts",
    "with": "src/environments/environment.prod.ts"
  }
]
```

👉 Production build automatically uses LIVE API.

---

# ✅ STEP 6 — Use Environment in Angular Code

Example:

```ts
this.http.get(environment.apiUrl + "/orders");
```

Razorpay:

```ts
key: environment.razorpayKey;
```

---

# ✅ STEP 7 — Deploy Angular Frontend

```bash
cd ecommerceapp
vercel
vercel --prod
```

Example URL:

```
https://ecommerceapp-zeta-bice.vercel.app
```

---

# ✅ STEP 8 — Future Deployment Flow

### ⭐ After Backend Change

```bash
git push
cd ecommerce-server
vercel --prod
```

### ⭐ After Frontend Change

```bash
git push
cd ecommerceapp
vercel --prod
```

---

# 🏗️ Final Architecture

```
User Browser
     ↓
Angular App (Vercel CDN)
     ↓
Express Serverless (Vercel Function)
     ↓
PostgreSQL (Render Cloud)
     ↓
Razorpay Payment Gateway
```

---

# ⭐ Best Practices

- Never commit `.env`
- Always use environment variables
- Never hardcode secrets
- Deploy backend first
- Update frontend API URL
- Deploy frontend after backend

---

# 🎉 Done

Your Full Stack Angular E-Commerce App is now LIVE 🚀

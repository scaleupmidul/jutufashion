# 👟 JUTU Footwear — E-Commerce Platform

Sustainable luxury footwear e-commerce application built with **React 19, Vite, Tailwind CSS, Express, MongoDB (Mongoose), and Meta (Facebook) Conversions API (CAPI)**.

---

## 🚀 দ্রুত GitHub এবং Vercel + MongoDB দিয়ে চালু করার নিয়মাবলী (Step-by-Step Guide)

---

### ধাপ ১: GitHub-এ কোড আপলোড করুন (Upload to GitHub)

আপনার কম্পিউটারে প্রজেক্ট ফোল্ডারটি ডাউনলোড/আনজিপ করার পর টার্মিনাল (Terminal / Command Prompt) ওপেন করে নিচের কমান্ডগুলো চালান:

```bash
# ১. গিট ইনিশিয়ালাইজ করুন
git init

# ২. মেইন ব্রাঞ্চ সেট করুন
git branch -M main

# ৩. সব ফাইল গিট স্টেজিংয়ে যোগ করুন
git add .

# ৪. প্রথম কমিট করুন
git commit -m "feat: JUTU E-Commerce with MongoDB, Vercel Serverless and Meta Tracking"

# ৫. আপনার গিটহাব রিপোসিটরির লিংক কানেক্ট করুন (আপনার লিংক বসান)
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPOSITORY_NAME.git

# ৬. গিটহাবে পুশ করুন
git push -u origin main
```

---

### ধাপ ২: ফ্রি MongoDB Atlas ডাটাবেস তৈরি করুন (Setup MongoDB)

1. [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)-এ গিয়ে ফ্রি একাউন্ট খুলুন বা লগইন করুন।
2. **"Create a Database"** -> **M0 (Free Tier)** সিলেক্ট করুন।
3. **Database User** তৈরি করুন (Username এবং একটি সুরক্ষিত Password দিন)।
4. **Network Access / IP Access List**-এ গিয়ে **`0.0.0.0/0` (Allow Access from Anywhere)** সিলেক্ট করুন (Vercel Serverless-এর কানেকশনের জন্য এটি জরুরি)।
5. **Database -> Connect -> Drivers (Node.js)** সিলেক্ট করে আপনার কানেকশন স্ট্রিংটি কপি করুন:
   ```env
   mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/jutu_store?retryWrites=true&w=majority
   ```
   *(এখানে `<username>` এবং `<password>` আপনার আসল ইউজারনেম ও পাসওয়ার্ড দিয়ে প্রতিস্থাপন করুন)*

---

### ধাপ ৩: Vercel-এ ডিপ্লয় করুন (Deploy to Vercel)

1. [Vercel](https://vercel.com)-এ লগইন করে **"Add New Project"** ক্লিক করুন।
2. আপনার GitHub একাউন্ট কানেক্ট করে **JUTU** রিপোজিটরিটি **"Import"** করুন।
3. **Framework Preset**: Vercel স্বয়ংক্রিয়ভাবে **Vite** ডিটেক্ট করবে।
4. **Environment Variables** সেকশনে নিচের ভেরিয়েবলগুলো যোগ করুন:

| Variable Name | Value / Description |
|---|---|
| `MONGODB_URI` | আপনার MongoDB Atlas connection string |
| `META_DATASET_ID` | আপনার Facebook / Meta Pixel বা Dataset ID (ঐচ্ছিক) |
| `VITE_META_PIXEL_ID` | আপনার Facebook Pixel ID (ঐচ্ছিক) |
| `META_ACCESS_TOKEN` | Meta Conversions API Access Token (ঐচ্ছিক) |
| `NODE_ENV` | `production` |

5. **"Deploy"** বাটনে ক্লিক করুন! 🎉
   - Vercel ১-২ মিনিটের মধ্যে পুরো প্রজেক্ট লাইভ করে একটি ফ্রি SSL ডোমেইন (`your-project.vercel.app`) দেবে।

---

## 💻 লোকাল মেশিনে রান করার নিয়ম (Run Locally)

```bash
# ডিপেন্ডেন্সি ইন্সটল করুন
npm install

# .env ফাইল তৈরি করুন
cp .env.example .env

# লোকাল ডেভেলপমেন্ট সার্ভার চালু করুন (Frontend + Backend + Vite)
npm run dev
```

ব্রাউজারে ওপেন করুন: `http://localhost:3000`

---

## 📁 প্রজেক্ট আর্কিটেকচার (Project Structure)

- `src/` — React 19 Frontend Components, Pages, State Store, Utilities
- `src/server/` — Express Backend, MongoDB Connection, Mongoose Models, Meta CAPI Tracking
- `api/index.ts` — Vercel Serverless Function entry point
- `vercel.json` — Vercel static build & serverless rewrites routing configuration
- `.env.example` — Environment variable schema

---

## 🛡️ ফিচারসমূহ (Key Features)

- ✅ **Full E-Commerce Flow**: Homepage, Shop, Men/Women Filters, Product Details, Cart, Checkout, Order Confirmation Receipts.
- ✅ **Admin Panel (`/admin`)**: Order Logistics, Product Inventory Management, Customer Inquiries Inbox, Payment Gateway Setup, Store Settings.
- ✅ **Database Hybrid Sync**: MongoDB Atlas Support + Instant Local Cache Fallback.
- ✅ **Meta Pixel & Conversions API (CAPI)**: Dual-layer Browser + Server Tracking with SHA-256 Data Hashing.
- ✅ **bKash, Nagad & Cash on Delivery (COD)**: Custom Advance Payment workflows with Transaction ID inputs.

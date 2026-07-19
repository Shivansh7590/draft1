# Nimbus — Setup Guide

Follow these steps in order. Total time: ~20 minutes.

---

## Step 1: MongoDB Atlas (Database)

MongoDB is not installed on your machine, so use the free cloud tier.

### 1.1 Create cluster

1. Go to [mongodb.com/atlas](https://www.mongodb.com/cloud/atlas/register)
2. Sign up (free)
3. Choose **M0 Free** cluster
4. Provider: **AWS**, Region: closest to you (e.g. `N. Virginia`)
5. Cluster name: `nimbus-cluster` → **Create**

### 1.2 Create database user

1. Security → **Database Access** → **Add New Database User**
2. Authentication: **Password**
3. Username: `nimbususer`
4. Password: generate a strong password (save it)
5. Privileges: **Read and write to any database**
6. **Add User**

### 1.3 Allow network access

1. Security → **Network Access** → **Add IP Address**
2. For local dev: **Add Current IP Address**
3. For Render deploy: also add **Allow Access from Anywhere** (`0.0.0.0/0`)
4. **Confirm**

### 1.4 Get connection string

1. Database → **Connect** → **Drivers**
2. Driver: **Node.js**, version 5.5 or later
3. Copy the connection string:

```
mongodb+srv://nimbususer:<password>@nimbus-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

4. Replace `<password>` with your actual password
5. Add database name before the `?`:

```
mongodb+srv://nimbususer:YOUR_PASSWORD@nimbus-cluster.xxxxx.mongodb.net/nimbus?retryWrites=true&w=majority
```

### 1.5 Update backend `.env`

Open `backend/.env` and set:

```env
MONGODB_URI=mongodb+srv://nimbususer:YOUR_PASSWORD@nimbus-cluster.xxxxx.mongodb.net/nimbus?retryWrites=true&w=majority
```

### 1.6 Seed the database

```powershell
cd backend
npm run seed
```

Expected output:

```
Connected to MongoDB
Seeded 5 products
Created demo user: demo@nimbus.audio / demo1234
Seed complete
```

---

## Step 2: Run locally

From the **project root** (runs both apps):

```powershell
npm run install:all   # first time only
npm run dev
```

Or run separately in two terminals:

```powershell
# Terminal 1 — Backend (port 5000)
npm run dev:backend

# Terminal 2 — Frontend (port 5173)
npm run dev:frontend
```

Expected backend output: `MongoDB connected` and `Server running on port 5000`

Open [http://localhost:5173](http://localhost:5173)

**Test login:** `demo@nimbus.audio` / `demo1234`

---

## Step 3: Stripe (optional — for checkout payments)

Checkout works without Stripe (demo mode). Add Stripe for real test payments.

### 3.1 Get test keys

1. Go to [dashboard.stripe.com/register](https://dashboard.stripe.com/register)
2. After signup, open **Developers → API keys**
3. Copy:
   - **Publishable key** (`pk_test_...`)
   - **Secret key** (`sk_test_...`)

### 3.2 Update env files

**backend/.env**

```env
STRIPE_SECRET_KEY=sk_test_your_key_here
```

**frontend/.env**

```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
```

Restart both servers after changing env files.

### 3.3 Test card

| Field   | Value                |
|---------|----------------------|
| Number  | `4242 4242 4242 4242` |
| Expiry  | Any future date      |
| CVC     | Any 3 digits         |

---

## Step 4: Deploy to production

### 4.1 Push to GitHub

```powershell
cd "c:\Users\DELL\OneDrive\Desktop\e commerce"
git init
git add .
git commit -m "Initial Nimbus e-commerce app"
```

Create a repo on GitHub, then:

```powershell
git remote add origin https://github.com/YOUR_USERNAME/nimbus-ecommerce.git
git branch -M main
git push -u origin main
```

### 4.2 Deploy backend → Render

1. Go to [render.com](https://render.com) and sign up (free)
2. **New → Web Service**
3. Connect your GitHub repo
4. Settings:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free

5. **Environment Variables** (add all):

| Key               | Value                                              |
|-------------------|----------------------------------------------------|
| `NODE_ENV`        | `production`                                       |
| `MONGODB_URI`     | Your Atlas connection string                       |
| `JWT_SECRET`      | Random 32+ char string (e.g. from password generator) |
| `JWT_EXPIRES_IN`  | `7d`                                               |
| `CLIENT_URL`      | `https://your-app.vercel.app` (update after Vercel) |
| `STRIPE_SECRET_KEY` | Your `sk_test_...` key (optional)              |

6. **Create Web Service**
7. Copy your Render URL: `https://nimbus-api.onrender.com`

8. **Seed production DB** (one time):
   - Render Dashboard → your service → **Shell**
   - Run: `npm run seed`

### 4.3 Deploy frontend → Vercel

1. Go to [vercel.com](https://vercel.com) and sign up (free)
2. **Add New Project** → import your GitHub repo
3. Settings:
   - **Root Directory:** `frontend`
   - **Framework Preset:** Vite

4. **Environment Variable:**

| Key              | Value                                      |
|------------------|--------------------------------------------|
| `VITE_API_URL`   | `https://nimbus-api.onrender.com/api`      |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Your `pk_test_...` (optional) |

5. **Deploy**
6. Copy your Vercel URL: `https://nimbus-ecommerce.vercel.app`

### 4.4 Final CORS fix

Go back to **Render → Environment Variables** and update:

```
CLIENT_URL=https://your-actual-vercel-url.vercel.app
```

Render will redeploy automatically.

### 4.5 Update README

Add your live demo link to `README.md`:

```markdown
**Live Demo:** https://your-app.vercel.app
```

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `MongoDB connected` fails | Check Atlas IP whitelist includes your IP or `0.0.0.0/0` |
| Products not loading | Run `npm run seed` in backend |
| CORS errors in browser | Set `CLIENT_URL` on Render to match your Vercel URL exactly |
| Login works but cart doesn't sync | Ensure you're logged in; check browser console for 401 errors |
| Stripe payment fails | Verify both `STRIPE_SECRET_KEY` and `VITE_STRIPE_PUBLISHABLE_KEY` are set |
| Render free tier sleeps | First request after 15 min idle takes ~30s to wake up |

---

## Quick reference

| Item | Value |
|------|-------|
| Demo email | `demo@nimbus.audio` |
| Demo password | `demo1234` |
| Promo codes | `NIMBUS10`, `WELCOME20` |
| Backend port | `5000` |
| Frontend port | `5173` |
| API health check | `http://localhost:5000/api/health` |

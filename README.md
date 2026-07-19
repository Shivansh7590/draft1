# Nimbus — Premium Audio & Wearables E-Commerce

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?logo=tailwindcss&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-Test_Mode-635BFF?logo=stripe&logoColor=white)

A full-stack e-commerce demo for **Nimbus**, a fictional premium audio and wearables brand. Built to showcase modern web development skills for portfolio and resume use.

**Live Demo:** https://www.nimbuselectronics.netlify.app

---

## Features Checklist

### Frontend

| Feature | Status | Implementation |
|---------|--------|----------------|
| Responsive (375 / 768 / 1440px) | ✅ | Tailwind mobile-first — `sm:`, `md:`, `lg:`, `xl:` across all pages |
| Cart localStorage + backend sync | ✅ | `lib/utils.js` persists cart · `context/AppContext.jsx` syncs via `cartService` on login |
| Live search + filter (debounced) | ✅ | `pages/Products.jsx` — 300ms debounce, category/price/rating/sort |
| Form validation (RHF + Zod) | ✅ | Login, Signup, Checkout, Contact, Reviews |
| Protected routes | ✅ | `components/ProtectedRoute.jsx` → Account, Checkout |
| Loading states + skeletons | ✅ | `components/Skeleton.jsx`, `components/Waveform.jsx` |
| Toast notifications | ✅ | `react-hot-toast` in `App.jsx` — cart, orders, auth, errors |
| Scroll-triggered animations | ✅ | Framer Motion `whileInView` on Home, About, ProductCard |

### Backend

| Feature | Status | Implementation |
|---------|--------|----------------|
| Password hashing (bcrypt) | ✅ | `routes/auth.js` |
| JWT middleware | ✅ | `middleware/auth.js` — cookie + Bearer token |
| Input validation on POST routes | ✅ | `express-validator` + `middleware/validate.js` |
| Error handling middleware | ✅ | `middleware/errorHandler.js` — consistent JSON errors |
| Rate limiting on auth | ✅ | `express-rate-limit` on signup/login |
| Seed script | ✅ | `seed.js` — 5 products + demo user |

### Polish

| Feature | Status | Implementation |
|---------|--------|----------------|
| SEO meta tags | ✅ | `components/SEO.jsx` per page |
| Sitemap + robots.txt | ✅ | `public/sitemap.xml`, `public/robots.txt` |
| Brand design system | ✅ | Ink / Cloud / Signal palette · Fraunces + Inter + JetBrains Mono |
| Waveform signature element | ✅ | Hero, loading, empty states |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  FRONTEND (Vite + React)          http://localhost:5173     │
│                                                             │
│  pages/ ──► services/ ──► lib/api.js ──► /api/* (proxy)     │
│     │              │                                        │
│     └── context/AppContext.jsx (auth + cart state)          │
└──────────────────────────┬──────────────────────────────────┘
                           │ REST + JWT Bearer token
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  BACKEND (Express)                http://localhost:5000     │
│                                                             │
│  server.js ──► routes/ ──► models/ ──► MongoDB Atlas        │
│                    │                                        │
│                    └── middleware/ (auth, validate, errors) │
└─────────────────────────────────────────────────────────────┘
```

### How files connect

| Layer | File | Connects to |
|-------|------|-------------|
| **Entry** | `frontend/src/main.jsx` | `App.jsx`, `index.css` |
| **Router** | `frontend/src/App.jsx` | All pages, `AuthProvider`, `CartProvider`, `Layout` |
| **API client** | `frontend/src/lib/api.js` | Axios instance → `VITE_API_URL` or Vite proxy `/api` |
| **Endpoints** | `frontend/src/lib/endpoints.js` | Route constants used by services |
| **Services** | `frontend/src/services/index.js` | `authService`, `productService`, `cartService`, `orderService`, `contactService` |
| **Cart helpers** | `frontend/src/lib/cartHelpers.js` | Hydrate localStorage cart · merge with server on login |
| **State** | `frontend/src/context/AppContext.jsx` | Services + localStorage · syncs cart when user logs in |
| **Backend entry** | `backend/server.js` | All route files · MongoDB via Mongoose |
| **Proxy (dev)** | `frontend/vite.config.js` | `/api` → `http://localhost:5000` |

### Data flow examples

**Browse products:** `Products.jsx` → `productService.getAll()` → `GET /api/products` → `routes/products.js` → `models/Product.js`

**Add to cart:** `ProductDetail.jsx` → `useCart().addItem()` → `localStorage` → on login → `cartService.sync()` → `POST /api/cart/sync`

**Checkout:** `Checkout.jsx` → `orderService.create()` → `POST /api/orders` → updates stock · clears server cart

---

## Tech Stack

| Layer      | Technology                                      |
|------------|-------------------------------------------------|
| Frontend   | React 19, Vite, Tailwind CSS v4, Framer Motion |
| Backend    | Node.js, Express, Mongoose                      |
| Database   | MongoDB Atlas (free tier) or local MongoDB      |
| Auth       | JWT (httpOnly cookie + localStorage Bearer)     |
| Payments   | Stripe test mode                                |
| Forms      | React Hook Form + Zod                           |
| Deployment | Vercel (frontend) · Render (backend)            |

---

## Project Structure

```
e commerce/
├── backend/
│   ├── models/          # User, Product, Order, Cart, Contact
│   ├── routes/          # auth, products, cart, orders, contact
│   ├── middleware/      # auth, validation, error handling
│   ├── seed.js          # Populate sample products
│   └── server.js        # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/  # Navbar, Footer, Waveform, ProductCard, etc.
│   │   ├── context/     # Auth + Cart providers
│   │   ├── lib/         # api.js, endpoints.js, cartHelpers.js, utils.js
│   │   ├── services/    # API service layer (connects pages → backend)
│   │   └── pages/       # Home, Products, Cart, Checkout, etc.
│   └── public/          # favicon, robots.txt, sitemap.xml
├── package.json         # Root scripts (run both apps)
├── SETUP.md             # MongoDB Atlas, Stripe, deployment guide
└── README.md
```

---

## Getting Started

> **Full setup guide:** see [SETUP.md](./SETUP.md) for MongoDB Atlas, Stripe, and deployment steps.

### Prerequisites
- Node.js 18+
- MongoDB ([MongoDB Atlas](https://www.mongodb.com/atlas) free tier recommended)

### Quick start

```bash
# Install all dependencies
npm run install:all

# Configure backend (add your MongoDB URI)
cp backend/.env.example backend/.env

# Seed database
npm run seed

# Run both frontend + backend
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

**Demo login:** `demo@nimbus.audio` / `demo1234`

---

## API Endpoints

| Method | Route                        | Description                    | Auth     | Frontend service        |
|--------|------------------------------|--------------------------------|----------|-------------------------|
| GET    | `/api/health`                | Health check                   | Public   | —                       |
| GET    | `/api/products`              | List products (filter/search)  | Public   | `productService`        |
| GET    | `/api/products/:slug`        | Product detail                 | Public   | `productService`        |
| POST   | `/api/auth/signup`           | Register                       | Public   | `authService`           |
| POST   | `/api/auth/login`            | Login (returns JWT)            | Public   | `authService`           |
| GET    | `/api/auth/me`               | Current user profile           | Required | `authService`           |
| GET    | `/api/cart`                  | Get user cart                  | Required | `cartService`           |
| POST   | `/api/cart/sync`             | Sync cart to backend           | Required | `cartService`           |
| POST   | `/api/orders`                | Create order (checkout)        | Required | `orderService`          |
| GET    | `/api/orders/:userId`        | Order history                  | Required | `orderService`          |
| POST   | `/api/products/:id/reviews`    | Add product review             | Required | `productService`        |
| POST   | `/api/contact`               | Contact form submission        | Public   | `contactService`        |

---

## Stripe Setup (Optional)

```env
# backend/.env
STRIPE_SECRET_KEY=sk_test_...

# frontend/.env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

Test card: `4242 4242 4242 4242` · Any future date · Any CVC

Without Stripe keys, checkout works in demo mode (orders created without payment processing).

---

## Deployment

| Service  | Hosts    | Root dir   | Key env var                          |
|----------|----------|------------|--------------------------------------|
| Frontend | Vercel   | `frontend` | `VITE_API_URL=https://…/api`         |
| Backend  | Render   | `backend`  | `MONGODB_URI`, `CLIENT_URL`, `JWT_SECRET` |
| Database | Atlas    | —          | Connection string in backend `.env`  |

See [SETUP.md](./SETUP.md) Step 4 for full deployment walkthrough.

---

## Promo Codes (Demo)

| Code       | Discount |
|------------|----------|
| NIMBUS10   | 10% off  |
| WELCOME20  | 20% off  |

---

## What I'd Improve With More Time

- Admin dashboard for product/order management
- Real email notifications (order confirmation, contact form)
- Product image upload via Cloudinary
- Unit and integration tests (Jest + Supertest + Vitest)
- Redis caching for product listings
- OAuth login (Google/GitHub)
- PWA support with offline cart
- CI/CD pipeline with GitHub Actions

---

## License

MIT — free to use for portfolio and learning purposes.

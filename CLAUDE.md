# Silk Road — Project Context for Claude

## What This Project Is
Restaurant website for **Silk Road** (Zentralasiatisches Restaurant, Köln).
Being extended into a **multi-tenant food ordering SaaS** to sell to multiple restaurants.

## Tech Stack
- **Frontend:** React + TypeScript + Tailwind CSS v4 + Framer Motion + Wouter (routing)
- **Backend:** Express + TypeScript (server/index.ts)
- **Database:** SQLite via better-sqlite3 (orders.db in project root)
- **Payments:** Stripe (stripe + @stripe/react-stripe-js + @stripe/stripe-js)
- **Forms:** react-hook-form + zod
- **UI:** shadcn/ui components in client/src/components/ui/
- **Icons:** Custom inline SVG icons in client/src/components/icons.tsx
- **i18n:** Custom LanguageContext (DE/EN/RU) via client/src/lib/LanguageContext.tsx
- **Build:** Vite (frontend) + esbuild (backend) via script/build.ts
- **Deployment:** Currently Netlify (static). Moving to Railway for Express backend.

## Key Commands
```bash
npm run dev        # start dev server (Express + Vite) on port 5000
npm run build      # build frontend + backend
npx tsc --noEmit   # type check only
```

## Project Structure
```
client/src/
  pages/          # Home, MenuPage, CheckoutPage, OrderSuccessPage, AdminPage (todo)
  components/
    Cart/         # CartButton, CartDrawer
    Checkout/     # PaymentForm (Stripe Elements)
    icons.tsx     # all SVG icons (NO lucide-react — React 19 compat issue)
  lib/
    CartContext.tsx     # cart state + localStorage
    LanguageContext.tsx # DE/EN/RU language switching
    MusicContext.tsx    # background music
    stripe.ts           # loadStripe setup
    i18n.ts             # translations
server/
  index.ts        # Express app entry point
  routes.ts       # all API routes
  db.ts           # SQLite operations (createOrder, getOrder, updateOrderStatus, etc.)
  stripe.ts       # Stripe client
  static.ts       # serve built frontend in production
```

## Critical Rules
- NEVER use lucide-react — use icons from client/src/components/icons.tsx only
- All new icons must be added to icons.tsx as inline SVG
- Prices stored as strings like "9,00€" — use parsePrice() to convert to number
- parsePrice: `parseFloat(priceStr.replace(/[€\s]/g, "").replace(",", "."))`
- Format price back: `price.toFixed(2).replace(".", ",") + " €"`
- Cart persists in localStorage under key "silkroad-cart"
- Delivery fee: €2.50, Min order: €15.00 (defined in CartContext.tsx)
- Cologne delivery PLZ zones defined in CheckoutPage.tsx

## Environment Variables (.env)
```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
ADMIN_PASSWORD=silkroad2024
```

## Routing (Wouter)
- `/` → Home
- `/menu` → MenuPage (+ /en/menu, /ru/menu)
- `/checkout` → CheckoutPage
- `/order-success/:id` → OrderSuccessPage
- `/admin` → AdminPage (Phase 4 — TODO)

## API Routes (all prefixed /api)
- `POST /api/orders/create-payment-intent` — card payment, creates Stripe PaymentIntent + saves pending order
- `POST /api/orders/cash` — cash order, saves directly as accepted
- `GET /api/orders/:id` — get order by ID
- `POST /api/orders/:id/cancel` — cancel + refund
- `POST /api/stripe/webhook` — Stripe webhook (payment_intent.succeeded)
- `GET /api/admin/orders` — all orders (requires x-admin-password header)
- `PATCH /api/admin/orders/:id/status` — update order status

## Order Status Flow
pending → accepted → preparing → delivering → delivered → (cancelled)

## Database Schema (orders.db)
id, order_number (SR-XXXX), status, customer_name, customer_email,
customer_phone, street, postcode, city, notes, items (JSON),
subtotal, delivery_fee, total, payment_method (card/cash),
stripe_payment_id, cancelled_by, cancelled_at, refund_id, created_at

## What Has Been Built
- [x] Phase 1 — Cart (CartContext, CartButton, CartDrawer)
- [x] Phase 2 — Checkout form (CheckoutPage with PLZ validation + payment method)
- [x] Phase 3 — Stripe payment (PaymentForm, backend routes, SQLite DB, OrderSuccessPage)
- [ ] Phase 4 — Admin panel (restaurant sees/manages orders)
- [ ] Phase 5 — Cancellations & Refunds (backend done, frontend TODO)
- [ ] Phase 6 — Email notifications (Resend)
- [ ] Phase 7 — Multi-tenant SaaS

## Business Context
- Selling to restaurant owners as alternative to Lieferando (which charges 13-30% commission)
- Our system costs restaurant ~€5/mo hosting + Stripe fees (1.4% + €0.25/order)
- Pricing model: €1,500 setup + €99/month per restaurant
- Multi-tenant: one codebase, many restaurants, each with own Stripe account
- Silk Road restaurant: Karl-Berbuer-Platz 7, 50678 Köln

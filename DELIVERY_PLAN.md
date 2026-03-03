# Silk Road — Online Ordering & Delivery System Plan

## Overview

Build a complete food ordering system so customers can order online and pay with card.
The restaurant delivers with their own driver. No Lieferando. No Uber Eats.

**Long-term goal:** Turn this into a SaaS product — one codebase, many restaurants, recurring monthly income.

---

## Two Stages

| Stage | What | When |
|-------|------|------|
| **Stage 1** | Build for Silk Road only | Now |
| **Stage 2** | Add multi-tenant support, sell to more restaurants | After Stage 1 works |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + TypeScript (already exists) |
| Backend | Express (already installed, needs real routes) |
| Payments | Stripe Connect (multi-tenant ready) |
| Hosting | Railway (~€5/mo) — runs Express properly |
| Notifications | Resend (free email) or browser sound alert |
| Database | PostgreSQL via Supabase (free tier, multi-tenant ready) |

---

## Business Logic

- Customer orders on website
- Pays with card via Stripe
- Restaurant sees order on admin panel (tablet in kitchen)
- Restaurant accepts order and delivers with own driver
- Customer gets email confirmation

---

## Phase 1 — Cart / Basket

**Goal:** Customer can add food items to a cart and see the total.

### Tasks
- [ ] Create cart state (React Context or Zustand)
- [ ] Add "Add to Cart" button on each menu item
- [ ] Cart drawer/sidebar — slides in from right
- [ ] Show item name, quantity, price
- [ ] Increase / decrease quantity buttons
- [ ] Remove item button
- [ ] Show subtotal, delivery fee, total
- [ ] Persist cart in localStorage (survives page refresh)
- [ ] Cart icon in navbar with item count badge

### Cart UI Example
```
YOUR ORDER
─────────────────────────────
2x Kebab Teller        €18.00
1x Ayran                €2.50
─────────────────────────────
Subtotal               €20.50
Delivery fee            €2.50
─────────────────────────────
Total                  €23.00

[Proceed to Checkout →]
```

---

## Phase 2 — Checkout Form

**Goal:** Customer enters their delivery details before paying.

### Tasks
- [ ] Checkout page at `/checkout`
- [ ] Form fields:
  - Full name
  - Phone number
  - Street + house number
  - PLZ (postcode)
  - City
  - Delivery notes (optional)
- [ ] PLZ validation — check if in delivery zone
- [ ] Minimum order check (e.g. €15 minimum)
- [ ] Show order summary on same page
- [ ] Form validation with Zod (already installed)

### Delivery Zone (PLZ Check)
```typescript
const DELIVERY_ZONES = ["10115", "10117", "10119"]; // restaurant sets these
const MIN_ORDER = 15; // euros
const DELIVERY_FEE = 2.50; // euros
```

---

## Phase 3 — Stripe Payment

**Goal:** Customer pays securely with credit/debit card.

### Tasks

**Backend (Express routes):**
- [ ] `POST /api/orders/create-payment-intent` — creates Stripe payment
- [ ] `POST /api/stripe/webhook` — confirms payment received
- [ ] `POST /api/orders` — saves order to database
- [ ] `GET /api/orders/:id` — get single order

**Frontend:**
- [ ] Install Stripe.js + React Stripe Elements
- [ ] Payment form (card number, expiry, CVC)
- [ ] Loading state while processing
- [ ] Success page after payment
- [ ] Error handling (card declined, etc.)

### Stripe Flow
```
Customer clicks "Pay"
        ↓
Frontend calls /api/orders/create-payment-intent
        ↓
Backend creates PaymentIntent on Stripe
        ↓
Frontend shows card form (Stripe Elements)
        ↓
Customer enters card details & confirms
        ↓
Stripe confirms payment
        ↓
Stripe calls /api/stripe/webhook
        ↓
Backend saves order to database
        ↓
Restaurant sees new order on admin panel
        ↓
Customer sees success page + email
```

### Stripe Fees (Germany)
- EU cards: **1.4% + €0.25** per transaction
- Non-EU cards: **2.9% + €0.25** per transaction
- No monthly fee

---

## Phase 4 — Order Management (Admin Panel)

**Goal:** Restaurant owner sees incoming orders in real-time on a tablet.

### Tasks
- [ ] Admin page at `/admin` — password protected
- [ ] Simple password login (no full auth system needed)
- [ ] Live order list — auto-refreshes every 10 seconds
- [ ] Sound alert when new order arrives
- [ ] Order card shows:
  - Order number & time
  - Customer name, address, phone
  - Items ordered
  - Total amount
  - Payment status (paid ✅)
- [ ] Buttons: [Accept] [Reject] [Ready for Delivery] [Delivered]
- [ ] Order status updates
- [ ] Order history (past orders)

### Order Status Flow
```
PENDING → ACCEPTED → PREPARING → OUT FOR DELIVERY → DELIVERED
```

### Admin Panel UI
```
SILK ROAD — ORDER MANAGEMENT
─────────────────────────────────────────────

🔴 NEW ORDER #43 — 15:32          [ACCEPT] [REJECT]
   📞 +49 176 1234567
   📍 Hauptstraße 12, 10115 Berlin
   • 2x Kebab Teller    €18.00
   • 1x Ayran            €2.50
   • 1x Baklava          €4.00
   💳 PAID — Total: €27.00

🟡 ORDER #42 — 15:10          [READY FOR DELIVERY]
   Accepted — Currently preparing...
   📍 Oranienstraße 5, 10119 Berlin

🟢 ORDER #41 — 14:45              [MARK DELIVERED]
   Out for delivery...
```

---

## Phase 5 — Cancellations & Refunds

**Goal:** Handle order cancellations fairly for both customer and restaurant.

### Cancellation Rules

| Situation | Result |
|-----------|--------|
| Customer cancels before restaurant accepts | ✅ Full refund |
| Customer cancels after restaurant accepts | ❌ No refund (food being prepared) |
| Restaurant cancels for any reason | ✅ Full refund to customer |
| Payment failed | No charge at all |

### Cancellation Flow

```
Customer orders → PENDING (2-5 min cancel window)
      ↓
Restaurant accepts → cancel no longer possible for customer
      ↓
Restaurant can still cancel → triggers automatic full refund
```

### Tasks

**Customer side:**
- [ ] Cancel button visible only while order is PENDING
- [ ] After restaurant accepts → button disappears
- [ ] Confirmation dialog: "Are you sure you want to cancel?"
- [ ] Show refund message: "Refund will arrive in 3-5 business days"

**Restaurant side (Admin Panel):**
- [ ] [Cancel & Refund] button on every order
- [ ] Confirmation dialog: "€23.00 will be refunded to customer. Are you sure?"
- [ ] After cancel → order marked as CANCELLED, refund triggered automatically

**Backend:**
- [ ] `POST /api/orders/:id/cancel` — cancellation endpoint
- [ ] Checks who is cancelling (customer vs admin)
- [ ] Checks order status — only cancel if allowed
- [ ] Calls Stripe refund API
- [ ] Sends cancellation email to customer

### Stripe Refund (One Line)
```typescript
await stripe.refunds.create({ payment_intent: order.stripePaymentId });
```

### Important Note on Stripe Fees
- Stripe does **not** refund their fee (1.4% + €0.25)
- That small loss is absorbed by the restaurant on cancellations
- This is standard across all payment platforms

### Cancellation Email to Customer
- **Restaurant cancelled:** *"We're sorry, your order was cancelled. Full refund of €23.00 in 3-5 business days."*
- **Customer cancelled:** *"Your order has been cancelled. Full refund of €23.00 in 3-5 business days."*

### Database Addition
```sql
orders:
  ...existing fields...
  cancelled_by    (customer/restaurant/null)
  cancelled_at    (timestamp)
  refund_id       (Stripe refund ID)
```

---

## Phase 6 — Email Notifications

**Goal:** Customer gets confirmation email. Restaurant gets notified of new order.

### Tasks
- [ ] Setup Resend (free: 3,000 emails/month)
- [ ] Customer email: order confirmation with details
- [ ] Restaurant email: new order alert (backup to admin panel)
- [ ] Customer email: "Your order is on the way!"

### Email Templates
- **To customer:** Thank you, here is your order summary, estimated 30-45 min
- **To restaurant:** New order received — order details

---

## Phase 7 — Multi-Tenant (SaaS for Many Restaurants)

**Goal:** One codebase, many restaurants. Charge each restaurant monthly.

### Concept
```
yourplatform.de/silkroad        → Silk Road website + ordering
yourplatform.de/pizzaroma       → Pizza Roma website + ordering
yourplatform.de/burgerhaus      → Burger Haus website + ordering

OR each on their own domain:
silkroad.de     → points to your platform
pizzaroma.de    → points to your platform
```

### What Changes in the Database

Every table gets a `restaurant_id`:

```sql
-- New table
restaurants:
  id
  name
  slug              (e.g. "silkroad")
  logo_url
  primary_color     (brand color)
  delivery_zones    (JSON array of PLZ codes)
  delivery_fee
  min_order
  admin_password
  stripe_account_id (each restaurant has own Stripe — see Stripe Connect)
  subscription_status (active/inactive)
  created_at

-- Updated tables
menu_items:
  id
  restaurant_id   ← NEW
  name
  price
  category
  image_url

orders:
  id
  restaurant_id   ← NEW
  ...existing fields...
```

### What Changes in the Code

Every API route becomes restaurant-aware:

```typescript
// Before (single restaurant)
GET /api/orders

// After (multi-tenant)
GET /api/:restaurantSlug/orders
POST /api/:restaurantSlug/orders/create-payment-intent
```

### Stripe Connect — Each Restaurant Gets Paid Directly

Instead of one Stripe account, use **Stripe Connect**:
- Each restaurant connects their own Stripe account
- Money goes directly to their bank
- You take a platform fee automatically (e.g. 0.5% per order)
- You never touch their money

```
Customer pays €23.00
        ↓
Stripe splits automatically:
  Restaurant receives: €22.54  (€23.00 - Stripe fee - your platform fee)
  You receive: €0.46 platform fee (2%)
```

### Super Admin Dashboard (Only You)

A private dashboard at `/superadmin`:

```
YOUR PLATFORM DASHBOARD
──────────────────────────────────────────────
Restaurant        Orders/mo   Revenue    Plan      Status
Silk Road           320       €8,200     €99/mo    ✅ Active
Pizza Roma          180       €4,600     €99/mo    ✅ Active
Burger Haus          95       €2,800     €99/mo    ✅ Active
Döner Palace         12       €340       €99/mo    ✅ Active
──────────────────────────────────────────────
Your monthly income:           €396/mo
Your platform fees (2%):       +€318/mo
──────────────────────────────────────────────
Total monthly income:          €714/mo
```

### Restaurant Onboarding Flow

When you sign up a new restaurant:
1. Create restaurant record in database (10 min)
2. Set up their menu items (1-2 hours)
3. They connect their Stripe account (they do this themselves)
4. Point their domain to your platform (30 min)
5. Done — they're live

### Tasks
- [ ] Add `restaurants` table to database
- [ ] Add `restaurant_id` to all existing tables
- [ ] Update all API routes to be restaurant-aware
- [ ] Restaurant switcher in frontend routing
- [ ] Each restaurant gets their own branding (logo, colors)
- [ ] Stripe Connect integration
- [ ] Super admin dashboard
- [ ] Restaurant onboarding flow
- [ ] Subscription management (active/inactive)

### Extra Work vs Single Restaurant
| Task | Time |
|------|------|
| Multi-tenant database changes | 1 day |
| Update API routes | half a day |
| Frontend routing per restaurant | half a day |
| Stripe Connect setup | 1 day |
| Super admin dashboard | 1 day |
| **Total extra** | **~3-4 days** |

---

## Database Schema (Full — Multi-Tenant)

```sql
restaurants:
  id
  name
  slug
  logo_url
  primary_color
  delivery_zones    (JSON)
  delivery_fee
  min_order
  admin_password
  stripe_account_id
  subscription_status
  created_at

menu_items:
  id
  restaurant_id
  name
  description
  price
  category
  image_url
  available        (true/false)

orders:
  id
  restaurant_id
  order_number
  status           (pending/accepted/preparing/delivering/delivered/cancelled)
  customer_name
  customer_phone
  customer_email
  street
  postcode
  city
  notes
  items            (JSON)
  subtotal
  delivery_fee
  total
  stripe_payment_id
  cancelled_by     (customer/restaurant/null)
  cancelled_at
  refund_id
  created_at
```

---

## File Structure (All New Files)

```
client/src/
├── components/
│   ├── Cart/
│   │   ├── CartDrawer.tsx
│   │   ├── CartItem.tsx
│   │   └── CartButton.tsx
│   ├── Checkout/
│   │   ├── CheckoutForm.tsx
│   │   └── PaymentForm.tsx
│   └── Admin/
│       ├── OrderCard.tsx
│       └── OrderList.tsx
├── pages/
│   ├── CheckoutPage.tsx
│   ├── OrderSuccessPage.tsx
│   ├── AdminPage.tsx            ← restaurant admin
│   └── SuperAdminPage.tsx       ← your dashboard (multi-tenant)
├── hooks/
│   └── useCart.ts
└── lib/
    └── cart.ts

server/
├── routes.ts
├── stripe.ts
├── database.ts
├── email.ts
└── superadmin.ts               ← super admin routes
```

---

## Environment Variables Needed

```env
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PLATFORM_FEE_PERCENT=2
RESEND_API_KEY=re_...
SUPERADMIN_PASSWORD=yourpassword
DATABASE_URL=...
```

---

## Pricing Model (What You Charge Restaurants)

| Plan | Price | What's included |
|------|-------|----------------|
| Setup fee | €1,500 one-time | Menu setup, domain config, onboarding |
| Monthly | €99/mo | Hosting, support, updates |
| Platform fee | 2% per order (optional) | Automatic via Stripe Connect |

### Revenue Projection

| Restaurants | Monthly fees | Platform fees (est.) | Total/mo |
|-------------|-------------|----------------------|----------|
| 5 | €495 | ~€200 | **€695** |
| 10 | €990 | ~€400 | **€1,390** |
| 20 | €1,980 | ~€800 | **€2,780** |

---

## Costs Summary (Monthly — Your Side)

| Service | Cost |
|---------|------|
| Railway hosting | ~€10/mo (scales with restaurants) |
| Supabase database | Free up to 500MB, then €25/mo |
| Resend (email) | Free up to 3k/mo, then €20/mo |
| **Total fixed** | **~€10-55/mo** |

---

## Build Order (Recommended)

### Stage 1 — Single Restaurant (Silk Road)
1. **Phase 1** — Cart
2. **Phase 2** — Checkout form
3. **Phase 3** — Stripe payment
4. **Phase 4** — Admin panel
5. **Phase 5** — Cancellations & refunds
6. **Phase 6** — Emails

### Stage 2 — Multi-Tenant (After Stage 1 Works)
7. **Phase 7** — Multi-tenant + Stripe Connect + Super admin

---

## Timeline Estimate

| Phase | Effort |
|-------|--------|
| Phase 1 — Cart | 1-2 days |
| Phase 2 — Checkout | 1 day |
| Phase 3 — Stripe | 2-3 days |
| Phase 4 — Admin panel | 1-2 days |
| Phase 5 — Cancellations | half a day |
| Phase 6 — Emails | half a day |
| **Stage 1 Total** | **~2 weeks** |
| Phase 7 — Multi-tenant | 3-4 days |
| **Stage 2 Total** | **~3 weeks total** |

---

## What We Are NOT Building (Keep It Simple)

- ❌ No mobile app
- ❌ No customer accounts / login
- ❌ No live GPS tracking
- ❌ No third-party delivery drivers
- ❌ No complex loyalty system

Keep it simple. Build what restaurants actually need.

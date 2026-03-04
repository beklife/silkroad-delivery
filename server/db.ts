import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const dbPath = process.env.DATABASE_PATH || path.resolve(process.cwd(), "orders.db");
fs.mkdirSync(path.dirname(dbPath), { recursive: true });
const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_number TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    street TEXT NOT NULL,
    postcode TEXT NOT NULL,
    city TEXT NOT NULL,
    notes TEXT,
    items TEXT NOT NULL,
    subtotal REAL NOT NULL,
    delivery_fee REAL NOT NULL,
    total REAL NOT NULL,
    payment_method TEXT NOT NULL,
    stripe_payment_id TEXT,
    cancelled_by TEXT,
    cancelled_at TEXT,
    refund_id TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`);

// ─── Settings table ──────────────────────────────────────────────────────────

db.exec(`
  CREATE TABLE IF NOT EXISTS settings (
    key   TEXT PRIMARY KEY,
    value TEXT NOT NULL
  )
`);

// Add eta_minutes to orders (no-op if column already exists)
try { db.exec("ALTER TABLE orders ADD COLUMN eta_minutes INTEGER"); } catch {}

const DEFAULT_SETTINGS: Record<string, string> = {
  is_open:        "true",
  delivery_fee:   "5",
  min_order:      "25",
  delivery_zones: JSON.stringify([
    "50667","50668","50670","50672","50674","50676",
    "50677","50678","50679","50733","50735","50737",
    "50739","50823","50825","50827","50829",
  ]),
  soldout_items: "[]",
};

for (const [k, v] of Object.entries(DEFAULT_SETTINGS)) {
  db.prepare("INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)").run(k, v);
}

export function getSetting(key: string): string | null {
  const row = db.prepare("SELECT value FROM settings WHERE key = ?").get(key) as { value: string } | undefined;
  return row?.value ?? null;
}

export function setSetting(key: string, value: string): void {
  db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)").run(key, value);
}

export function getAllSettings(): Record<string, string> {
  const rows = db.prepare("SELECT key, value FROM settings").all() as { key: string; value: string }[];
  return Object.fromEntries(rows.map(r => [r.key, r.value]));
}

export function setOrderEta(id: number, etaMinutes: number): void {
  db.prepare("UPDATE orders SET eta_minutes = ? WHERE id = ?").run(etaMinutes, id);
}

// ─────────────────────────────────────────────────────────────────────────────

export interface OrderRow {
  id: number;
  order_number: string;
  status: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  street: string;
  postcode: string;
  city: string;
  notes: string | null;
  items: string;
  subtotal: number;
  delivery_fee: number;
  total: number;
  payment_method: string;
  stripe_payment_id: string | null;
  cancelled_by: string | null;
  cancelled_at: string | null;
  refund_id: string | null;
  created_at: string;
  eta_minutes: number | null;
}

function generateOrderNumber(): string {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `SR-${num}`;
}

export function createOrder(data: {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  street: string;
  postcode: string;
  city: string;
  notes?: string;
  items: object[];
  subtotal: number;
  delivery_fee: number;
  total: number;
  payment_method: string;
  stripe_payment_id?: string;
  status?: string;
}): OrderRow {
  const order_number = generateOrderNumber();
  const stmt = db.prepare(`
    INSERT INTO orders (
      order_number, status, customer_name, customer_email, customer_phone,
      street, postcode, city, notes, items,
      subtotal, delivery_fee, total, payment_method, stripe_payment_id
    ) VALUES (
      @order_number, @status, @customer_name, @customer_email, @customer_phone,
      @street, @postcode, @city, @notes, @items,
      @subtotal, @delivery_fee, @total, @payment_method, @stripe_payment_id
    )
  `);

  const result = stmt.run({
    order_number,
    status: data.status ?? "pending",
    customer_name: data.customer_name,
    customer_email: data.customer_email,
    customer_phone: data.customer_phone,
    street: data.street,
    postcode: data.postcode,
    city: data.city,
    notes: data.notes ?? null,
    items: JSON.stringify(data.items),
    subtotal: data.subtotal,
    delivery_fee: data.delivery_fee,
    total: data.total,
    payment_method: data.payment_method,
    stripe_payment_id: data.stripe_payment_id ?? null,
  });

  return getOrder(result.lastInsertRowid as number)!;
}

export function getOrder(id: number): OrderRow | null {
  return db.prepare("SELECT * FROM orders WHERE id = ?").get(id) as OrderRow | null;
}

export function getOrderByStripeId(stripePaymentId: string): OrderRow | null {
  return db
    .prepare("SELECT * FROM orders WHERE stripe_payment_id = ?")
    .get(stripePaymentId) as OrderRow | null;
}

export function updateOrderStatus(id: number, status: string): void {
  db.prepare("UPDATE orders SET status = ? WHERE id = ?").run(status, id);
}

export function updateStripePaymentId(id: number, stripePaymentId: string): void {
  db.prepare("UPDATE orders SET stripe_payment_id = ? WHERE id = ?").run(stripePaymentId, id);
}

export function getAllOrders(): OrderRow[] {
  return db
    .prepare("SELECT * FROM orders ORDER BY created_at DESC")
    .all() as OrderRow[];
}

export function cancelOrder(id: number, cancelledBy: string, refundId?: string): void {
  db.prepare(`
    UPDATE orders SET
      status = 'cancelled',
      cancelled_by = ?,
      cancelled_at = datetime('now'),
      refund_id = ?
    WHERE id = ?
  `).run(cancelledBy, refundId ?? null, id);
}

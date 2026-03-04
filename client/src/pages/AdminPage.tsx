import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ClockIcon,
  CheckIcon,
  XIcon,
  PhoneIcon,
  MapPinIcon,
  Loader2Icon,
  TruckIcon,
  BanIcon,
  RefreshCwIcon,
  LogOutIcon,
  CheckCircleIcon,
  UtensilsIcon,
} from "@/components/icons";

// ─── Types ────────────────────────────────────────────────────────────────────

type OrderStatus =
  | "pending"
  | "accepted"
  | "preparing"
  | "delivering"
  | "delivered"
  | "cancelled";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  order_number: string;
  status: OrderStatus;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  street: string;
  postcode: string;
  city: string;
  notes: string | null;
  items: OrderItem[];
  subtotal: number;
  delivery_fee: number;
  total: number;
  payment_method: "card" | "cash";
  stripe_payment_id: string | null;
  cancelled_by: string | null;
  cancelled_at: string | null;
  created_at: string;
  eta_minutes: number | null;
}

interface AdminSettings {
  isOpen: boolean;
  deliveryFee: string;
  minOrder: string;
  deliveryZones: string; // newline-separated PLZ
  soldoutItems: string[];
}

// ─── Menu items for soldout management ───────────────────────────────────────

const MENU_ITEMS: { id: string; name: string; category: string }[] = [
  { id: "schurpa",         name: "Schurpa",                           category: "Suppen" },
  { id: "samsa",           name: "Samsa",                             category: "Vorspeisen" },
  { id: "plowbeef",        name: "Plow (Rindfleisch)",                category: "Hauptgerichte" },
  { id: "mantybeef",       name: "Manty (Rindfleisch)",               category: "Hauptgerichte" },
  { id: "mantyveg",        name: "Manty (Kartoffel/Kürbis)",          category: "Hauptgerichte" },
  { id: "kurutob",         name: "Kurutob",                           category: "Hauptgerichte" },
  { id: "tschuponcha",     name: "Tschuponcha (Lammrippen)",          category: "Hauptgerichte" },
  { id: "dapanji",         name: "Da Pan Ji (Hähnchen)",              category: "Hauptgerichte" },
  { id: "lagman",          name: "Lagman",                            category: "Hauptgerichte" },
  { id: "ganfan",          name: "Gan Fan",                           category: "Hauptgerichte" },
  { id: "salatbahor",      name: "Salat Bahor",                       category: "Salate" },
  { id: "glasnudelsalat",  name: "Glasnudelsalat",                    category: "Salate" },
  { id: "auberginensalat", name: "Auberginensalat",                   category: "Salate" },
  { id: "rubin",           name: "Salat Rubin",                       category: "Salate" },
  { id: "russischersalat", name: "Russischer Salat",                  category: "Salate" },
  { id: "gurkenrind",      name: "Gurken mit Rindfleisch",            category: "Salate" },
  { id: "karottensalat",   name: "Karottensalat",                     category: "Salate" },
  { id: "schakarob",       name: "Schakarob",                         category: "Salate" },
  { id: "kremigersalat",   name: "Cremiger Salat",                    category: "Salate" },
  { id: "haehnchenwalnuss",name: "Hähnchen mit Walnüssen",            category: "Salate" },
  { id: "gemueseteller",   name: "Gemüse Teller (Frisch)",            category: "Salate" },
  { id: "eingelegtesgemuese", name: "Eingelegtes Gemüse",             category: "Salate" },
  { id: "lepeschka",       name: "Lepeschka",                         category: "Beilagen" },
  { id: "lazjan",          name: 'Chili Soße "Lazjan"',               category: "Beilagen" },
  { id: "suzma",           name: 'Joghurt Soße "Suzma"',              category: "Beilagen" },
  { id: "tschaktschak",    name: "Tschak Tschak",                     category: "Desserts" },
  { id: "schokoladentorte",name: "Schokoladentorte",                  category: "Desserts" },
  { id: "cheesecake",      name: "Cheesecake",                        category: "Desserts" },
  { id: "tiramisu",        name: "Tiramisu / Pistazienmousse",         category: "Desserts" },
];

// ─── Utilities ────────────────────────────────────────────────────────────────

function fmt(price: number) {
  return price.toFixed(2).replace(".", ",") + " €";
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
  });
}

function playBeep() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    [0, 0.2, 0.4].forEach((delay) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.3, ctx.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.25);
      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + 0.25);
    });
  } catch {}
}

function printTicket(order: Order) {
  const win = window.open("", "_blank", "width=420,height=650");
  if (!win) return;
  win.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8">
    <title>${order.order_number}</title>
    <style>
      body{font-family:monospace;padding:20px;font-size:13px;max-width:380px}
      h2{font-size:16px;border-bottom:2px solid #000;padding-bottom:6px;margin:0 0 12px}
      .row{display:flex;justify-content:space-between;margin:3px 0}
      .divider{border-top:1px dashed #000;margin:10px 0}
      .total{font-weight:bold;font-size:15px}
      @media print{.no-print{display:none}}
    </style>
  </head><body>
    <h2>🍽️ SILK ROAD — ${order.order_number}</h2>
    <div class="row"><span>Zeit</span><span>${formatDate(order.created_at)} ${formatTime(order.created_at)}</span></div>
    <div class="divider"></div>
    <div><strong>${order.customer_name}</strong></div>
    <div>📞 ${order.customer_phone}</div>
    <div>📍 ${order.street}, ${order.postcode} ${order.city}</div>
    ${order.notes ? `<div>📝 ${order.notes}</div>` : ""}
    ${order.eta_minutes ? `<div>⏱️ Lieferzeit ca. ${order.eta_minutes} min</div>` : ""}
    <div class="divider"></div>
    ${order.items.map(i => `<div class="row"><span>${i.quantity}× ${i.name}</span><span>${fmt(i.price * i.quantity)}</span></div>`).join("")}
    <div class="divider"></div>
    <div class="row total"><span>GESAMT</span><span>${fmt(order.total)}</span></div>
    <div>${order.payment_method === "card" ? "💳 Kartenzahlung · BEZAHLT" : "💵 Barzahlung bei Lieferung"}</div>
    <div class="divider"></div>
    <button class="no-print" onclick="window.print()">🖨️ Drucken</button>
  </body></html>`);
  win.document.close();
  setTimeout(() => win.print(), 400);
}

// ─── Config ───────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; dot: string }> = {
  pending:    { label: "Neu",            color: "text-red-500",              dot: "bg-red-500" },
  accepted:   { label: "Angenommen",     color: "text-amber-500",            dot: "bg-amber-500" },
  preparing:  { label: "In Zubereitung", color: "text-blue-500",             dot: "bg-blue-500" },
  delivering: { label: "Unterwegs",      color: "text-purple-500",           dot: "bg-purple-500" },
  delivered:  { label: "Geliefert",      color: "text-green-500",            dot: "bg-green-500" },
  cancelled:  { label: "Storniert",      color: "text-muted-foreground",     dot: "bg-muted-foreground" },
};

const ACTIVE_STATUSES: OrderStatus[] = ["pending", "accepted", "preparing", "delivering"];
const ETA_OPTIONS = [20, 30, 45, 60, 90];

// ─── Main component ───────────────────────────────────────────────────────────

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(() => sessionStorage.getItem("admin-authed") === "1");
  const [authError, setAuthError] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<"active" | "history" | "settings">("active");
  const [cancelConfirm, setCancelConfirm] = useState<{ orderId: number; total: number; orderNumber: string } | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [etaPicker, setEtaPicker] = useState<{ orderId: number } | null>(null);

  // History filters
  const [filterPeriod, setFilterPeriod] = useState<"today" | "week" | "month" | "all">("all");
  const [filterPayment, setFilterPayment] = useState<"all" | "card" | "cash">("all");

  // Settings tab state
  const [adminSettings, setAdminSettings] = useState<AdminSettings | null>(null);
  const [settingsSaving, setSettingsSaving] = useState<string | null>(null);

  const prevPendingIds = useRef<Set<number>>(new Set());
  const initialized = useRef(false);

  const adminPw = () => sessionStorage.getItem("admin-pw") ?? "";

  // ─── Fetch orders ───────────────────────────────────────────────────────────
  const fetchOrders = useCallback(async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const res = await fetch("/api/admin/orders", {
        headers: { "x-admin-password": adminPw() },
      });
      if (res.status === 401) {
        sessionStorage.removeItem("admin-authed");
        sessionStorage.removeItem("admin-pw");
        setAuthed(false);
        return;
      }
      const data: Order[] = await res.json();
      setOrders(data);

      const newPendingIds = new Set(data.filter(o => o.status === "pending").map(o => o.id));
      if (initialized.current) {
        const hasNew = Array.from(newPendingIds).some(id => !prevPendingIds.current.has(id));
        if (hasNew) {
          playBeep();
          if ("Notification" in window && Notification.permission === "granted") {
            new Notification("🔔 Neue Bestellung!", {
              body: `${newPendingIds.size} neue Bestellung(en) eingegangen`,
            });
          }
          document.title = `🔔 (${newPendingIds.size}) Silk Road Admin`;
        }
      } else {
        initialized.current = true;
        if (newPendingIds.size > 0) {
          document.title = `🔔 (${newPendingIds.size}) Silk Road Admin`;
        }
      }
      if (newPendingIds.size === 0) document.title = "Silk Road Admin";
      prevPendingIds.current = newPendingIds;
    } finally {
      if (showLoading) setLoading(false);
    }
  }, []);

  // ─── Fetch settings ─────────────────────────────────────────────────────────
  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch("/api/settings");
      if (!res.ok) throw new Error("not ok");
      const data = await res.json();
      setAdminSettings({
        isOpen: data.isOpen,
        deliveryFee: String(data.deliveryFee),
        minOrder: String(data.minOrder),
        deliveryZones: (data.deliveryZones as string[]).join("\n"),
        soldoutItems: data.soldoutItems,
      });
    } catch {
      // Server doesn't have the new route yet — use defaults
      setAdminSettings({
        isOpen: true,
        deliveryFee: "5",
        minOrder: "25",
        deliveryZones: "50667\n50668\n50670\n50672\n50674\n50676\n50677\n50678\n50679\n50733\n50735\n50737\n50739\n50823\n50825\n50827\n50829",
        soldoutItems: [],
      });
    }
  }, []);

  useEffect(() => {
    if (!authed) return;
    fetchOrders(true);
    fetchSettings();
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
    const interval = setInterval(() => fetchOrders(), 10_000);
    return () => {
      clearInterval(interval);
      document.title = "Silk Road";
    };
  }, [authed, fetchOrders, fetchSettings]);

  // ─── Auth ───────────────────────────────────────────────────────────────────
  async function login() {
    setAuthError("");
    const res = await fetch("/api/admin/orders", {
      headers: { "x-admin-password": password },
    });
    if (res.ok) {
      sessionStorage.setItem("admin-authed", "1");
      sessionStorage.setItem("admin-pw", password);
      setAuthed(true);
      const data: Order[] = await res.json();
      setOrders(data);
      initialized.current = true;
      prevPendingIds.current = new Set(data.filter(o => o.status === "pending").map(o => o.id));
      fetchSettings();
      if ("Notification" in window && Notification.permission === "default") {
        Notification.requestPermission();
      }
    } else {
      setAuthError("Falsches Passwort");
    }
  }

  // ─── Actions ────────────────────────────────────────────────────────────────
  async function updateStatus(orderId: number, status: OrderStatus) {
    setActionLoading(orderId);
    try {
      await fetch(`/api/admin/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-admin-password": adminPw() },
        body: JSON.stringify({ status }),
      });
      await fetchOrders();
    } finally {
      setActionLoading(null);
    }
  }

  async function acceptWithEta(orderId: number, etaMinutes: number) {
    setEtaPicker(null);
    setActionLoading(orderId);
    try {
      await fetch(`/api/admin/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-admin-password": adminPw() },
        body: JSON.stringify({ status: "accepted" }),
      });
      await fetch(`/api/admin/orders/${orderId}/eta`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-admin-password": adminPw() },
        body: JSON.stringify({ etaMinutes }),
      });
      await fetchOrders();
    } finally {
      setActionLoading(null);
    }
  }

  async function cancelOrder(orderId: number) {
    setActionLoading(orderId);
    setCancelConfirm(null);
    try {
      await fetch(`/api/orders/${orderId}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cancelledBy: "restaurant" }),
      });
      await fetchOrders();
    } finally {
      setActionLoading(null);
    }
  }

  async function saveSetting(key: string, value: string) {
    setSettingsSaving(key);
    try {
      await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-admin-password": adminPw() },
        body: JSON.stringify({ key, value }),
      });
      await fetchSettings();
    } finally {
      setSettingsSaving(null);
    }
  }

  // ─── Login screen ────────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm bg-card border border-border rounded-sm shadow-2xl p-8"
        >
          <h1 className="font-heading text-2xl font-bold text-center mb-1">Admin</h1>
          <p className="text-muted-foreground text-sm text-center mb-6">Silk Road · Bestellverwaltung</p>
          <div className="space-y-4">
            <input
              type="password"
              placeholder="Passwort"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === "Enter" && login()}
              autoFocus
              className="w-full px-4 py-3 rounded-sm border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            {authError && <p className="text-red-500 text-sm">{authError}</p>}
            <button
              onClick={login}
              className="w-full py-3 bg-primary text-primary-foreground rounded-sm font-semibold text-sm tracking-wide uppercase hover:bg-primary/90 transition-colors [font-family:'Quando',_serif]"
            >
              Einloggen
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ─── Computed values ─────────────────────────────────────────────────────────
  const activeOrders = orders.filter(o => ACTIVE_STATUSES.includes(o.status));
  const newCount = orders.filter(o => o.status === "pending").length;

  // History with filters
  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const monthStr = now.toISOString().slice(0, 7);

  const historyOrders = orders
    .filter(o => !ACTIVE_STATUSES.includes(o.status))
    .filter(o => {
      if (filterPeriod === "today") return o.created_at.startsWith(todayStr);
      if (filterPeriod === "week") return o.created_at >= weekAgo;
      if (filterPeriod === "month") return o.created_at.startsWith(monthStr);
      return true;
    })
    .filter(o => filterPayment === "all" || o.payment_method === filterPayment);

  const displayOrders = tab === "active" ? activeOrders : historyOrders;

  // Stats
  const delivered = orders.filter(o => o.status === "delivered");
  const todayDelivered = delivered.filter(o => o.created_at.startsWith(todayStr));
  const monthDelivered = delivered.filter(o => o.created_at.startsWith(monthStr));
  const todayRevenue = todayDelivered.reduce((s, o) => s + o.total, 0);
  const monthRevenue = monthDelivered.reduce((s, o) => s + o.total, 0);
  const avgOrder = monthDelivered.length > 0 ? monthRevenue / monthDelivered.length : 0;

  const isOpen = adminSettings?.isOpen ?? true;

  return (
    <div className="min-h-screen bg-background text-foreground pb-8">
      {/* ─── Header ──────────────────────────────────────────────────────── */}
      <header className={`border-b sticky top-0 z-20 backdrop-blur-md ${isOpen ? "border-border bg-card/80" : "border-red-500/40 bg-red-500/10"}`}>
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <h1 className="font-heading font-bold text-lg shrink-0">Silk Road Admin</h1>
            {newCount > 0 && (
              <span className="animate-pulse bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shrink-0">
                {newCount} NEU
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Open/closed toggle */}
            {adminSettings && (
              <button
                onClick={() => saveSetting("is_open", isOpen ? "false" : "true")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm border text-xs font-bold transition-colors ${
                  isOpen
                    ? "border-green-500/40 bg-green-500/10 text-green-600 hover:bg-green-500/20 dark:text-green-400"
                    : "border-red-500/40 bg-red-500/15 text-red-600 hover:bg-red-500/25 dark:text-red-400 animate-pulse"
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${isOpen ? "bg-green-500" : "bg-red-500"}`} />
                {isOpen ? "Offen" : "Geschlossen"}
              </button>
            )}
            <button
              onClick={() => fetchOrders(true)}
              className="p-2 rounded-sm text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors"
              title="Aktualisieren"
            >
              <RefreshCwIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                sessionStorage.removeItem("admin-authed");
                sessionStorage.removeItem("admin-pw");
                setAuthed(false);
              }}
              className="p-2 rounded-sm text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors"
              title="Abmelden"
            >
              <LogOutIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* ─── Stats ───────────────────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-4 pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Heute · Umsatz" value={fmt(todayRevenue)} />
        <StatCard label="Heute · Bestellungen" value={String(todayDelivered.length)} />
        <StatCard label="Monat · Umsatz" value={fmt(monthRevenue)} highlight />
        <StatCard label="Monat · Ø Bestellwert" value={avgOrder > 0 ? fmt(avgOrder) : "—"} />
      </div>

      {/* ─── Tabs ────────────────────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-4 pt-4">
        <div className="flex gap-1 bg-muted/30 rounded-sm p-1 w-fit">
          {(["active", "history", "settings"] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-1.5 text-sm font-medium rounded-sm transition-colors ${
                tab === t ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t === "active" && `Aktiv${activeOrders.length > 0 ? ` (${activeOrders.length})` : ""}`}
              {t === "history" && "Verlauf"}
              {t === "settings" && "Einstellungen"}
            </button>
          ))}
        </div>
      </div>

      {/* ─── History filters ─────────────────────────────────────────────── */}
      {tab === "history" && (
        <div className="max-w-4xl mx-auto px-4 pt-3 flex flex-wrap gap-2">
          <FilterGroup
            options={[
              { value: "today", label: "Heute" },
              { value: "week",  label: "7 Tage" },
              { value: "month", label: "Monat" },
              { value: "all",   label: "Alle" },
            ]}
            value={filterPeriod}
            onChange={v => setFilterPeriod(v as any)}
          />
          <FilterGroup
            options={[
              { value: "all",  label: "Alle" },
              { value: "card", label: "Karte" },
              { value: "cash", label: "Bar" },
            ]}
            value={filterPayment}
            onChange={v => setFilterPayment(v as any)}
          />
        </div>
      )}

      {/* ─── Settings tab ────────────────────────────────────────────────── */}
      {tab === "settings" && adminSettings && (
        <SettingsTab
          settings={adminSettings}
          saving={settingsSaving}
          onChange={setAdminSettings}
          onSave={saveSetting}
        />
      )}

      {/* ─── Orders ──────────────────────────────────────────────────────── */}
      {tab !== "settings" && (
        <main className="max-w-4xl mx-auto px-4 py-4 space-y-4">
          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2Icon className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : displayOrders.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground text-sm">
              {tab === "active" ? "Keine aktiven Bestellungen" : "Keine Bestellungen für diesen Zeitraum"}
            </div>
          ) : (
            <AnimatePresence>
              {displayOrders.map(order => (
                <OrderCard
                  key={order.id}
                  order={order}
                  actionLoading={actionLoading === order.id}
                  showEtaPicker={etaPicker?.orderId === order.id}
                  onUpdateStatus={updateStatus}
                  onAcceptWithEta={(id) => setEtaPicker({ orderId: id })}
                  onEtaSelected={acceptWithEta}
                  onEtaCancel={() => setEtaPicker(null)}
                  onCancelRequest={(id, total, num) => setCancelConfirm({ orderId: id, total, orderNumber: num })}
                  onPrint={() => printTicket(order)}
                />
              ))}
            </AnimatePresence>
          )}
        </main>
      )}

      {/* ─── Cancel confirmation dialog ──────────────────────────────────── */}
      <AnimatePresence>
        {cancelConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setCancelConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-card border border-border rounded-sm shadow-2xl p-6 w-full max-w-sm"
            >
              <h3 className="font-heading font-bold text-lg mb-2">Bestellung stornieren?</h3>
              <p className="text-sm text-muted-foreground mb-1">
                <span className="font-semibold text-foreground">{cancelConfirm.orderNumber}</span>
              </p>
              <p className="text-sm text-muted-foreground mb-5">
                {fmt(cancelConfirm.total)} werden dem Kunden automatisch zurückerstattet.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setCancelConfirm(null)}
                  className="flex-1 py-2.5 border border-border rounded-sm text-sm font-medium hover:bg-muted/30 transition-colors"
                >
                  Abbrechen
                </button>
                <button
                  onClick={() => cancelOrder(cancelConfirm.orderId)}
                  className="flex-1 py-2.5 bg-red-500 text-white rounded-sm text-sm font-medium hover:bg-red-600 transition-colors"
                >
                  Ja, stornieren
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Order Card ───────────────────────────────────────────────────────────────

interface OrderCardProps {
  order: Order;
  actionLoading: boolean;
  showEtaPicker: boolean;
  onUpdateStatus: (id: number, status: OrderStatus) => void;
  onAcceptWithEta: (id: number) => void;
  onEtaSelected: (id: number, eta: number) => void;
  onEtaCancel: () => void;
  onCancelRequest: (id: number, total: number, orderNumber: string) => void;
  onPrint: () => void;
}

function OrderCard({ order, actionLoading, showEtaPicker, onUpdateStatus, onAcceptWithEta, onEtaSelected, onEtaCancel, onCancelRequest, onPrint }: OrderCardProps) {
  const cfg = STATUS_CONFIG[order.status];
  const isNew = order.status === "pending";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className={`bg-card border rounded-sm overflow-hidden shadow-sm ${isNew ? "border-red-500/50" : "border-border"}`}
    >
      {/* Header */}
      <div className={`flex items-center justify-between px-4 py-3 border-b border-border ${isNew ? "bg-red-500/10" : "bg-muted/20"}`}>
        <div className="flex items-center gap-2 min-w-0">
          <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${cfg.dot} ${isNew ? "animate-pulse" : ""}`} />
          <span className={`text-xs font-bold uppercase tracking-wide shrink-0 ${cfg.color}`}>{cfg.label}</span>
          <span className="font-heading font-bold text-foreground">{order.order_number}</span>
          {order.eta_minutes && (order.status === "accepted" || order.status === "preparing") && (
            <span className="text-xs text-muted-foreground">· ca. {order.eta_minutes} min</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onPrint}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors px-1.5 py-0.5 rounded border border-border hover:bg-muted/30"
            title="Ticket drucken"
          >
            🖨️
          </button>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <ClockIcon className="w-3.5 h-3.5" />
            {formatDate(order.created_at)} · {formatTime(order.created_at)}
          </div>
        </div>
      </div>

      {/* Customer info */}
      <div className="px-4 py-3 grid grid-cols-1 sm:grid-cols-2 gap-3 border-b border-border">
        <div>
          <p className="font-semibold text-foreground">{order.customer_name}</p>
          <a href={`tel:${order.customer_phone}`} className="flex items-center gap-1.5 mt-0.5 text-sm text-primary hover:underline w-fit">
            <PhoneIcon className="w-3.5 h-3.5 shrink-0" />{order.customer_phone}
          </a>
        </div>
        <div className="flex items-start gap-1.5">
          <MapPinIcon className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
          <div className="text-sm text-muted-foreground">
            <p>{order.street}</p>
            <p>{order.postcode} {order.city}</p>
          </div>
        </div>
      </div>

      {/* Notes */}
      {order.notes && (
        <div className="px-4 py-2 bg-amber-500/10 border-b border-amber-500/20 text-sm text-amber-700 dark:text-amber-400">
          📝 {order.notes}
        </div>
      )}

      {/* Items */}
      <div className="px-4 py-3 border-b border-border">
        <ul className="space-y-1">
          {order.items.map((item, i) => (
            <li key={i} className="flex justify-between text-sm">
              <span className="text-foreground">{item.quantity}× {item.name}</span>
              <span className="text-primary font-medium tabular-nums">{fmt(item.price * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-2 pt-2 border-t border-border flex justify-between items-center">
          <span className="text-xs text-muted-foreground flex items-center gap-1.5">
            {order.payment_method === "card"
              ? <><span className="text-green-500 font-bold">✓</span> Kartenzahlung · Bezahlt</>
              : <><span className="text-amber-500">○</span> Barzahlung bei Lieferung</>}
          </span>
          <span className="font-heading font-bold text-foreground">{fmt(order.total)}</span>
        </div>
      </div>

      {/* ETA picker */}
      {showEtaPicker && (
        <div className="px-4 py-3 border-b border-border bg-amber-500/5">
          <p className="text-xs font-medium text-muted-foreground mb-2">Lieferzeit wählen:</p>
          <div className="flex flex-wrap gap-2">
            {ETA_OPTIONS.map(min => (
              <button
                key={min}
                onClick={() => onEtaSelected(order.id, min)}
                className="px-3 py-1.5 rounded-sm border border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-400 text-sm font-medium hover:bg-amber-500/20 transition-colors"
              >
                {min} min
              </button>
            ))}
            <button
              onClick={onEtaCancel}
              className="px-3 py-1.5 rounded-sm border border-border text-muted-foreground text-sm hover:bg-muted/30 transition-colors"
            >
              Abbrechen
            </button>
          </div>
        </div>
      )}

      {/* Action buttons */}
      <ActionButtons
        order={order}
        loading={actionLoading}
        showEtaPicker={showEtaPicker}
        onUpdate={onUpdateStatus}
        onAccept={onAcceptWithEta}
        onCancel={onCancelRequest}
      />
    </motion.div>
  );
}

// ─── Action Buttons ───────────────────────────────────────────────────────────

function ActionButtons({ order, loading, showEtaPicker, onUpdate, onAccept, onCancel }: {
  order: Order;
  loading: boolean;
  showEtaPicker: boolean;
  onUpdate: (id: number, status: OrderStatus) => void;
  onAccept: (id: number) => void;
  onCancel: (id: number, total: number, orderNumber: string) => void;
}) {
  if (order.status === "delivered") {
    return (
      <div className="px-4 py-3 flex items-center gap-2 text-green-500 text-sm">
        <CheckCircleIcon className="w-4 h-4" />
        <span className="font-medium">Geliefert</span>
      </div>
    );
  }
  if (order.status === "cancelled") {
    return (
      <div className="px-4 py-3 text-xs text-muted-foreground">
        Storniert{order.cancelled_by ? ` von ${order.cancelled_by}` : ""}
        {order.cancelled_at ? ` · ${formatDate(order.cancelled_at)} ${formatTime(order.cancelled_at)}` : ""}
      </div>
    );
  }
  if (showEtaPicker) return null;

  return (
    <div className="px-4 py-3 flex flex-wrap gap-2">
      {loading ? (
        <Loader2Icon className="w-5 h-5 animate-spin text-muted-foreground" />
      ) : (
        <>
          {order.status === "pending" && (
            <>
              <ActionBtn color="green" icon={<CheckIcon className="w-4 h-4" />} onClick={() => onAccept(order.id)}>
                Annehmen
              </ActionBtn>
              <ActionBtn color="red" icon={<XIcon className="w-4 h-4" />} onClick={() => onCancel(order.id, order.total, order.order_number)}>
                Ablehnen
              </ActionBtn>
            </>
          )}
          {order.status === "accepted" && (
            <>
              <ActionBtn color="blue" icon={<UtensilsIcon className="w-4 h-4" />} onClick={() => onUpdate(order.id, "preparing")}>
                In Zubereitung
              </ActionBtn>
              <ActionBtn color="red" icon={<BanIcon className="w-4 h-4" />} onClick={() => onCancel(order.id, order.total, order.order_number)}>
                Stornieren
              </ActionBtn>
            </>
          )}
          {order.status === "preparing" && (
            <>
              <ActionBtn color="purple" icon={<TruckIcon className="w-4 h-4" />} onClick={() => onUpdate(order.id, "delivering")}>
                Unterwegs
              </ActionBtn>
              <ActionBtn color="red" icon={<BanIcon className="w-4 h-4" />} onClick={() => onCancel(order.id, order.total, order.order_number)}>
                Stornieren
              </ActionBtn>
            </>
          )}
          {order.status === "delivering" && (
            <ActionBtn color="green" icon={<CheckCircleIcon className="w-4 h-4" />} onClick={() => onUpdate(order.id, "delivered")}>
              Geliefert
            </ActionBtn>
          )}
        </>
      )}
    </div>
  );
}

function ActionBtn({ color, icon, onClick, children }: {
  color: "green" | "red" | "blue" | "purple";
  icon: React.ReactNode;
  onClick: () => void;
  children: React.ReactNode;
}) {
  const colors = {
    green:  "bg-green-500/10 text-green-700 border-green-500/30 hover:bg-green-500/20 dark:text-green-400",
    red:    "bg-red-500/10 text-red-700 border-red-500/30 hover:bg-red-500/20 dark:text-red-400",
    blue:   "bg-blue-500/10 text-blue-700 border-blue-500/30 hover:bg-blue-500/20 dark:text-blue-400",
    purple: "bg-purple-500/10 text-purple-700 border-purple-500/30 hover:bg-purple-500/20 dark:text-purple-400",
  };
  return (
    <button onClick={onClick} className={`flex items-center gap-1.5 px-3 py-2 rounded-sm border text-sm font-medium transition-colors ${colors[color]}`}>
      {icon}{children}
    </button>
  );
}

// ─── Settings Tab ─────────────────────────────────────────────────────────────

function SettingsTab({ settings, saving, onChange, onSave }: {
  settings: AdminSettings;
  saving: string | null;
  onChange: (s: AdminSettings) => void;
  onSave: (key: string, value: string) => void;
}) {
  const soldoutByCategory: Record<string, typeof MENU_ITEMS> = {};
  for (const item of MENU_ITEMS) {
    if (!soldoutByCategory[item.category]) soldoutByCategory[item.category] = [];
    soldoutByCategory[item.category].push(item);
  }

  function toggleSoldout(id: string) {
    const current = settings.soldoutItems;
    const next = current.includes(id) ? current.filter(x => x !== id) : [...current, id];
    onChange({ ...settings, soldoutItems: next });
    onSave("soldout_items", JSON.stringify(next));
  }

  return (
    <div className="max-w-4xl mx-auto px-4 pt-4 space-y-6">

      {/* Betrieb */}
      <SettingsSection title="Betrieb">
        <div className="flex items-center justify-between p-4 bg-card border border-border rounded-sm">
          <div>
            <p className="font-medium text-sm">Bestellungen annehmen</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {settings.isOpen ? "Restaurant ist geöffnet" : "Restaurant ist geschlossen — keine Bestellungen möglich"}
            </p>
          </div>
          <button
            onClick={() => onSave("is_open", settings.isOpen ? "false" : "true")}
            className={`relative w-11 h-6 rounded-full transition-colors ${settings.isOpen ? "bg-green-500" : "bg-muted"}`}
          >
            <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${settings.isOpen ? "left-6" : "left-1"}`} />
          </button>
        </div>
      </SettingsSection>

      {/* Liefereinstellungen */}
      <SettingsSection title="Liefereinstellungen">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-muted-foreground block mb-1">Mindestbestellwert (€)</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={settings.minOrder}
                onChange={e => onChange({ ...settings, minOrder: e.target.value })}
                className="flex-1 px-3 py-2 rounded-sm border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <SaveButton saving={saving === "min_order"} onClick={() => onSave("min_order", settings.minOrder)} />
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground block mb-1">Liefergebühr (€)</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={settings.deliveryFee}
                onChange={e => onChange({ ...settings, deliveryFee: e.target.value })}
                className="flex-1 px-3 py-2 rounded-sm border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <SaveButton saving={saving === "delivery_fee"} onClick={() => onSave("delivery_fee", settings.deliveryFee)} />
            </div>
          </div>
        </div>
        <div className="mt-3">
          <label className="text-xs text-muted-foreground block mb-1">Lieferzonen (PLZ, eine pro Zeile)</label>
          <div className="flex gap-2">
            <textarea
              value={settings.deliveryZones}
              onChange={e => onChange({ ...settings, deliveryZones: e.target.value })}
              rows={5}
              className="flex-1 px-3 py-2 rounded-sm border border-border bg-background text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
            />
            <SaveButton
              saving={saving === "delivery_zones"}
              onClick={() => onSave("delivery_zones", JSON.stringify(
                settings.deliveryZones.split("\n").map(s => s.trim()).filter(Boolean)
              ))}
            />
          </div>
        </div>
      </SettingsSection>

      {/* Speisekarte — Nicht verfügbar */}
      <SettingsSection title="Speisekarte — Nicht verfügbar">
        <p className="text-xs text-muted-foreground mb-3">Markierte Gerichte werden auf der Speisekarte als ausverkauft angezeigt.</p>
        <div className="space-y-4">
          {Object.entries(soldoutByCategory).map(([category, items]) => (
            <div key={category}>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">{category}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {items.map(item => (
                  <label key={item.id} className="flex items-center gap-2.5 p-2 rounded-sm border border-border hover:bg-muted/20 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={settings.soldoutItems.includes(item.id)}
                      onChange={() => toggleSoldout(item.id)}
                      className="accent-primary w-4 h-4"
                    />
                    <span className={`text-sm ${settings.soldoutItems.includes(item.id) ? "line-through text-muted-foreground" : "text-foreground"}`}>
                      {item.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </SettingsSection>
    </div>
  );
}

function SettingsSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-heading font-bold text-sm uppercase tracking-wide text-muted-foreground mb-3">{title}</h2>
      {children}
    </div>
  );
}

function SaveButton({ saving, onClick }: { saving: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      disabled={saving}
      className="px-3 py-2 bg-primary text-primary-foreground rounded-sm text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 shrink-0"
    >
      {saving ? <Loader2Icon className="w-4 h-4 animate-spin" /> : <CheckIcon className="w-4 h-4" />}
    </button>
  );
}

// ─── Filter Group ─────────────────────────────────────────────────────────────

function FilterGroup({ options, value, onChange }: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex gap-1 bg-muted/30 rounded-sm p-0.5">
      {options.map(o => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={`px-3 py-1 text-xs font-medium rounded-sm transition-colors ${
            value === o.value ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`rounded-sm border p-3 ${highlight ? "border-primary/30 bg-primary/5" : "border-border bg-card"}`}>
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className={`font-heading font-bold text-lg tabular-nums ${highlight ? "text-primary" : "text-foreground"}`}>
        {value}
      </p>
    </div>
  );
}

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
}

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
    const ctx = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
    [0, 0.2, 0.4].forEach((delay) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.3, ctx.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        ctx.currentTime + delay + 0.25
      );
      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + 0.25);
    });
  } catch {
    // AudioContext not available — silent fail
  }
}

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; color: string; dot: string }
> = {
  pending: {
    label: "Neu",
    color: "text-red-500",
    dot: "bg-red-500",
  },
  accepted: {
    label: "Angenommen",
    color: "text-amber-500",
    dot: "bg-amber-500",
  },
  preparing: {
    label: "In Zubereitung",
    color: "text-blue-500",
    dot: "bg-blue-500",
  },
  delivering: {
    label: "Unterwegs",
    color: "text-purple-500",
    dot: "bg-purple-500",
  },
  delivered: {
    label: "Geliefert",
    color: "text-green-500",
    dot: "bg-green-500",
  },
  cancelled: {
    label: "Storniert",
    color: "text-muted-foreground",
    dot: "bg-muted-foreground",
  },
};

const ACTIVE_STATUSES: OrderStatus[] = [
  "pending",
  "accepted",
  "preparing",
  "delivering",
];

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(
    () => sessionStorage.getItem("admin-authed") === "1"
  );
  const [authError, setAuthError] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<"active" | "history">("active");
  const [cancelConfirm, setCancelConfirm] = useState<{
    orderId: number;
    total: number;
    orderNumber: string;
  } | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const prevPendingIds = useRef<Set<number>>(new Set());
  const initialized = useRef(false);

  const fetchOrders = useCallback(async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const res = await fetch("/api/admin/orders", {
        headers: {
          "x-admin-password": sessionStorage.getItem("admin-pw") ?? "",
        },
      });
      if (res.status === 401) {
        sessionStorage.removeItem("admin-authed");
        sessionStorage.removeItem("admin-pw");
        setAuthed(false);
        return;
      }
      const data: Order[] = await res.json();
      setOrders(data);

      // Sound alert: only fire after first fetch, when new pending orders appear
      const newPendingIds = new Set(
        data.filter((o) => o.status === "pending").map((o) => o.id)
      );
      if (initialized.current) {
        const hasNew = Array.from(newPendingIds).some(
          (id) => !prevPendingIds.current.has(id)
        );
        if (hasNew) playBeep();
      } else {
        initialized.current = true;
      }
      prevPendingIds.current = newPendingIds;
    } finally {
      if (showLoading) setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authed) return;
    fetchOrders(true);
    const interval = setInterval(() => fetchOrders(), 10_000);
    return () => clearInterval(interval);
  }, [authed, fetchOrders]);

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
      prevPendingIds.current = new Set(
        data.filter((o) => o.status === "pending").map((o) => o.id)
      );
    } else {
      setAuthError("Falsches Passwort");
    }
  }

  async function updateStatus(orderId: number, status: OrderStatus) {
    setActionLoading(orderId);
    try {
      await fetch(`/api/admin/orders/${orderId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": sessionStorage.getItem("admin-pw") ?? "",
        },
        body: JSON.stringify({ status }),
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

  // ─── Login screen ────────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm bg-card border border-border rounded-sm shadow-2xl p-8"
        >
          <h1 className="font-heading text-2xl font-bold text-center mb-1">
            Admin
          </h1>
          <p className="text-muted-foreground text-sm text-center mb-6">
            Silk Road · Bestellverwaltung
          </p>
          <div className="space-y-4">
            <input
              type="password"
              placeholder="Passwort"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && login()}
              autoFocus
              className="w-full px-4 py-3 rounded-sm border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            {authError && (
              <p className="text-red-500 text-sm">{authError}</p>
            )}
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

  const activeOrders = orders.filter((o) =>
    ACTIVE_STATUSES.includes(o.status)
  );
  const historyOrders = orders.filter(
    (o) => !ACTIVE_STATUSES.includes(o.status)
  );
  const displayOrders = tab === "active" ? activeOrders : historyOrders;
  const newCount = orders.filter((o) => o.status === "pending").length;

  // ─── Stats ───────────────────────────────────────────────────────────────────
  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);
  const thisMonthStr = now.toISOString().slice(0, 7);

  const delivered = orders.filter((o) => o.status === "delivered");
  const todayDelivered = delivered.filter((o) =>
    o.created_at.startsWith(todayStr)
  );
  const monthDelivered = delivered.filter((o) =>
    o.created_at.startsWith(thisMonthStr)
  );

  const todayRevenue = todayDelivered.reduce((s, o) => s + o.total, 0);
  const monthRevenue = monthDelivered.reduce((s, o) => s + o.total, 0);
  const avgOrder =
    monthDelivered.length > 0 ? monthRevenue / monthDelivered.length : 0;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ─── Header ──────────────────────────────────────────────────────── */}
      <header className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="font-heading font-bold text-lg">Silk Road Admin</h1>
            {newCount > 0 && (
              <span className="animate-pulse bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {newCount} NEU
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
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
          <button
            onClick={() => setTab("active")}
            className={`px-4 py-1.5 text-sm font-medium rounded-sm transition-colors ${
              tab === "active"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Aktiv{activeOrders.length > 0 && ` (${activeOrders.length})`}
          </button>
          <button
            onClick={() => setTab("history")}
            className={`px-4 py-1.5 text-sm font-medium rounded-sm transition-colors ${
              tab === "history"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Verlauf
          </button>
        </div>
      </div>

      {/* ─── Orders ──────────────────────────────────────────────────────── */}
      <main className="max-w-4xl mx-auto px-4 py-4 space-y-4">
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2Icon className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : displayOrders.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground text-sm">
            {tab === "active"
              ? "Keine aktiven Bestellungen"
              : "Noch keine abgeschlossenen Bestellungen"}
          </div>
        ) : (
          <AnimatePresence>
            {displayOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                actionLoading={actionLoading === order.id}
                onUpdateStatus={updateStatus}
                onCancelRequest={(id, total, orderNumber) =>
                  setCancelConfirm({ orderId: id, total, orderNumber })
                }
              />
            ))}
          </AnimatePresence>
        )}
      </main>

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
              onClick={(e) => e.stopPropagation()}
              className="bg-card border border-border rounded-sm shadow-2xl p-6 w-full max-w-sm"
            >
              <h3 className="font-heading font-bold text-lg mb-2">
                Bestellung stornieren?
              </h3>
              <p className="text-sm text-muted-foreground mb-1">
                <span className="font-semibold text-foreground">
                  {cancelConfirm.orderNumber}
                </span>
              </p>
              <p className="text-sm text-muted-foreground mb-5">
                {fmt(cancelConfirm.total)} werden dem Kunden automatisch
                zurückerstattet. Diese Aktion kann nicht rückgängig gemacht
                werden.
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
  onUpdateStatus: (id: number, status: OrderStatus) => void;
  onCancelRequest: (id: number, total: number, orderNumber: string) => void;
}

function OrderCard({
  order,
  actionLoading,
  onUpdateStatus,
  onCancelRequest,
}: OrderCardProps) {
  const cfg = STATUS_CONFIG[order.status];
  const isNew = order.status === "pending";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className={`bg-card border rounded-sm overflow-hidden shadow-sm ${
        isNew ? "border-red-500/50" : "border-border"
      }`}
    >
      {/* Header */}
      <div
        className={`flex items-center justify-between px-4 py-3 border-b border-border ${
          isNew ? "bg-red-500/10" : "bg-muted/20"
        }`}
      >
        <div className="flex items-center gap-2">
          <span
            className={`w-2.5 h-2.5 rounded-full shrink-0 ${cfg.dot} ${
              isNew ? "animate-pulse" : ""
            }`}
          />
          <span
            className={`text-xs font-bold uppercase tracking-wide ${cfg.color}`}
          >
            {cfg.label}
          </span>
          <span className="font-heading font-bold text-foreground">
            {order.order_number}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <ClockIcon className="w-3.5 h-3.5" />
          {formatDate(order.created_at)} · {formatTime(order.created_at)}
        </div>
      </div>

      {/* Customer info */}
      <div className="px-4 py-3 grid grid-cols-1 sm:grid-cols-2 gap-3 border-b border-border">
        <div>
          <p className="font-semibold text-foreground">{order.customer_name}</p>
          <a
            href={`tel:${order.customer_phone}`}
            className="flex items-center gap-1.5 mt-0.5 text-sm text-primary hover:underline w-fit"
          >
            <PhoneIcon className="w-3.5 h-3.5 shrink-0" />
            {order.customer_phone}
          </a>
        </div>
        <div className="flex items-start gap-1.5">
          <MapPinIcon className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
          <div className="text-sm text-muted-foreground">
            <p>{order.street}</p>
            <p>
              {order.postcode} {order.city}
            </p>
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
              <span className="text-foreground">
                {item.quantity}× {item.name}
              </span>
              <span className="text-primary font-medium tabular-nums">
                {fmt(item.price * item.quantity)}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-2 pt-2 border-t border-border flex justify-between items-center">
          <span className="text-xs text-muted-foreground flex items-center gap-1.5">
            {order.payment_method === "card" ? (
              <>
                <span className="text-green-500 font-bold">✓</span>
                Kartenzahlung · Bezahlt
              </>
            ) : (
              <>
                <span className="text-amber-500">○</span>
                Barzahlung bei Lieferung
              </>
            )}
          </span>
          <span className="font-heading font-bold text-foreground">
            {fmt(order.total)}
          </span>
        </div>
      </div>

      {/* Action buttons */}
      <ActionButtons
        order={order}
        loading={actionLoading}
        onUpdate={onUpdateStatus}
        onCancel={onCancelRequest}
      />
    </motion.div>
  );
}

// ─── Action Buttons ───────────────────────────────────────────────────────────

function ActionButtons({
  order,
  loading,
  onUpdate,
  onCancel,
}: {
  order: Order;
  loading: boolean;
  onUpdate: (id: number, status: OrderStatus) => void;
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
        {order.cancelled_at
          ? ` · ${formatDate(order.cancelled_at)} ${formatTime(order.cancelled_at)}`
          : ""}
      </div>
    );
  }

  return (
    <div className="px-4 py-3 flex flex-wrap gap-2">
      {loading ? (
        <Loader2Icon className="w-5 h-5 animate-spin text-muted-foreground" />
      ) : (
        <>
          {order.status === "pending" && (
            <>
              <ActionBtn
                color="green"
                icon={<CheckIcon className="w-4 h-4" />}
                onClick={() => onUpdate(order.id, "accepted")}
              >
                Annehmen
              </ActionBtn>
              <ActionBtn
                color="red"
                icon={<XIcon className="w-4 h-4" />}
                onClick={() =>
                  onCancel(order.id, order.total, order.order_number)
                }
              >
                Ablehnen
              </ActionBtn>
            </>
          )}

          {order.status === "accepted" && (
            <>
              <ActionBtn
                color="blue"
                icon={<UtensilsIcon className="w-4 h-4" />}
                onClick={() => onUpdate(order.id, "preparing")}
              >
                In Zubereitung
              </ActionBtn>
              <ActionBtn
                color="red"
                icon={<BanIcon className="w-4 h-4" />}
                onClick={() =>
                  onCancel(order.id, order.total, order.order_number)
                }
              >
                Stornieren
              </ActionBtn>
            </>
          )}

          {order.status === "preparing" && (
            <>
              <ActionBtn
                color="purple"
                icon={<TruckIcon className="w-4 h-4" />}
                onClick={() => onUpdate(order.id, "delivering")}
              >
                Unterwegs
              </ActionBtn>
              <ActionBtn
                color="red"
                icon={<BanIcon className="w-4 h-4" />}
                onClick={() =>
                  onCancel(order.id, order.total, order.order_number)
                }
              >
                Stornieren
              </ActionBtn>
            </>
          )}

          {order.status === "delivering" && (
            <ActionBtn
              color="green"
              icon={<CheckCircleIcon className="w-4 h-4" />}
              onClick={() => onUpdate(order.id, "delivered")}
            >
              Geliefert
            </ActionBtn>
          )}
        </>
      )}
    </div>
  );
}

function ActionBtn({
  color,
  icon,
  onClick,
  children,
}: {
  color: "green" | "red" | "blue" | "purple";
  icon: React.ReactNode;
  onClick: () => void;
  children: React.ReactNode;
}) {
  const colors = {
    green:
      "bg-green-500/10 text-green-700 border-green-500/30 hover:bg-green-500/20 dark:text-green-400",
    red: "bg-red-500/10 text-red-700 border-red-500/30 hover:bg-red-500/20 dark:text-red-400",
    blue: "bg-blue-500/10 text-blue-700 border-blue-500/30 hover:bg-blue-500/20 dark:text-blue-400",
    purple:
      "bg-purple-500/10 text-purple-700 border-purple-500/30 hover:bg-purple-500/20 dark:text-purple-400",
  };
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-2 rounded-sm border text-sm font-medium transition-colors ${colors[color]}`}
    >
      {icon}
      {children}
    </button>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-sm border p-3 ${
        highlight
          ? "border-primary/30 bg-primary/5"
          : "border-border bg-card"
      }`}
    >
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p
        className={`font-heading font-bold text-lg tabular-nums ${
          highlight ? "text-primary" : "text-foreground"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

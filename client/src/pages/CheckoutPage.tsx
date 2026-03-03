import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Elements } from "@stripe/react-stripe-js";
import { useCart, DELIVERY_FEE, MIN_ORDER } from "@/lib/CartContext";
import { useLanguage } from "@/lib/LanguageContext";
import { ArrowLeftIcon } from "@/components/icons";
import { stripePromise } from "@/lib/stripe";
import PaymentForm from "@/components/Checkout/PaymentForm";

import carpetImage from "@assets/stock_images/persian_carpet.webp";

// Cologne delivery zones (PLZ)
const DELIVERY_ZONES = [
  "50667", "50668", "50670", "50672", "50674", "50676",
  "50677", "50678", "50679", "50733", "50735", "50737",
  "50739", "50823", "50825", "50827", "50829",
];

function fmt(price: number) {
  return price.toFixed(2).replace(".", ",") + " €";
}

const labels = {
  de: {
    title: "Zur Kasse",
    subtitle: "Lieferdetails",
    name: "Vollständiger Name",
    email: "E-Mail-Adresse",
    phone: "Telefonnummer",
    street: "Straße & Hausnummer",
    postcode: "Postleitzahl",
    city: "Stadt",
    notes: "Lieferhinweise (optional)",
    notesPlaceholder: "z.B. 2. Etage, klingeln bei Müller",
    paymentTitle: "Zahlungsmethode",
    card: "Kreditkarte / EC-Karte",
    cardHint: "Sicher bezahlen mit Stripe",
    cash: "Bar bei Lieferung",
    cashHint: "Bezahlen Sie beim Fahrer",
    orderSummary: "Ihre Bestellung",
    subtotal: "Zwischensumme",
    delivery: "Liefergebühr",
    total: "Gesamt",
    submit: "Bestellung aufgeben",
    backToMenu: "Zurück zum Menü",
    errors: {
      name: "Name ist erforderlich (min. 2 Zeichen)",
      email: "Gültige E-Mail-Adresse erforderlich",
      phone: "Telefonnummer ist erforderlich",
      street: "Straße und Hausnummer erforderlich",
      postcode: "Wir liefern leider nicht in Ihre PLZ",
      city: "Stadt ist erforderlich",
    },
    emptyCart: "Ihr Warenkorb ist leer",
    emptyCartHint: "Fügen Sie zuerst Gerichte hinzu",
  },
  en: {
    title: "Checkout",
    subtitle: "Delivery Details",
    name: "Full Name",
    email: "Email Address",
    phone: "Phone Number",
    street: "Street & House Number",
    postcode: "Postcode",
    city: "City",
    notes: "Delivery notes (optional)",
    notesPlaceholder: "e.g. 2nd floor, ring Müller",
    paymentTitle: "Payment Method",
    card: "Credit / Debit Card",
    cardHint: "Pay securely with Stripe",
    cash: "Cash on Delivery",
    cashHint: "Pay the driver on arrival",
    orderSummary: "Your Order",
    subtotal: "Subtotal",
    delivery: "Delivery fee",
    total: "Total",
    submit: "Place Order",
    backToMenu: "Back to Menu",
    errors: {
      name: "Name is required (min. 2 characters)",
      email: "Valid email address required",
      phone: "Phone number is required",
      street: "Street and house number required",
      postcode: "Sorry, we don't deliver to your postcode",
      city: "City is required",
    },
    emptyCart: "Your cart is empty",
    emptyCartHint: "Add some dishes first",
  },
  ru: {
    title: "Оформление заказа",
    subtitle: "Детали доставки",
    name: "Полное имя",
    email: "Адрес электронной почты",
    phone: "Номер телефона",
    street: "Улица и номер дома",
    postcode: "Почтовый индекс",
    city: "Город",
    notes: "Комментарий к заказу (необязательно)",
    notesPlaceholder: "напр. 2-й этаж, звонить Мюллеру",
    paymentTitle: "Способ оплаты",
    card: "Кредитная / дебетовая карта",
    cardHint: "Безопасная оплата через Stripe",
    cash: "Наличные при доставке",
    cashHint: "Оплата курьеру",
    orderSummary: "Ваш заказ",
    subtotal: "Подытог",
    delivery: "Доставка",
    total: "Итого",
    submit: "Оформить заказ",
    backToMenu: "Назад в меню",
    errors: {
      name: "Имя обязательно (мин. 2 символа)",
      email: "Требуется действительный адрес электронной почты",
      phone: "Номер телефона обязателен",
      street: "Улица и номер дома обязательны",
      postcode: "К сожалению, мы не доставляем по вашему индексу",
      city: "Город обязателен",
    },
    emptyCart: "Ваша корзина пуста",
    emptyCartHint: "Сначала добавьте блюда",
  },
};

export default function CheckoutPage() {
  const [, setLocation] = useLocation();
  const { lang, getLocalizedPath } = useLanguage();
  const { items, subtotal, clearCart } = useCart();
  const t = labels[lang];

  const meetsMinOrder = subtotal >= MIN_ORDER;
  const total = subtotal + DELIVERY_FEE;

  // Payment step state (card only)
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [pendingOrderId, setPendingOrderId] = useState<number | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Redirect to menu if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      setLocation(getLocalizedPath("/menu"));
    }
  }, [items.length]);

  const schema = z.object({
    name: z.string().min(2, t.errors.name),
    email: z.string().email(t.errors.email),
    phone: z.string().min(6, t.errors.phone),
    street: z.string().min(3, t.errors.street),
    postcode: z.string().refine(
      (plz) => DELIVERY_ZONES.includes(plz.trim()),
      t.errors.postcode
    ),
    city: z.string().min(2, t.errors.city),
    notes: z.string().optional(),
    paymentMethod: z.enum(["card", "cash"]),
  });

  type FormData = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { paymentMethod: "card" },
  });

  const paymentMethod = watch("paymentMethod");

  const onSubmit = async (data: FormData) => {
    setSubmitError(null);
    const customer = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      street: data.street,
      postcode: data.postcode,
      city: data.city,
      notes: data.notes,
    };

    try {
      if (data.paymentMethod === "cash") {
        const res = await fetch("/api/orders/cash", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ customer, items, subtotal }),
        });
        if (!res.ok) throw new Error((await res.json()).message);
        const { orderId } = await res.json();
        clearCart();
        setLocation(`/order-success/${orderId}`);
      } else {
        const res = await fetch("/api/orders/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ customer, items, subtotal }),
        });
        if (!res.ok) throw new Error((await res.json()).message);
        const { clientSecret: secret, orderId } = await res.json();
        setClientSecret(secret);
        setPendingOrderId(orderId);
      }
    } catch (err: any) {
      setSubmitError(err.message ?? "Something went wrong");
    }
  };

  if (items.length === 0) return null;

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      {/* Carpet background */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `url(${carpetImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.4,
        }}
        role="presentation"
      />
      <div className="fixed inset-0 pointer-events-none z-0 bg-background/40" />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border py-4">
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          <Link href={getLocalizedPath("/menu")}>
            <button className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors">
              <ArrowLeftIcon className="w-4 h-4" />
              {t.backToMenu}
            </button>
          </Link>
          <span className="font-heading text-xl font-bold tracking-wider text-primary">
            SILK ROAD
          </span>
          <div className="w-24" />
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 md:px-6 py-8 md:py-12 relative z-10 max-w-5xl">
        {/* Page title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-heading font-bold tracking-wide text-foreground">
            {t.title}
          </h1>
          <div className="flex items-center justify-center gap-3 mt-3">
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-primary" />
            <span className="text-primary text-xl">✦</span>
            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-primary" />
          </div>
        </div>

        {/* ── Stripe Payment Step ── */}
        {clientSecret && pendingOrderId && stripePromise && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid md:grid-cols-[1fr_360px] gap-6"
          >
            <div className="bg-card/95 backdrop-blur-md rounded-sm border border-border p-6 shadow-lg">
              <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: "night" } }}>
                <PaymentForm
                  orderId={pendingOrderId}
                  total={total}
                  onSuccess={() => {
                    clearCart();
                    setLocation(`/order-success/${pendingOrderId}`);
                  }}
                />
              </Elements>
            </div>
            {/* Order summary (repeated for payment step) */}
            <div className="bg-card/95 backdrop-blur-md rounded-sm border border-border shadow-lg h-fit sticky top-24">
              <div className="p-5 border-b border-border">
                <h2 className="font-heading text-lg font-bold tracking-wide text-foreground uppercase">{t.orderSummary}</h2>
              </div>
              <ul className="divide-y divide-border/50 max-h-72 overflow-y-auto">
                {items.map((item) => (
                  <li key={item.id} className="flex items-center gap-3 px-5 py-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground line-clamp-1">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.quantity}x {fmt(item.price)}</p>
                    </div>
                    <p className="text-sm font-bold text-primary tabular-nums">{fmt(item.price * item.quantity)}</p>
                  </li>
                ))}
              </ul>
              <div className="p-5 border-t border-border space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground"><span>{t.subtotal}</span><span>{fmt(subtotal)}</span></div>
                <div className="flex justify-between text-sm text-muted-foreground"><span>{t.delivery}</span><span>{fmt(DELIVERY_FEE)}</span></div>
                <div className="h-[1px] bg-border my-1" />
                <div className="flex justify-between font-bold text-foreground"><span>{t.total}</span><span className="text-primary text-lg">{fmt(total)}</span></div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Checkout Form Step ── */}
        {!clientSecret && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid md:grid-cols-[1fr_360px] gap-6">

            {/* LEFT — Form */}
            <div className="space-y-6">

              {/* Delivery details */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card/95 backdrop-blur-md rounded-sm border border-border p-6 shadow-lg"
              >
                <h2 className="font-heading text-lg font-bold tracking-wide text-foreground mb-5 uppercase">
                  {t.subtitle}
                </h2>

                <div className="space-y-4">
                  {/* Name & Phone */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label={t.name} error={errors.name?.message}>
                      <input
                        {...register("name")}
                        type="text"
                        autoComplete="name"
                        className={inputClass(!!errors.name)}
                      />
                    </Field>
                    <Field label={t.phone} error={errors.phone?.message}>
                      <input
                        {...register("phone")}
                        type="tel"
                        autoComplete="tel"
                        className={inputClass(!!errors.phone)}
                      />
                    </Field>
                  </div>

                  {/* Email */}
                  <Field label={t.email} error={errors.email?.message}>
                    <input
                      {...register("email")}
                      type="email"
                      autoComplete="email"
                      className={inputClass(!!errors.email)}
                    />
                  </Field>

                  {/* Street */}
                  <Field label={t.street} error={errors.street?.message}>
                    <input
                      {...register("street")}
                      type="text"
                      autoComplete="street-address"
                      className={inputClass(!!errors.street)}
                    />
                  </Field>

                  {/* PLZ & City */}
                  <div className="grid sm:grid-cols-[140px_1fr] gap-4">
                    <Field label={t.postcode} error={errors.postcode?.message}>
                      <input
                        {...register("postcode")}
                        type="text"
                        autoComplete="postal-code"
                        maxLength={5}
                        className={inputClass(!!errors.postcode)}
                      />
                    </Field>
                    <Field label={t.city} error={errors.city?.message}>
                      <input
                        {...register("city")}
                        type="text"
                        autoComplete="address-level2"
                        className={inputClass(!!errors.city)}
                      />
                    </Field>
                  </div>

                  {/* Notes */}
                  <Field label={t.notes}>
                    <textarea
                      {...register("notes")}
                      rows={2}
                      placeholder={t.notesPlaceholder}
                      className={inputClass(false) + " resize-none"}
                    />
                  </Field>
                </div>
              </motion.div>

              {/* Payment method */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 }}
                className="bg-card/95 backdrop-blur-md rounded-sm border border-border p-6 shadow-lg"
              >
                <h2 className="font-heading text-lg font-bold tracking-wide text-foreground mb-5 uppercase">
                  {t.paymentTitle}
                </h2>

                <div className="space-y-3">
                  {/* Card */}
                  <label className={paymentOptionClass(paymentMethod === "card")}>
                    <input
                      {...register("paymentMethod")}
                      type="radio"
                      value="card"
                      className="sr-only"
                    />
                    <div className="flex items-center gap-3">
                      <div className={radioDotClass(paymentMethod === "card")} />
                      <div>
                        <p className="font-semibold text-sm text-foreground">{t.card}</p>
                        <p className="text-xs text-muted-foreground">{t.cardHint}</p>
                      </div>
                    </div>
                    <div className="flex gap-1 ml-auto">
                      <span className="text-xs bg-muted px-2 py-1 rounded font-mono">VISA</span>
                      <span className="text-xs bg-muted px-2 py-1 rounded font-mono">MC</span>
                    </div>
                  </label>

                  {/* Cash */}
                  <label className={paymentOptionClass(paymentMethod === "cash")}>
                    <input
                      {...register("paymentMethod")}
                      type="radio"
                      value="cash"
                      className="sr-only"
                    />
                    <div className="flex items-center gap-3">
                      <div className={radioDotClass(paymentMethod === "cash")} />
                      <div>
                        <p className="font-semibold text-sm text-foreground">{t.cash}</p>
                        <p className="text-xs text-muted-foreground">{t.cashHint}</p>
                      </div>
                    </div>
                    <span className="text-lg ml-auto">💵</span>
                  </label>
                </div>
              </motion.div>
            </div>

            {/* RIGHT — Order summary */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 }}
              className="bg-card/95 backdrop-blur-md rounded-sm border border-border shadow-lg h-fit sticky top-24"
            >
              <div className="p-5 border-b border-border">
                <h2 className="font-heading text-lg font-bold tracking-wide text-foreground uppercase">
                  {t.orderSummary}
                </h2>
              </div>

              {/* Items */}
              <ul className="divide-y divide-border/50 max-h-72 overflow-y-auto">
                {items.map((item) => (
                  <li key={item.id} className="flex items-center gap-3 px-5 py-3">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 rounded-sm object-cover flex-shrink-0 border border-border"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-sm bg-muted flex items-center justify-center text-sm border border-border flex-shrink-0">
                        🍽
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground line-clamp-1">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.quantity}x {fmt(item.price)}</p>
                    </div>
                    <p className="text-sm font-bold text-primary tabular-nums flex-shrink-0">
                      {fmt(item.price * item.quantity)}
                    </p>
                  </li>
                ))}
              </ul>

              {/* Totals */}
              <div className="p-5 space-y-2 border-t border-border">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{t.subtotal}</span>
                  <span className="tabular-nums">{fmt(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{t.delivery}</span>
                  <span className="tabular-nums">{fmt(DELIVERY_FEE)}</span>
                </div>
                <div className="h-[1px] bg-border my-2" />
                <div className="flex justify-between font-bold text-foreground">
                  <span>{t.total}</span>
                  <span className="tabular-nums text-primary text-lg">{fmt(total)}</span>
                </div>

                {/* Submit error */}
                {submitError && (
                  <p className="text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-sm px-3 py-2">
                    {submitError}
                  </p>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting || !meetsMinOrder}
                  className="w-full mt-4 py-3 rounded-sm font-semibold text-sm tracking-wide uppercase transition-all
                    bg-primary text-primary-foreground hover:bg-primary/90
                    disabled:opacity-40 disabled:cursor-not-allowed
                    [font-family:'Quando',_serif]"
                >
                  {isSubmitting ? "..." : t.submit}
                </button>
              </div>
            </motion.div>
          </div>
        </form>
        )}
      </main>
    </div>
  );
}

function inputClass(hasError: boolean) {
  return [
    "w-full px-3 py-2.5 rounded-sm bg-background border text-sm text-foreground",
    "placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 transition-colors",
    hasError
      ? "border-destructive focus:ring-destructive"
      : "border-border focus:ring-primary focus:border-primary",
  ].join(" ");
}

function paymentOptionClass(selected: boolean) {
  return [
    "flex items-center gap-3 p-4 rounded-sm border cursor-pointer transition-all",
    selected
      ? "border-primary bg-primary/5"
      : "border-border hover:border-primary/50 hover:bg-muted/50",
  ].join(" ");
}

function radioDotClass(selected: boolean) {
  return [
    "w-4 h-4 rounded-full border-2 flex-shrink-0 transition-all",
    selected ? "border-primary bg-primary" : "border-muted-foreground",
  ].join(" ");
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

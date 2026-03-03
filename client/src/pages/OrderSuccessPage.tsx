import { useEffect, useState } from "react";
import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";
import carpetImage from "@assets/stock_images/persian_carpet.webp";

function fmt(price: number) {
  return price.toFixed(2).replace(".", ",") + " €";
}

const labels = {
  de: {
    title: "Bestellung aufgegeben!",
    subtitle: "Vielen Dank für Ihre Bestellung",
    orderNumber: "Bestellnummer",
    delivery: "Geschätzte Lieferzeit",
    deliveryTime: "30 – 45 Minuten",
    items: "Ihre Bestellung",
    total: "Gesamt",
    cashNote: "Bitte halten Sie den Betrag in bar bereit.",
    cardNote: "Zahlung erfolgreich. Wir haben eine Bestätigung an Ihre E-Mail gesendet.",
    backToMenu: "Zurück zur Speisekarte",
    loading: "Lade Bestellung...",
    notFound: "Bestellung nicht gefunden",
  },
  en: {
    title: "Order Placed!",
    subtitle: "Thank you for your order",
    orderNumber: "Order number",
    delivery: "Estimated delivery",
    deliveryTime: "30 – 45 minutes",
    items: "Your order",
    total: "Total",
    cashNote: "Please have the exact amount ready for the driver.",
    cardNote: "Payment successful. We've sent a confirmation to your email.",
    backToMenu: "Back to Menu",
    loading: "Loading order...",
    notFound: "Order not found",
  },
  ru: {
    title: "Заказ оформлен!",
    subtitle: "Спасибо за ваш заказ",
    orderNumber: "Номер заказа",
    delivery: "Ориентировочное время доставки",
    deliveryTime: "30 – 45 минут",
    items: "Ваш заказ",
    total: "Итого",
    cashNote: "Пожалуйста, приготовьте наличные для курьера.",
    cardNote: "Оплата прошла успешно. Подтверждение отправлено на вашу почту.",
    backToMenu: "Назад в меню",
    loading: "Загрузка заказа...",
    notFound: "Заказ не найден",
  },
};

export default function OrderSuccessPage() {
  const { id } = useParams<{ id: string }>();
  const { lang, getLocalizedPath } = useLanguage();
  const t = labels[lang];

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/orders/${id}`)
      .then((r) => r.json())
      .then((data) => { setOrder(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  return (
    <div className="min-h-screen bg-background text-foreground relative flex items-center justify-center px-4 py-12">
      {/* Carpet background */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `url(${carpetImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.35,
        }}
        role="presentation"
      />
      <div className="fixed inset-0 pointer-events-none z-0 bg-background/50" />

      <main className="relative z-10 w-full max-w-lg">
        {loading ? (
          <p className="text-center text-muted-foreground">{t.loading}</p>
        ) : !order || order.message ? (
          <p className="text-center text-muted-foreground">{t.notFound}</p>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card/95 backdrop-blur-md rounded-sm border border-border shadow-2xl overflow-hidden"
          >
            {/* Success header */}
            <div className="bg-primary/10 border-b border-primary/20 px-6 py-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="text-6xl mb-4"
              >
                ✅
              </motion.div>
              <h1 className="font-heading text-2xl md:text-3xl font-bold tracking-wide text-foreground">
                {t.title}
              </h1>
              <p className="text-muted-foreground mt-1">{t.subtitle}</p>

              {/* Order number */}
              <div className="mt-4 inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-sm px-4 py-2">
                <span className="text-xs text-muted-foreground uppercase tracking-wide">{t.orderNumber}</span>
                <span className="font-heading font-bold text-primary text-lg">{order.order_number}</span>
              </div>
            </div>

            {/* Delivery time */}
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">{t.delivery}</p>
                <p className="font-semibold text-foreground">{t.deliveryTime}</p>
              </div>
              <span className="text-3xl">🛵</span>
            </div>

            {/* Items */}
            <div className="px-6 py-4 border-b border-border">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-3">{t.items}</p>
              <ul className="space-y-2">
                {order.items.map((item: any, i: number) => (
                  <li key={i} className="flex justify-between text-sm">
                    <span className="text-foreground">{item.quantity}x {item.name}</span>
                    <span className="text-primary font-semibold tabular-nums">{fmt(item.price * item.quantity)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 pt-3 border-t border-border flex justify-between font-bold">
                <span>{t.total}</span>
                <span className="text-primary">{fmt(order.total)}</span>
              </div>
            </div>

            {/* Payment note */}
            <div className="px-6 py-4 border-b border-border">
              <p className="text-sm text-muted-foreground">
                {order.payment_method === "cash" ? t.cashNote : t.cardNote}
              </p>
            </div>

            {/* Delivery address */}
            <div className="px-6 py-4 border-b border-border">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">📍</p>
              <p className="text-sm text-foreground">{order.street}</p>
              <p className="text-sm text-foreground">{order.postcode} {order.city}</p>
            </div>

            {/* Back button */}
            <div className="px-6 py-5">
              <Link href={getLocalizedPath("/menu")}>
                <button className="w-full py-3 rounded-sm font-semibold text-sm tracking-wide uppercase transition-all bg-primary text-primary-foreground hover:bg-primary/90 [font-family:'Quando',_serif]">
                  {t.backToMenu}
                </button>
              </Link>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}

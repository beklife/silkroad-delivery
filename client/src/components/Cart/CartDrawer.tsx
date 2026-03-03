import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { XIcon, PlusIcon, MinusIcon, TrashIcon, ShoppingCartIcon } from "@/components/icons";
import { useCart, DELIVERY_FEE, MIN_ORDER } from "@/lib/CartContext";
import { useLanguage } from "@/lib/LanguageContext";

function fmt(price: number): string {
  return price.toFixed(2).replace(".", ",") + " €";
}

const labels = {
  de: {
    title: "Ihre Bestellung",
    empty: "Ihr Warenkorb ist leer",
    emptyHint: "Fügen Sie Gerichte aus der Speisekarte hinzu",
    subtotal: "Zwischensumme",
    delivery: "Liefergebühr",
    total: "Gesamt",
    minOrder: `Mindestbestellwert ${MIN_ORDER},00 €`,
    minOrderHint: (remaining: string) => `Noch ${remaining} € bis zum Mindestbestellwert`,
    checkout: "Zur Kasse",
    free: "Kostenlos",
  },
  en: {
    title: "Your Order",
    empty: "Your cart is empty",
    emptyHint: "Add dishes from the menu",
    subtotal: "Subtotal",
    delivery: "Delivery fee",
    total: "Total",
    minOrder: `Minimum order ${MIN_ORDER},00 €`,
    minOrderHint: (remaining: string) => `${remaining} € more for minimum order`,
    checkout: "Proceed to Checkout",
    free: "Free",
  },
  ru: {
    title: "Ваш заказ",
    empty: "Ваша корзина пуста",
    emptyHint: "Добавьте блюда из меню",
    subtotal: "Подытог",
    delivery: "Доставка",
    total: "Итого",
    minOrder: `Минимальный заказ ${MIN_ORDER},00 €`,
    minOrderHint: (remaining: string) => `Ещё ${remaining} € до минимального заказа`,
    checkout: "Оформить заказ",
    free: "Бесплатно",
  },
};

export default function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, subtotal } = useCart();
  const { lang } = useLanguage();
  const [, setLocation] = useLocation();
  const t = labels[lang];

  const meetsMinOrder = subtotal >= MIN_ORDER;
  const remaining = Math.max(0, MIN_ORDER - subtotal);
  const total = meetsMinOrder ? subtotal + DELIVERY_FEE : subtotal;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/60 z-40"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-sm bg-card border-l border-border shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div className="flex items-center gap-3">
                <ShoppingCartIcon className="w-5 h-5 text-primary" />
                <h2 className="font-heading text-lg font-bold tracking-wide text-foreground">
                  {t.title}
                </h2>
              </div>
              <button
                onClick={closeCart}
                className="p-1.5 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                aria-label="Close cart"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-6">
                  <ShoppingCartIcon className="w-12 h-12 text-muted-foreground/30" />
                  <p className="font-medium text-foreground">{t.empty}</p>
                  <p className="text-sm text-muted-foreground">{t.emptyHint}</p>
                </div>
              ) : (
                <ul className="divide-y divide-border/50">
                  {items.map((item) => (
                    <li key={item.id} className="flex gap-3 px-5 py-4 items-start">
                      {/* Image */}
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-14 h-14 rounded-sm object-cover flex-shrink-0 border border-border"
                        />
                      )}
                      {!item.image && (
                        <div className="w-14 h-14 rounded-sm flex-shrink-0 bg-muted flex items-center justify-center border border-border text-xl">
                          🍽
                        </div>
                      )}

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground leading-snug line-clamp-2">
                          {item.name}
                        </p>
                        <p className="text-primary font-bold text-sm mt-0.5">
                          {fmt(item.price)}
                        </p>

                        {/* Quantity controls */}
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:bg-muted hover:border-primary transition-colors text-foreground"
                            aria-label="Decrease quantity"
                          >
                            <MinusIcon className="w-3 h-3" />
                          </button>
                          <span className="text-sm font-bold w-5 text-center tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:bg-muted hover:border-primary transition-colors text-foreground"
                            aria-label="Increase quantity"
                          >
                            <PlusIcon className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Line total + remove */}
                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <p className="text-sm font-bold text-foreground tabular-nums">
                          {fmt(item.price * item.quantity)}
                        </p>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                          aria-label="Remove item"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-border px-5 py-4 space-y-3 bg-background/50">
                {/* Min order warning */}
                {!meetsMinOrder && (
                  <div className="bg-primary/10 border border-primary/20 rounded-sm px-3 py-2">
                    <p className="text-xs text-primary font-medium">
                      {t.minOrderHint(remaining.toFixed(2).replace(".", ","))}
                    </p>
                  </div>
                )}

                {/* Subtotal */}
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{t.subtotal}</span>
                  <span className="tabular-nums">{fmt(subtotal)}</span>
                </div>

                {/* Delivery */}
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{t.delivery}</span>
                  <span className="tabular-nums">
                    {meetsMinOrder ? fmt(DELIVERY_FEE) : t.free}
                  </span>
                </div>

                {/* Divider */}
                <div className="h-[1px] bg-border" />

                {/* Total */}
                <div className="flex justify-between font-bold text-foreground">
                  <span>{t.total}</span>
                  <span className="tabular-nums text-primary">{fmt(total)}</span>
                </div>

                {/* Checkout button */}
                <button
                  disabled={!meetsMinOrder}
                  onClick={() => { closeCart(); setLocation("/checkout"); }}
                  className="w-full py-3 rounded-sm font-semibold text-sm tracking-wide uppercase transition-all
                    bg-primary text-primary-foreground hover:bg-primary/90
                    disabled:opacity-40 disabled:cursor-not-allowed
                    [font-family:'Quando',_serif]"
                >
                  {t.checkout}
                </button>

                {!meetsMinOrder && (
                  <p className="text-xs text-center text-muted-foreground">
                    {t.minOrder}
                  </p>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

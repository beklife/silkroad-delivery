import { useState } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useLanguage } from "@/lib/LanguageContext";

const labels = {
  de: {
    title: "Kartenzahlung",
    submit: "Jetzt bezahlen",
    processing: "Wird verarbeitet...",
    error: "Zahlung fehlgeschlagen. Bitte versuchen Sie es erneut.",
  },
  en: {
    title: "Card Payment",
    submit: "Pay Now",
    processing: "Processing...",
    error: "Payment failed. Please try again.",
  },
  ru: {
    title: "Оплата картой",
    submit: "Оплатить сейчас",
    processing: "Обработка...",
    error: "Ошибка оплаты. Попробуйте ещё раз.",
  },
};

interface Props {
  orderId: number;
  total: number;
  onSuccess: () => void;
}

export default function PaymentForm({ orderId, total, onSuccess }: Props) {
  const stripe = useStripe();
  const elements = useElements();
  const { lang } = useLanguage();
  const t = labels[lang];

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    const { error: stripeError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/order-success/${orderId}`,
      },
      redirect: "if_required",
    });

    if (stripeError) {
      setError(stripeError.message ?? t.error);
      setLoading(false);
      return;
    }

    // Payment succeeded without redirect
    onSuccess();
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h3 className="font-heading text-base font-bold uppercase tracking-wide text-foreground">
        {t.title}
      </h3>

      <PaymentElement
        options={{
          layout: "tabs",
        }}
      />

      {error && (
        <p className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-sm px-3 py-2">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full py-3 rounded-sm font-semibold text-sm tracking-wide uppercase transition-all
          bg-primary text-primary-foreground hover:bg-primary/90
          disabled:opacity-50 disabled:cursor-not-allowed
          [font-family:'Quando',_serif]"
      >
        {loading ? t.processing : `${t.submit} — ${total.toFixed(2).replace(".", ",")} €`}
      </button>
    </form>
  );
}

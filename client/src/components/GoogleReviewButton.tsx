import { useState, useEffect } from "react";
import { Star, X } from "@/components/icons";
import { useLanguage } from "@/lib/LanguageContext";

export default function GoogleReviewButton() {
  const { lang } = useLanguage();
  const [isVisible, setIsVisible] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const placeId = "ChIJhx2VfmkJvUcRnefb1P5Fxf4";
  const reviewUrl = `https://search.google.com/local/writereview?placeid=${placeId}`;

  // Translations
  const translations = {
    de: {
      topText: "Zufrieden mit uns?",
      mainText: "Bewertung abgeben",
      googleReviews: "Google Bewertungen"
    },
    en: {
      topText: "Love our food?",
      mainText: "Share your review",
      googleReviews: "Google Reviews"
    },
    ru: {
      topText: "Понравилось?",
      mainText: "Оставить отзыв",
      googleReviews: "Google отзывы"
    },
    uz: {
      topText: "Yoqdimi?",
      mainText: "Fikr qoldiring",
      googleReviews: "Google sharhlari"
    }
  };

  const t = translations[lang];

  const [footerVisible, setFooterVisible] = useState(false);

  // Check localStorage on mount
  useEffect(() => {
    const dismissed = localStorage.getItem("reviewButtonDismissed");
    if (dismissed === "true") {
      setIsVisible(false);
    }
  }, []);

  // Hide when footer is visible
  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;
    const observer = new IntersectionObserver(
      ([entry]) => setFooterVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  const handleClose = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsVisible(false);
    localStorage.setItem("reviewButtonDismissed", "true");
  };

  if (!isVisible || footerVisible) return null;

  if (!isExpanded) {
    return (
      <div className="fixed z-[60] right-4 md:right-6 bottom-[max(1rem,env(safe-area-inset-bottom))]">
        <button
          onClick={() => setIsExpanded(true)}
          aria-label="Google Bewertung"
          className="w-12 h-12 rounded-full shadow-[0_8px_32px_-8px_rgba(199,68,64,0.4)]
                     flex items-center justify-center
                     bg-gradient-to-br from-[hsl(355,65%,42%)] to-[hsl(355,55%,35%)]
                     hover:scale-110 active:scale-95 transition-transform duration-200"
        >
          <svg className="w-5 h-5 text-[hsl(38,85%,60%)]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed z-[60] right-4 md:right-6 bottom-[max(1rem,env(safe-area-inset-bottom))] group animate-expand">
      <a
        href={reviewUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
        aria-label={t.mainText}
      >
        <div className="relative overflow-hidden rounded-3xl shadow-[0_8px_32px_-8px_rgba(199,68,64,0.4),0_0_0_1px_rgba(199,68,64,0.1)] transition-all duration-500 ease-out group-hover:shadow-[0_12px_40px_-8px_rgba(199,68,64,0.6),0_0_0_1px_rgba(199,68,64,0.2)] group-hover:scale-[1.02] group-active:scale-[0.98]">
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute -top-1.5 -right-1.5 z-10 w-5 h-5 rounded-full bg-white shadow-lg flex items-center justify-center transition-transform duration-200 hover:scale-110 active:scale-95"
            aria-label="Close"
          >
            <X className="w-3 h-3 text-gray-700" />
          </button>

          {/* Decorative pattern overlay - inspired by Uzbek textiles */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}
          />

          {/* Warm gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[hsl(355,65%,42%)] via-[hsl(355,60%,38%)] to-[hsl(355,55%,35%)]" />

          {/* Animated shimmer on hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
            <div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"
              style={{
                backgroundSize: '200% 100%',
                animation: 'shimmer 3s ease-in-out infinite'
              }}
            />
          </div>

          <div className="relative px-3 py-2.5 md:px-4 md:py-3">
            {/* Stars row */}
            <div className="flex items-center justify-center gap-0.5 mb-1.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-3 h-3 md:w-3.5 md:h-3.5 fill-[hsl(38,85%,50%)] text-[hsl(38,85%,50%)] drop-shadow-[0_1px_3px_rgba(0,0,0,0.2)]"
                />
              ))}
            </div>

            {/* Main text */}
            <div className="text-center">
              <div className="text-white/90 text-[9px] md:text-[10px] uppercase tracking-[0.18em] font-medium mb-0.5 font-sans">
                {t.topText}
              </div>
              <div className="text-white font-bold text-sm md:text-base leading-tight font-heading flex items-center justify-center gap-1.5">
                <span>{t.mainText}</span>
                <svg
                  className="w-3.5 h-3.5 md:w-4 md:h-4 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
              <div className="text-[hsl(38,85%,60%)] text-[9px] md:text-[10px] font-medium mt-0.5 flex items-center justify-center gap-1">
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
                </svg>
                <span>{t.googleReviews}</span>
              </div>
            </div>
          </div>
        </div>
      </a>

      {/* Add keyframes for animations */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes expand-in {
          from { transform: scale(0.5); opacity: 0; transform-origin: bottom right; }
          to   { transform: scale(1);   opacity: 1; transform-origin: bottom right; }
        }
        .animate-expand { animation: expand-in 0.25s ease-out; }
      `}</style>
    </div>
  );
}

import { useState, useEffect, useLayoutEffect, lazy, Suspense } from "react";
import { Link } from "wouter";
import { translations, Language } from "@/lib/i18n";
import { useMusic } from "@/lib/MusicContext";
import { useLanguage } from "@/lib/LanguageContext";
import { useSeoMeta } from "@/lib/seo";
import { motion, AnimatePresence } from "framer-motion";
import { MapPinIcon as MapPin, PhoneIcon as Phone, ClockIcon as Clock, ChevronDownIcon as ChevronDown, MailIcon as Mail, X } from "@/components/icons";
import HamburgerButton from "@/components/HamburgerButton";
import { Button } from "@/components/ui/button";

// Lazy load BookingForm to reduce initial bundle size
const BookingForm = lazy(() => import("@/components/BookingForm"));

import heroImage from "@assets/stock_images/hero.webp";
import mantyImage from "@assets/stock_images/manty_dumplings_cent_45246789.webp";
import interiorImage from "@assets/stock_images/cozy_warm_restaurant_5c6c7aae.jpg";
import samsaImage from "@assets/stock_images/menu/Somsa.webp";
import teaImage from "@assets/stock_images/menu/tea_1.webp";
import carpetImage from "@assets/stock_images/persian_carpet.webp";
import plovImage from "@assets/stock_images/menu/palov.webp";
import shashlikImage from "@assets/stock_images/menu/Schaschlik_vom_Lamm.webp";
import kazanKebabImage from "@assets/stock_images/menu/Kazan_Kebab.webp";
import heroLogoImage from "../../../attached_assets/stock_images/ChatGPT Image Feb 4, 2026, 07_43_14 PM.png";

const langNames: Record<Language, string> = {
  de: "Deutsch",
  en: "English",
  ru: "Русский",
  uz: "O‘zbek"
};

const langFlags: Record<Language, string> = {
  de: "🇩🇪",
  en: "🇬🇧",
  ru: "🇷🇺",
  uz: "🇺🇿"
};

export default function Home() {
  const { lang, setLang, getLocalizedPath } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<{ src: string; name: string } | null>(null);
  const { musicPlaying, toggleMusic } = useMusic();

  const t = translations[lang];
  const currentYear = new Date().getFullYear();

  // SEO meta tags optimized for key search terms
  const seoTitles: Record<Language, string> = {
    de: "CARAVAN Restaurant Frankfurt | Usbekisches Restaurant Bornheim | Authentische Zentralasiatische Küche",
    en: "CARAVAN Restaurant Frankfurt | Uzbek Restaurant Bornheim | Authentic Central Asian Cuisine",
    ru: "Ресторан CARAVAN Франкфурт | Узбекский Ресторан Борнхайм | Аутентичная Центральноазиатская Кухня",
    uz: "CARAVAN Restoran Frankfurt | Bornheimdagi o‘zbek restorani | Asl Markaziy Osiyo oshxonasi"
  };

  const seoDescriptions: Record<Language, string> = {
    de: "Restaurant CARAVAN Frankfurt Bornheim - Das beste usbekische Restaurant in Frankfurt. Authentische zentralasiatische Küche seit 2005. Usbekischer Plov, Manty, Samsa. 100% Halal. Wöllstädter Str. 11, 60385 Frankfurt. Tel: 069 95909158",
    en: "CARAVAN Restaurant Frankfurt Bornheim - The best Uzbek restaurant in Frankfurt. Authentic Central Asian cuisine since 2005. Uzbek Plov, Manty, Samsa. 100% Halal. Wöllstädter Str. 11, 60385 Frankfurt. Tel: 069 95909158",
    ru: "Ресторан CARAVAN Франкфурт Борнхайм - Лучший узбекский ресторан во Франкфурте. Аутентичная центральноазиатская кухня с 2005 года. Узбекский Плов, Манты, Самса. 100% Халяль. Wöllstädter Str. 11, 60385 Франкфурт. Тел: 069 95909158",
    uz: "CARAVAN Restorani Frankfurt Bornheim - Frankfurtdagi eng yaxshi o'zbek restorani. 2005 yildan beri asl Markaziy Osiyo oshxonasi. O'zbek osh, manti, somsa. 100% halol. Wöllstädter Str. 11, 60385 Frankfurt. Tel: 069 95909158"
  };

  // Dynamic canonical URL based on language path
  const getCanonicalUrl = () => {
    const localPath = getLocalizedPath('/');
    return `https://caravan-restaurant.de${localPath}`;
  };

  useSeoMeta({
    title: seoTitles[lang],
    description: seoDescriptions[lang],
    canonical: getCanonicalUrl()
  });

  useLayoutEffect(() => {
    // Check if there's a hash in the URL
    const hash = window.location.hash;
    if (hash) {
      // Remove the # from the hash
      const elementId = hash.substring(1);
      // Use setTimeout to ensure DOM is ready
      setTimeout(() => {
        const element = document.getElementById(elementId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    // Delay scroll to allow mobile menu to close first
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        // Only add offset for reservation section
        if (id === "reservation") {
          const offset = 100; // Navbar height + spacing
          const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
          const offsetPosition = elementPosition - offset;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
          });
        } else {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }
    }, 300);
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20, willChange: 'transform, opacity' },
    visible: { opacity: 1, y: 0, willChange: 'auto', transition: { duration: 0.6 } }
  };

  return (
    <div className="min-h-screen bg-background font-sans text-foreground selection:bg-primary selection:text-white relative overflow-hidden">

      {/* Persian Carpet Background */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `url(${carpetImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'scroll',
          opacity: 0.5
        }}
      />
      {/* Lighter overlay to maintain text readability while showing more carpet */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-background/30" />

      {/* Navigation */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-background/95 backdrop-blur-md shadow-sm py-3" : "bg-transparent py-6"
        }`}
      >
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link
              href={getLocalizedPath('/')}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className={`font-heading text-2xl font-bold tracking-wider ${isScrolled ? "text-primary" : "text-white"}`}
            >
              CARAVAN
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollToSection("about")} className={`text-sm font-medium hover:text-primary transition-colors uppercase [font-family:'Quando',_serif] ${isScrolled ? "text-foreground" : "text-white/90"}`}>{t.nav.about}</button>
            <Link href={getLocalizedPath('/menu/')} onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })} className={`text-sm font-medium hover:text-primary transition-colors uppercase [font-family:'Quando',_serif] ${isScrolled ? "text-foreground" : "text-white/90"}`}>{t.nav.menu}</Link>
            <button onClick={() => scrollToSection("contact")} className={`text-sm font-medium hover:text-primary transition-colors uppercase [font-family:'Quando',_serif] ${isScrolled ? "text-foreground" : "text-white/90"}`}>{t.nav.contact}</button>
            <button onClick={() => scrollToSection("reservation")} className={`text-sm font-medium hover:text-primary transition-colors uppercase [font-family:'Quando',_serif] ${isScrolled ? "text-foreground" : "text-white/90"}`}>{t.nav.reserve}</button>

            <div className="h-4 w-px bg-white/30 mx-2"></div>

            {/* Music Button */}
            <div className="relative">
              <motion.button
                onClick={toggleMusic}
                aria-label="Toggle music"
                data-testid="button-music-toggle"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`relative p-2 transition-all ${
                  isScrolled
                    ? "text-foreground hover:text-primary"
                    : "text-white/90 hover:text-white"
                }`}
              >
                <svg
                  viewBox="0 0 24 30"
                  className="w-6 h-6"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {musicPlaying ? (
                    <>
                      <path d="M23.7902 7.93094L21.7823 5.92305C21.5205 5.65065 21.0496 5.65065 20.7878 5.92305L10.6976 16.0132C9.42274 15.3349 7.95422 15.0466 6.5066 15.1989C0.466712 15.8127 -2.19035 23.3063 2.12404 27.5894C3.54353 29.0089 5.40823 29.7186 7.27284 29.7186C12.7061 29.7483 16.2897 23.8594 13.7003 19.0154L23.7902 8.92555C24.0627 8.66365 24.0627 8.19284 23.7902 7.93094ZM2.64278 26.0571L3.41473 25.2852L4.42806 26.2985L3.65614 27.0704C3.46973 26.9246 3.29002 26.7663 3.11852 26.5948C2.94701 26.4232 2.78863 26.2435 2.64278 26.0571ZM11.4272 26.5948C9.6657 28.3563 7.05468 28.7629 4.90056 27.8152L5.91993 26.7958C6.19238 26.5339 6.19233 26.0631 5.91993 25.8012L3.91204 23.7933C3.65019 23.5209 3.17933 23.5209 2.91747 23.7933L1.8981 24.8127C0.950374 22.6586 1.35696 20.0476 3.11852 18.286C4.83797 16.5666 7.46572 16.1101 9.64488 17.0659L7.14367 19.5671C6.86902 19.8417 6.86902 20.287 7.14367 20.5617L9.15156 22.5695C9.42616 22.8442 9.87152 22.8442 10.1461 22.5695L12.6496 20.0661C13.6258 22.2623 13.1695 24.8524 11.4272 26.5948ZM9.64887 21.0777L8.63554 20.0644L19.0763 9.62362L20.0896 10.6369L9.64887 21.0777ZM21.0842 9.64233L20.0709 8.62901L21.285 7.41488L22.2983 8.42825L21.0842 9.64233Z"/>
                      <path d="M13.4182 1.37446L11.5018 0.907213C11.3069 0.859826 11.1012 0.904382 10.9435 1.02816C10.7858 1.15203 10.6937 1.3414 10.6937 1.54193V3.37469C9.44947 2.91319 8.0614 3.8915 8.08052 5.22221C8.1881 7.82222 11.893 7.82178 12.0004 5.22217C12.0004 5.15248 12.0003 2.37364 12.0003 2.37364L13.1087 2.64385C13.9589 2.81563 14.2516 1.61292 13.4182 1.37446ZM10.0404 5.87561C9.68017 5.87561 9.3871 5.58253 9.3871 5.22225C9.42299 4.35561 10.658 4.35587 10.6937 5.22225C10.6937 5.58253 10.4006 5.87561 10.0404 5.87561Z"/>
                      <path d="M3.42555 5.71875C3.04721 5.71875 2.74048 6.02548 2.74048 6.40382V7.91668C1.43561 7.43275 -0.0197554 8.45857 0.000203006 9.85406C0.0940119 12.4815 3.80604 12.6191 4.10345 10.0185C4.10766 9.98774 4.11062 6.40382 4.11062 6.40382C4.11062 6.02548 3.80389 5.71875 3.42555 5.71875ZM2.05541 10.5391C1.67767 10.5391 1.37034 10.2318 1.37034 9.85406C1.40798 8.9452 2.70299 8.94548 2.74048 9.85406C2.74048 10.2318 2.43316 10.5391 2.05541 10.5391Z"/>
                    </>
                  ) : (
                    <path d="M23.7902 7.93094L21.7823 5.92305C21.5205 5.65065 21.0496 5.65065 20.7878 5.92305L10.6976 16.0132C9.42274 15.3349 7.95422 15.0466 6.5066 15.1989C0.466712 15.8127 -2.19035 23.3063 2.12404 27.5894C3.54353 29.0089 5.40823 29.7186 7.27284 29.7186C12.7061 29.7483 16.2897 23.8594 13.7003 19.0154L23.7902 8.92555C24.0627 8.66365 24.0627 8.19284 23.7902 7.93094ZM2.64278 26.0571L3.41473 25.2852L4.42806 26.2985L3.65614 27.0704C3.46973 26.9246 3.29002 26.7663 3.11852 26.5948C2.94701 26.4232 2.78863 26.2435 2.64278 26.0571ZM11.4272 26.5948C9.6657 28.3563 7.05468 28.7629 4.90056 27.8152L5.91993 26.7958C6.19238 26.5339 6.19233 26.0631 5.91993 25.8012L3.91204 23.7933C3.65019 23.5209 3.17933 23.5209 2.91747 23.7933L1.8981 24.8127C0.950374 22.6586 1.35696 20.0476 3.11852 18.286C4.83797 16.5666 7.46572 16.1101 9.64488 17.0659L7.14367 19.5671C6.86902 19.8417 6.86902 20.287 7.14367 20.5617L9.15156 22.5695C9.42616 22.8442 9.87152 22.8442 10.1461 22.5695L12.6496 20.0661C13.6258 22.2623 13.1695 24.8524 11.4272 26.5948ZM9.64887 21.0777L8.63554 20.0644L19.0763 9.62362L20.0896 10.6369L9.64887 21.0777ZM21.0842 9.64233L20.0709 8.62901L21.285 7.41488L22.2983 8.42825L21.0842 9.64233Z"/>
                  )}
                </svg>

                {/* Floating music notes when playing */}
                <AnimatePresence>
                  {musicPlaying && (
                    <>
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: [0, 1, 0], y: [0, -20] }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
                        className="absolute -top-1 -right-1 text-xs pointer-events-none"
                      >
                        ♪
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: [0, 1, 0], y: [0, -25] }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.8, repeat: Infinity, delay: 0.6 }}
                        className="absolute -top-2 right-0 text-xs pointer-events-none"
                      >
                        ♫
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>

            {/* Language Dropdown */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                aria-label="Select language"
                data-testid="button-language-toggle"
                className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all ${
                  isScrolled
                    ? "bg-muted hover:bg-muted/80 text-foreground"
                    : "bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm"
                }`}
              >
                <span className="text-lg">{langFlags[lang]}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${langDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {langDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full right-0 mt-2 bg-card border border-border rounded-lg shadow-xl overflow-hidden min-w-[140px]"
                  >
                    {(["de", "en", "uz", "ru"] as Language[]).map((l) => (
                      <button
                        key={l}
                        data-testid={`button-lang-${l}`}
                        onClick={() => { setLang(l); setLangDropdownOpen(false); }}
                        className={`w-full px-4 py-3 text-left text-sm font-medium transition-colors flex items-center gap-3 ${
                          lang === l
                            ? "bg-primary/10 text-primary"
                            : "hover:bg-muted text-foreground"
                        }`}
                      >
                        <span className="text-xl">{langFlags[l]}</span>
                        {langNames[l]}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-3 md:hidden">
            {/* Mobile Music Button */}
            <button
              onClick={toggleMusic}
              aria-label="Toggle music"
              className={`p-1.5 ${isScrolled ? "text-foreground" : "text-white"}`}
            >
              <svg
                viewBox="0 0 24 30"
                className="w-5 h-5"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                {musicPlaying ? (
                  <>
                    <path d="M23.7902 7.93094L21.7823 5.92305C21.5205 5.65065 21.0496 5.65065 20.7878 5.92305L10.6976 16.0132C9.42274 15.3349 7.95422 15.0466 6.5066 15.1989C0.466712 15.8127 -2.19035 23.3063 2.12404 27.5894C3.54353 29.0089 5.40823 29.7186 7.27284 29.7186C12.7061 29.7483 16.2897 23.8594 13.7003 19.0154L23.7902 8.92555C24.0627 8.66365 24.0627 8.19284 23.7902 7.93094ZM2.64278 26.0571L3.41473 25.2852L4.42806 26.2985L3.65614 27.0704C3.46973 26.9246 3.29002 26.7663 3.11852 26.5948C2.94701 26.4232 2.78863 26.2435 2.64278 26.0571ZM11.4272 26.5948C9.6657 28.3563 7.05468 28.7629 4.90056 27.8152L5.91993 26.7958C6.19238 26.5339 6.19233 26.0631 5.91993 25.8012L3.91204 23.7933C3.65019 23.5209 3.17933 23.5209 2.91747 23.7933L1.8981 24.8127C0.950374 22.6586 1.35696 20.0476 3.11852 18.286C4.83797 16.5666 7.46572 16.1101 9.64488 17.0659L7.14367 19.5671C6.86902 19.8417 6.86902 20.287 7.14367 20.5617L9.15156 22.5695C9.42616 22.8442 9.87152 22.8442 10.1461 22.5695L12.6496 20.0661C13.6258 22.2623 13.1695 24.8524 11.4272 26.5948ZM9.64887 21.0777L8.63554 20.0644L19.0763 9.62362L20.0896 10.6369L9.64887 21.0777ZM21.0842 9.64233L20.0709 8.62901L21.285 7.41488L22.2983 8.42825L21.0842 9.64233Z"/>
                    <path d="M13.4182 1.37446L11.5018 0.907213C11.3069 0.859826 11.1012 0.904382 10.9435 1.02816C10.7858 1.15203 10.6937 1.3414 10.6937 1.54193V3.37469C9.44947 2.91319 8.0614 3.8915 8.08052 5.22221C8.1881 7.82222 11.893 7.82178 12.0004 5.22217C12.0004 5.15248 12.0003 2.37364 12.0003 2.37364L13.1087 2.64385C13.9589 2.81563 14.2516 1.61292 13.4182 1.37446ZM10.0404 5.87561C9.68017 5.87561 9.3871 5.58253 9.3871 5.22225C9.42299 4.35561 10.658 4.35587 10.6937 5.22225C10.6937 5.58253 10.4006 5.87561 10.0404 5.87561Z"/>
                    <path d="M3.42555 5.71875C3.04721 5.71875 2.74048 6.02548 2.74048 6.40382V7.91668C1.43561 7.43275 -0.0197554 8.45857 0.000203006 9.85406C0.0940119 12.4815 3.80604 12.6191 4.10345 10.0185C4.10766 9.98774 4.11062 6.40382 4.11062 6.40382C4.11062 6.02548 3.80389 5.71875 3.42555 5.71875ZM2.05541 10.5391C1.67767 10.5391 1.37034 10.2318 1.37034 9.85406C1.40798 8.9452 2.70299 8.94548 2.74048 9.85406C2.74048 10.2318 2.43316 10.5391 2.05541 10.5391Z"/>
                  </>
                ) : (
                  <path d="M23.7902 7.93094L21.7823 5.92305C21.5205 5.65065 21.0496 5.65065 20.7878 5.92305L10.6976 16.0132C9.42274 15.3349 7.95422 15.0466 6.5066 15.1989C0.466712 15.8127 -2.19035 23.3063 2.12404 27.5894C3.54353 29.0089 5.40823 29.7186 7.27284 29.7186C12.7061 29.7483 16.2897 23.8594 13.7003 19.0154L23.7902 8.92555C24.0627 8.66365 24.0627 8.19284 23.7902 7.93094ZM2.64278 26.0571L3.41473 25.2852L4.42806 26.2985L3.65614 27.0704C3.46973 26.9246 3.29002 26.7663 3.11852 26.5948C2.94701 26.4232 2.78863 26.2435 2.64278 26.0571ZM11.4272 26.5948C9.6657 28.3563 7.05468 28.7629 4.90056 27.8152L5.91993 26.7958C6.19238 26.5339 6.19233 26.0631 5.91993 25.8012L3.91204 23.7933C3.65019 23.5209 3.17933 23.5209 2.91747 23.7933L1.8981 24.8127C0.950374 22.6586 1.35696 20.0476 3.11852 18.286C4.83797 16.5666 7.46572 16.1101 9.64488 17.0659L7.14367 19.5671C6.86902 19.8417 6.86902 20.287 7.14367 20.5617L9.15156 22.5695C9.42616 22.8442 9.87152 22.8442 10.1461 22.5695L12.6496 20.0661C13.6258 22.2623 13.1695 24.8524 11.4272 26.5948ZM9.64887 21.0777L8.63554 20.0644L19.0763 9.62362L20.0896 10.6369L9.64887 21.0777ZM21.0842 9.64233L20.0709 8.62901L21.285 7.41488L22.2983 8.42825L21.0842 9.64233Z"/>
                )}
              </svg>
            </button>

            {/* Mobile Language Selector */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                aria-label="Select language"
                className={`flex items-center gap-1 px-2 py-1.5 rounded-full ${
                  isScrolled ? "bg-muted text-foreground" : "bg-white/10 text-white"
                }`}
              >
                <span className="text-base">{langFlags[lang]}</span>
              </button>

              <AnimatePresence>
                {langDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full right-0 mt-2 bg-card border border-border rounded-lg shadow-xl overflow-hidden z-50"
                  >
                    {(["de", "en", "uz", "ru"] as Language[]).map((l) => (
                      <button
                        key={l}
                        onClick={() => { setLang(l); setLangDropdownOpen(false); }}
                        className={`flex items-center gap-2 w-full px-4 py-2 text-sm ${lang === l ? "bg-primary/10 text-primary" : "hover:bg-muted"}`}
                      >
                        <span className="text-lg">{langFlags[l]}</span>
                        {langNames[l]}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <HamburgerButton
              isOpen={mobileMenuOpen}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={isScrolled ? "text-foreground" : "text-white"}
            />
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-background border-b border-border absolute top-full left-0 right-0 shadow-lg"
            >
              <div className="flex flex-col p-6 gap-4">
                <button onClick={() => scrollToSection("about")} className="text-lg font-medium py-2 border-b border-dashed border-border uppercase [font-family:'Quando',_serif]">{t.nav.about}</button>
                <Link href={getLocalizedPath('/menu/')} className="text-lg text-center font-medium py-2 border-b border-dashed border-border uppercase [font-family:'Quando',_serif]" onClick={() => { setMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'instant' }); }}>{t.nav.menu}</Link>
                <button onClick={() => scrollToSection("contact")} className="text-lg font-medium py-2 border-b border-dashed border-border uppercase [font-family:'Quando',_serif]">{t.nav.contact}</button>
                <button onClick={() => scrollToSection("reservation")} className="text-lg font-medium py-2 border-b border-dashed border-border uppercase [font-family:'Quando',_serif]">{t.nav.reserve}</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="relative h-screen min-h-[900px] flex items-center justify-center text-center px-4 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="Traditional Uzbek and Central Asian feast with colorful dishes including Uzbek Plov and Manty dumplings at CARAVAN Restaurant Frankfurt"
            className="w-full h-full object-cover"
            fetchPriority="high"
            decoding="async"
          />
          <div className="absolute inset-0 bg-black/40 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30"></div>
        </div>

        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="relative z-10 max-w-4xl mx-auto flex flex-col items-center gap-6"
        >
          <div className="inline-block border-y-2 border-primary/60 py-2 mb-4">
            <span className="text-secondary font-bold tracking-[0.2em] uppercase text-sm md:text-base">Seit 2005 • Frankfurt</span>
          </div>
          <img src={heroLogoImage} alt="CARAVAN" className="w-64 h-auto" />
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight drop-shadow-lg">
            <span className="[font-family:'Quando',_serif]">CARAVAN</span>{' '}
            <span className="block text-xl  font-heading mt-2">
              {t.hero.title.replace(/^CARAVAN\s*[–—-]\s*/i, '')}
            </span>
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl font-semibold leading-relaxed">
            {t.hero.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Button size="lg" onClick={() => scrollToSection("reservation")} className="bg-primary hover:bg-primary/90 text-white font-heading uppercase tracking-wide text-lg px-8 py-6 h-auto">
              {t.hero.cta_reserve}
            </Button>
            <Button size="lg" onClick={() => scrollToSection("menu")} variant="outline" className="border-white text-white hover:bg-white hover:text-primary font-heading uppercase tracking-wide text-lg px-8 py-6 h-auto">
              {t.hero.cta_menu}
            </Button>
          </div>
        </motion.div>
        <motion.div
          animate={{ y: [0, 15, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 cursor-pointer"
          onClick={() => scrollToSection("about")}
        >
          <span className="text-white/80 text-xs uppercase tracking-widest font-medium">Scroll</span>
          <div className="w-8 h-12 border-2 border-white/60 rounded-full flex items-start justify-center p-2">
            <motion.div
              animate={{ y: [0, 16, 0], opacity: [1, 0.3, 1] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="w-1.5 h-1.5 bg-white rounded-full"
            />
          </div>
        </motion.div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 relative z-10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="aspect-[4/5] overflow-hidden rounded-sm">
                <img src={interiorImage} alt="Cozy interior of CARAVAN Uzbek Restaurant Frankfurt with traditional Central Asian carpets and warm atmosphere" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-secondary/20 -z-10 rounded-full blur-2xl"></div>
              <div className="absolute -top-6 -left-6 w-32 h-32 border-2 border-primary/30 z-20"></div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-background/90 backdrop-blur-sm p-8 rounded-sm"
            >
              <div className="text-primary text-lg font-bold tracking-widest mb-2 flex items-center gap-2">
                <span className="w-8 h-[2px] bg-primary"></span>
                STORY
              </div>
              <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6 text-foreground">{t.about.title}</h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                {t.about.content}
              </p>
              
              <div className="grid grid-cols-3 gap-4 border-t border-border pt-8">
                <div className="text-center">
                  <span className="block font-heading text-3xl font-bold text-accent">3+</span>
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">Cuisines</span>
                </div>
                <div className="text-center border-l border-border">
                  <span className="block font-heading text-3xl font-bold text-accent">100%</span>
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">Halal</span>
                </div>
                 <div className="text-center border-l border-border">
                  <span className="block font-heading text-3xl font-bold text-accent">∞</span>
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">Tea</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Menu Highlights */}
      <section id="menu" className="py-24 bg-card/80 backdrop-blur-sm relative z-10 border-y border-border/50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 bg-background/80 backdrop-blur-sm p-6 rounded-sm">
            <div className="text-primary text-lg font-bold tracking-widest mb-2">{t.menu.journey}</div>
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">{t.menu.title}</h2>
            <p className="text-muted-foreground">{t.menu.subtitle}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <MenuCard image={plovImage} title={t.menu.dishes.plov.name} desc={t.menu.dishes.plov.desc} price="17.90€" />
            <MenuCard image={mantyImage} title={t.menu.dishes.manty.name} desc={t.menu.dishes.manty.desc} price="23.90€" />
            <MenuCard image={samsaImage} title={t.menu.dishes.somsa.name} desc={t.menu.dishes.somsa.desc} price="11.90€" />
            <MenuCard image={shashlikImage} title={t.menu.dishes.schaschlikvomlamm.name} desc={t.menu.dishes.schaschlikvomlamm.desc} price="26.90€" />
            <MenuCard image={kazanKebabImage} title={t.menu.dishes.kazankebab.name} desc={t.menu.dishes.kazankebab.desc} price="26.90€" />
            <MenuCard image={teaImage} title={t.menu.dishes.kannetee06jasmin.name} desc={t.menu.dishes.kannetee06jasmin.desc} price="6.50€" />
          </div>
          
          <div className="mt-12 text-center">
            <Link href={getLocalizedPath('/menu/')} onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })}>
              <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-white font-heading uppercase tracking-wide">
                {lang === 'de' ? 'Vollständige Speisekarte' : lang === 'ru' ? 'Полное меню' : lang === 'uz' ? "To'liq menyu" : 'View Full Menu'}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-24 bg-foreground text-background relative z-10">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-center text-4xl font-heading font-bold mb-12 text-white">{t.gallery.title}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 h-[500px]">
             <div className="col-span-2 row-span-2 relative overflow-hidden group rounded-sm cursor-pointer" onClick={() => setLightboxImage({ src: heroImage, name: "CARAVAN Restaurant Frankfurt" })}>
                <img alt="Authentic Uzbek and Central Asian dishes at CARAVAN Restaurant Frankfurt - Uzbek Plov, Manty" src={heroImage} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100" />
             </div>
             <div className="col-span-2 row-span-1 relative overflow-hidden group rounded-sm cursor-pointer" onClick={() => setLightboxImage({ src: interiorImage, name: "CARAVAN Interior" })}>
                <img alt="Warm and inviting interior of CARAVAN Restaurant in Bornheim, Frankfurt with traditional decorations" src={interiorImage} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100" />
             </div>
          </div>
        </div>
      </section>

      {/* Contact Section: Hours, Location & Booking */}
      <section id="contact" className="py-24 relative z-10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-12">

            <motion.div
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               className="bg-card/90 backdrop-blur-sm p-8 md:p-12 rounded-sm border border-border shadow-sm relative overflow-hidden"
            >
               <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-accent/20 rounded-tr-3xl"></div>
               <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-accent/20 rounded-bl-3xl"></div>

               <h2 className="text-3xl font-heading font-bold mb-8">{t.hours.title}</h2>

               <div className="space-y-6">
                 <div className="flex justify-between items-center border-b border-dashed border-border pb-4">
                   <span className="font-medium text-lg text-muted-foreground">{t.hours.open}</span>
                   <span className="font-bold text-xl">{t.hours.openTime}</span>
                 </div>
                 <div className="flex justify-between items-center border-b border-dashed border-border pb-4">
                   <span className="font-medium text-lg text-muted-foreground">{t.hours.kitchen}</span>
                   <span className="font-bold text-xl">{t.hours.kitchenTime}</span>
                 </div>
                 <div className="flex justify-between items-center border-b border-dashed border-border pb-4">
                   <span className="font-medium text-lg text-muted-foreground">{t.hours.monday}</span>
                   <span className="font-bold text-xl">{t.hours.closed}</span>
                 </div>
               </div>

               <p className="mt-6 text-sm text-muted-foreground bg-secondary/10 p-4 rounded-md flex items-start gap-2">
                 <Clock className="w-4 h-4 mt-1 text-secondary" />
                 {t.hours.note}
               </p>

               <div className="mt-12">
                 <h3 className="text-2xl font-bold uppercase text-secondary mb-6 flex items-center gap-2">
                   <MapPin className="w-6 h-6" /> {t.location.title}
                 </h3>
                 <address className="not-italic text-lg mb-6 block">
                   Wöllstädter Str. 11<br />
                   60385 Frankfurt am Main
                 </address>

                 <div className="space-y-2 text-sm text-neutral-400 font-mono">
                   <p>U-Bahn: Seckbacher Landstraße, Bornheim</p>
                 </div>

                 <div className="flex items-start gap-4 mt-6">
                   <div className="bg-primary/10 p-3 rounded-full text-primary">
                     <Phone className="w-6 h-6" />
                   </div>
                   <div>
                     <a href="tel:+496995909158" className="font-bold text-lg hover:text-primary">
                       069 95909158
                     </a>
                   </div>
                 </div>
               </div>
            </motion.div>

            <div className="h-full min-h-[400px] bg-muted relative rounded-sm overflow-hidden border border-border group">
               <iframe
                title="Google Maps location of the restaurant"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2557.4614624215283!2d8.710742976530918!3d50.13379857153347!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47bd09697e951d87%3A0xfec545fed4dbe79d!2sRestaurant%20Caravan!5e0!3m2!1sde!2sde!4v1769458302327!5m2!1sde!2sde"
                width="100%"
                height="100%"
                style={{border:0}}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

          </div>

          {/* Booking Form */}
          <div id="reservation" className="mt-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-card/90 backdrop-blur-sm p-8 md:p-12 rounded-sm border border-border shadow-sm relative overflow-hidden max-w-3xl mx-auto"
            >
              <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-accent/20 rounded-tr-3xl"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-accent/20 rounded-bl-3xl"></div>

              <h2 className="text-3xl font-heading font-bold mb-8">{t.contact.title}</h2>
              <Suspense fallback={<div className="text-center py-8 text-muted-foreground">Loading form...</div>}>
                <BookingForm lang={lang} />
              </Suspense>

              {/* Fallback Contact Info */}
              <div className="mt-8 pt-8 border-t border-dashed border-border text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  {t.contact.fallback}
                </p>
                <a
                  href="mailto:info.restaurantcaravan@gmail.com"
                  className="text-primary hover:underline font-medium"
                >
                  info.restaurantcaravan@gmail.com
                </a>
                <span className="mx-2 text-muted-foreground">|</span>
                <a
                  href="tel:+496995909158"
                  className="text-primary hover:underline font-medium"
                >
                  +49 69 95909158
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-16 border-t border-white/10 relative z-10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-3 gap-12 text-center md:text-left">
            <div>
              <h4 className="text-2xl font-heading font-bold mb-6 text-white tracking-widest">CARAVAN</h4>
              <p className="text-white/60 mb-4">{t.location.address}</p>
              <a href="tel:+496995909158" className="text-white/60 hover:text-primary transition-colors">
                069 95909158
              </a>
            </div>
            
            <div className="flex flex-col gap-2 items-center md:items-start">
               <Link href={getLocalizedPath('/menu/')} className="hover:text-primary transition-colors text-white/80 uppercase [font-family:'Quando',_serif]">{t.nav.menu}</Link>
               <a href="#about" className="hover:text-primary transition-colors text-white/80 uppercase [font-family:'Quando',_serif]">{t.nav.about}</a>
               <a href="#contact" className="hover:text-primary transition-colors text-white/80 uppercase [font-family:'Quando',_serif]">{t.nav.contact}</a>
               <Link href="/impressum/" className="hover:text-primary transition-colors text-white/80 uppercase [font-family:'Quando',_serif]">{t.footer.impressum}</Link>
               <Link href="/datenschutz/" className="hover:text-primary transition-colors text-white/80 uppercase [font-family:'Quando',_serif]">{t.footer.privacy}</Link>
            </div>

            <div className="flex flex-col items-center md:items-end gap-4">
              <div className="flex gap-4">
                <a href="https://www.instagram.com/caravan_frankfurt/" aria-label="Instagram" className="p-2 bg-white/10 rounded-full hover:bg-primary transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="mailto:info.restaurantcaravan@gmail.com" aria-label="Email" className="p-2 bg-white/10 rounded-full hover:bg-primary transition-colors"><Mail className="w-5 h-5" /></a>
              </div>
              <p className="text-xs text-white/80 mt-auto">© {currentYear} CARAVAN Frankfurt. {t.footer.rights}</p>
              <p className="text-xs text-white/60 mt-2">
                Made by ❤️{" "}
                <a href="https://beklife.github.io/" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary transition-colors">
                  ASLBEK
                </a>
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxImage(null)}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl w-full max-h-[90vh] cursor-default"
            >
              {/* Close Button */}
              <button
                onClick={() => setLightboxImage(null)}
                className="absolute -top-12 right-0 md:-right-12 md:top-0 text-white hover:text-primary transition-colors p-2 bg-white/10 rounded-full backdrop-blur-sm"
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Image */}
              <img
                src={lightboxImage.src}
                alt={lightboxImage.name}
                className="w-full h-full object-contain rounded-lg shadow-2xl"
              />

              {/* Image Title */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-lg">
                <h3 className="text-white text-xl md:text-2xl font-heading font-bold text-center">
                  {lightboxImage.name}
                </h3>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MenuCard({ image, title, desc, price }: { image: string, title: string, desc: string, price: string }) {
  return (
    <div className="group bg-background/95 backdrop-blur-sm rounded-sm overflow-hidden border border-border shadow-sm hover:shadow-lg transition-all duration-300">
      <div className="aspect-[4/3] bg-muted relative overflow-hidden">
        {image ? (
          <img src={image} alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
            <span className="text-6xl opacity-40">🍽</span>
          </div>
        )}
        <div className="absolute top-2 right-2 bg-background/90 backdrop-blur-sm px-3 py-1 rounded-sm text-sm font-bold shadow-sm">
          {price}
        </div>
      </div>
      <div className="p-6">
        <h4 className="text-xl font-heading font-bold mb-2 group-hover:text-primary transition-colors">{title}</h4>
        <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
      </div>
    </div>
  )
}

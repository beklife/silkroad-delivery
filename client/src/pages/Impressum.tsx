import { useState, useLayoutEffect } from "react";
import { Link, useLocation } from "wouter";
import { translations, Language } from "@/lib/i18n";
import { useMusic } from "@/lib/MusicContext";
import { useLanguage } from "@/lib/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeftIcon as ArrowLeft, ChevronDownIcon as ChevronDown } from "@/components/icons";
import HamburgerButton from "@/components/HamburgerButton";
import { Button } from "@/components/ui/button";
import carpetImage from "@assets/stock_images/persian_carpet.webp";

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

export default function Impressum() {
  const { lang, getLocalizedPath } = useLanguage();
  const [, setLocation] = useLocation();
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { musicPlaying, toggleMusic } = useMusic();
  const currentYear = new Date().getFullYear();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background font-sans text-foreground relative">
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
      <div className="fixed inset-0 pointer-events-none z-0 bg-background/30" />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border py-4">
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          <Link href={getLocalizedPath('/')}>
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              {lang === 'de' ? 'Zurück' : lang === 'ru' ? 'Назад' : 'Back'}
            </Button>
          </Link>

          <Link
            href={getLocalizedPath('/')}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="font-heading text-2xl font-bold tracking-wider text-primary"
          >
            CARAVAN
          </Link>

          <div className="hidden md:flex items-center gap-4">
            {/* Music Button */}
            <motion.button
              onClick={toggleMusic}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Toggle music"
              className="relative p-2 text-foreground hover:text-primary transition-all"
            >
              <svg viewBox="0 0 24 30" className="w-6 h-6" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
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

            {/* Language Dropdown */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                aria-label="Select language"
                className="flex items-center gap-2 px-3 py-2 rounded-full bg-muted hover:bg-muted/80 transition-all"
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
                        onClick={() => { setLangDropdownOpen(false); setLocation(getLocalizedPath('/', l)); }}
                        className={`w-full px-4 py-3 text-left text-sm font-medium transition-colors flex items-center gap-3 ${
                          lang === l ? "bg-primary/10 text-primary" : "hover:bg-muted text-foreground"
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

          {/* Mobile Menu Controls */}
          <div className="flex items-center gap-3 md:hidden">
            {/* Mobile Music Button */}
            <button
              onClick={toggleMusic}
              aria-label="Toggle music"
              className="p-1.5 text-foreground"
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
                className="flex items-center gap-1 px-2 py-1.5 rounded-full bg-muted text-foreground"
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
                        onClick={() => { setLangDropdownOpen(false); setLocation(getLocalizedPath('/', l)); }}
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

            {/* Mobile Menu Toggle */}
            <HamburgerButton
              isOpen={mobileMenuOpen}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-foreground"
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
                <button onClick={() => { setMobileMenuOpen(false); setLocation(`${getLocalizedPath('/') }#about`); }} className="text-lg text-center font-medium py-2 border-b border-dashed border-border text-foreground hover:text-primary uppercase [font-family:'Quando',_serif]">
                  {lang === 'de' ? 'Über uns' : lang === 'ru' ? 'О нас' : lang === 'uz' ? 'Biz haqida' : 'About Us'}
                </button>
                <Link href={getLocalizedPath('/menu/')} className="text-lg text-center font-medium py-2 border-b border-dashed border-border uppercase [font-family:'Quando',_serif]" onClick={() => setMobileMenuOpen(false)}>
                  {lang === 'de' ? 'Speisekarte' : lang === 'ru' ? 'Меню' : lang === 'uz' ? 'Menyu' : 'Menu'}
                </Link>
                <button onClick={() => { setMobileMenuOpen(false); setLocation(`${getLocalizedPath('/') }#contact`); }} className="text-lg text-center font-medium py-2 border-b border-dashed border-border text-foreground hover:text-primary uppercase [font-family:'Quando',_serif]">
                  {lang === 'de' ? 'Kontakt' : lang === 'ru' ? 'Контакт' : lang === 'uz' ? 'Aloqa' : 'Contact'}
                </button>
                <button onClick={() => { setMobileMenuOpen(false); setLocation(`${getLocalizedPath('/') }#reservation`); }} className="text-lg text-center font-medium py-2 border-b border-dashed border-border text-foreground hover:text-primary uppercase [font-family:'Quando',_serif]">
                  {lang === 'de' ? 'Reservierungsanfrage' : lang === 'ru' ? 'Запрос на бронирование' : lang === 'uz' ? 'Bron so‘rovi' : 'Reservation Request'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 md:px-6 py-8 md:py-16 relative z-10 max-w-4xl">
        <div className="bg-card/90 backdrop-blur-md p-6 md:p-12 rounded-sm border border-border shadow-xl">
          <h1 className="text-3xl md:text-4xl font-heading font-bold mb-8 text-primary">
            {lang === 'de' ? 'Impressum' : lang === 'ru' ? 'Импрессум' : lang === 'uz' ? 'Huquqiy ma’lumot' : 'Imprint'}
          </h1>

          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <h2 className="text-2xl font-heading font-bold mt-8 mb-4">
              {lang === 'de' ? 'Angaben gemäß § 5 TMG' : lang === 'ru' ? 'Информация согласно § 5 TMG' : lang === 'uz' ? '§ 5 TMG ga muvofiq ma’lumot' : 'Information according to § 5 TMG'}
            </h2>

            <p className="mb-4">
              <strong>CARAVAN Restaurant</strong><br />
              Wöllstädter Str. 11<br />
              60385 Frankfurt am Main<br />
              Deutschland
            </p>

            <h2 className="text-2xl font-heading font-bold mt-8 mb-4">
              {lang === 'de' ? 'Kontakt' : lang === 'ru' ? 'Контакты' : lang === 'uz' ? 'Aloqa' : 'Contact'}
            </h2>
            <p className="mb-4">
              <strong>{lang === 'de' ? 'Telefon:' : lang === 'ru' ? 'Телефон:' : lang === 'uz' ? 'Telefon:' : 'Phone:'}</strong>{" "}
              <a href="tel:+496995909158" className="underline hover:text-primary transition-colors">
                +49 69 95909158
              </a>
              <br />
              <strong>E-Mail:</strong> info.restaurantcaravan@gmail.com
            </p>

            <h2 className="text-2xl font-heading font-bold mt-8 mb-4">
              {lang === 'de' ? 'Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV' : lang === 'ru' ? 'Ответственный за содержание согласно § 55 Abs. 2 RStV' : lang === 'uz' ? '§ 55 Abs. 2 RStV bo‘yicha mazmun uchun mas’ul shaxs' : 'Responsible for content according to § 55 Abs. 2 RStV'}
            </h2>
            <p className="mb-4">
              CARAVAN Restaurant<br />
              Wöllstädter Str. 11<br />
              60385 Frankfurt am Main
            </p>

            <h2 className="text-2xl font-heading font-bold mt-8 mb-4">
              {lang === 'de' ? 'Haftungsausschluss' : lang === 'ru' ? 'Отказ от ответственности' : lang === 'uz' ? 'Mas’uliyatdan voz kechish' : 'Disclaimer'}
            </h2>

            <h3 className="text-xl font-semibold mt-6 mb-2">
              {lang === 'de' ? 'Haftung für Inhalte' : lang === 'ru' ? 'Ответственность за содержание' : lang === 'uz' ? 'Mazmun uchun mas’uliyat' : 'Liability for content'}
            </h3>
            <p className="mb-4">
              {lang === 'de'
                ? 'Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen.'
                : lang === 'ru'
                ? 'Содержание наших страниц было создано с величайшей тщательностью. Однако мы не можем гарантировать точность, полноту и актуальность содержания.'
                : 'The content of our pages has been created with the greatest care. However, we cannot guarantee the accuracy, completeness and timeliness of the content.'}
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-2">
              {lang === 'de' ? 'Haftung für Links' : lang === 'ru' ? 'Ответственность за ссылки' : lang === 'uz' ? 'Havolalar uchun mas’uliyat' : 'Liability for links'}
            </h3>
            <p className="mb-4">
              {lang === 'de'
                ? 'Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen Einfluss haben. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.'
                : lang === 'ru'
                ? 'Наше предложение содержит ссылки на внешние веб-сайты третьих лиц, на содержание которых мы не имеем влияния. За содержание связанных страниц всегда несет ответственность соответствующий поставщик или оператор страниц.'
                : 'Our offer contains links to external third-party websites, the content of which we have no influence on. The respective provider or operator of the pages is always responsible for the content of the linked pages.'}
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-foreground text-background py-8 md:py-12 mt-8 md:mt-16 border-t-2 border-primary/30 relative z-10">
        <div className="container mx-auto px-4 text-center">
          <p className="font-heading text-2xl md:text-3xl tracking-wider mb-2 text-white">CARAVAN</p>
          <p className="text-white/80 text-sm md:text-base mb-1">Wöllstädter Str. 11, 60385 Frankfurt am Main</p>
          <a href="tel:+496995909158" className="text-secondary font-bold tracking-wider text-sm md:text-base hover:text-primary transition-colors">
            069 95909158
          </a>
          <div className="mt-4 md:mt-6">
            <p className="text-xs text-white/80 mt-auto">© {currentYear} CARAVAN Restaurant • Frankfurt</p>
            <p className="text-xs text-white/60 mt-2">
              Made by ❤️{" "}
              <a href="https://beklife.github.io/" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary transition-colors">
                ASLBEK
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

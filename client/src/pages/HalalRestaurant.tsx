import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { MapPinIcon as MapPin, PhoneIcon as Phone, ClockIcon as Clock, CheckIcon as Check, ArrowRightIcon as ArrowRight } from "@/components/icons";
import { useSeoMeta } from "@/lib/seo";

import heroImage from "@assets/stock_images/hero.webp";
import teaImage from "@assets/stock_images/menu/tea_1.webp";
import samsaImage from "@assets/stock_images/menu/Somsa.webp";
import interiorImage from "@assets/stock_images/cozy_warm_restaurant_5c6c7aae.jpg";

export default function HalalRestaurant() {
  useSeoMeta({
    title: "Halal Restaurant Frankfurt | CARAVAN",
    description:
      "Halal‑freundliches Restaurant in Frankfurt am Main. Zentralasiatische Küche mit frischen Zutaten, aromatischen Gewürzen und herzlichem Service.",
    canonical: "https://caravan-restaurant.de/halal-restaurant-frankfurt/",
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/60 bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 md:px-6 py-5 flex items-center justify-between">
          <Link
            href="/"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="font-heading text-2xl font-bold tracking-wider text-primary"
          >
            CARAVAN
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/menu/">
              <Button variant="ghost" className="uppercase [font-family:'Quando',_serif]">Speisekarte</Button>
            </Link>
            <a href="tel:+496995909158">
              <Button className="uppercase [font-family:'Quando',_serif]">Reservierungsanfrage</Button>
            </a>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Halal‑freundliche Küche im CARAVAN" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/40 to-black/20" />
        </div>
        <div className="relative z-10 container mx-auto px-4 md:px-6 py-20 md:py-28">
          <div className="max-w-2xl text-white">
            <p className="text-sm uppercase tracking-[0.3em] text-white/80">Halal Restaurant Frankfurt</p>
            <h1 className="mt-4 font-heading text-4xl md:text-6xl font-bold leading-tight">
              Halal‑freundlich genießen <span className="text-primary">mit Stil</span>.
            </h1>
            <p className="mt-5 text-lg text-white/90">
              Im CARAVAN servieren wir zentralasiatische Klassiker, die halal‑bewusst zubereitet
              werden. Perfekt für Familien, Freunde und alle, die ehrliche Küche lieben.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/menu/">
                <Button className="gap-2">
                  Speisekarte ansehen <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <a href="tel:+496995909158">
                <Button variant="outline" className="border-white/40 text-white hover:bg-white/10">
                  +49 69 95909158
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-start">
          <div>
            <h2 className="font-heading text-3xl md:text-4xl">Halal‑freundliche Küche in Frankfurt</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Wir legen Wert auf transparente Zutaten und eine respektvolle Zubereitung.
              Unser Team beantwortet gern alle Fragen zu Allergenen, Zutaten und Halal‑Optionen.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                "Halal‑bewusste Menüauswahl",
                "Frische Zutaten & traditionelle Gewürze",
                "Familienfreundliche Atmosphäre",
                "Große Portionen zum Teilen",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-xl border border-border/60 bg-card p-4">
                  <span className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary/15 text-primary">
                    <Check className="h-4 w-4" />
                  </span>
                  <p className="text-sm leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-muted/60 to-background p-6">
            <h3 className="font-heading text-2xl">Besuch planen</h3>
            <div className="mt-4 space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold">Wöllstädter Str. 11</p>
                  <p className="text-muted-foreground">60385 Frankfurt am Main</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold">Di–So 17:00–23:00</p>
                  <p className="text-muted-foreground">Montag Ruhetag</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold">Reservierung empfohlen</p>
                  <a href="tel:+496995909158" className="text-primary hover:underline">
                    +49 69 95909158
                  </a>
                </div>
              </div>
              <a
                href="https://maps.google.com/?q=W%C3%B6llst%C3%A4dter%20Str.%2011%2C%2060385%20Frankfurt%20am%20Main"
                className="inline-flex items-center gap-2 text-primary hover:underline"
              >
                Anfahrt öffnen <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border border-border/60 bg-card overflow-hidden shadow-sm">
            <img src={samsaImage} alt="Samsa" className="h-56 w-full object-cover" />
            <div className="p-6">
              <h3 className="font-heading text-2xl">Samsa & Grillgerichte</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Knusprige Teigtaschen, würzige Spieße und Beilagen, die perfekt zu einer
                halal‑freundlichen Küche passen.
              </p>
            </div>
          </div>
          <div className="rounded-2xl border border-border/60 bg-card overflow-hidden shadow-sm">
            <img src={teaImage} alt="Zentralasiatische Teekultur" className="h-56 w-full object-cover" />
            <div className="p-6">
              <h3 className="font-heading text-2xl">Teekultur & Gastlichkeit</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Wir servieren traditionellen Tee und hausgemachte Spezialitäten – perfekt für
                einen entspannten Abend mit Freunden und Familie.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 md:px-6 pb-16">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] items-center">
          <div className="rounded-2xl overflow-hidden">
            <img src={interiorImage} alt="Familienfreundliches Ambiente im CARAVAN" className="h-full w-full object-cover" />
          </div>
          <div>
            <h2 className="font-heading text-3xl md:text-4xl">Gemeinsam essen, gemeinsam feiern</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Ob Familienessen, Gruppen oder besondere Anlässe – wir schaffen einen Ort,
              an dem sich jeder willkommen fühlt. Sprechen Sie uns an, wir beraten gern.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/menu/">
                <Button>Gerichte entdecken</Button>
              </Link>
              <a href="tel:+496995909158">
                <Button variant="outline">Jetzt reservieren</Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

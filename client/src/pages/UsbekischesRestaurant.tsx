import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { MapPinIcon as MapPin, PhoneIcon as Phone, ClockIcon as Clock, CheckIcon as Check, ArrowRightIcon as ArrowRight } from "@/components/icons";
import { useSeoMeta } from "@/lib/seo";

import heroImage from "@assets/stock_images/hero.webp";
import mantyImage from "@assets/stock_images/manty_dumplings_cent_45246789.webp";
import plovImage from "@assets/stock_images/menu/palov.webp";
import interiorImage from "@assets/stock_images/cozy_warm_restaurant_5c6c7aae.jpg";

export default function UsbekischesRestaurant() {
  useSeoMeta({
    title: "Usbekisches Restaurant Frankfurt | CARAVAN",
    description:
      "Authentisches usbekisches Restaurant in Frankfurt am Main: Plov, Manty und mehr. Herzliche Gastfreundschaft, zentrale Lage in Bornheim.",
    canonical: "https://caravan-restaurant.de/usbekisches-restaurant-frankfurt/",
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
          <img src={heroImage} alt="Usbekische Küche im CARAVAN" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/40 to-black/20" />
        </div>
        <div className="relative z-10 container mx-auto px-4 md:px-6 py-20 md:py-28">
          <div className="max-w-2xl text-white">
            <p className="text-sm uppercase tracking-[0.3em] text-white/80">Usbekisches Restaurant Frankfurt</p>
            <h1 className="mt-4 font-heading text-4xl md:text-6xl font-bold leading-tight">
              Zentralasiatische Küche, <span className="text-primary">authentisch</span> und warmherzig.
            </h1>
            <p className="mt-5 text-lg text-white/90">
              CARAVAN bringt die Seele Usbekistans nach Frankfurt: langsam geschmorter Plov,
              handgerollte Manty und authentische Samsa – alles frisch zubereitet.
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
            <h2 className="font-heading text-3xl md:text-4xl">Warum CARAVAN?</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Als usbekisches Restaurant in Frankfurt setzen wir auf traditionelle Rezepte,
              frische Zutaten und echte Gastfreundschaft. Unser Team kocht täglich wie zu Hause:
              würzig, aromatisch und voller Handwerk.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                "Traditionelle Rezepte aus Usbekistan",
                "Handgemachte Teigtaschen & Nudeln",
                "Vegetarische & halal‑freundliche Optionen",
                "Gemütliches Ambiente mit zentralasiatischer Seele",
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
            <h3 className="font-heading text-2xl">Kurz & knapp</h3>
            <div className="mt-4 space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold">Wöllstädter Str. 11</p>
                  <p className="text-muted-foreground">60385 Frankfurt am Main (Bornheim)</p>
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
        <div className="grid gap-8 lg:grid-cols-3">
          {[
            { image: plovImage, title: "Plov", text: "Das Herz der usbekischen Küche – langsam gegart im Kasan." },
            { image: mantyImage, title: "Manty", text: "Große Teigtaschen mit saftiger Füllung und Joghurt‑Dip." },
          ].map((dish) => (
            <div key={dish.title} className="rounded-2xl border border-border/60 bg-card overflow-hidden shadow-sm">
              <img src={dish.image} alt={dish.title} className="h-48 w-full object-cover" />
              <div className="p-5">
                <h3 className="font-heading text-2xl">{dish.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{dish.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 md:px-6 pb-16">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] items-center">
          <div className="rounded-2xl overflow-hidden">
            <img src={interiorImage} alt="Ambiente im CARAVAN" className="h-full w-full object-cover" />
          </div>
          <div>
            <h2 className="font-heading text-3xl md:text-4xl">Ein Ort für Familie & Genuss</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Zentralasiatische Küche lebt von Gemeinschaft. Im CARAVAN servieren wir große Portionen,
              teilen Geschichten und bringen die Wärme usbekischer Gastlichkeit nach Frankfurt.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/menu/">
                <Button>Zur Speisekarte</Button>
              </Link>
              <a href="tel:+496995909158">
                <Button variant="outline">Tisch reservieren</Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

import { useState, useLayoutEffect } from "react";
import { Link, useLocation } from "wouter";
import { translations, Language } from "@/lib/i18n";
import { useMusic } from "@/lib/MusicContext";
import { useLanguage } from "@/lib/LanguageContext";
import { useSeoMeta } from "@/lib/seo";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowLeftIcon as ArrowLeft, ChevronDownIcon as ChevronDown, X, PlusIcon, MinusIcon } from "@/components/icons";
import HamburgerButton from "@/components/HamburgerButton";
import { Button } from "@/components/ui/button";
import CartButton from "@/components/Cart/CartButton";
import CartDrawer from "@/components/Cart/CartDrawer";
import { useCart } from "@/lib/CartContext";

import carpetImage from "@assets/stock_images/persian_carpet.webp";
import plowMenuImage from "@assets/stock_images/menu/plov.webp";
import mantyBeefMenuImage from "@assets/stock_images/menu/manti.webp";
import mantyVegMenuImage from "@assets/stock_images/menu/manti2.webp";
import kurutobMenuImage from "@assets/stock_images/menu/kurutob.webp";
import tschuponchaMenuImage from "@assets/stock_images/menu/tschuponcha.webp";
import daPanJiMenuImage from "@assets/stock_images/menu/da pan ji.webp";
import lagmanMenuImage from "@assets/stock_images/menu/lagman.webp";
import samsaMenuImage from "@assets/stock_images/menu/samsa.webp";
import lepeshkaMenuImage from "@assets/stock_images/menu/lepeshka.webp";
import schurpaMenuImage from "@assets/stock_images/menu/schurpa.webp";
import salatBahorMenuImage from "@assets/stock_images/menu/salat bahor.webp";
import glasnudelsalatMenuImage from "@assets/stock_images/menu/glasnudelsalat.webp";
import auberginensalatMenuImage from "@assets/stock_images/menu/auberginensalat.webp";
import rubinSalatMenuImage from "@assets/stock_images/menu/ruben salat.webp";
import russischerSalatMenuImage from "@assets/stock_images/menu/russicher salat.webp";
import gurkenRindMenuImage from "@assets/stock_images/menu/gurken mit rindfleisch.webp";
import karottenSalatMenuImage from "@assets/stock_images/menu/karottensalat.webp";
import schakarobMenuImage from "@assets/stock_images/menu/schakarob.webp";
import kremigerSalatMenuImage from "@assets/stock_images/menu/kremiger salat.webp";
import haehnchenWalnussMenuImage from "@assets/stock_images/menu/Hähnchen mit Walnüssen, Ananas und Trauben.webp";
import gemueseTellerMenuImage from "@assets/stock_images/menu/gemüse teller.webp";
import eingelegtesGemueseMenuImage from "@assets/stock_images/menu/Teller mit eingelegtem Gemüse.webp";
import tschakTschakMenuImage from "@assets/stock_images/menu/tschak tschak.webp";
import schokoladentorteMenuImage from "@assets/stock_images/menu/Schokoladentorte.webp";
import cheesecakeMenuImage from "@assets/stock_images/menu/cheesecake.webp";
import tiramisuMenuImage from "@assets/stock_images/menu/tiramisu.webp";

const langNames: Record<Language, string> = {
  de: "Deutsch",
  en: "English",
  ru: "Русский"
};

const langFlags: Record<Language, string> = {
  de: "🇩🇪",
  en: "🇬🇧",
  ru: "🇷🇺"
};

const silkRoadMenuCategories = {
  de: {
    soups: "Suppen",
    appetizers: "Vorspeisen",
    mains: "Hauptgerichte",
    salads: "Salate",
    sides: "Soßen & Beilagen",
    desserts: "Desserts",
    drinks: "Heiße Getränke",
    colddrinks: "Kalte Getränke",
    beer: "Bier",
    wine: "Wein",
    spirits: "Spirituosen",
    grills: "Spezialitäten"
  },
  en: {
    soups: "Soups",
    appetizers: "Starters",
    mains: "Main Dishes",
    salads: "Salads",
    sides: "Sauces & Sides",
    desserts: "Desserts",
    drinks: "Hot Drinks",
    colddrinks: "Cold Drinks",
    beer: "Beer",
    wine: "Wine",
    spirits: "Spirits",
    grills: "Specials"
  },
  ru: {
    soups: "Супы",
    appetizers: "Закуски",
    mains: "Основные блюда",
    salads: "Салаты",
    sides: "Соусы и гарниры",
    desserts: "Десерты",
    drinks: "Горячие напитки",
    colddrinks: "Холодные напитки",
    beer: "Пиво",
    wine: "Вино",
    spirits: "Крепкий алкоголь",
    grills: "Специальные блюда"
  }
};

const silkRoadMenu = {
  soups: [
    {
      id: "schurpa",
      image: schurpaMenuImage,
      price: "9,00€",
      dietary: "halal",
      names: { de: "Schurpa", en: "Shurpa", ru: "Шурпа" },
      descs: {
        de: "Traditionelle Suppe aus Zentralasien mit Lammfleisch, Gemüse und Gewürzen. Wärmend und sättigend.",
        en: "Traditional Central Asian soup with lamb, vegetables and spices.",
        ru: "Традиционный суп Центральной Азии с бараниной, овощами и специями."
      }
    }
  ],
  appetizers: [
    {
      id: "samsa",
      image: samsaMenuImage,
      price: "4,50€",
      dietary: "halal",
      names: { de: "Samsa (pro Stück)", en: "Samsa (per piece)", ru: "Самса (за штуку)" },
      descs: {
        de: "Gebackene Teigtasche. Füllung nach Wahl: Rindfleisch, Hähnchen, Kürbis, Kartoffel oder Käse. Allergene: A, E, J.",
        en: "Baked pastry pocket with your choice of filling.",
        ru: "Запечённая слоёная выпечка с начинкой на выбор."
      }
    }
  ],
  mains: [
    {
      id: "plowbeef",
      image: plowMenuImage,
      price: "13,50€",
      dietary: "halal",
      names: { de: "Plow (Rindfleisch)", en: "Plow (Beef)", ru: "Плов (говядина)" },
      descs: {
        de: "Das beliebteste Gericht aus Zentralasien. In drei Stufen zubereitet: Braten, Schmoren und Dämpfen.",
        en: "Central Asia's most iconic rice dish, prepared in three stages.",
        ru: "Самое популярное блюдо Центральной Азии, готовится в три этапа."
      }
    },
    {
      id: "mantybeef",
      image: mantyBeefMenuImage,
      price: "12,50€",
      dietary: "halal",
      names: { de: "Manty (Rindfleisch)", en: "Manty (Beef)", ru: "Манты (говядина)" },
      descs: {
        de: "Gedämpfte Teigtaschen mit gewürfeltem Rindfleisch. Portion: 5 Stück.",
        en: "Steamed dumplings with diced beef. Portion: 5 pieces.",
        ru: "Паровые манты с нарезанной говядиной. Порция: 5 шт."
      }
    },
    {
      id: "mantyveg",
      image: mantyVegMenuImage,
      price: "11,50€",
      dietary: "vegetarian",
      names: { de: "Manty (Kartoffel oder Kürbis)", en: "Manty (Potato or Pumpkin)", ru: "Манты (картофель или тыква)" },
      descs: {
        de: "Gedämpfte Teigtaschen mit Kartoffel oder Kürbis. Portion: 5 Stück.",
        en: "Steamed dumplings filled with potato or pumpkin. Portion: 5 pieces.",
        ru: "Паровые манты с картофелем или тыквой. Порция: 5 шт."
      }
    },
    {
      id: "kurutob",
      image: kurutobMenuImage,
      price: "14,50€",
      dietary: "halal",
      names: { de: "Kurutob (Rindfleisch)", en: "Kurutob (Beef)", ru: "Курутоб (говядина)" },
      descs: {
        de: "Tadschikisches Gericht mit geschichtetem Fatir, frischem Gemüse, Kräutern und Kurut-Sauce (getrockneter Joghurt). Allergene: A, E, J.",
        en: "Tajik layered dish with fatir bread, vegetables, herbs and kurut sauce.",
        ru: "Таджикское блюдо из слоев фатир-хлеба, овощей и соуса курут."
      }
    },
    {
      id: "tschuponcha",
      image: tschuponchaMenuImage,
      price: "16,50€",
      dietary: "halal",
      names: { de: "Tschuponcha (Lammrippen)", en: "Tschuponcha (Lamb Ribs)", ru: "Чупонча (бараньи ребрышки)" },
      descs: {
        de: "Lammrippen aus dem Kazan mit frittierten Kartoffeln. Allergene: A.",
        en: "Lamb ribs from the kazan served with fried potatoes.",
        ru: "Бараньи ребрышки из казана с жареным картофелем."
      }
    },
    {
      id: "dapanji",
      image: daPanJiMenuImage,
      price: "15,50€",
      dietary: "halal",
      names: { de: "Da Pan Ji (Hähnchenfleisch)", en: "Da Pan Ji (Chicken)", ru: "Да Пан Цзи (курица)" },
      descs: {
        de: "Authentisches Gericht aus Xinjiang. Saftiges Hähnchen im Kazan. Allergene: B, D, G.",
        en: "Authentic Xinjiang chicken dish cooked in a traditional kazan.",
        ru: "Аутентичное блюдо Синьцзяна: сочная курица, приготовленная в казане."
      }
    },
    {
      id: "lagman",
      image: lagmanMenuImage,
      price: "14,50€",
      dietary: "halal",
      names: { de: "Lagman (Rindfleisch)", en: "Lagman (Beef)", ru: "Лагман (говядина)" },
      descs: {
        de: "Handgemachte Nudeln mit Fleisch und Gemüse aus dem Wok. Allergene: A, D, G.",
        en: "Handmade noodles with meat and vegetables from the wok.",
        ru: "Домашняя лапша с мясом и овощами из вокa."
      }
    },
    {
      id: "ganfan",
      image: daPanJiMenuImage,
      price: "14,50€",
      dietary: "halal",
      names: { de: "Gan Fan (Rindfleisch)", en: "Gan Fan (Beef)", ru: "Ган Фан (говядина)" },
      descs: {
        de: "Uigurisches Reisgericht mit gebratenem Fleisch und Gemüse aus dem Wok. Allergene: D, G.",
        en: "Uyghur rice dish with stir-fried meat and vegetables.",
        ru: "Уйгурское рисовое блюдо с жареным мясом и овощами."
      }
    }
  ],
  salads: [
    {
      id: "salatbahor",
      image: salatBahorMenuImage,
      price: "9,00€",
      names: { de: "Salat Bahor", en: "Bahor Salad", ru: "Салат Бахор" },
      descs: {
        de: "Geräuchertes Hähnchen, Gurken, Tomaten, rote Zwiebeln, Käse, Eier und Mayonnaise. Allergene: B.",
        en: "Smoked chicken, cucumber, tomato, red onion, cheese, eggs, mayo.",
        ru: "Копчёная курица, огурцы, помидоры, лук, сыр, яйца, майонез."
      }
    },
    {
      id: "glasnudelsalat",
      image: glasnudelsalatMenuImage,
      price: "8,50€",
      names: { de: "Glasnudelsalat", en: "Glass Noodle Salad", ru: "Салат с фунчозой" },
      descs: {
        de: "Glasnudeln, Karotten, Gurken, gekochtes Rindfleisch in Sojasoße, Paprika, Knoblauch, Sesam. Allergene: D, G, J.",
        en: "Glass noodles with beef, soy sauce, vegetables, garlic and sesame.",
        ru: "Фунчоза с говядиной, соевым соусом, овощами и кунжутом."
      }
    },
    {
      id: "auberginensalat",
      image: auberginensalatMenuImage,
      price: "7,50€",
      names: { de: "Auberginensalat", en: "Eggplant Salad", ru: "Салат с баклажанами" },
      descs: {
        de: "Gebackene Auberginen, frische Tomaten, Kräuter und Hausdressing. Allergene: A, B, D.",
        en: "Baked eggplant, tomato, herbs and house dressing.",
        ru: "Запечённые баклажаны, томаты, зелень и фирменная заправка."
      }
    },
    {
      id: "rubin",
      image: rubinSalatMenuImage,
      price: "8,50€",
      names: { de: "Salat Rubin", en: "Rubin Salad", ru: "Салат Рубин" },
      descs: {
        de: "Rote Bete, Nüsse, Hirtenkäse, Granatapfelkerne. Allergene: C1.",
        en: "Beetroot, nuts, white cheese and pomegranate seeds.",
        ru: "Свекла, орехи, сыр и зерна граната."
      }
    },
    {
      id: "russischersalat",
      image: russischerSalatMenuImage,
      price: "7,50€",
      names: { de: "Russischer Salat", en: "Russian Salad", ru: "Русский салат" },
      descs: {
        de: "Hähnchenfleisch, Salzgurken, Kartoffeln, Karotten, Erbsen, Eier, Mayonnaise. Allergene: B, F.",
        en: "Chicken, pickles, potato, carrot, peas, eggs and mayo.",
        ru: "Курица, солёные огурцы, картофель, морковь, горошек, яйца, майонез."
      }
    },
    {
      id: "gurkenrind",
      image: gurkenRindMenuImage,
      price: "7,50€",
      names: { de: "Gurken mit Rindfleisch", en: "Cucumber with Beef", ru: "Огурцы с говядиной" },
      descs: {
        de: "Gurken, gekochtes Rindfleisch in Sojasoße, Paprika und Knoblauch. Allergene: D, F, J.",
        en: "Cucumber with soy-marinated beef, pepper and garlic.",
        ru: "Огурцы с говядиной в соевом соусе, перцем и чесноком."
      }
    },
    {
      id: "karottensalat",
      image: karottenSalatMenuImage,
      price: "7,50€",
      dietary: "vegan",
      names: { de: "Karottensalat", en: "Carrot Salad", ru: "Морковный салат" },
      descs: {
        de: "Gewürzte Karottenstreifen mit Essig.",
        en: "Spiced carrot strips with vinegar dressing.",
        ru: "Пряная морковь с уксусной заправкой."
      }
    },
    {
      id: "schakarob",
      image: schakarobMenuImage,
      price: "7,50€",
      dietary: "vegan",
      names: { de: "Schakarob", en: "Shakarob", ru: "Шакароб" },
      descs: {
        de: "Frische Tomaten mit Zwiebeln und Kräutern.",
        en: "Fresh tomato salad with onions and herbs.",
        ru: "Свежие помидоры с луком и зеленью."
      }
    },
    {
      id: "kremigersalat",
      image: kremigerSalatMenuImage,
      price: "8,50€",
      names: { de: "Cremiger Salat", en: "Creamy Salad", ru: "Сливочный салат" },
      descs: {
        de: "Tomaten, Gurken, Bohnen, Eier, rote Zwiebeln, Creme fraiche. Allergene: E.",
        en: "Tomatoes, cucumbers, beans, eggs, red onion, creme fraiche.",
        ru: "Томаты, огурцы, фасоль, яйца, красный лук, крем-фреш."
      }
    },
    {
      id: "haehnchenwalnuss",
      image: haehnchenWalnussMenuImage,
      price: "9,50€",
      names: { de: "Hähnchen mit Walnüssen, Ananas und Trauben", en: "Chicken with Walnuts, Pineapple and Grapes", ru: "Курица с грецким орехом, ананасом и виноградом" },
      descs: {
        de: "Hähnchen, Trauben, Ananas, Walnüsse, Käse und Mayonnaise. Allergene: F.",
        en: "Chicken, grapes, pineapple, walnuts, cheese and mayonnaise.",
        ru: "Курица, виноград, ананас, грецкий орех, сыр и майонез."
      }
    },
    {
      id: "gemueseteller",
      image: gemueseTellerMenuImage,
      price: "8,50€",
      dietary: "vegan",
      names: { de: "Gemüse Teller (Frisch)", en: "Fresh Vegetable Plate", ru: "Овощная тарелка (свежая)" },
      descs: {
        de: "Frische Tomaten, Gurken, Paprika, rote Zwiebeln, Radieschen, Dill und Koriander.",
        en: "Fresh tomatoes, cucumbers, peppers, onion, radish, dill and coriander.",
        ru: "Свежие томаты, огурцы, перец, лук, редис, укроп и кинза."
      }
    },
    {
      id: "eingelegtesgemuese",
      image: eingelegtesGemueseMenuImage,
      price: "8,50€",
      dietary: "vegan",
      names: { de: "Teller mit eingelegtem Gemüse", en: "Pickled Vegetable Plate", ru: "Тарелка с маринованными овощами" },
      descs: {
        de: "Eingelegte Tomaten, Gurken, Paprika, Peperoni, Sauerkraut, Oliven. Allergene: F, G, H.",
        en: "Pickled tomatoes, cucumbers, peppers, sauerkraut and olives.",
        ru: "Маринованные томаты, огурцы, перец, квашеная капуста и оливки."
      }
    }
  ],
  sides: [
    {
      id: "lepeschka",
      image: lepeshkaMenuImage,
      price: "2,50€",
      dietary: "vegetarian",
      names: { de: "Lepeschka", en: "Lepeshka", ru: "Лепешка" },
      descs: {
        de: "Traditionelles Fladenbrot aus gemahlenem Getreide und Wasser. Allergene: A, B, E.",
        en: "Traditional flatbread from grain and water.",
        ru: "Традиционная лепешка из муки и воды."
      }
    },
    {
      id: "lazjan",
      image: null,
      price: "1,00€",
      names: { de: 'Chili Soße "Lazjan"', en: 'Chili Sauce "Lazjan"', ru: 'Соус чили "Лазжан"' },
      descs: {
        de: "Kräftige scharfe Soße. Zusatzstoffe/Allergene: 1,2,3,4,5,7,B,D,E,F,H,J.",
        en: "Spicy chili sauce.",
        ru: "Острый соус чили."
      }
    },
    {
      id: "suzma",
      image: null,
      price: "1,00€",
      names: { de: 'Joghurt Soße "Suzma"', en: 'Yogurt Sauce "Suzma"', ru: 'Йогуртовый соус "Сузьма"' },
      descs: { de: "Milder Joghurt-Dip.", en: "Mild yogurt dip.", ru: "Нежный йогуртовый соус." }
    },
    {
      id: "tomatenknoblauch",
      image: null,
      price: "1,00€",
      names: { de: "Tomaten-Knoblauch Soße", en: "Tomato-Garlic Sauce", ru: "Томатно-чесночный соус" },
      descs: { de: "Hausgemachte Tomaten-Knoblauch-Soße.", en: "House tomato-garlic sauce.", ru: "Домашний томатно-чесночный соус." }
    },
    {
      id: "mayonnaise",
      image: null,
      price: "1,00€",
      names: { de: "Mayonnaise", en: "Mayonnaise", ru: "Майонез" },
      descs: { de: "Klassische Mayonnaise.", en: "Classic mayonnaise.", ru: "Классический майонез." }
    },
    {
      id: "ketchup",
      image: null,
      price: "1,00€",
      names: { de: "Ketchup", en: "Ketchup", ru: "Кетчуп" },
      descs: { de: "Tomatenketchup.", en: "Tomato ketchup.", ru: "Томатный кетчуп." }
    },
    {
      id: "joghurtknoblauch",
      image: null,
      price: "1,00€",
      names: { de: "Joghurt-Knoblauch", en: "Yogurt-Garlic", ru: "Йогурт-чеснок" },
      descs: { de: "Frischer Joghurt mit Knoblauch.", en: "Fresh yogurt with garlic.", ru: "Свежий йогурт с чесноком." }
    }
  ],
  desserts: [
    {
      id: "tschaktschak",
      image: tschakTschakMenuImage,
      price: "6,50€",
      names: { de: "Tschak Tschak", en: "Tchak Tchak", ru: "Чак-чак" },
      descs: {
        de: "Teigstäbchen in Honig mit Nüssen und Beeren. Allergene: A, B, E.",
        en: "Honey-coated pastry sticks with nuts and berries.",
        ru: "Тесто в меду с орехами и ягодами."
      }
    },
    {
      id: "schokoladentorte",
      image: schokoladentorteMenuImage,
      price: "6,00€",
      names: { de: "Schokoladentorte", en: "Chocolate Cake", ru: "Шоколадный торт" },
      descs: {
        de: "Hausgemachte Schokoladentorte. Allergene: A, B, E.",
        en: "Homemade chocolate cake.",
        ru: "Домашний шоколадный торт."
      }
    },
    {
      id: "cheesecake",
      image: cheesecakeMenuImage,
      price: "6,00€",
      names: { de: "Cheesecake", en: "Cheesecake", ru: "Чизкейк" },
      descs: {
        de: "Käsekuchen mit Beeren. Allergene: A, B, E.",
        en: "Cheesecake served with berries.",
        ru: "Чизкейк с ягодами."
      }
    },
    {
      id: "tiramisu",
      image: tiramisuMenuImage,
      price: "5,50€",
      names: { de: "Tiramisu / Pistazienmousse", en: "Tiramisu / Pistachio Mousse", ru: "Тирамису / Фисташковый мусс" },
      descs: {
        de: "Serviert im Glas. Allergene: A, B, E.",
        en: "Served in a glass.",
        ru: "Подается в стакане."
      }
    }
  ],
  drinks: [
    { id: "tee-schwarz", image: null, price: "4,00€", names: { de: "Schwarzer Tee (Kanne)", en: "Black Tea (Pot)", ru: "Черный чай (чайник)" }, descs: { de: "Traditionell serviert.", en: "Traditionally served.", ru: "Традиционная подача." } },
    { id: "tee-schwarz-minze", image: null, price: "5,00€", names: { de: "Schwarzer Tee mit Minze und Zitrone", en: "Black Tea with Mint and Lemon", ru: "Черный чай с мятой и лимоном" }, descs: { de: "Frisch und aromatisch.", en: "Fresh and aromatic.", ru: "Свежий и ароматный." } },
    { id: "tee-gruen", image: null, price: "4,00€", names: { de: "Grüner Tee", en: "Green Tea", ru: "Зеленый чай" }, descs: { de: "Klassischer grüner Tee.", en: "Classic green tea.", ru: "Классический зеленый чай." } },
    { id: "kaffee-schwarz", image: null, price: "2,00€", names: { de: "Kaffee Schwarz", en: "Black Coffee", ru: "Черный кофе" }, descs: { de: "Zusatzstoff: 6 (koffeinhaltig).", en: "Additive: 6 (caffeine).", ru: "Добавка: 6 (кофеин)." } },
    { id: "milchkaffee", image: null, price: "2,00€", names: { de: "Milchkaffee", en: "Coffee with Milk", ru: "Кофе с молоком" }, descs: { de: "Zusatzstoff: 6 (koffeinhaltig).", en: "Additive: 6 (caffeine).", ru: "Добавка: 6 (кофеин)." } },
    { id: "espresso", image: null, price: "2,00€", names: { de: "Espresso", en: "Espresso", ru: "Эспрессо" }, descs: { de: "Zusatzstoff: 6 (koffeinhaltig).", en: "Additive: 6 (caffeine).", ru: "Добавка: 6 (кофеин)." } }
  ],
  colddrinks: [
    { id: "coca-cola", image: null, price: "2,50€", names: { de: "Coca-Cola (0.33L)", en: "Coca-Cola (0.33L)", ru: "Coca-Cola (0.33л)" }, descs: { de: "Zusatzstoffe: 1,2,6,7.", en: "Additives: 1,2,6,7.", ru: "Добавки: 1,2,6,7." } },
    { id: "fanta", image: null, price: "2,50€", names: { de: "Fanta (0.33L)", en: "Fanta (0.33L)", ru: "Fanta (0.33л)" }, descs: { de: "Zusatzstoffe: 1,2,6,7.", en: "Additives: 1,2,6,7.", ru: "Добавки: 1,2,6,7." } },
    { id: "sprite", image: null, price: "2,50€", names: { de: "Sprite (0.33L)", en: "Sprite (0.33L)", ru: "Sprite (0.33л)" }, descs: { de: "Zusatzstoffe: 1,2,6,7.", en: "Additives: 1,2,6,7.", ru: "Добавки: 1,2,6,7." } },
    { id: "mezzo-mix", image: null, price: "2,50€", names: { de: "Mezzo Mix (0.33L)", en: "Mezzo Mix (0.33L)", ru: "Mezzo Mix (0.33л)" }, descs: { de: "Zusatzstoffe: 1,2,6,7.", en: "Additives: 1,2,6,7.", ru: "Добавки: 1,2,6,7." } },
    { id: "wasser", image: null, price: "2,50€", names: { de: "Wasser (0.33L)", en: "Water (0.33L)", ru: "Вода (0.33л)" }, descs: { de: "Still oder sprudelnd.", en: "Still or sparkling.", ru: "Негазированная или газированная." } },
    { id: "apfelschorle", image: null, price: "2,50€", names: { de: "Apfelschorle (0.33L)", en: "Apple Spritzer (0.33L)", ru: "Яблочный шорле (0.33л)" }, descs: { de: "Erfrischend.", en: "Refreshing.", ru: "Освежающий напиток." } },
    { id: "bionade", image: null, price: "2,50€", names: { de: "Bionade (versch. Sorten)", en: "Bionade (various)", ru: "Bionade (разные вкусы)" }, descs: { de: "Je nach Verfügbarkeit.", en: "Subject to availability.", ru: "По наличию." } },
    { id: "vitamaltz", image: null, price: "2,50€", names: { de: "Vita Malz", en: "Vita Malz", ru: "Vita Malz" }, descs: { de: "Malzgetränk.", en: "Malt beverage.", ru: "Солодовый напиток." } },
    { id: "fassbrause", image: null, price: "2,50€", names: { de: "Fassbrause", en: "Fassbrause", ru: "Fassbrause" }, descs: { de: "Alkoholfreies Erfrischungsgetränk.", en: "Non-alcoholic refreshment.", ru: "Безалкогольный освежающий напиток." } },
    { id: "clubmate", image: null, price: "2,50€", names: { de: "Club-Mate", en: "Club-Mate", ru: "Club-Mate" }, descs: { de: "Zusatzstoff: 6 (koffeinhaltig).", en: "Additive: 6 (caffeine).", ru: "Добавка: 6 (кофеин)." } },
    { id: "fritz", image: null, price: "2,50€", names: { de: "Fritz (versch. Sorten)", en: "Fritz (various)", ru: "Fritz (разные вкусы)" }, descs: { de: "Je nach Verfügbarkeit.", en: "Subject to availability.", ru: "По наличию." } }
  ],
  grills: [],
  beer: [],
  wine: [],
  spirits: []
};

function parsePrice(priceStr: string): number {
  return parseFloat(priceStr.replace(/[€\s]/g, "").replace(",", "."));
}

export default function MenuPage() {
  const { lang, setLang, getLocalizedPath } = useLanguage();
  const [, setLocation] = useLocation();
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<{ src: string; name: string } | null>(null);
  const { musicPlaying, toggleMusic } = useMusic();
  const { addItem, items: cartItems, updateQuantity, removeItem } = useCart();

  const cartQuantities: Record<string, number> = {};
  cartItems.forEach((i) => { cartQuantities[i.id] = i.quantity; });

  const handleAddToCart = (item: any, name: string) => {
    if (item._decrease) {
      const qty = cartQuantities[item.id] ?? 0;
      if (qty <= 1) removeItem(item.id);
      else updateQuantity(item.id, qty - 1);
      return;
    }
    addItem({
      id: item.id,
      name,
      price: parsePrice(item.price),
      priceStr: item.price,
      image: item.image ?? null,
    });
  };
  const t = translations[lang];
  const cats = silkRoadMenuCategories[lang];
  const activeMenu = silkRoadMenu;
  const mainCombinedItems = [...activeMenu.mains, ...activeMenu.soups, ...activeMenu.appetizers];
  const currentYear = new Date().getFullYear();
  const additiveLegend = [
    { key: "1", label: "Farbstoff" },
    { key: "2", label: "Konservierungsstoff" },
    { key: "3", label: "Antioxidationsmittel" },
    { key: "4", label: "Geschmacksverstärker" },
    { key: "5", label: "Milcheiweiß" },
    { key: "6", label: "Koffeinhaltig" },
    { key: "7", label: "Süßungsmittel" },
  ];
  const allergenLegend = [
    { key: "A", label: "Glutenhaltiges Getreide (Weizenmehl)" },
    { key: "B", label: "Eier" },
    { key: "C", label: "Erdnüsse" },
    { key: "C1", label: "Walnuss" },
    { key: "D", label: "Soja" },
    { key: "E", label: "Milch" },
    { key: "F", label: "Schalenfrüchte" },
    { key: "G", label: "Sellerie" },
    { key: "H", label: "Senf" },
    { key: "J", label: "Sesamsamen" },
  ];

  // SEO meta tags for menu page
  const seoTitles: Record<Language, string> = {
    de: "Speisekarte - SILK ROAD Restaurant Köln | Zentralasiatische Gerichte & Preise",
    en: "Menu - SILK ROAD Restaurant Köln | Central Asian Dishes & Prices",
    ru: "Меню - SILK ROAD Restaurant Кёльн | Блюда Центральной Азии и цены"
  };

  const seoDescriptions: Record<Language, string> = {
    de: "Originale Gerichte der Seidenstraße: Plow, Manty, Kurutob, Lagman, Salate, Desserts und Getränke. SILK ROAD Restaurant Köln, Karl-Berbuer-Platz 7.",
    en: "Original Silk Road dishes: plow, manty, kurutob, lagman, salads, desserts and drinks at SILK ROAD Restaurant Cologne.",
    ru: "Оригинальные блюда Шелкового пути: плов, манты, курутоб, лагман, салаты, десерты и напитки в SILK ROAD Restaurant Köln."
  };

  // Dynamic canonical URL based on language path
  const getCanonicalUrl = () => {
    const localPath = getLocalizedPath('/menu/');
    return `https://silkroad-restaurant-koeln.de${localPath}`;
  };

  useSeoMeta({
    title: seoTitles[lang],
    description: seoDescriptions[lang],
    canonical: getCanonicalUrl()
  });

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const getDishInfo = (dish: any) => {
    if (dish.names) {
      return { name: dish.names[lang], desc: dish.descs[lang] };
    }
    const dishes = t.menu.dishes as any;
    if (dishes[dish.id]) {
      return { name: dishes[dish.id].name, desc: dishes[dish.id].desc };
    }
    return { name: dish.id, desc: '' };
  };

  return (
    <div className="min-h-screen bg-background font-sans text-foreground relative">
      {/* Persian Carpet Background - Lazy loaded */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `url(${carpetImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'scroll',
          opacity: 0.5,
          willChange: 'auto',
        }}
        role="presentation"
      />
      {/* Lighter overlay to maintain text readability while showing more carpet */}
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
            className="font-heading text-xl md:text-2xl font-bold tracking-wide md:tracking-wider leading-none whitespace-nowrap text-primary"
          >
            SILK ROAD
          </Link>

          <div className="hidden md:flex items-center gap-4">
            <a href="https://www.xn--silk-road-kln-smb.de/" target="_blank" rel="noopener noreferrer" className="text-sm font-medium hover:text-primary transition-colors uppercase [font-family:'Quando',_serif]">{t.nav.order}</a>
            {/* Cart Button */}
            <CartButton />
            {/* Music Button */}
            <motion.button
              onClick={toggleMusic}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Toggle music"
              className="relative p-2 text-foreground hover:text-primary transition-all"
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
                    {( ["de", "en", "ru"] as Language[] ).map((l) => (
                      <button
                        key={l}
                        onClick={() => { setLang(l); setLangDropdownOpen(false); }}
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
            {/* Mobile Cart Button */}
            <CartButton />
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
                    {( ["de", "en", "ru"] as Language[] ).map((l) => (
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
                  {lang === 'de' ? 'Über uns' : lang === 'ru' ? 'О нас' : 'About Us'}
                </button>
                <button onClick={() => { setMobileMenuOpen(false); setLocation(`${getLocalizedPath('/') }#contact`); }} className="text-lg text-center font-medium py-2 border-b border-dashed border-border text-foreground hover:text-primary uppercase [font-family:'Quando',_serif]">
                  {lang === 'de' ? 'Kontakt' : lang === 'ru' ? 'Контакт' : 'Contact'}
                </button>
                <button onClick={() => { setMobileMenuOpen(false); setLocation(`${getLocalizedPath('/') }#reservation`); }} className="text-lg text-center font-medium py-2 border-b border-dashed border-border text-foreground hover:text-primary uppercase [font-family:'Quando',_serif]">
                  {lang === 'de' ? 'Reservierungsanfrage' : lang === 'ru' ? 'Запрос на бронирование' : 'Reservation Request'}
                </button>
                <a href="https://www.xn--silk-road-kln-smb.de/" target="_blank" rel="noopener noreferrer" onClick={() => setMobileMenuOpen(false)} className="text-lg text-center font-medium py-2 border-b border-dashed border-border uppercase [font-family:'Quando',_serif]">
                  {t.nav.order}
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Menu Content */}
      <main className="container mx-auto px-4 md:px-6 py-8 md:py-16 relative z-10 max-w-5xl">
        {/* Elegant Header */}
        <div className="text-center mb-12 md:mb-20 bg-background/90 backdrop-blur-md p-6 md:p-12 rounded-sm border-2 border-primary/20 relative overflow-hidden shadow-xl">
          {/* Decorative Corner Elements */}
          <div className="absolute top-0 left-0 w-12 h-12 md:w-24 md:h-24 border-t-2 border-l-2 border-primary/30"></div>
          <div className="absolute top-0 right-0 w-12 h-12 md:w-24 md:h-24 border-t-2 border-r-2 border-primary/30"></div>
          <div className="absolute bottom-0 left-0 w-12 h-12 md:w-24 md:h-24 border-b-2 border-l-2 border-primary/30"></div>
          <div className="absolute bottom-0 right-0 w-12 h-12 md:w-24 md:h-24 border-b-2 border-r-2 border-primary/30"></div>

          {/* Ornamental Top */}
          <div className="flex items-center justify-center gap-2 md:gap-4 mb-4 md:mb-6">
            <div className="h-[2px] w-8 md:w-16 bg-gradient-to-r from-transparent to-primary"></div>
            <span className="text-2xl md:text-4xl">✦</span>
            <div className="h-[2px] w-8 md:w-16 bg-gradient-to-l from-transparent to-primary"></div>
          </div>

          <h2 className="text-secondary text-xs md:text-sm font-bold tracking-[0.2em] md:tracking-[0.3em] mb-2 md:mb-3 uppercase">Speisekarte • Menu • Меню</h2>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-heading font-bold mb-3 md:mb-4 text-foreground tracking-wide">{t.menu.title}</h1>
          <p className="text-muted-foreground text-sm md:text-lg max-w-2xl mx-auto leading-relaxed italic px-4">{t.menu.subtitle}</p>

          {/* Ornamental Bottom */}
          <div className="flex items-center justify-center gap-2 md:gap-4 mt-4 md:mt-6">
            <div className="h-[2px] w-8 md:w-16 bg-gradient-to-r from-transparent to-primary"></div>
            <span className="text-2xl md:text-4xl">✦</span>
            <div className="h-[2px] w-8 md:w-16 bg-gradient-to-l from-transparent to-primary"></div>
          </div>
        </div>

        {/* Soups */}
        {mainCombinedItems.length > 0 && <MenuSection title={cats.mains} items={mainCombinedItems} lang={lang} getDishInfo={getDishInfo} setLightboxImage={setLightboxImage} onAddToCart={handleAddToCart} cartQuantities={cartQuantities} />}
        {activeMenu.salads.length > 0 && <MenuSection title={cats.salads} items={activeMenu.salads} lang={lang} getDishInfo={getDishInfo} setLightboxImage={setLightboxImage} onAddToCart={handleAddToCart} cartQuantities={cartQuantities} />}
        {activeMenu.sides.length > 0 && <MenuSection title={cats.sides} items={activeMenu.sides} lang={lang} getDishInfo={getDishInfo} setLightboxImage={setLightboxImage} hidePlaceholder={true} onAddToCart={handleAddToCart} cartQuantities={cartQuantities} />}
        {activeMenu.desserts.length > 0 && <MenuSection title={cats.desserts} items={activeMenu.desserts} lang={lang} getDishInfo={getDishInfo} setLightboxImage={setLightboxImage} onAddToCart={handleAddToCart} cartQuantities={cartQuantities} />}
        {activeMenu.drinks.length > 0 && <MenuSection title={cats.drinks} items={activeMenu.drinks} lang={lang} getDishInfo={getDishInfo} setLightboxImage={setLightboxImage} hidePlaceholder={true} onAddToCart={handleAddToCart} cartQuantities={cartQuantities} />}
        {activeMenu.colddrinks.length > 0 && <MenuSection title={cats.colddrinks} items={activeMenu.colddrinks} lang={lang} getDishInfo={getDishInfo} setLightboxImage={setLightboxImage} hidePlaceholder={true} hideDetails={true} onAddToCart={handleAddToCart} cartQuantities={cartQuantities} />}

        {/* Footer Note */}
        <div className="mt-12 md:mt-20 text-center bg-card/90 backdrop-blur-sm p-4 md:p-8 rounded-sm border border-border/50">
          <div className="flex items-center justify-center gap-2 md:gap-4 mb-3 md:mb-4">
            <div className="h-[1px] w-8 md:w-12 bg-gradient-to-r from-transparent to-primary"></div>
            <span className="text-xl md:text-2xl text-primary">✦</span>
            <div className="h-[1px] w-8 md:w-12 bg-gradient-to-l from-transparent to-primary"></div>
          </div>
          {lang === 'de' ? (
            <div className="text-left max-w-4xl mx-auto space-y-4">
              <p className="text-muted-foreground text-xs md:text-sm text-center">Alle Preise inkl. MwSt.</p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="rounded-sm border border-border/60 bg-background/60 p-3 md:p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary mb-2">Zusatzstoffe</p>
                  <div className="flex flex-wrap gap-2">
                    {additiveLegend.map((item) => (
                      <span key={item.key} className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] md:text-xs text-foreground">
                        <span className="font-bold text-primary">{item.key}</span>
                        <span>{item.label}</span>
                      </span>
                    ))}
                  </div>
                </div>
                <div className="rounded-sm border border-border/60 bg-background/60 p-3 md:p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary mb-2">Allergene</p>
                  <div className="flex flex-wrap gap-2">
                    {allergenLegend.map((item) => (
                      <span key={item.key} className="inline-flex items-center gap-1.5 rounded-full bg-secondary/15 px-2.5 py-1 text-[11px] md:text-xs text-foreground">
                        <span className="font-bold text-secondary">{item.key}</span>
                        <span>{item.label}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground text-xs md:text-sm leading-relaxed max-w-2xl mx-auto px-2">
              {lang === 'en' && 'All prices include VAT • Additives and allergens are marked by code and available per item'}
              {lang === 'ru' && 'Все цены включают НДС • Добавки и аллергены указаны кодами для каждого блюда'}
            </p>
          )}
          <div className="mt-4 md:mt-6 text-center">
            <p className="text-xs text-muted-foreground/70">
              {lang === 'de' && (
                <>
                  Reservierung empfohlen •{" "}
                  <a href="tel:+4922196026707" className="hover:text-primary transition-colors">
                    0221 96026707
                  </a>
                </>
              )}
              {lang === 'en' && (
                <>
                  Reservation recommended •{" "}
                  <a href="tel:+4922196026707" className="hover:text-primary transition-colors">
                    0221 96026707
                  </a>
                </>
              )}
              {lang === 'ru' && (
                <>
                  Рекомендуется бронирование •{" "}
                  <a href="tel:+4922196026707" className="hover:text-primary transition-colors">
                    0221 96026707
                  </a>
                </>
              )}
            </p>
            <p className="mt-2 text-sm font-semibold text-primary">
              {lang === 'de' && 'Nur Barzahlung (Cash only)'}
              {lang === 'en' && 'Cash only payment'}
              {lang === 'ru' && 'Оплата только наличными'}
              
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-foreground text-background py-8 md:py-12 mt-8 md:mt-16 border-t-2 border-primary/30 relative z-10">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 md:gap-4 mb-3 md:mb-4">
            <div className="h-[1px] w-8 md:w-16 bg-gradient-to-r from-transparent to-white/30"></div>
            <span className="text-2xl md:text-3xl text-secondary">✦</span>
            <div className="h-[1px] w-8 md:w-16 bg-gradient-to-l from-transparent to-white/30"></div>
          </div>
          <p className="font-heading text-2xl md:text-3xl tracking-[0.2em] md:tracking-[0.3em] mb-2 text-white">SILK ROAD</p>
          <p className="text-white/80 text-sm md:text-base mb-1">Karl-Berbuer-Platz 7, 50678 Köln</p>
          <p className="text-white/60 text-xs md:text-sm mb-3 md:mb-4">Südstadt • Köln</p>
          <a href="tel:+4922196026707" className="text-secondary font-bold tracking-wider text-sm md:text-base hover:text-primary transition-colors">
            0221 96026707
          </a>
          <div className="mt-4 md:mt-6">
            <p className="text-xs text-white/80 mt-auto">© {currentYear} SILK ROAD Restaurant • Köln</p>
            <p className="text-xs text-white/60 mt-2">
              Made by ❤️{" "}
              <a href="https://codebek.com/" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary transition-colors">
                ASLBEK
              </a>
            </p>
          </div>
        </div>
      </footer>

      {/* Image Lightbox Modal */}
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

      {/* Cart Drawer */}
      <CartDrawer />
    </div>
  );
}

function MenuSection({ title, items, lang, getDishInfo, setLightboxImage, hidePlaceholder, hideDetails, onAddToCart, cartQuantities }: {
  title: string;
  items: any[];
  lang: Language;
  getDishInfo: (d: any) => { name: string; desc: string };
  setLightboxImage: (image: { src: string; name: string } | null) => void;
  hidePlaceholder?: boolean;
  hideDetails?: boolean;
  onAddToCart?: (item: any, name: string) => void;
  cartQuantities?: Record<string, number>;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      initial={{ opacity: 1, y: reduceMotion ? 0 : 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px", amount: 0.2 }}
      transition={{ duration: reduceMotion ? 0 : 0.45, ease: "easeOut" }}
      className="mb-20"
    >
      {/* Category Header */}
      <div className="text-center mb-8 md:mb-12 relative">
        {/* Decorative Line */}
        <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-border to-transparent"></div>

        {/* Category Title */}
        <div className="relative inline-block bg-background/95 backdrop-blur-sm px-4 md:px-8 py-2 md:py-3 border-2 border-primary/30 rounded-sm">
          <h3 className="text-xl md:text-3xl font-heading font-bold tracking-wider text-primary uppercase">
            {title}
          </h3>
        </div>
      </div>

      {/* Menu Items Container */}
      <div className="bg-card/95 backdrop-blur-md p-4 md:p-8 lg:p-12 rounded-sm border border-border shadow-lg">
        <div className="space-y-6 md:space-y-8">
          {items.map((item, idx) => {
            const { name, desc } = getDishInfo(item);
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 1, x: reduceMotion ? 0 : -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "0px", amount: 0.4 }}
                transition={{ delay: reduceMotion ? 0 : idx * 0.04, duration: reduceMotion ? 0 : 0.35 }}
                className="group relative"
              >
                <div className="flex gap-3 md:gap-6 items-start">
                  {/* Image */}
                  {item.image ? (
                    <div
                      onClick={() => setLightboxImage({ src: item.image, name })}
                      className="w-24 md:w-40 aspect-[4/3] rounded-sm overflow-hidden flex-shrink-0 bg-muted shadow-md relative cursor-zoom-in hover:ring-2 hover:ring-primary transition-all group/image"
                    >
                      <img
                        src={item.image}
                        alt={name}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {/* Zoom overlay hint */}
                      <div className="absolute inset-0 bg-black/0 group-hover/image:bg-black/20 transition-colors flex items-center justify-center">
                        <span className="text-white opacity-0 group-hover/image:opacity-100 transition-opacity text-2xl">🔍</span>
                      </div>
                    </div>
                  ) : !hidePlaceholder ? (
                    <div className="w-24 md:w-40 aspect-[4/3] rounded-sm flex-shrink-0 bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center border border-border">
                      <span className="text-3xl md:text-5xl opacity-40">🍽</span>
                    </div>
                  ) : null}

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {/* Dish Name & Price with Dotted Line - Stack on mobile */}
                    <div className="mb-2 md:mb-3">
                      {/* Mobile Layout - Stacked */}
                      <div className="md:hidden">
                        <div className="flex items-baseline justify-between gap-2 mb-1">
                          <h4 className="text-lg font-heading font-bold group-hover:text-primary transition-colors">
                            {name}
                          </h4>
                          <span className="text-lg font-bold text-primary whitespace-nowrap">
                            {item.price}
                          </span>
                        </div>
                      </div>

                      {/* Desktop Layout - With dotted line */}
                      <div className="hidden md:flex items-baseline gap-2">
                        <h4 className="text-xl lg:text-2xl font-heading font-bold group-hover:text-primary transition-colors flex-shrink-0">
                          {name}
                        </h4>
                        <div className="flex-1 border-b-2 border-dotted border-border/50 mb-1 min-w-[20px]"></div>
                        <span className="text-xl lg:text-2xl font-bold text-primary whitespace-nowrap flex-shrink-0">
                          {item.price}
                        </span>
                      </div>
                    </div>

                    {!hideDetails && (
                      <>
                        {/* Description */}
                        <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                          {desc}
                        </p>

                        {/* Dietary Icons (if applicable) */}
                        <div className="flex gap-2 mt-2 md:mt-3">
                          {item.dietary === 'halal' && (
                            <span className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                              <span>✓</span> {lang === 'de' ? 'Halal' : lang === 'ru' ? 'Халяль' : 'Halal'}
                            </span>
                          )}
                          {item.dietary === 'vegetarian' && (
                            <span className="inline-flex items-center gap-1 text-xs bg-green-500/10 text-green-600 px-2 py-1 rounded-full">
                              <span>🌱</span> {lang === 'de' ? 'Vegetarisch' : lang === 'ru' ? 'Вегетарианское' : 'Vegetarian'}
                            </span>
                          )}
                          {item.dietary === 'vegan' && (
                            <span className="inline-flex items-center gap-1 text-xs bg-green-600/10 text-green-700 px-2 py-1 rounded-full">
                              <span>🌿</span> {lang === 'de' ? 'Vegan' : lang === 'ru' ? 'Веганское' : 'Vegan'}
                            </span>
                          )}
                        </div>
                      </>
                    )}

                    {/* Add to Cart */}
                    {onAddToCart && (
                      <div className="mt-3">
                        {(cartQuantities?.[item.id] ?? 0) === 0 ? (
                          <button
                            onClick={() => onAddToCart(item, name)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm border border-primary/50 text-primary text-xs font-semibold hover:bg-primary hover:text-primary-foreground transition-all [font-family:'Quando',_serif] uppercase tracking-wide"
                          >
                            <PlusIcon className="w-3 h-3" />
                            {lang === 'de' ? 'Bestellen' : lang === 'ru' ? 'Добавить' : 'Add'}
                          </button>
                        ) : (
                          <div className="inline-flex items-center gap-2">
                            <button
                              onClick={() => {
                                const qty = (cartQuantities?.[item.id] ?? 1) - 1;
                                if (qty === 0) {
                                  // remove via adding with qty trick — handled by context
                                  onAddToCart({ ...item, _remove: true }, name);
                                } else {
                                  onAddToCart({ ...item, _decrease: true }, name);
                                }
                              }}
                              className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:bg-muted hover:border-primary transition-colors text-foreground"
                            >
                              <MinusIcon className="w-3 h-3" />
                            </button>
                            <span className="text-sm font-bold w-5 text-center tabular-nums text-primary">
                              {cartQuantities?.[item.id]}
                            </span>
                            <button
                              onClick={() => onAddToCart(item, name)}
                              className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:bg-muted hover:border-primary transition-colors text-foreground"
                            >
                              <PlusIcon className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Separator (except for last item) */}
                {idx < items.length - 1 && (
                  <div className="mt-6 md:mt-8 h-[1px] bg-gradient-to-r from-transparent via-border/50 to-transparent"></div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

    </motion.section>
  );
}

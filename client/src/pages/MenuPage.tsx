import { useState, useLayoutEffect } from "react";
import { Link, useLocation } from "wouter";
import { translations, Language } from "@/lib/i18n";
import { useMusic } from "@/lib/MusicContext";
import { useLanguage } from "@/lib/LanguageContext";
import { useSeoMeta } from "@/lib/seo";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowLeftIcon as ArrowLeft, ChevronDownIcon as ChevronDown, X } from "@/components/icons";
import HamburgerButton from "@/components/HamburgerButton";
import { Button } from "@/components/ui/button";

import plovImage from "@assets/stock_images/menu/palov.webp";
import mantyImage from "@assets/stock_images/manty_dumplings_cent_45246789.webp";
import samsaImage from "@assets/stock_images/menu/Somsa.webp";
import shashlikLammImage from "@assets/stock_images/menu/Schaschlik_vom_Lamm.webp";
import shashlikHaehnchenImage from "@assets/stock_images/menu/Schaschlik_vom_Hahnchen.webp";
import teaImage from "@assets/stock_images/menu/tea_1.webp";
import saladImage from "@assets/stock_images/menu/salat.webp";
import breadImage from "@assets/stock_images/menu/Uzbek-bread-obi-non-thumbnail-square-500x500.webp";
import carpetImage from "@assets/stock_images/persian_carpet.webp";
import schorpaImage from "@assets/stock_images/menu/Schorpa.webp";
import tscheburekiImage from "@assets/stock_images/menu/Tschebureki.webp";
import karottensalatImage from "@assets/stock_images/menu/Karottensalat.webp";
import atschuchuksalatImage from "@assets/stock_images/menu/Atschuchuksalat.webp";
import kazanKebabImage from "@assets/stock_images/menu/Kazan_Kebab.webp";
import kazanKebabHaehnchenImage from "@assets/stock_images/menu/Kazan_Kebab_Hahnchen.webp";
import honimVegetarischImage from "@assets/stock_images/menu/Honim_Vegetarisch.webp";
import honigMedovikKuchenImage from "@assets/stock_images/menu/Honig_Medovik_Kuchen.webp";
import borschImage from "@assets/stock_images/menu/Borsch.webp";
import chuchvaraImage from "@assets/stock_images/menu/Chuchvara.webp";
import mastavAImage from "@assets/stock_images/menu/Mastava.webp";
import pelmeniImage from "@assets/stock_images/menu/Pelmeni.webp";
import warenikyImage from "@assets/stock_images/menu/Wareniki.webp";
import caravanDessertImage from "@assets/stock_images/menu/Caravan Dessert.webp";
import honigMedovikSchokoladeImage from "@assets/stock_images/menu/Honig Medovik schokolade.webp";
import knackigerStartImage from "@assets/stock_images/menu/Knäckiger start.webp";

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

const menuCategories = {
  de: {
    soups: "Suppen",
    mains: "Hausspezialitäten",
    grills: "Grillspezialitäten",
    appetizers: "Heisse, Kalte Vorspeisen und Salate",
    sides: "Beilagen",
    drinks: "Heisse Getränke",
    colddrinks: "Kalte Getränke",
    beer: "Bier",
    wine: "Wein",
    spirits: "Spirituosen",
    desserts: "Desserts"
  },
  en: {
    soups: "Soups",
    mains: "House Specialties",
    grills: "Grill Specialties",
    appetizers: "Hot, Cold Appetizers and Salads",
    sides: "Sides",
    drinks: "Hot Drinks",
    colddrinks: "Cold Drinks",
    beer: "Beer",
    wine: "Wine",
    spirits: "Spirits",
    desserts: "Desserts"
  },
  ru: {
    soups: "Супы",
    mains: "Фирменные блюда",
    grills: "Блюда на гриле",
    appetizers: "Горячие, холодные закуски и салаты",
    sides: "Гарниры",
    drinks: "Горячие напитки",
    colddrinks: "Холодные напитки",
    beer: "Пиво",
    wine: "Вино",
    spirits: "Крепкие напитки",
    desserts: "Десерты"
  },
  uz: {
    soups: "Sho‘rvalar",
    mains: "Firma taomlari",
    grills: "Gril taomlari",
    appetizers: "Issiq va sovuq taomlar, salatlar",
    sides: "Garnirlar",
    drinks: "Issiq ichimliklar",
    colddrinks: "Sovuq ichimliklar",
    beer: "Pivo",
    wine: "Vino",
    spirits: "Kuchli ichimliklar",
    desserts: "Shirinliklar"
  }
};

const fullMenu = {
  soups: [
    { id: 'schorpa', image: schorpaImage, price: '12.90€', dietary: 'halal' },
    { id: 'borsch', image: borschImage, price: '12.90€', dietary: 'halal' },
    { id: 'chuchvara', image: chuchvaraImage, price: '13.90€', dietary: 'halal' },
    { id: 'mastava', image: mastavAImage, price: '12.90€', dietary: 'halal' },
  ],
  appetizers: [
    { id: 'somsa', image: samsaImage, price: '11.90€', dietary: 'halal' },
    { id: 'tschebureki', image: tscheburekiImage, price: '11.90€', dietary: 'halal' },
    {
      id: 'knackigerstart',
      image: knackigerStartImage,
      price: '10.90€',
      dietary: 'vegetarian',
      names: { de: 'Knäckiger Start', en: 'Crunchy Start', ru: 'Хрустящая закуска', uz: 'Qarsildoq boshlanish' },
      descs: {
        de: 'Sauergürkensalat - Bestehend aus hauseingeleg ten sauren Gurken, Tomaten und Weißkohl.',
        en: 'Assortment of home-made pickled cucumbers, tomatoes, and cabbage.',
        ru: 'Салат из маринованных огурцов, помидоров и капусты.',
        uz: 'Tuzlangan bodring, pomidor va karam salati.'
      }
    },
    { id: 'karottensalat', image: karottensalatImage, price: '9.90€', dietary: 'vegan' },
    { id: 'atschuchuksalat', image: atschuchuksalatImage, price: '9.90€', dietary: 'vegan' },
  ],
  mains: [
    { id: 'kazankebab', image: kazanKebabImage, price: '26.90€', dietary: 'halal' },
    { id: 'kazankebabhaehnchen', image: kazanKebabHaehnchenImage, price: '25.90€', dietary: 'halal' },
    { id: 'plov', image: plovImage, price: '17.90€', dietary: 'halal' },
    { id: 'pelmeni', image: pelmeniImage, price: '22.90€', dietary: 'halal' },
    { id: 'manty', image: mantyImage, price: '23.90€', dietary: 'halal' },
    { id: 'honimvegetariach', image: honimVegetarischImage, price: '21.90€', dietary: 'vegetarian' },
    { id: 'warenikiwegetarisch', image: warenikyImage, price: '21.90€', dietary: 'vegetarian' },
  ],
  grills: [
    { id: 'schaschlikvomlamm', image: shashlikLammImage, price: '26.90€', dietary: 'halal' },
    { id: 'schaschlikvomhaehnchen', image: shashlikHaehnchenImage, price: '25.90€', dietary: 'halal' },
  ],
  sides: [
    {
      id: 'pommes',
      image: null,
      price: '5.90€',
      names: { de: 'Extra Portion Pommes', en: 'Extra Portion Fries', ru: 'Дополнительная порция картофеля фри', uz: 'Qo‘shimcha kartoshka fri' },
      descs: {
        de: 'Knusprige Pommes Frites.',
        en: 'Crispy french fries.',
        ru: 'Хрустящий картофель фри.',
        uz: 'Qo‘shimcha kartoshka fri.'
      }
    },
    {
      id: 'reis',
      image: null,
      price: '4.90€',
      names: { de: 'Extra Portion Reis', en: 'Extra Portion Rice', ru: 'Дополнительная порция риса', uz: 'Qo‘shimcha guruch' },
      descs: {
        de: 'Gedämpfter Reis.',
        en: 'Steamed rice.',
        ru: 'Рис на пару.',
        uz: 'Bug‘da pishirilgan guruch.'
      }
    },
    {
      id: 'sosse',
      image: null,
      price: '2.90€',
      names: { de: 'Extra Portion Sosse', en: 'Extra Portion Sauce', ru: 'Дополнительная порция соуса', uz: 'Qo‘shimcha sous' },
      descs: {
        de: 'Yoghurt-, Scharf-, Tomatensoße, Schmand.',
        en: 'Yogurt, Spicy, Tomato sauce, Sour cream.',
        ru: 'Йогурт, острый, томатный соус, сметана.',
        uz: 'Yogurt, achchiq, pomidor sousi, smetana.'
      }
    },
    {
      id: 'non',
      image: null,
      price: '3.90€',
      names: { de: 'Extra Portion Brot (ganzes Fladenbrot)', en: 'Extra Portion Bread (whole flatbread)', ru: 'Дополнительная порция хлеба (целая лепёшка)', uz: 'Qo‘shimcha non (butun non)' },
      descs: {
        de: 'Traditionelles Fladenbrot.',
        en: 'Traditional flatbread.',
        ru: 'Традиционная лепёшка.',
        uz: 'Milliy non.'
      }
    },
    {
      id: 'nonhalf',
      image: null,
      price: '1.90€',
      names: { de: 'Extra Portion Brot (halbes Fladenbrot)', en: 'Extra Portion Bread (half flatbread)', ru: 'Дополнительная порция хлеба (половина лепёшки)', uz: 'Qo‘shimcha non (yarim non)' },
      descs: {
        de: 'Halbes traditionelles Fladenbrot.',
        en: 'Half traditional flatbread.',
        ru: 'Половина традиционной лепёшки.',
        uz: 'Yarimta an’anaviy non.'
      }
    },
  ],
  desserts: [
    { id: 'caravandessert', image: caravanDessertImage, price: '7.90€', dietary: 'vegetarian' },
    { id: 'honigmedovikkuchen', image: honigMedovikKuchenImage, price: '8.90€', dietary: 'vegetarian' },
    { id: 'honigmedovikschokolade', image: honigMedovikSchokoladeImage, price: '8.90€', dietary: 'vegetarian' },
  ],
  drinks: [
    {
      id: 'kannetee06black',
      image: null,
      price: '5.50€',
      names: { de: 'Kanne Tee (0.6L) - Schwarzer oder Grüner', en: 'Pot of Tea (0.6L) - Black or Green', ru: 'Чайник чая (0.6л) - Черный или Зеленый', uz: 'Choynakdagi choy (0.6L) - qora yoki yashil' },
      descs: {
        de: 'Schwarzer oder Grüner Tee.',
        en: 'Black or Green tea.',
        ru: 'Черный или зеленый чай.',
        uz: 'Qora yoki yashil choy.'
      }
    },
    {
      id: 'kannetee06jasmin',
      image: null,
      price: '6.50€',
      names: { de: 'Kanne Tee (0.6L) - Jasmin', en: 'Pot of Tea (0.6L) - Jasmine', ru: 'Чайник чая (0.6л) - Жасминовый', uz: 'Choynakdagi choy (0.6L) - yasminli' },
      descs: {
        de: 'Jasmin Tee.',
        en: 'Jasmine tea.',
        ru: 'Жасминовый чай.',
        uz: 'Yasminli choy.'
      }
    },
    {
      id: 'tassejasmin',
      image: null,
      price: '3.50€',
      names: { de: 'Tasse Jasmin Tee (0.3L)', en: 'Cup of Jasmine Tea (0.3L)', ru: 'Чашка жасминового чая (0.3л)', uz: 'Yasminli choy (piyola, 0.3L)' },
      descs: {
        de: 'Eine Tasse Jasmin Tee.',
        en: 'A cup of jasmine tea.',
        ru: 'Чашка жасминового чая.',
        uz: 'Bir piyola yasminli choy.'
      }
    },
    {
      id: 'tassetee',
      image: null,
      price: '2.50€',
      names: { de: 'Tasse Tee (0.3L)', en: 'Cup of Tea (0.3L)', ru: 'Чашка чая (0.3л)', uz: 'Piyola choy (0.3L)' },
      descs: {
        de: 'Beutel Grüner oder Schwarzer.',
        en: 'Green or Black tea bag.',
        ru: 'Зеленый или черный чай в пакетике.',
        uz: 'Yashil yoki qora paketli choy.'
      }
    },
    {
      id: 'minzetee1',
      image: null,
      price: '3.00€',
      names: { de: 'Minze Tee (0.3L)', en: 'Mint Tea (0.3L)', ru: 'Мятный чай (0.3л)', uz: 'Yalpizli choy (0.3L)' },
      descs: {
        de: 'Frische Minze mit Zitrone.',
        en: 'Fresh mint with lemon.',
        ru: 'Свежая мята с лимоном.',
        uz: 'Yangi yalpiz va limon bilan.'
      }
    },
    {
      id: 'minzetee2',
      image: null,
      price: '4.50€',
      names: { de: 'Minze Tee (0.3L)', en: 'Mint Tea (0.3L)', ru: 'Мятный чай (0.3л)', uz: 'Yalpizli choy (0.3L)' },
      descs: {
        de: 'Frische Minze mit Ingwer, Zitrone und Honig.',
        en: 'Fresh mint with ginger, lemon and honey.',
        ru: 'Свежая мята с имбирем, лимоном и медом.',
        uz: 'Yangi yalpiz, zanjabil, limon va asal bilan.'
      }
    },
  ],
  colddrinks: [
    {
      id: 'selteskohlensaeure',
      image: null,
      price: '2.20€ / 3.80€',
      names: { de: 'Seltes Kohlensäure (0.2L / 0.4L)', en: 'Sparkling Water (0.2L / 0.4L)', ru: 'Газированная вода (0.2л / 0.4л)', uz: 'Gazlangan suv (0.2L / 0.4L)' },
      descs: {
        de: 'Sprudelwasser',
        en: 'Sparkling water',
        ru: 'Газированная вода',
        uz: 'Gazlangan suv'
      }
    },
    {
      id: 'seltesnaturell',
      image: null,
      price: '2.20€ / 3.80€',
      names: { de: 'Seltes Naturell (0.2L / 0.4L)', en: 'Still Water (0.2L / 0.4L)', ru: 'Негазированная вода (0.2л / 0.4л)', uz: 'Gazsiz suv (0.2L / 0.4L)' },
      descs: {
        de: 'Stilles Wasser',
        en: 'Still water',
        ru: 'Негазированная вода',
        uz: 'Gazsiz suv'
      }
    },
    {
      id: 'seltesflasche',
      image: null,
      price: '7.50€',
      names: { de: 'Seltes Flasche (0.75L)', en: 'Water Bottle (0.75L)', ru: 'Бутылка воды (0.75л)', uz: 'Suv shishasi (0.75L)' },
      descs: {
        de: 'Große Wasserflasche',
        en: 'Large water bottle',
        ru: 'Большая бутылка воды',
        uz: 'Katta suv shishasi'
      }
    },
    {
      id: 'cocacola',
      image: null,
      price: '3.90€ / 4.90€',
      names: { de: 'Coca-Cola (0.2L / 0.4L)', en: 'Coca-Cola (0.2L / 0.4L)', ru: 'Кока-Кола (0.2л / 0.4л)', uz: 'Coca-Cola (0.2L / 0.4L)' },
      descs: {
        de: 'Coca-Cola',
        en: 'Coca-Cola',
        ru: 'Кока-Кола',
        uz: 'Coca-Cola'
      }
    },
    {
      id: 'colalight',
      image: null,
      price: '3.90€ / 4.90€',
      names: { de: 'Cola-Light (0.2L / 0.4L)', en: 'Cola Light (0.2L / 0.4L)', ru: 'Кола Лайт (0.2л / 0.4л)', uz: 'Cola Light (0.2L / 0.4L)' },
      descs: {
        de: 'Cola Light',
        en: 'Cola Light',
        ru: 'Кола Лайт',
        uz: 'Cola Light'
      }
    },
    {
      id: 'colazero',
      image: null,
      price: '3.90€ / 4.90€',
      names: { de: 'Cola-Zero (0.2L / 0.4L)', en: 'Cola Zero (0.2L / 0.4L)', ru: 'Кола Зеро (0.2л / 0.4л)', uz: 'Cola Zero (0.2L / 0.4L)' },
      descs: {
        de: 'Cola Zero',
        en: 'Cola Zero',
        ru: 'Кола Зеро',
        uz: 'Cola Zero'
      }
    },
    {
      id: 'fanta',
      image: null,
      price: '3.90€ / 4.90€',
      names: { de: 'Fanta (0.2L / 0.4L)', en: 'Fanta (0.2L / 0.4L)', ru: 'Фанта (0.2л / 0.4л)', uz: 'Fanta (0.2L / 0.4L)' },
      descs: {
        de: 'Fanta Orange',
        en: 'Fanta Orange',
        ru: 'Фанта Апельсин',
        uz: 'Fanta Apelsin'
      }
    },
    {
      id: 'sprit',
      image: null,
      price: '3.90€ / 4.90€',
      names: { de: 'Sprit (0.2L / 0.4L)', en: 'Sprite (0.2L / 0.4L)', ru: 'Спрайт (0.2л / 0.4л)', uz: 'Sprite (0.2L / 0.4L)' },
      descs: {
        de: 'Sprite',
        en: 'Sprite',
        ru: 'Спрайт',
        uz: 'Sprite'
      }
    },
    {
      id: 'apfelsaftschorle',
      image: null,
      price: '3.90€ / 4.90€',
      names: { de: 'Apfelsaftschorle (0.2L / 0.4L)', en: 'Apple Spritzer (0.2L / 0.4L)', ru: 'Яблочный сок со газом (0.2л / 0.4л)', uz: 'Olma sharbati (0.2L / 0.4L)' },
      descs: {
        de: 'Apfelsaft mit Sprudelwasser',
        en: 'Apple juice with sparkling water',
        ru: 'Яблочный сок с газированной водой',
        uz: 'Olma sharbati gazlangan suv bilan'
      }
    },
    {
      id: 'bitterlemon',
      image: null,
      price: '3.90€ / 4.90€',
      names: { de: 'Bitter Lemon (0.2L / 0.4L)', en: 'Bitter Lemon (0.2L / 0.4L)', ru: 'Биттер Лимон (0.2л / 0.4л)', uz: 'Bitter Lemon (0.2L / 0.4L)' },
      descs: {
        de: 'Bitter Lemon',
        en: 'Bitter Lemon',
        ru: 'Биттер Лимон',
        uz: 'Bitter Lemon'
      }
    },
    {
      id: 'gingerale',
      image: null,
      price: '3.90€ / 4.90€',
      names: { de: 'Ginger Ale (0.2L / 0.4L)', en: 'Ginger Ale (0.2L / 0.4L)', ru: 'Имбирный Эль (0.2л / 0.4л)', uz: 'Ginger Ale (0.2L / 0.4L)' },
      descs: {
        de: 'Ginger Ale',
        en: 'Ginger Ale',
        ru: 'Имбирный Эль',
        uz: 'Ginger Ale'
      }
    },
    {
      id: 'orangensaft',
      image: null,
      price: '3.90€ / 5.90€',
      names: { de: 'Orangensaft (0.2L / 0.4L)', en: 'Orange Juice (0.2L / 0.4L)', ru: 'Апельсиновый сок (0.2л / 0.4л)', uz: 'Apelsin sharbati (0.2L / 0.4L)' },
      descs: {
        de: 'Frischer Orangensaft',
        en: 'Fresh orange juice',
        ru: 'Свежий апельсиновый сок',
        uz: 'Yangi apelsin sharbati'
      }
    },
    {
      id: 'apfelsaft',
      image: null,
      price: '3.90€ / 5.90€',
      names: { de: 'Apfelsaft (0.2L / 0.4L)', en: 'Apple Juice (0.2L / 0.4L)', ru: 'Яблочный сок (0.2л / 0.4л)', uz: 'Olma sharbati (0.2L / 0.4L)' },
      descs: {
        de: 'Frischer Apfelsaft',
        en: 'Fresh apple juice',
        ru: 'Свежий яблочный сок',
        uz: 'Yangi olma sharbati'
      }
    },
    {
      id: 'kirschsaft',
      image: null,
      price: '3.90€ / 5.90€',
      names: { de: 'Kirschsaft (0.2L / 0.4L)', en: 'Cherry Juice (0.2L / 0.4L)', ru: 'Вишневый сок (0.2л / 0.4л)', uz: 'Olcha sharbati (0.2L / 0.4L)' },
      descs: {
        de: 'Kirschsaft',
        en: 'Cherry juice',
        ru: 'Вишневый сок',
        uz: 'Olcha sharbati'
      }
    },
    {
      id: 'bananensaft',
      image: null,
      price: '3.90€ / 5.90€',
      names: { de: 'Bananensaft (0.2L / 0.4L)', en: 'Banana Juice (0.2L / 0.4L)', ru: 'Банановый сок (0.2л / 0.4л)', uz: 'Banan sharbati (0.2L / 0.4L)' },
      descs: {
        de: 'Bananensaft',
        en: 'Banana juice',
        ru: 'Банановый сок',
        uz: 'Banan sharbati'
      }
    },
    {
      id: 'pfirsichsaft',
      image: null,
      price: '3.90€ / 5.90€',
      names: { de: 'Pfirsichsaft (0.2L / 0.4L)', en: 'Peach Juice (0.2L / 0.4L)', ru: 'Персиковый сок (0.2л / 0.4л)', uz: 'Shaftoli sharbati (0.2L / 0.4L)' },
      descs: {
        de: 'Pfirsichsaft',
        en: 'Peach juice',
        ru: 'Персиковый сок',
        uz: 'Shaftoli sharbati'
      }
    },
    {
      id: 'maracujasaft',
      image: null,
      price: '3.90€ / 5.90€',
      names: { de: 'Maracujasaft (0.2L / 0.4L)', en: 'Passion Fruit Juice (0.2L / 0.4L)', ru: 'Маракуйя сок (0.2л / 0.4л)', uz: 'Marakuya sharbati (0.2L / 0.4L)' },
      descs: {
        de: 'Maracujasaft',
        en: 'Passion fruit juice',
        ru: 'Сок маракуйи',
        uz: 'Marakuya sharbati'
      }
    },
  ],
  beer: [
    {
      id: 'binding',
      image: null,
      price: '3.90€ / 5.90€',
      names: { de: 'Binding (4.9% Vol.) Pils, vom Fass (0.2L / 0.4L)', en: 'Binding (4.9% Vol.) Pilsner, draft (0.2L / 0.4L)', ru: 'Binding (4.9% Vol.) Пилснер, разливное (0.2л / 0.4л)', uz: 'Binding (4.9% Vol.) Pils, quyma (0.2L / 0.4L)' },
      descs: {
        de: 'Frisches Pils vom Fass',
        en: 'Fresh draft pilsner',
        ru: 'Свежее разливное пиво',
        uz: 'Yangi quyma pivo'
      }
    },
    {
      id: 'radler',
      image: null,
      price: '3.90€ / 5.90€',
      names: { de: 'Radler (4.9% Vol.) (0.2L / 0.4L)', en: 'Radler (4.9% Vol.) (0.2L / 0.4L)', ru: 'Радлер (4.9% Vol.) (0.2л / 0.4л)', uz: 'Radler (4.9% Vol.) (0.2L / 0.4L)' },
      descs: {
        de: 'Bier mit Limonade gemischt',
        en: 'Beer mixed with lemonade',
        ru: 'Пиво с лимонадом',
        uz: 'Limonad bilan pivo'
      }
    },
    {
      id: 'kostritzer',
      image: null,
      price: '4.90€',
      names: { de: 'Köstritzer Schwarzbier 0.33L (4.8% Vol.)', en: 'Köstritzer Black Beer 0.33L (4.8% Vol.)', ru: 'Köstritzer Черное пиво 0.33л (4.8% Vol.)', uz: 'Köstritzer Qora pivo 0.33L (4.8% Vol.)' },
      descs: {
        de: 'Dunkles Bier aus Thüringen',
        en: 'Dark beer from Thuringia',
        ru: 'Темное пиво из Тюрингии',
        uz: 'Tyuringiyadan qora pivo'
      }
    },
    {
      id: 'schofferhofer',
      image: null,
      price: '5.90€',
      names: { de: 'Schöfferhofer Hefeweizen (0.5L)', en: 'Schöfferhofer Wheat Beer (0.5L)', ru: 'Schöfferhofer пшеничное (0.5л)', uz: 'Schöfferhofer bug‘doy pivosi (0.5L)' },
      descs: {
        de: 'Klassisches Hefeweizen',
        en: 'Classic wheat beer',
        ru: 'Классическое пшеничное пиво',
        uz: 'Klassik bug‘doy pivosi'
      }
    },
    {
      id: 'clausthaler',
      image: null,
      price: '3.90€',
      names: { de: 'Clausthaler Original (0.0% Vol.) (0.33L)', en: 'Clausthaler Original (0.0% Vol.) (0.33L)', ru: 'Clausthaler Оригинал (0.0% Vol.) (0.33л)', uz: 'Clausthaler Original (0.0% Vol.) (0.33L)' },
      descs: {
        de: 'Alkoholfreies Bier',
        en: 'Non-alcoholic beer',
        ru: 'Безалкогольное пиво',
        uz: 'Alkogolsiz pivo'
      }
    },
    {
      id: 'schofferhoferna',
      image: null,
      price: '5.90€',
      names: { de: 'Schöfferhofer Hefeweizen (0.0% Vol.) (0.5L)', en: 'Schöfferhofer Wheat Beer (0.0% Vol.) (0.5L)', ru: 'Schöfferhofer пшеничное (0.0% Vol.) (0.5л)', uz: 'Schöfferhofer bug‘doy (0.0% Vol.) (0.5L)' },
      descs: {
        de: 'Alkoholfreies Hefeweizen',
        en: 'Non-alcoholic wheat beer',
        ru: 'Безалкогольное пшеничное пиво',
        uz: 'Alkogolsiz bug‘doy pivosi'
      }
    },
    {
      id: 'apfelwein',
      image: null,
      price: '3.90€ / 4.90€',
      names: { de: 'Apfelwein pur, süss, sauer (0.25L / 0.5L)', en: 'Apple Wine pure, sweet, sour (0.25L / 0.5L)', ru: 'Яблочное вино чистое, сладкое, кислое (0.25л / 0.5л)', uz: 'Olma vinosi toza, shirin, nordon (0.25L / 0.5L)' },
      descs: {
        de: 'Hessische Spezialität',
        en: 'Hessian specialty',
        ru: 'Гессенская специальность',
        uz: 'Gessen mahsuloti'
      }
    },
  ],
  wine: [
    {
      id: 'valmarone',
      image: null,
      price: '7.50€',
      names: { de: 'Valmarone Merlot (0.2L)', en: 'Valmarone Merlot (0.2L)', ru: 'Valmarone Мерло (0.2л)', uz: 'Valmarone Merlot (0.2L)' },
      descs: {
        de: 'Trocken, Kirscharomen, feine Kräuter',
        en: 'Dry, cherry aromas, fine herbs',
        ru: 'Сухое, вишневые ароматы, травы',
        uz: 'Quruq, olcha aromati, o‘tlar'
      }
    },
    {
      id: 'thomasrathdornfelder',
      image: null,
      price: '7.50€',
      names: { de: 'Thomas Rath Dornfelder (0.2L)', en: 'Thomas Rath Dornfelder (0.2L)', ru: 'Thomas Rath Дорнфельдер (0.2л)', uz: 'Thomas Rath Dornfelder (0.2L)' },
      descs: {
        de: 'Trocken, Wild oder kräftige Käsesorten',
        en: 'Dry, game or strong cheese varieties',
        ru: 'Сухое, дичь или крепкие сыры',
        uz: 'Quruq, yovvoyi go‘sht yoki kuchli pishloqlar bilan'
      }
    },
    {
      id: 'lospagos',
      image: null,
      price: '7.50€',
      names: { de: 'Los Pagos Cabernet (0.2L)', en: 'Los Pagos Cabernet (0.2L)', ru: 'Los Pagos Каберне (0.2л)', uz: 'Los Pagos Cabernet (0.2L)' },
      descs: {
        de: 'Halbtrocken, nach schwarzen Johannisbeeren, fruchtig',
        en: 'Semi-dry, black currant, fruity',
        ru: 'Полусухое, черная смородина, фруктовое',
        uz: 'Yarim quruq, qora smorodina, mevali'
      }
    },
    {
      id: 'vinoespana',
      image: null,
      price: '7.50€',
      names: { de: 'Vino de España (0.2L)', en: 'Vino de España (0.2L)', ru: 'Vino de España (0.2л)', uz: 'Vino de España (0.2L)' },
      descs: {
        de: 'Lieblich, leicht, nach roten Beeren',
        en: 'Sweet, light, red berries',
        ru: 'Сладкое, легкое, красные ягоды',
        uz: 'Shirin, yengil, qizil rezavorlar'
      }
    },
    {
      id: 'thomasrathspatburgunder',
      image: null,
      price: '7.50€',
      names: { de: 'Thomas Rath Spätburgunder (0.2L)', en: 'Thomas Rath Pinot Noir (0.2L)', ru: 'Thomas Rath Шпетбургундер (0.2л)', uz: 'Thomas Rath Spätburgunder (0.2L)' },
      descs: {
        de: 'Trocken Qualitätswein, gehaltvoll, aromatisch',
        en: 'Dry quality wine, full-bodied, aromatic',
        ru: 'Сухое качественное вино, насыщенное, ароматное',
        uz: 'Quruq, sifatli vino: to‘liq, xushbo‘y'
      }
    },
    {
      id: 'josedezarzas',
      image: null,
      price: '27.90€',
      names: { de: 'Jose de Zarzas Gran Reserva (0.75L)', en: 'Jose de Zarzas Gran Reserva (0.75L)', ru: 'Jose de Zarzas Гран Резерва (0.75л)', uz: 'Jose de Zarzas Gran Reserva (0.75L)' },
      descs: {
        de: 'Trocken, 2 Jahre im Eichefass gelagert, nach dunklen Beeren und Vanille, leichte Röstnoten',
        en: 'Dry, 2 years oak-aged, dark berries and vanilla, light roasted notes',
        ru: 'Сухое, 2 года в дубовой бочке, темные ягоды и ваниль, легкая обжарка',
        uz: 'Quruq, 2 yil eman bochkasida, qora rezavorlar va vanil, yengil qovurilgan notalar'
      }
    },
    {
      id: 'marquesderiscalred',
      image: null,
      price: '67.90€',
      names: { de: 'Marques de Riscal (0.75L)', en: 'Marques de Riscal (0.75L)', ru: 'Marques de Riscal (0.75л)', uz: 'Marques de Riscal (0.75L)' },
      descs: {
        de: 'Rioja / Am Gaumen fein und elegant, mit zarten und runden Tanninen, einem seidigen Mundgefühl und einer angenessenen Säure. Alles in allem ein sehr milder, gut definierter und zugänglicher Wein.',
        en: 'Rioja / Fine and elegant on the palate, with gentle and round tannins, a silky mouthfeel and a pleasant acidity. Overall a very mild, well-defined and accessible wine.',
        ru: 'Риоха / Тонкое и элегантное во рту, с нежными и округлыми танинами, шелковистым ощущением и приятной кислотностью. В целом очень мягкое, хорошо определенное и доступное вино.',
        uz: 'Rioja / Og‘izda nozik va oqlangan; yumshoq va yumaloq taninlar, ipakdek his va yoqimli kislotalilik. Umuman olganda juda yumshoq, yaxshi aniqlangan va ochiq vino.'
      }
    },
    {
      id: 'thomasrathriesling',
      image: null,
      price: '7.50€',
      names: { de: 'Thomas Rath Riesling (0.2L)', en: 'Thomas Rath Riesling (0.2L)', ru: 'Thomas Rath Рислинг (0.2л)', uz: 'Thomas Rath Riesling (0.2L)' },
      descs: {
        de: 'Trocken, Aromen nach Apfel und Pfirsichen, frische Säure',
        en: 'Dry, apple and peach aromas, fresh acidity',
        ru: 'Сухое, ароматы яблок и персиков, свежая кислотность',
        uz: 'Quruq, olma va shaftoli aromati, yangi kislotalik'
      }
    },
    {
      id: 'thomasrathgrauburgunder',
      image: null,
      price: '7.50€',
      names: { de: 'Thomas Rath Grauburgunder (0.2L)', en: 'Thomas Rath Pinot Gris (0.2L)', ru: 'Thomas Rath Граубургундер (0.2л)', uz: 'Thomas Rath Grauburgunder (0.2L)' },
      descs: {
        de: 'Trocken, nach Pfirsich und Zitrusfrüchten, weich',
        en: 'Dry, peach and citrus, soft',
        ru: 'Сухое, персик и цитрусовые, мягкое',
        uz: 'Quruq, shaftoli va sitrus, yumshoq'
      }
    },
    {
      id: 'thomasrathoppenheimer',
      image: null,
      price: '7.50€',
      names: { de: 'Thomas Rath Oppenheimer Krötenbrunnen (0.2L)', en: 'Thomas Rath Oppenheimer Krötenbrunnen (0.2L)', ru: 'Thomas Rath Опенхаймер Кретенбруннен (0.2л)', uz: 'Thomas Rath Oppenheimer Krötenbrunnen (0.2L)' },
      descs: {
        de: 'Lieblich, fruchtig nach Mirabellen',
        en: 'Sweet, fruity with mirabelle plums',
        ru: 'Сладкое, фруктовое с мирабелью',
        uz: 'Shirin, mevali mirabelle olxo‘ri bilan'
      }
    },
    {
      id: 'caernestorosato',
      image: null,
      price: '7.50€',
      names: { de: 'CA Ernesto Rosato (0.2L)', en: 'CA Ernesto Rosato (0.2L)', ru: 'CA Ernesto Розато (0.2л)', uz: 'CA Ernesto Rosato (0.2L)' },
      descs: {
        de: 'Trocken, frisch, nach roten Beeren',
        en: 'Dry, fresh, red berries',
        ru: 'Сухое, свежее, красные ягоды',
        uz: 'Quruq, yangi, qizil rezavorlar'
      }
    },
    {
      id: 'achkarrengrauburgunder',
      image: null,
      price: '27.90€',
      names: { de: 'Achkarren Grauburgunder (0.75L)', en: 'Achkarren Pinot Gris (0.75L)', ru: 'Achkarren Граубургундер (0.75л)', uz: 'Achkarren Grauburgunder (0.75L)' },
      descs: {
        de: 'Trocken, vollmundig nach frischen Äpfeln',
        en: 'Dry, full-bodied with fresh apples',
        ru: 'Сухое, полнотелое со свежими яблоками',
        uz: 'Quruq, to‘liq, yangi olma aromati bilan'
      }
    },
    {
      id: 'marquesderiscalwhite',
      image: null,
      price: '57.90€',
      names: { de: 'Marques de Riscal (0.75L)', en: 'Marques de Riscal (0.75L)', ru: 'Marques de Riscal (0.75л)', uz: 'Marques de Riscal (0.75L)' },
      descs: {
        de: 'Der Riscal Blanco ist ein frischer fruchtiger Wein, betont trocken am Gaumen und mit rassiger Säure ausgestattet.',
        en: 'The Riscal Blanco is a fresh fruity wine, distinctly dry on the palate and equipped with racy acidity.',
        ru: 'Riscal Blanco - свежее фруктовое вино, ярко выраженное сухое на вкус и с живой кислотностью.',
        uz: 'Riscal Blanco — yangi mevali vino, og‘izda aniq quruq va jonli kislotalikka ega.'
      }
    },
  ],
  spirits: [
    {
      id: 'vodkaabsolut',
      image: null,
      price: '3.90€ / 20.00€ / 45.00€',
      names: { de: 'Absolut Russischer Vodka (0.2cl / 0.2L / 0.5L)', en: 'Absolut Russian Vodka (0.2cl / 0.2L / 0.5L)', ru: 'Absolut Русская Водка (0.2cl / 0.2л / 0.5л)', uz: 'Absolut rus aroqi (0.2cl / 0.2L / 0.5L)' },
      descs: {
        de: 'Premium Vodka',
        en: 'Premium vodka',
        ru: 'Премиум водка',
        uz: 'Premium aroq'
      }
    },
    {
      id: 'vodkastandart',
      image: null,
      price: '3.90€ / 20.00€ / 45.00€',
      names: { de: 'Standart Vodka (0.2cl / 0.2L / 0.5L)', en: 'Standard Vodka (0.2cl / 0.2L / 0.5L)', ru: 'Стандарт Водка (0.2cl / 0.2л / 0.5л)', uz: 'Standart aroq (0.2cl / 0.2L / 0.5L)' },
      descs: {
        de: 'Standard Vodka',
        en: 'Standard vodka',
        ru: 'Стандартная водка',
        uz: 'Standart aroq'
      }
    },
    {
      id: 'vodkaflasche',
      image: null,
      price: '65.00€',
      names: { de: 'Vodka Flasche (0.75L)', en: 'Vodka Bottle (0.75L)', ru: 'Бутылка водки (0.75л)', uz: 'Aroq shishasi (0.75L)' },
      descs: {
        de: 'Vodka Flasche',
        en: 'Vodka bottle',
        ru: 'Бутылка водки',
        uz: 'Aroq shishasi'
      }
    },
    {
      id: 'hennessy',
      image: null,
      price: '8.90€',
      names: { de: 'Hennessy (0.2cl)', en: 'Hennessy (0.2cl)', ru: 'Hennessy (0.2cl)', uz: 'Hennessy (0.2cl)' },
      descs: {
        de: 'Cognac',
        en: 'Cognac',
        ru: 'Коньяк',
        uz: 'Konyak'
      }
    },
    {
      id: 'chivasregal',
      image: null,
      price: '8.90€',
      names: { de: 'Chivas Regal (0.2cl)', en: 'Chivas Regal (0.2cl)', ru: 'Chivas Regal (0.2cl)', uz: 'Chivas Regal (0.2cl)' },
      descs: {
        de: 'Scotch Whisky',
        en: 'Scotch whisky',
        ru: 'Скотч виски',
        uz: 'Shotland viskisi'
      }
    },
    {
      id: 'jackdaniels',
      image: null,
      price: '8.90€',
      names: { de: 'Jack Daniel\'s (0.2cl)', en: 'Jack Daniel\'s (0.2cl)', ru: 'Jack Daniel\'s (0.2cl)', uz: 'Jack Daniel\'s (0.2cl)' },
      descs: {
        de: 'Tennessee Whiskey',
        en: 'Tennessee whiskey',
        ru: 'Теннесси виски',
        uz: 'Tennessi viskisi'
      }
    },
    {
      id: 'ramazzotti',
      image: null,
      price: '8.90€',
      names: { de: 'Ramazzotti Amaro (0.2cl)', en: 'Ramazzotti Amaro (0.2cl)', ru: 'Ramazzotti Amaro (0.2cl)', uz: 'Ramazzotti Amaro (0.2cl)' },
      descs: {
        de: 'Italienischer Kräuterlikör',
        en: 'Italian herbal liqueur',
        ru: 'Итальянский травяной ликер',
        uz: 'Italiya o‘tli likyori'
      }
    },
    {
      id: 'jagermeister',
      image: null,
      price: '8.90€',
      names: { de: 'Jägermeister (0.2cl)', en: 'Jägermeister (0.2cl)', ru: 'Jägermeister (0.2cl)', uz: 'Jägermeister (0.2cl)' },
      descs: {
        de: 'Kräuterlikör',
        en: 'Herbal liqueur',
        ru: 'Травяной ликер',
        uz: 'O‘tli likyor'
      }
    },
    {
      id: 'glasssekt',
      image: null,
      price: '5.90€',
      names: { de: 'Glass Sekt / Prosecco (0.2L)', en: 'Glass Sparkling Wine / Prosecco (0.2L)', ru: 'Бокал игристого / Просекко (0.2л)', uz: 'Bokal ko‘pikli vino / Prosecco (0.2L)' },
      descs: {
        de: 'Sekt oder Prosecco',
        en: 'Sparkling wine or Prosecco',
        ru: 'Игристое вино или Просекко',
        uz: 'Ko‘pikli vino yoki Prosecco'
      }
    },
    {
      id: 'flaschesekt',
      image: null,
      price: '21.90€',
      names: { de: 'Flasche Sekt (0.75L) / Trocken', en: 'Bottle Sparkling Wine (0.75L) / Dry', ru: 'Бутылка игристого (0.75л) / Сухое', uz: 'Ko‘pikli vino shishasi (0.75L) / quruq' },
      descs: {
        de: 'Flasche Sekt, trocken',
        en: 'Bottle sparkling wine, dry',
        ru: 'Бутылка игристого, сухое',
        uz: 'Ko‘pikli vino shishasi, quruq'
      }
    },
  ]
};

export default function MenuPage() {
  const { lang, setLang, getLocalizedPath } = useLanguage();
  const [, setLocation] = useLocation();
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<{ src: string; name: string } | null>(null);
  const { musicPlaying, toggleMusic } = useMusic();
  const t = translations[lang];
  const cats = menuCategories[lang];
  const currentYear = new Date().getFullYear();

  // SEO meta tags for menu page
  const seoTitles: Record<Language, string> = {
    de: "Speisekarte - CARAVAN Restaurant Frankfurt | Usbekische Gerichte & Preise",
    en: "Menu - CARAVAN Restaurant Frankfurt | Uzbek Dishes & Prices",
    ru: "Меню - Ресторан CARAVAN Франкфурт | Узбекские блюда и цены",
    uz: "Menyu - CARAVAN Restoran Frankfurt | O'zbek taomlari va narxlar"
  };

  const seoDescriptions: Record<Language, string> = {
    de: "Entdecken Sie unsere Speisekarte mit authentischen usbekischen Spezialitäten: Plov ab 17.90€, Manty 23.90€, Samsa, Schaschlik und mehr. Halal-Küche in Frankfurt Bornheim.",
    en: "Discover our menu with authentic Uzbek specialties: Plov from €17.90, Manty €23.90, Samsa, Shashlik and more. Halal cuisine in Frankfurt Bornheim.",
    ru: "Откройте для себя наше меню с аутентичными узбекскими блюдами: Плов от 17.90€, Манты 23.90€, Самса, Шашлык и многое другое. Халяль кухня во Франкфурте Борнхайм.",
    uz: "Bizning menyumizni kashf eting: O'zbek osh 17.90€ dan, manti 23.90€, somsa, shashlik va boshqalar. Frankfurt Bornheimdagi halol oshxona."
  };

  // Dynamic canonical URL based on language path
  const getCanonicalUrl = () => {
    const localPath = getLocalizedPath('/menu/');
    return `https://caravan-restaurant.de${localPath}`;
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
              {lang === 'de' ? 'Zurück' : lang === 'ru' ? 'Назад' : lang === 'en' ? 'Back' : lang === 'uz' ? 'Ortga' : 'Back'}
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
                    {(["de", "en", "uz", "ru"] as Language[]).map((l) => (
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
                  {lang === 'de' ? 'Über uns' : lang === 'ru' ? 'О нас' : lang === 'uz' ? 'Biz haqida' : 'About Us'}
                </button>
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
        <MenuSection title={cats.soups} items={fullMenu.soups} lang={lang} getDishInfo={getDishInfo} setLightboxImage={setLightboxImage} />

        {/* Appetizers */}
        <MenuSection title={cats.appetizers} items={fullMenu.appetizers} lang={lang} getDishInfo={getDishInfo} setLightboxImage={setLightboxImage} />

        {/* Main Dishes */}
        <MenuSection title={cats.mains} items={fullMenu.mains} lang={lang} getDishInfo={getDishInfo} setLightboxImage={setLightboxImage} />

        {/* Grills */}
        <MenuSection title={cats.grills} items={fullMenu.grills} lang={lang} getDishInfo={getDishInfo} setLightboxImage={setLightboxImage} />

        {/* Desserts */}
        <MenuSection title={cats.desserts} items={fullMenu.desserts} lang={lang} getDishInfo={getDishInfo} setLightboxImage={setLightboxImage} />

        {/* Sides */}
        <MenuSection title={cats.sides} items={fullMenu.sides} lang={lang} getDishInfo={getDishInfo} setLightboxImage={setLightboxImage} />

        {/* Hot Drinks */}
        <MenuSection title={cats.drinks} items={fullMenu.drinks} lang={lang} getDishInfo={getDishInfo} setLightboxImage={setLightboxImage} hidePlaceholder={true} />

        {/* Cold Drinks */}
        <MenuSection title={cats.colddrinks} items={fullMenu.colddrinks} lang={lang} getDishInfo={getDishInfo} setLightboxImage={setLightboxImage} hidePlaceholder={true} hideDetails={true} />

        {/* Beer */}
        <MenuSection title={cats.beer} items={fullMenu.beer} lang={lang} getDishInfo={getDishInfo} setLightboxImage={setLightboxImage} hidePlaceholder={true} />

        {/* Wine */}
        <MenuSection title={cats.wine} items={fullMenu.wine} lang={lang} getDishInfo={getDishInfo} setLightboxImage={setLightboxImage} hidePlaceholder={true} />

        {/* Spirits */}
        <MenuSection title={cats.spirits} items={fullMenu.spirits} lang={lang} getDishInfo={getDishInfo} setLightboxImage={setLightboxImage} hidePlaceholder={true} />

        {/* Footer Note */}
        <div className="mt-12 md:mt-20 text-center bg-card/90 backdrop-blur-sm p-4 md:p-8 rounded-sm border border-border/50">
          <div className="flex items-center justify-center gap-2 md:gap-4 mb-3 md:mb-4">
            <div className="h-[1px] w-8 md:w-12 bg-gradient-to-r from-transparent to-primary"></div>
            <span className="text-xl md:text-2xl text-primary">✦</span>
            <div className="h-[1px] w-8 md:w-12 bg-gradient-to-l from-transparent to-primary"></div>
          </div>
          <p className="text-muted-foreground text-xs md:text-sm leading-relaxed max-w-2xl mx-auto px-2">
            {lang === 'de' && 'Alle Preise inkl. MwSt. • Allergene und Zusatzstoffe auf Anfrage • Alle Gerichte sind Halal'}
            {lang === 'en' && 'All prices include VAT • Allergen information available on request • All dishes are Halal'}
            {lang === 'ru' && 'Все цены включают НДС • Информация об аллергенах по запросу • Все блюда халяльные'}
            {lang === 'uz' && 'Barcha narxlar QQS bilan • Allergenlar bo‘yicha ma’lumot so‘rovga binoan • Barcha taomlar halol'}
          </p>
          <div className="mt-4 md:mt-6 text-center">
            <p className="text-xs text-muted-foreground/70">
              {lang === 'de' && (
                <>
                  Reservierung empfohlen •{" "}
                  <a href="tel:+496995909158" className="hover:text-primary transition-colors">
                    069 95909158
                  </a>
                </>
              )}
              {lang === 'en' && (
                <>
                  Reservation recommended •{" "}
                  <a href="tel:+496995909158" className="hover:text-primary transition-colors">
                    069 95909158
                  </a>
                </>
              )}
              {lang === 'ru' && (
                <>
                  Рекомендуется бронирование •{" "}
                  <a href="tel:+496995909158" className="hover:text-primary transition-colors">
                    069 95909158
                  </a>
                </>
              )}
              {lang === 'uz' && (
                <>
                  Bron qilish tavsiya etiladi •{" "}
                  <a href="tel:+496995909158" className="hover:text-primary transition-colors">
                    069 95909158
                  </a>
                </>
              )}
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
          <p className="font-heading text-2xl md:text-3xl tracking-[0.2em] md:tracking-[0.3em] mb-2 text-white">CARAVAN</p>
          <p className="text-white/80 text-sm md:text-base mb-1">Wöllstädter Str. 11, 60385 Frankfurt am Main</p>
          <p className="text-white/60 text-xs md:text-sm mb-3 md:mb-4">Bornheim • Frankfurt</p>
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
    </div>
  );
}

function MenuSection({ title, items, lang, getDishInfo, setLightboxImage, hidePlaceholder, hideDetails }: { title: string, items: any[], lang: Language, getDishInfo: (d: any) => { name: string, desc: string }, setLightboxImage: (image: { src: string; name: string } | null) => void, hidePlaceholder?: boolean, hideDetails?: boolean }) {
  // Check if this section has signature dishes (mains)
  const isMainSection = items.length > 0 && items[0].id === 'plov';
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
            const isSignature = isMainSection && (item.id === 'plov' || item.id === 'shashlik');

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
                      className="w-20 h-20 md:w-32 md:h-32 rounded-sm overflow-hidden flex-shrink-0 bg-muted shadow-md relative cursor-zoom-in hover:ring-2 hover:ring-primary transition-all group/image"
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
                      {isSignature && (
                        <div className="absolute top-1 right-1 md:top-2 md:right-2 bg-secondary text-secondary-foreground text-xs font-bold px-1.5 md:px-2 py-0.5 md:py-1 rounded-sm shadow-lg">
                          ★
                        </div>
                      )}
                    </div>
                  ) : !hidePlaceholder ? (
                    <div className="w-20 h-20 md:w-32 md:h-32 rounded-sm flex-shrink-0 bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center border border-border">
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
                            {isSignature && <span className="text-secondary ml-1 text-sm">★</span>}
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
                          {isSignature && <span className="text-secondary ml-2 text-sm">★</span>}
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
                              <span>✓</span> {lang === 'de' ? 'Halal' : lang === 'ru' ? 'Халяль' : lang === 'uz' ? 'Halol' : 'Halal'}
                            </span>
                          )}
                          {item.dietary === 'vegetarian' && (
                            <span className="inline-flex items-center gap-1 text-xs bg-green-500/10 text-green-600 px-2 py-1 rounded-full">
                              <span>🌱</span> {lang === 'de' ? 'Vegetarisch' : lang === 'ru' ? 'Вегетарианское' : lang === 'uz' ? 'Vegetarian' : 'Vegetarian'}
                            </span>
                          )}
                          {item.dietary === 'vegan' && (
                            <span className="inline-flex items-center gap-1 text-xs bg-green-600/10 text-green-700 px-2 py-1 rounded-full">
                              <span>🌿</span> {lang === 'de' ? 'Vegan' : lang === 'ru' ? 'Веганское' : lang === 'uz' ? 'Vegan' : 'Vegan'}
                            </span>
                          )}
                        </div>
                      </>
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

      {/* Signature Note */}
      {isMainSection && (
        <div className="mt-3 md:mt-4 text-center">
          <p className="text-xs md:text-sm text-muted-foreground font-bold italic">
            <span className="text-secondary text-xl">★</span> {lang === 'de' ? 'Empfehlung des Hauses' : lang === 'ru' ? 'Фирменное блюдо' : lang === 'uz' ? 'Oshpaz tavsiyasi' : "Chef's Signature"}
          </p>
        </div>
      )}
    </motion.section>
  );
}

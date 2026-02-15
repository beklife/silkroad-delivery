export type Language = 'de' | 'en' | 'ru' | 'uz';

export const translations = {
  de: {
    nav: {
      about: "Über uns",
      menu: "Speisekarte",
      location: "Kontakt",
      contact: "Kontakt",
      reserve: "Reservierungsanfrage"
    },
    hero: {
      title: "CARAVAN – erste Usbekische Küche in Deutschland.",
      subtitle: "Authentische usbekische Küche, warme Gastfreundschaft und lebendige Teekultur in Frankfurt am Main.",
      cta_reserve: "Tisch anfragen",
      cta_menu: "Highlights ansehen"
    },
    about: {
      title: "Unsere Geschichte",
      content: "Willkommen im CARAVAN. Wir bringen die reichen Aromen und die herzliche Gastfreundschaft der Seidenstraße nach Frankfurt. Unsere Küche zelebriert die kulinarischen Traditionen Zentralasiens. Bei uns ist Essen mehr als nur Nahrung; es ist ein gemeinschaftliches Erlebnis, geteilt mit Freunden und Familie in einer Atmosphäre, die sich wie zu Hause anfühlt."
    },
    menu: {
      journey: "REISE MIT CARAVAN",
      title: "Kulinarische Highlights",
      subtitle: "Eine Auswahl unserer beliebtesten Gerichte. Das Angebot kann saisonal variieren.",
      dishes: {
        schorpa: { name: "Schorpa", desc: "Usbekische Nationalsuppe mit zartem Fleisch, Kartoffeln, Karotten, Paprika, Zwiebeln und frischen Kräutern." },
        borsch: { name: "Borsch", desc: "Gemüsesuppe und Rindfleisch mit rote Bete nach altrussische Art." },
        chuchvara: { name: "Chuchvara", desc: "Gefüllte Teigtaschensuppe (Pelmeny) mit Kalbfleisch, Gemüse und Zwiebeln, verfeinert mit Koriander." },
        mastava: { name: "Mastava", desc: "Reissuppe mit Kalbfleisch, Gemüse und Zwiebeln und abgeschmeckt mit orientalischen Gewürzen." },
        somsa: { name: "Somsa (2 St.)", desc: "Knuspriges Gebäck mit Kalbfleisch, verfeinert mit traditionell usbekischen Gewürzen." },
        tschebureki: { name: "Tschebureki (2 St.)", desc: "Knusprige Krapfen mit Hackfleischfüllung (Rind)." },
        karottensalat: { name: "Karottensalat", desc: "Exotischer Karottensalat nach usbekischer Art hauchdünn geraspelt, mit frischem Knoblauch." },
        atschuchuksalat: { name: "Atschuchuksalat", desc: "Ein frischer Gemüsesalat mit saftigen Tomaten, Zwiebeln und wahlweise Pfeffer." },
        kazankebab: { name: "Kazan Kebab", desc: "Gebratenes Lammfleisch und Kartoffeln mit orientalischen Gewürzen, köstlich zubereitet im traditionellen gusseisernen Kochtopf 'Kazan'. Frischer Gemüsesalat dazu." },
        kazankebabhaehnchen: { name: "Kazan Kebab Hähnchen", desc: "Gebratenes Hühnerfleisch und Kartoffeln mit orientalischen Gewürzen, köstlich zubereitet im traditionellen gusseisernen Kochtopf 'Kazan'. Frischer Gemüsesalat dazu." },
        plov: { name: "Plov", desc: "Erlesener Reis, Lammfleisch und Karotten fein gewürzt nach alter usbekischer Art. Frischer Gemüsesalat dazu." },
        pelmeni: { name: "Pelmeni", desc: "Kleine gefüllte Teigtaschen mit Fleischfüllung nach altrussische Art. Servieren mit schmand und frische Salat." },
        manty: { name: "Manty", desc: "Gedämpfte Teigtaschen mit Kalbfleisch nach Usbekische Art. Frische Gemüsesalat dazu." },
        honimvegetariach: { name: "Honim Vegetarisch", desc: "Gedämpfte hauchdünne Teigrolade mit Füllung aus Zucchini, Karotten, Kartoffel und Zwiebel. Frische Gemüsesalat dazu." },
        warenikiwegetarisch: { name: "Wareniki Vegetarisch", desc: "Kleine Maultaschen Mit Kartoffelfüllung. Frische Gemüsesalat dazu." },
        schaschlikvomlamm: { name: "Schaschlik vom Lamm", desc: "Saftige Lammfleischstückchen mit Tomaten-Yoghurt-Knoblauch-Sauce und frischem Gemüsesalat." },
        schaschlikvomhaehnchen: { name: "Schaschlik vom Hähnchen", desc: "Saftige Hähnchenfleischstückchen mit Tomaten-Yoghurt-Knoblauch-Sauce und frischem Gemüsesalat." },
        caravandessert: { name: "Caravan Dessert", desc: "Gebackene Apetithäppchen aus Blätterteig mit Halwa und Äpfeln. Vanillesauce dazu." },
        honigmedovikkuchen: { name: "Honig Medovik Kuchen", desc: "Honig Medovik Kuchen in zwei Sorten: Nuss / Schokolade" },
        honigmedovikschokolade: { name: "Honig Medovik Schokolade", desc: "Honig Medovik Torte in der Schokoladen-Variante." },
        kannetee06jasmin: { name: "Kanne Jasmin Tee", desc: "Aromatischer Jasmin-Tee, traditionell serviert in einer Teekanne." }
      }
    },
    hours: {
      title: "Öffnungszeiten",
      open: "Dienstag-Sonntag",
      openTime: "17:00 - 23:00",
      kitchen: "Küche geöffnet bis",
      kitchenTime: "22:00 Uhr",
      weekdays: "Dienstag – Freitag",
      weekend: "Samstag – Sonntag",
      monday: "Montag",
      closed: "Geschlossen",
      note: "An Feiertagen können die Zeiten abweichen. Bitte rufen Sie an."
    },
    location: {
      title: "Standort",
      address: "Wöllstädter Str. 11, 60385 Frankfurt am Main",
      district: "Bornheim / Frankfurt am Main",
      get_directions: "Route planen",
      call_us: "Anrufen"
    },
    gallery: {
      title: "Einblicke"
    },
    contact: {
      title: "Reservierungsanfrage & Kontakt",
      form: {
        name: "Ihr Name",
        email: "E-Mail",
        phone: "Telefonnummer",
        guests: "Anzahl der Personen",
        date: "Datum",
        time: "Uhrzeit",
        message: "Nachricht (Optional)",
        submit: "Anfrage senden",
        success: "Ihre Reservierungsanfrage wurde erfolgreich übermittelt.\nWir prüfen die Verfügbarkeit und melden uns in Kürze bei Ihnen.",
        error: "Es gab ein Problem beim Senden. Bitte versuchen Sie es erneut."
      },
      fallback: "Funktioniert das Formular nicht? Schreiben Sie uns:",
      catering: "Catering auf Anfrage verfügbar."
    },
    footer: {
      impressum: "Impressum",
      privacy: "Datenschutz",
      rights: "Alle Rechte vorbehalten."
    }
  },
  en: {
    nav: {
      about: "About",
      menu: "Menu",
      location: "Location",
      contact: "Contact",
      reserve: "Reservation Request"
    },
    hero: {
      title: "CARAVAN – first Uzbek cuisine in Germany.",
      subtitle: "Authentic Uzbek flavors, warm hospitality, and vibrant tea culture in Frankfurt am Main.",
      notice: "This is the official CARAVAN website. We are still building it, so photos and texts are examples. Real photos are coming soon. You can still reserve a table or contact us.",
      cta_reserve: "Book a Table",
      cta_menu: "View Highlights"
    },
    about: {
      title: "Our Story",
      content: "Welcome to CARAVAN. We bring the rich flavors and warm hospitality of the ancient Silk Road to Frankfurt. Our kitchen celebrates the culinary traditions of Central Asia. Here, dining is more than just food; it is a communal experience shared with friends and family in an atmosphere that feels like home."
    },
    menu: {
      journey: "JOURNEY WITH CARAVAN",
      title: "Menu Highlights",
      subtitle: "A selection of our favorites. Offerings may vary seasonally.",
      dishes: {
        schorpa: { name: "Schorpa", desc: "Uzbek national soup with tender meat, potatoes, carrots, bell peppers, onions, and fresh herbs." },
        borsch: { name: "Borsch", desc: "Vegetable and beef soup with beetroot in traditional old Russian style." },
        chuchvara: { name: "Chuchvara", desc: "Dumpling soup (Pelmeny) filled with veal, vegetables, and onions, refined with coriander." },
        mastava: { name: "Mastava", desc: "Rice soup with veal, vegetables, and onions, seasoned with oriental spices." },
        somsa: { name: "Somsa (2 pcs.)", desc: "Crispy patty filled with minced meat (beef), onions and Uzbek spices." },
        tschebureki: { name: "Tschebureki (2 pcs.)", desc: "Crispy fried pie with minced meat filling (beef) - The most famous 'street food' in Uzbekistan!" },
        karottensalat: { name: "Carrot Salad", desc: "Traditional spicy salad made of fresh carrots and garlic." },
        atschuchuksalat: { name: "Atschuchuk Salad", desc: "A fresh vegetable salad with juicy tomatoes, onions, and optional peppers." },
        kazankebab: { name: "Kazan Kebab", desc: "Mouth-watering fried lamb pieces served with potatoes and a fresh vegetable salad." },
        kazankebabhaehnchen: { name: "Kazan Kebab Chicken", desc: "Mouth-watering fried chicken pieces served with potatoes and a fresh vegetable salad." },
        plov: { name: "Plov", desc: "The main national Uzbek specialty made of rice, carrots, lamb, with a fine mix of spices." },
        pelmeni: { name: "Pelmeni", desc: "Small filled dumplings with meat filling in the old Russian style. Served with a fresh vegetable salad." },
        manty: { name: "Manty", desc: "Steamed dumplings with veal prepared in Uzbek style. Served with a fresh vegetable salad." },
        honimvegetariach: { name: "Honim Vegetarian", desc: "Steamed, paper-thin dough roll filled with zucchini, carrots, potatoes, and onions. Served with a fresh vegetable salad." },
        warenikiwegetarisch: { name: "Wareniki Vegetarian", desc: "Little dumpling filled with potatoes. Served with a fresh vegetable salad." },
        schaschlikvomlamm: { name: "Shashlik from Lamb", desc: "Tenderly marinated lamb filets, served with a fresh vegetable salad, tomato sauce and a side dish of your choice." },
        schaschlikvomhaehnchen: { name: "Shashlik from Chicken", desc: "Tenderly marinated chicken filets, served with a fresh vegetable salad, tomato sauce and a side dish of your choice." },
        caravandessert: { name: "Caravan Dessert", desc: "Puff pastry filled with Halva and Apples, served with a vanilla sauce." },
        honigmedovikkuchen: { name: "Honey Medovik Cake", desc: "Honey Medovik Cake in two varieties: Nut / Chocolate" },
        honigmedovikschokolade: { name: "Honey Medovik Chocolate", desc: "Honey Medovik cake in the chocolate variety." },
        kannetee06jasmin: { name: "Pot of Jasmine Tea", desc: "Aromatic jasmine tea, traditionally served in a teapot." }
      }
    },
    hours: {
      title: "Opening Hours",
      open: "Tuesday-Sunday",
      openTime: "17:00 - 23:00",
      kitchen: "Kitchen open until",
      kitchenTime: "22:00",
      weekdays: "Tuesday – Friday",
      weekend: "Saturday – Sunday",
      monday: "Monday",
      closed: "Closed",
      note: "Hours may vary on holidays. Call to confirm."
    },
    location: {
      title: "Location",
      address: "Wöllstädter Str. 11, 60385 Frankfurt am Main",
      district: "Bornheim / Frankfurt am Main",
      get_directions: "Get Directions",
      call_us: "Call Us"
    },
    gallery: {
      title: "Gallery"
    },
    contact: {
      title: "Reservation Request & Contact",
      form: {
        name: "Your Name",
        email: "Email",
        phone: "Phone Number",
        guests: "Number of Guests",
        date: "Date",
        time: "Time",
        message: "Message (Optional)",
        submit: "Send Request",
        success: "Your reservation request has been sent successfully! We'll be in touch soon.",
        error: "There was a problem sending your request. Please try again."
      },
      fallback: "Form not working? Email us at:",
      catering: "Catering available upon request."
    },
    footer: {
      impressum: "Imprint",
      privacy: "Privacy Policy",
      rights: "All rights reserved."
    }
  },
  ru: {
    nav: {
      about: "О нас",
      menu: "Меню",
      location: "Локация",
      contact: "Контакты",
      reserve: "Запрос на бронирование"
    },
    hero: {
      title: "CARAVAN — первая узбекская кухня в Германии.",
      subtitle: "Аутентичные узбекские вкусы, теплое гостеприимство и культура чаепития во Франкфурте-на-Майне.",
      notice: "Это официальный сайт CARAVAN. Мы еще дорабатываем сайт, поэтому фото и тексты пока примерные. Настоящие фото скоро будут. Вы уже можете бронировать столик или связаться с нами.",
      cta_reserve: "Забронировать стол",
      cta_menu: "Смотреть меню"
    },
    about: {
      title: "Наша история",
      content: "Добро пожаловать в CARAVAN. Мы привезли во Франкфурт богатые вкусы и теплое гостеприимство Шелкового пути. Наша кухня прославляет кулинарные традиции Центральной Азии. Еда для нас — это не просто пища, а повод собраться с друзьями и семьей в атмосфере домашнего уюта."
    },
    menu: {
      journey: "ПУТЕШЕСТВИЕ С CARAVAN",
      title: "Хиты меню",
      subtitle: "Избранные блюда. Меню может меняться в зависимости от сезона.",
      dishes: {
        schorpa: { name: "Шурпа", desc: "Узбекский национальный суп с нежным мясом, картофелем, морковью, перцем, луком и свежей зеленью." },
        borsch: { name: "Борщ", desc: "Овощной суп с говядиной и свеклой по старорусскому рецепту." },
        chuchvara: { name: "Чучвара", desc: "Суп с пельменями из телятины, овощей и лука, приправленный кориандром." },
        mastava: { name: "Мастава", desc: "Рисовый суп с телятиной, овощами и луком, приправленный восточными специями." },
        somsa: { name: "Сомса (2 шт.)", desc: "Хрустящая выпечка с телятиной, приправленная традиционными узбекскими специями." },
        tschebureki: { name: "Чебуреки (2 шт.)", desc: "Хрустящие пирожки с мясным фаршем (говядина)." },
        karottensalat: { name: "Морковный салат", desc: "Экзотический морковный салат по-узбекски, тонко нарезанный, со свежим чесноком." },
        atschuchuksalat: { name: "Салат Ачучук", desc: "Свежий овощной салат с сочными помидорами, луком и перцем по желанию." },
        kazankebab: { name: "Казан Кебаб", desc: "Жареная баранина с картофелем и восточными специями, приготовленная в традиционном чугунном казане. Свежий овощной салат." },
        kazankebabhaehnchen: { name: "Казан Кебаб из курицы", desc: "Жареная курица с картофелем и восточными специями, приготовленная в традиционном чугунном казане. Свежий овощной салат." },
        plov: { name: "Плов", desc: "Изысканный рис, баранина и морковь, приправленные по старинному узбекскому рецепту. Свежий овощной салат." },
        pelmeni: { name: "Пельмени", desc: "Маленькие пельмени с мясной начинкой по старорусскому рецепту. Подаются со сметаной и свежим салатом." },
        manty: { name: "Манты", desc: "Паровые манты с телятиной по-узбекски. Свежий овощной салат." },
        honimvegetariach: { name: "Хоним вегетарианский", desc: "Паровые тонкие рулеты из теста с начинкой из кабачков, моркови, картофеля и лука. Свежий овощной салат." },
        warenikiwegetarisch: { name: "Вареники вегетарианские", desc: "Маленькие вареники с картофельной начинкой. Свежий овощной салат." },
        schaschlikvomlamm: { name: "Шашлык из баранины", desc: "Сочные кусочки баранины с томатно-йогуртовым соусом с чесноком и свежим овощным салатом." },
        schaschlikvomhaehnchen: { name: "Шашлык из курицы", desc: "Сочные кусочки курицы с томатно-йогуртовым соусом с чесноком и свежим овощным салатом." },
        caravandessert: { name: "Десерт Караван", desc: "Печеные аппетитные кусочки слоеного теста с халвой и яблоками. Ванильный соус." },
        honigmedovikkuchen: { name: "Медовый торт Медовик", desc: "Медовый торт Медовик в двух вариантах: Ореховый / Шоколадный" },
        honigmedovikschokolade: { name: "Медовик Шоколадный", desc: "Медовый торт Медовик в шоколадном исполнении." },
        kannetee06jasmin: { name: "Чайник жасминового чая", desc: "Ароматный жасминовый чай, традиционно подается в чайнике." }
      }
    },
    hours: {
      title: "Часы работы",
      open: "Вторник-Воскресенье",
      openTime: "17:00 - 23:00",
      kitchen: "Кухня открыта до",
      kitchenTime: "22:00",
      weekdays: "Вторник – Пятница",
      weekend: "Суббота – Воскресенье",
      monday: "Понедельник",
      closed: "Закрыто",
      note: "В праздничные дни часы могут меняться. Позвоните для уточнения."
    },
    location: {
      title: "Как нас найти",
      address: "Wöllstädter Str. 11, 60385 Франкфурт-на-Майне",
      district: "Хеддернхайм / Франкфурт-на-Майне",
      get_directions: "Проложить маршрут",
      call_us: "Позвонить"
    },
    gallery: {
      title: "Галерея"
    },
    contact: {
      title: "Запрос на бронирование и Контакты",
      form: {
        name: "Ваше Имя",
        email: "Email",
        phone: "Телефон",
        guests: "Количество гостей",
        date: "Дата",
        time: "Время",
        message: "Сообщение (необязательно)",
        submit: "Отправить запрос",
        success: "Ваш запрос на бронирование успешно отправлен! Скоро свяжемся с вами.",
        error: "Возникла проблема при отправке. Пожалуйста, попробуйте снова."
      },
      fallback: "Не получается отправить? Напишите нам:",
      catering: "Кейтеринг доступен по запросу."
    },
    footer: {
      impressum: "Импрессум",
      privacy: "Конфиденциальность",
      rights: "Все права защищены."
    }
  },
  uz: {
    nav: {
      about: "Biz haqimizda",
      menu: "Menyu",
      location: "Manzil",
      contact: "Aloqa",
      reserve: "Bron so‘rovi"
    },
    hero: {
      title: "CARAVAN – Germaniyadagi birinchi o‘zbek oshxonasi.",
      subtitle: "Frankfurt am Main shahrida asl o‘zbek ta’mlari, samimiy mehmondo‘stlik va choy madaniyati.",
      notice: "Bu CARAVANning rasmiy veb-sayti. Hozir saytni yakunlayapmiz, shuning uchun foto va matnlar hozircha namunadir. Haqiqiy suratlar tez orada bo‘ladi. Baribir stol bron qilishingiz yoki biz bilan bog‘lanishingiz mumkin.",
      cta_reserve: "Stol bron qilish",
      cta_menu: "Menyu ko‘rish"
    },
    about: {
      title: "Bizning tariximiz",
      content: "CARAVAN restoraniga xush kelibsiz. Biz Frankfurt shahriga Ipak yo‘lining boy ta’mlari va samimiy mehmondo‘stligini olib keldik. Oshxonamiz Markaziy Osiyoning oshpazlik an’analarini nishonlaydi. Bizda ovqatlanish shunchaki ovqat emas; bu do‘stlar va oila bilan uyga o‘xshagan muhitda baham ko‘riladigan jamoaviy tajribadir."
    },
    menu: {
      journey: "CARAVAN BILAN SAYOHAT",
      title: "Oshxonamizdagi diqqatga sazovor taomlar",
      subtitle: "Bizning eng mashhur taomlarimizdan tanlov. Taomlar mavsumga qarab o‘zgarishi mumkin.",
      dishes: {
        schorpa: { name: "Shurpa", desc: "O‘zbek milliy sho‘rvasi yumshoq go‘sht, kartoshka, sabzi, qalampir, piyoz va yangi ko‘katlar bilan." },
        borsch: { name: "Borsh", desc: "Sabzavot va mol go‘shti sho‘rvasi lavlagi bilan eski rus uslubida." },
        chuchvara: { name: "Chuchvara", desc: "Dana go‘shti, sabzavot va piyoz bilan to‘ldirilgan pelmenli sho‘rva, koriandr bilan." },
        mastava: { name: "Mastava", desc: "Dana go‘shti, sabzavot va piyoz bilan guruch sho‘rvasi, sharq ziravorlari bilan." },
        somsa: { name: "Somsa (2 dona)", desc: "Dana go‘shti bilan xamirli somsa, an’anaviy o‘zbek ziravorlari bilan." },
        tschebureki: { name: "Cheburek (2 dona)", desc: "Qiyma (mol go‘shti) bilan xamirli cheburek." },
        karottensalat: { name: "Sabzi salati", desc: "O‘zbekcha ekzotik sabzi salati ingichka qirg‘ichdan o‘tkazilgan, yangi sarimsoq bilan." },
        atschuchuksalat: { name: "Achichuk salati", desc: "Shirin pomidor, piyoz va ixtiyoriy qalampir bilan yangi sabzavot salati." },
        kazankebab: { name: "Qozon kabob", desc: "Qovurilgan qo‘y go‘shti va kartoshka sharq ziravorlari bilan, an’anaviy cho‘yan qozonda tayyorlangan. Yangi sabzavot salati." },
        kazankebabhaehnchen: { name: "Qozon kabob (tovuq)", desc: "Qovurilgan tovuq go‘shti va kartoshka sharq ziravorlari bilan, an’anaviy cho‘yan qozonda tayyorlangan. Yangi sabzavot salati." },
        plov: { name: "Osh", desc: "Tanlangan guruch, qo‘y go‘shti va sabzi qadimiy o‘zbek uslubida ziravorlangan. Yangi sabzavot salati." },
        pelmeni: { name: "Pelmeni", desc: "Go‘shtli kichik pelmenlar eski rus uslubida. Smetana va yangi salat bilan." },
        manty: { name: "Manti", desc: "Dana go‘shti bilan bug‘da pishirilgan manti, o‘zbekcha. Yangi sabzavot salati." },
        honimvegetariach: { name: "Honim Vegetarian", desc: "Qovoq, sabzi, kartoshka va piyoz bilan to‘ldirilgan yupqa xamir ruleti bug‘da pishirilgan. Yangi sabzavot salati." },
        warenikiwegetarisch: { name: "Vareniki Vegetarian", desc: "Kartoshkali kichik vareniklar. Yangi sabzavot salati." },
        schaschlikvomlamm: { name: "Qo‘y go‘shtidan shashlik", desc: "Pomidor-yogurt-sarimsoq sousi va yangi sabzavot salati bilan sharbatli qo‘y go‘shti bo‘laklari." },
        schaschlikvomhaehnchen: { name: "Tovuqdan shashlik", desc: "Pomidor-yogurt-sarimsoq sousi va yangi sabzavot salati bilan sharbatli tovuq go‘shti bo‘laklari." },
        caravandessert: { name: "Caravan dessert", desc: "Halva va olma bilan pishirilgan xamir bo‘laklari. Vanil sousi bilan." },
        honigmedovikkuchen: { name: "Asal Medovik torti", desc: "Ikki xil asal Medovik torti: yong'oq / shokolad" },
        honigmedovikschokolade: { name: "Shokoladli Medovik torti", desc: "Shokoladli asal Medovik torti." },
        kannetee06jasmin: { name: "Yasminli choy (choynakda)", desc: "Xushbo‘y yasminli choy, an’anaviy choynak bilan beriladi." }
      }
    },
    hours: {
      title: "Ish vaqti",
      open: "Seshanba – Yakshanba",
      openTime: "17:00 - 23:00",
      kitchen: "Oshxona",
      kitchenTime: "22:00 gacha",
      weekdays: "Seshanba – Juma",
      weekend: "Shanba – Yakshanba",
      monday: "Dushanba",
      closed: "Yopiq",
      note: "Bayram kunlari vaqt o‘zgarishi mumkin. Tasdiqlash uchun qo‘ng‘iroq qiling."
    },
    location: {
      title: "Manzil",
      address: "Wöllstädter Str. 11, 60385 Frankfurt am Main",
      district: "Bornheim / Frankfurt am Main",
      get_directions: "Yo‘nalish olish",
      call_us: "Qo‘ng‘iroq qilish"
    },
    gallery: {
      title: "Galereya"
    },
    contact: {
      title: "Bron so‘rovi va aloqa",
      form: {
        name: "Ismingiz",
        email: "Elektron pochta",
        phone: "Telefon raqami",
        guests: "Mehmonlar soni",
        date: "Sana",
        time: "Vaqt",
        message: "Xabar (ixtiyoriy)",
        submit: "So‘rov yuborish",
        success: "Sizning bron qilish so‘rovingiz muvaffaqiyatli yuborildi! Tez orada bog‘lanamiz.",
        error: "So‘rovingizni yuborishda muammo yuz berdi. Iltimos, qayta urinib ko‘ring."
      },
      fallback: "Shakl ishlamayaptimi? Bizga yozing:",
      catering: "So‘rov bo‘yicha katering xizmati mavjud."
    },
    footer: {
      impressum: "Huquqiy ma’lumot",
      privacy: "Maxfiylik siyosati",
      rights: "Barcha huquqlar himoyalangan."
    }
  }
};

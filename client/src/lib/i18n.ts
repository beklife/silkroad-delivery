export type Language = 'de' | 'en' | 'ru';

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
      title: "authentische zentralasiatische Küche.",
      subtitle: "Aromen der Seidenstraße, warme Gastfreundschaft und gelebte Teekultur in Köln-Südstadt.",
      cta_reserve: "Tisch anfragen",
      cta_menu: "Highlights ansehen"
    },
    about: {
      title: "Unsere Geschichte",
      content: "Willkommen im SILK ROAD Restaurant Köln. Unsere Küche verbindet Traditionen aus Zentralasien mit echter Gastfreundschaft und dem Ritual des gemeinsamen Essens. Unsere Küche zelebriert die kulinarischen Traditionen Zentralasiens. Bei uns ist Essen mehr als nur Nahrung; es ist ein gemeinschaftliches Erlebnis, geteilt mit Freunden und Familie in einer Atmosphäre, die sich wie zu Hause anfühlt."
    },
    menu: {
      journey: "GESCHMACK DER SEIDENSTRASSE",
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
        silkroaddessert: { name: "Silk Road Dessert", desc: "Gebackene Apetithäppchen aus Blätterteig mit Halwa und Äpfeln. Vanillesauce dazu." },
        honigmedovikkuchen: { name: "Honig Medovik Kuchen", desc: "Honig Medovik Kuchen in zwei Sorten: Nuss / Schokolade" },
        honigmedovikschokolade: { name: "Honig Medovik Schokolade", desc: "Honig Medovik Torte in der Schokoladen-Variante." },
        kannetee06jasmin: { name: "Kanne Jasmin Tee", desc: "Aromatischer Jasmin-Tee, traditionell serviert in einer Teekanne." }
      }
    },
    hours: {
      title: "Öffnungszeiten",
      open: "Di-Sa",
      openTime: "12:00 - 22:00",
      kitchen: "Sonntag",
      kitchenTime: "12:00 - 20:00",
      weekdays: "Dienstag – Freitag",
      weekend: "Samstag – Sonntag",
      monday: "Montag",
      closed: "Geschlossen",
      note: "Bei Veranstaltungen oder Feiertagen können die Zeiten abweichen. Bitte kurz anrufen."
    },
    location: {
      title: "Standort",
      address: "Karl-Berbuer-Platz 7, 50678 Köln",
      district: "Südstadt / Köln",
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
      title: "authentic Central Asian cuisine.",
      subtitle: "Authentic Silk Road flavors, warm hospitality, and vibrant tea culture in Cologne's Suedstadt.",
      notice: "This is the official SILK ROAD website. We are still building it, so photos and texts are examples. Real photos are coming soon. You can still reserve a table or contact us.",
      cta_reserve: "Book a Table",
      cta_menu: "View Highlights"
    },
    about: {
      title: "Our Story",
      content: "Welcome to SILK ROAD Restaurant Cologne. We celebrate Central Asian cooking traditions with bold spices, generous plates, and tea-centered hospitality. Our kitchen celebrates the culinary traditions of Central Asia. Here, dining is more than just food; it is a communal experience shared with friends and family in an atmosphere that feels like home."
    },
    menu: {
      journey: "TASTE THE SILK ROAD",
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
        silkroaddessert: { name: "Silk Road Dessert", desc: "Puff pastry filled with Halva and Apples, served with a vanilla sauce." },
        honigmedovikkuchen: { name: "Honey Medovik Cake", desc: "Honey Medovik Cake in two varieties: Nut / Chocolate" },
        honigmedovikschokolade: { name: "Honey Medovik Chocolate", desc: "Honey Medovik cake in the chocolate variety." },
        kannetee06jasmin: { name: "Pot of Jasmine Tea", desc: "Aromatic jasmine tea, traditionally served in a teapot." }
      }
    },
    hours: {
      title: "Opening Hours",
      open: "Tue-Sat",
      openTime: "12:00 - 22:00",
      kitchen: "Sunday",
      kitchenTime: "12:00 - 20:00",
      weekdays: "Tuesday – Friday",
      weekend: "Saturday – Sunday",
      monday: "Monday",
      closed: "Closed",
      note: "Hours may vary on holidays or event days. Please call to confirm."
    },
    location: {
      title: "Location",
      address: "Karl-Berbuer-Platz 7, 50678 Köln",
      district: "Südstadt / Köln",
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
      title: "аутентичная кухня Центральной Азии.",
      subtitle: "Аутентичные вкусы Шелкового пути, теплое гостеприимство и культура чаепития в Кёльне.",
      notice: "Это официальный сайт SILK ROAD. Мы еще дорабатываем сайт, поэтому фото и тексты пока примерные. Настоящие фото скоро будут. Вы уже можете бронировать столик или связаться с нами.",
      cta_reserve: "Забронировать стол",
      cta_menu: "Смотреть меню"
    },
    about: {
      title: "Наша история",
      content: "Добро пожаловать в SILK ROAD. Мы привезли во Кёльн богатые вкусы и теплое гостеприимство Шелкового пути. Наша кухня прославляет кулинарные традиции Центральной Азии. Еда для нас — это не просто пища, а повод собраться с друзьями и семьей в атмосфере домашнего уюта."
    },
    menu: {
      journey: "ВКУС ШЕЛКОВОГО ПУТИ",
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
        silkroaddessert: { name: "Десерт Silk Road", desc: "Печеные аппетитные кусочки слоеного теста с халвой и яблоками. Ванильный соус." },
        honigmedovikkuchen: { name: "Медовый торт Медовик", desc: "Медовый торт Медовик в двух вариантах: Ореховый / Шоколадный" },
        honigmedovikschokolade: { name: "Медовик Шоколадный", desc: "Медовый торт Медовик в шоколадном исполнении." },
        kannetee06jasmin: { name: "Чайник жасминового чая", desc: "Ароматный жасминовый чай, традиционно подается в чайнике." }
      }
    },
    hours: {
      title: "Часы работы",
      open: "Вт-Сб",
      openTime: "12:00 - 22:00",
      kitchen: "Воскресенье",
      kitchenTime: "12:00 - 20:00",
      weekdays: "Вторник – Пятница",
      weekend: "Суббота – Воскресенье",
      monday: "Понедельник",
      closed: "Закрыто",
      note: "В праздники и в дни мероприятий часы могут меняться. Позвоните для уточнения."
    },
    location: {
      title: "Как нас найти",
      address: "Karl-Berbuer-Platz 7, 50678 Кёльн",
      district: "Зюдштадт / Кёльн",
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
  }};

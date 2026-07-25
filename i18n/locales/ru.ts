const ru = {
  brand: {
    factory: "Фабрика окон",
    name: "IMPERIYA",
    partner: "проверенный партнёр",
  },
  nav: {
    home: "Главная",
    profiles: "Профили",
    glass: "Стеклопакеты",
    facade: "Фасадные системы",
    services: "Услуги",
    about: "О компании",
    contacts: "Контакты",
  },
  topbar: {
    schedule: "Ежедневно с 9:00 до 20:00",
    cta: "Рассчитать окно",
  },
  hero: {
    title1: "Окна нового",
    title2: "поколения",
    subtitle: "Энергоэффективность, тишина и комфорт в каждом доме.",
    ctaCalc: "Рассчитать окно",
    ctaConsult: "Бесплатная консультация",
    features: {
      years: "16 лет\nна рынке",
      warranty: "Гарантия\nдо 10 лет",
      production: "Собственное\nпроизводство",
      turnkey: "Монтаж\nпод ключ",
    },
  },
  calc: {
    title: "Рассчитайте стоимость окна",
    subtitle: "Укажите параметры и получите точный расчёт",
    steps: {
      type: "Тип и конструкция",
      sizes: "Размеры",
      params: "Параметры",
      extra: "Дополнительно",
      contacts: "Контакты",
    },
    wizard: {
      product: "Тип конструкции",
      frame: "Количество створок",
      opening: "Способ открывания",
      sizes: "Размеры",
      configuration: "Комплектация",
      estimate: "Предварительная стоимость",
      contacts: "Контакты",
      progress: "Шаг {{current}} из {{total}}",
      pieces: "шт.",
    },
    constructionType: "Тип конструкции",
    products: { window: "Окно", door: "Дверь" },
    material: "Материал",
    materials: { pvc: "ПВХ", aluminum: "Алюминий" },
    profileSerial: "Серия профиля",
    lamination: "Ламинация",
    fittings: "Фурнитура",
    components: "Комплектующие",
    componentNames: {
      sill: "Подоконник",
      mosquito: "Москитная сетка",
      ebb: "Отлив",
    },
    sizesTitle: "Размеры",
    widthMm: "ширина, мм",
    address: "Адрес",
    frame: "Створчатость",
    opening: "Тип открывания",
    individualNote:
      "Эту конструкцию рассчитываем индивидуально. Укажите размеры и оставьте контакты — менеджер свяжется и пришлёт точную цену.",
    types: {
      window: "Окно",
      door: "Дверь",
      stained: "Витраж",
      balcony: "Балконный блок",
      facade: "Фасадная система",
    },
    frames: {
      single: "Одностворчатое",
      double: "Двухстворчатое",
      triple: "Трёхстворчатое",
      "door-single": "Одностворчатая",
      "door-double": "Двухстворчатая",
    },
    color: "Цвет",
    colors: {
      white: "Белый",
      darkOak: "Тёмный дуб",
      graphite: "Графит",
      nut: "Орех",
      golden: "Золотой дуб",
    },
    series: "Серия профиля",
    seriesPlaceholder: "Выберите серию",
    glass: "Тип стекла",
    glassPlaceholder: "Выберите стекло",
    width: "Ширина, мм",
    height: "Высота, мм",
    quantity: "Количество, шт",
    additional: "Дополнительно",
    mosquito: "Москитная сетка",
    sill: "Подоконник",
    name: "Ваше имя",
    phone: "Телефон",
    comment: "Комментарий",
    estimate: "Предварительная стоимость",
    estimateNote: "Итоговая цена уточняется после замера",
    back: "Назад",
    next: "Продолжить",
    getResult: "Получить расчёт",
    sendMessenger: "Отправим расчёт в мессенджер",
    submit: "Отправить заявку",
    sending: "Отправляем заявку…",
    success: "Спасибо! Мы свяжемся с вами в ближайшее время.",
    requestNumber: "Номер заявки",
    successTime: "Менеджер свяжется с вами в течение 24 часов.",
    newCalculation: "Новый расчёт",
    draftSaved: "Черновик сохранён в этой вкладке",
    /* Plural forms — Russian needs one/few/many, English & Uzbek need
     * one/other. We declare all four in every locale so the i18n schema
     * (derived from the ru object) stays consistent across locales. */
    successItems_one: "В заявке {{count}} позиция.",
    successItems_few: "В заявке {{count}} позиции.",
    successItems_many: "В заявке {{count}} позиций.",
    successItems_other: "В заявке {{count}} позиций.",
    required: "Заполните обязательные поля",
    validation: {
      range: "Введите значение от {{min}} до {{max}} мм",
      quantity: "Введите целое количество от 1 до 100",
      name: "Введите имя — минимум 2 символа",
      phone: "Введите полный номер: +998 XX XXX XX XX",
      email: "Проверьте формат email",
    },
    addAnother: "Добавить ещё",
    itemAdded: "Позиция добавлена",
    removeItem: "Удалить позицию",
    cart: "Состав заявки",
    totalPrice: "Итого",
    currentItem: "Текущая позиция",
  },
  mobileBar: {
    label: "Быстрая связь",
    call: "Позвонить",
    telegram: "Telegram",
    calculate: "Рассчитать",
  },
  profiles: {
    title: "Серии профилей",
    subtitle: "ПВХ, алюминий и фасадные системы под любые задачи",
    more: "Подробнее",
    all: "Все серии",
    categories: {
      pvc: "ПВХ профили",
      facade: "Фасадные системы",
    },
    detailSoon:
      "Характеристики и фотографии этой серии будут добавлены в ближайшее время.",
  },
  glass: {
    title: "Стеклопакеты",
    items: {
      single24:
        "Идеальное решение для неотапливаемых помещений и остекления балконов.",
      double32:
        "Оптимальное сочетание тепло- и шумоизоляции для жилых помещений.",
      energy:
        "Со специальным химическим покрытием, сохраняет тепло зимой и прохладу летом.",
      argon:
        "Заполнение аргоном снижает теплопередачу и повышает энергоэффективность.",
      multimix:
        "Двухкамерный с аргоном и энергосберегающим напылением — максимум комфорта.",
      single:
        "Одинарные стёкла от 4 мм до 20 мм под любые задачи и требования.",
    },
    names: {
      single24: "Стеклопакет однокамерный 24 мм",
      double32: "Стеклопакет двухкамерный 32 мм",
      energy: "Стеклопакет энергосберегающий",
      argon: "Стеклопакет с аргоном",
      multimix: "Стеклопакет мультимикс",
      single: "Стекло от 4 до 20 мм",
    },
  },
  services: {
    title: "Наши услуги",
    all: "Все услуги",
    items: {
      facade: "Фасадные системы",
      shutters: "Ролл ставни",
      adjustment: "Регулировка и замена стеклопакетов",
      shower: "Душевые кабинки",
      sliding: "Раздвижные двери",
      pergola: "Пергола для террасы",
      gates: "Автоматические ворота",
      wpc: "ДПК террасная доска",
    },
  },
  about: {
    title: "О компании",
    text: "Imperiya — производственная компания полного цикла. Собираем ПВХ-окна, алюминиевые конструкции и фасадные системы на собственных линиях с 2010 года. Работаем напрямую с клиентами в Ташкенте и регионах, без посредников.",
    more: "Подробнее",
    photoFallback: "Фото производства будет добавлено",
  },
  stats: {
    title: "Imperiya в цифрах",
    area: "м² площадь производства",
    clients: "довольных клиентов",
    lines: "роботизированных линий",
    constructions: "конструкций в год",
    years: "лет на рынке Узбекистана",
  },
  certificates: {
    title: "Сертификаты",
    items: {
      iso: "Сертификат ISO 9001",
      gost32603: "Сэндвич-панели · ГОСТ 32603-2021",
      gost30245: "Аксессуары · ГОСТ 30245-2012",
      gost23486: "Класс пожаробезопасности НГ · ГОСТ 23486-79",
    },
  },
  partners: {
    title: "Партнёры",
  },
  footer: {
    contacts: "Контакты",
    address: "Таш. область, Янгиюльский район, ул. Тахтакуприк, 18 А",
    showMap: "Показать на карте",
    social: "Мы в социальных сетях",
    rights: "Все права защищены.",
    emailSoon: "Почта будет добавлена позже",
    ctaTitle: "Готовы рассчитать стоимость вашего окна?",
    ctaSub: "Бесплатный замер и расчёт стоимости в течение 24 часов",
    aboutTagline: "Производим окна, двери и фасадные системы под ключ в Узбекистане с 2010 года.",
    schedule: "Ежедневно 9:00 — 20:00",
    openNow: "Сейчас открыто",
    closedNow: "Сейчас закрыто",
  },
  notFound: {
    title: "Страница не найдена",
    home: "На главную",
  },
  /* Profile spec table. `data/catalog.ts` stores keys, not prose, so the
   * table reads in the visitor's language instead of always Russian. */
  specs: {
    labels: {
      profileType: "Тип профиля",
      series: "Серия",
      wallThickness: "Толщина стенки",
      chambers: "Количество камер",
      maxSashHeight: "Макс. высота створки",
      maxSashWidth: "Макс. ширина створки",
      glassThickness: "Толщина стеклопакета",
      coating: "Покрытие",
      mountingDepth: "Монтажная глубина",
      glazingOptions: "Варианты остекления",
      maxFillWeight: "Макс. вес заполнения",
    },
    values: {
      aluminium: "Алюминий",
      aluminiumAdj: "Алюминиевый",
      pvc: "ПВХ",
      warm: "тёплая",
      cold: "холодная",
      lamination: "Ламинация",
      anodisingRalLamination: "Анодирование, цвета RAL, ламинация",
      decorCapsClampProfile: "декоративные крышки / прижимной профиль",
    },
    units: { mm: "мм", kg: "кг" },
  },
  /* Drives <title> and <meta name="description"> per language. Kept here
   * rather than in lib/site.ts so all three stay side by side. */
  seo: {
    title: "IMPERIYA — Фабрика окон, дверей и витражей",
    description:
      "IMPERIYA — фабрика окон, дверей и витражей премиум-класса. Официальный партнёр Akfa. Профили Thermo и Engelberg, энергосберегающие стеклопакеты, монтаж под ключ. Расчёт стоимости онлайн.",
    profileTitle: "Профиль {{name}}",
    profileDescription:
      "{{name}} — {{category}}{{depth}}. Характеристики, остекление и монтаж под ключ. Расчёт стоимости онлайн в IMPERIYA.",
    profileDepth: ", монтажная глубина {{value}}",
    categoryFacade: "фасадные системы",
    categoryPvc: "ПВХ-профиль",
  },
} as const;

export default ru;

type DeepString<T> = {
  [K in keyof T]: T[K] extends string ? string : DeepString<T[K]>;
};
export type Translation = DeepString<typeof ru>;

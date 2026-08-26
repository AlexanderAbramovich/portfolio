import { typoDeep } from './utils/typo'

const rawTranslations = {
  ru: {
    meta: {
      home: {
        title: 'Сайты, которые приводят заявки',
        description: 'Дизайнер Александр Абрамович: сайты на Tilda и коде, презентации, карточки маркетплейсов, наружная реклама, AI-контент, моушн. 40+ проектов, работаю по всей России.',
      },
      works: {
        title: 'Работы',
        description: '39 проектов: сайты, презентации и КП, карточки Wildberries, наружная реклама, айдентика, AI-контент и моушн. Каждый кейс - с материалами и результатом.',
      },
      about: {
        title: 'Обо мне',
        description: 'Дизайнер из Иркутска, пять лет в профессии. Наружка и препресс, презентации, маркетплейсы, моушн, AI-контент. Самозанятый: договор и чек.',
      },
      services: {
        title: 'Услуги и цены',
        description: 'Сайты, презентации, карточки маркетплейсов, наружная реклама, айдентика, AI-контент, моушн. Цены-ориентиры, два раунда правок включены.',
      },
      contact: {
        title: 'Контакты',
        description: 'Telegram, почта, телефон. Отвечаю в первые минуты, смета - после короткого разговора о задаче.',
      },
      notFound: {
        title: 'Страница не найдена',
        description: 'Такой страницы нет. Загляните в работы или напишите напрямую.',
      },
    },
    nav: {
      home: 'ГЛАВНАЯ',
      works: 'РАБОТЫ',
      about: 'ОБО МНЕ',
      services: 'УСЛУГИ',
      contact: 'КОНТАКТЫ',
    },
    home: {
      label: 'АЛЕКСАНДР АБРАМОВИЧ · ДИЗАЙНЕР · РАБОТАЮ ПО ВСЕЙ РОССИИ',
      title1: 'САЙТЫ, КОТОРЫЕ',
      title2: 'ПРИВОДЯТ ЗАЯВКИ',
      subtitle: 'Tilda и не только: нестандартные блоки собираю кодом. Плюс всё, что нужно бизнесу вокруг сайта - презентации, карточки маркетплейсов, наружная реклама, AI-контент, моушн.',
      cta: 'СМОТРЕТЬ РАБОТЫ',
      cta2: 'ОБСУДИТЬ ПРОЕКТ',
      ticker: [
        'САЙТЫ НА TILDA + КОД',
        'КП ЗА ОДНУ НОЧЬ',
        'ПРЕВЬЮ ЗА ДЕНЬ',
        'БАННЕР БЕЗ ВОЗВРАТОВ ИЗ ТИПОГРАФИИ',
        'AI-КОНТЕНТ БЕЗ ФОТОСЕССИЙ',
        'ДВА РАУНДА ПРАВОК ВКЛЮЧЕНЫ',
      ],
      stats: [
        { number: '40+', label: 'ПРОЕКТОВ СДЕЛАНО' },
        { number: '4', label: 'САЙТА ЗА ПОСЛЕДНИЙ МЕСЯЦ' },
        { number: '5', label: 'ЛЕТ В ДИЗАЙНЕ' },
        { number: '24Ч', label: 'РЕКОРД СДАЧИ КП' },
      ],
      featuredTitle: 'ИЗБРАННОЕ',
      ctaTitle: 'ЕСТЬ ПРОЕКТ?',
      ctaSubtitle: 'Отвечаю в первые минуты. Смета после короткого разговора, два раунда правок включены.',
      ctaButton: 'НАПИСАТЬ МНЕ',
    },
    works: {
      title: 'РАБОТЫ',
      companiesTitle: 'РАБОТЫ С КОМПАНИЯМИ',
      companiesSub: 'Комплексные рекламные системы: один клиент - все носители',
      categoriesTitle: 'КАТЕГОРИИ',
      filters: {
        all: 'ВСЕ',
        web: 'САЙТЫ',
        presentation: 'ПРЕЗЕНТАЦИИ',
        marketplace: 'МАРКЕТПЛЕЙС',
        outdoor: 'НАРУЖКА И РЕКЛАМА',
        identity: 'ЛОГО И АЙДЕНТИКА',
        ai: 'AI-УСЛУГИ',
        motion: 'МОУШН',
        youtube: 'ПРЕВЬЮ YOUTUBE',
        social: 'СОЦСЕТИ',
      },
    },
    about: {
      title: 'ОБО МНЕ',
      text: 'Я Александр Абрамович - дизайнер из Иркутска. Делаю сайты, которые приводят заявки: Tilda и не только, нестандартные блоки собираю кодом. Пять лет в дизайне: наружная реклама и полиграфия (работал в печатном производстве - препресс знаю изнутри), презентации и КП, карточки маркетплейсов, моушн. Отдельное направление - AI-контент: фотореалистичные карточки товара без фотосессии, видео нейросетью, закадровый голос студийного качества. Работаю быстро и по делу: КП собирал за ночь, превью - день в день. Официально: самозанятый, договор, чек.',
      skillsTitle: 'ИНСТРУМЕНТЫ',
      worksWithTitle: 'ЧТО ДЕЛАЮ',
      worksWith: [
        'Сайты: Tilda + код',
        'Презентации и КП',
        'Карточки маркетплейсов',
        'Наружная реклама и препресс',
        'Логотипы и айдентика',
        'AI-контент: фото, видео, голос',
        'Моушн и монтаж',
      ],
    },
    services: {
      title: 'УСЛУГИ',
      subtitle: 'Цены - ориентиры «от». Точная смета после короткого разговора о задаче. Два раунда правок включены в каждую услугу. Работаю официально: самозанятый, договор, чек.',
      from: 'от',
      ctaTitle: 'ГОТОВ ОБСУДИТЬ ПРОЕКТ',
      ctaButton: 'НАПИСАТЬ МНЕ',
      categories: [
        {
          title: 'САЙТЫ',
          items: [
            { name: 'Блок на базе Tilda', price: 'от 3 500 ₽' },
            { name: 'Уникальный блок кодом (Zero + T123)', price: 'от 5 000 ₽' },
            { name: 'Лендинг под ключ (10-15 блоков): структура, тексты, дизайн, сборка, адаптив', price: 'от 35 000 ₽' },
            { name: 'Доработка существующего сайта на Tilda', price: 'от 3 500 ₽' },
          ],
        },
        {
          title: 'ПРЕЗЕНТАЦИИ И КП',
          items: [
            { name: 'Слайд (дизайн)', price: 'от 900 ₽' },
            { name: 'Слайд под ключ: структура, тексты, дизайн', price: 'от 1 500 ₽' },
            { name: 'Коммерческое предложение формата А4', price: 'от 3 600 ₽' },
            { name: 'Дека 10-15 слайдов', price: 'пакетом' },
          ],
        },
        {
          title: 'МАРКЕТПЛЕЙСЫ WB / OZON',
          items: [
            { name: 'Слайд карточки товара (сборка)', price: 'от 1 500 ₽' },
            { name: 'AI-обложка: фотореализм без фотосессии', price: 'от 2 500 ₽' },
            { name: 'Линейка 5+ слайдов', price: 'пакетом дешевле' },
          ],
        },
        {
          title: 'БАННЕРЫ И НАРУЖНАЯ РЕКЛАМА',
          items: [
            { name: 'Веб-баннер, креатив для соцсетей', price: 'от 2 500 ₽' },
            { name: 'Наружка: макет + препресс, файлы под печать без возвратов', price: 'от 4 000 ₽' },
            { name: 'Рекламная кампания 5+ форматов в едином стиле', price: 'от 12 000 ₽' },
          ],
        },
        {
          title: 'ЛОГОТИПЫ И АЙДЕНТИКА',
          items: [
            { name: 'Логотип: 3 концепта, доработка, исходники', price: 'от 12 000 ₽' },
            { name: 'Логотип + мини-айдентика: цвета, шрифты, шаблоны', price: 'от 20 000 ₽' },
          ],
        },
        {
          title: 'AI-КОНТЕНТ И ВИДЕО',
          items: [
            { name: 'Тизер / анонс до 15 секунд', price: 'от 6 000 ₽' },
            { name: 'Ролик 30-60 секунд под ключ', price: 'от 15 000 ₽' },
            { name: 'Нейродиктор: закадровый голос студийного качества', price: 'от 2 000 ₽' },
          ],
        },
        {
          title: 'YOUTUBE',
          items: [
            { name: 'Превью (обложка ролика)', price: 'от 1 500 ₽' },
            { name: 'Монтаж ролика до 10 минут', price: 'от 6 000 ₽' },
            { name: 'Монтаж 10-20 минут', price: 'от 10 000 ₽' },
            { name: 'Превью в пакете с монтажом', price: '2 000 ₽' },
          ],
        },
      ],
    },
    contact: {
      title: 'ДАВАЙТЕ РАБОТАТЬ',
      contactsTitle: 'КОНТАКТЫ',
      formTitle: 'НАПИСАТЬ МНЕ',
      form: {
        name: 'Имя',
        contact: 'Email или Telegram',
        message: 'Сообщение',
        submit: 'ОТПРАВИТЬ',
        placeholder: {
          name: 'Как вас зовут?',
          contact: 'your@email.com или @username',
          message: 'Расскажите о проекте...',
        },
      },
    },
    footer: {
      copyright: '© 2026 Александр Абрамович',
      ctaTitle: 'ОБСУДИТЬ ПРОЕКТ',
      status: 'ОТКРЫТ К ЗАКАЗАМ',
      timeLabel: 'ИРКУТСК',
      reply: 'ОТВЕЧАЮ В ПЕРВЫЕ МИНУТЫ',
    },
    case: {
      back: '← НАЗАД К РАБОТАМ',
      nextProject: 'СЛЕДУЮЩИЙ ПРОЕКТ',
      year: 'ГОД',
      category: 'КАТЕГОРИЯ',
      tags: 'ТЕГИ',
      gallery: 'ГАЛЕРЕЯ',
      task: 'ЗАДАЧА',
      solution: 'РЕШЕНИЕ',
      result: 'РЕЗУЛЬТАТ',
      beforeAfter: 'ДО / ПОСЛЕ',
    },
  },

  en: {
    meta: {
      home: {
        title: 'Websites That Bring Leads',
        description: 'Designer Alexander Abramovich: websites on Tilda and code, presentations, marketplace cards, outdoor advertising, AI content, motion. 40+ projects.',
      },
      works: {
        title: 'Works',
        description: '39 projects: websites, decks and proposals, Wildberries cards, outdoor advertising, identity, AI content and motion.',
      },
      about: {
        title: 'About',
        description: 'Designer from Irkutsk, five years in the field. Outdoor and prepress, presentations, marketplaces, motion, AI content.',
      },
      services: {
        title: 'Services and Prices',
        description: 'Websites, presentations, marketplace cards, outdoor advertising, identity, AI content, motion. Reference prices, two rounds of edits included.',
      },
      contact: {
        title: 'Contact',
        description: 'Telegram, email, phone. I reply within minutes; the estimate comes after a short call about the task.',
      },
      notFound: {
        title: 'Page Not Found',
        description: 'No such page. Take a look at the works or write to me directly.',
      },
    },
    nav: {
      home: 'HOME',
      works: 'WORKS',
      about: 'ABOUT',
      services: 'SERVICES',
      contact: 'CONTACT',
    },
    home: {
      label: 'ALEXANDER ABRAMOVICH · DESIGNER · WORKING ACROSS RUSSIA',
      title1: 'WEBSITES THAT',
      title2: 'BRING YOU LEADS',
      subtitle: 'Tilda and beyond: custom blocks built with code. Plus everything a business needs around the website - presentations, marketplace cards, outdoor advertising, AI content, motion.',
      cta: 'VIEW WORKS',
      cta2: 'DISCUSS A PROJECT',
      ticker: [
        'TILDA + CODE WEBSITES',
        'PITCH DECK OVERNIGHT',
        'THUMBNAIL IN A DAY',
        'PRINT-READY WITHOUT RETURNS',
        'AI CONTENT WITHOUT PHOTOSHOOTS',
        'TWO REVISION ROUNDS INCLUDED',
      ],
      stats: [
        { number: '40+', label: 'PROJECTS DONE' },
        { number: '4', label: 'WEBSITES LAST MONTH' },
        { number: '5', label: 'YEARS IN DESIGN' },
        { number: '24H', label: 'FASTEST PITCH DELIVERY' },
      ],
      featuredTitle: 'SELECTED',
      ctaTitle: 'GOT A PROJECT?',
      ctaSubtitle: 'I reply within minutes. Estimate after a short talk, two revision rounds included.',
      ctaButton: 'CONTACT ME',
    },
    works: {
      title: 'WORKS',
      companiesTitle: 'WORK WITH COMPANIES',
      companiesSub: 'Complete ad systems: one client - every carrier',
      categoriesTitle: 'CATEGORIES',
      filters: {
        all: 'ALL',
        web: 'WEBSITES',
        presentation: 'PRESENTATIONS',
        marketplace: 'MARKETPLACE',
        outdoor: 'OUTDOOR & ADS',
        identity: 'LOGO & IDENTITY',
        ai: 'AI SERVICES',
        motion: 'MOTION',
        youtube: 'YOUTUBE THUMBNAILS',
        social: 'SOCIAL',
      },
    },
    about: {
      title: 'ABOUT',
      text: "I'm Alexander Abramovich, a designer from Irkutsk. I build websites that bring leads: Tilda and beyond, with custom blocks built in code. Five years in design: outdoor advertising and print (I worked in print production - I know prepress from the inside), presentations, marketplace cards, motion. A separate direction is AI content: photorealistic product cards without a photoshoot, AI video, studio-grade voiceover. I work fast and to the point: pitch decks overnight, thumbnails same-day. Official: self-employed, contract, receipts.",
      skillsTitle: 'TOOLS',
      worksWithTitle: 'WHAT I DO',
      worksWith: [
        'Websites: Tilda + code',
        'Presentations & pitch decks',
        'Marketplace cards',
        'Outdoor advertising & prepress',
        'Logos & identity',
        'AI content: photo, video, voice',
        'Motion & editing',
      ],
    },
    services: {
      title: 'SERVICES',
      subtitle: 'Prices are starting points. Exact estimate after a short talk about your task. Two revision rounds included. Official: self-employed, contract, receipts.',
      from: 'from',
      ctaTitle: 'READY TO DISCUSS A PROJECT',
      ctaButton: 'CONTACT ME',
      categories: [
        {
          title: 'WEBSITES',
          items: [
            { name: 'Tilda-based block', price: 'from 3 500 ₽' },
            { name: 'Custom coded block (Zero + T123)', price: 'from 5 000 ₽' },
            { name: 'Landing page turnkey (10-15 blocks): structure, copy, design, build, responsive', price: 'from 35 000 ₽' },
            { name: 'Improving an existing Tilda site', price: 'from 3 500 ₽' },
          ],
        },
        {
          title: 'PRESENTATIONS',
          items: [
            { name: 'Slide (design)', price: 'from 900 ₽' },
            { name: 'Slide turnkey: structure, copy, design', price: 'from 1 500 ₽' },
            { name: 'A4 commercial proposal', price: 'from 3 600 ₽' },
            { name: 'Deck of 10-15 slides', price: 'package' },
          ],
        },
        {
          title: 'MARKETPLACES',
          items: [
            { name: 'Product card slide', price: 'from 1 500 ₽' },
            { name: 'AI cover: photorealism without a photoshoot', price: 'from 2 500 ₽' },
            { name: 'Series of 5+ slides', price: 'package deal' },
          ],
        },
        {
          title: 'BANNERS & OUTDOOR',
          items: [
            { name: 'Web banner, social media creative', price: 'from 2 500 ₽' },
            { name: 'Outdoor: layout + prepress, print-ready files', price: 'from 4 000 ₽' },
            { name: 'Ad campaign, 5+ formats in one style', price: 'from 12 000 ₽' },
          ],
        },
        {
          title: 'LOGOS & IDENTITY',
          items: [
            { name: 'Logo: 3 concepts, refinement, source files', price: 'from 12 000 ₽' },
            { name: 'Logo + mini identity: colors, fonts, templates', price: 'from 20 000 ₽' },
          ],
        },
        {
          title: 'AI CONTENT & VIDEO',
          items: [
            { name: 'Teaser up to 15 seconds', price: 'from 6 000 ₽' },
            { name: '30-60 second video turnkey', price: 'from 15 000 ₽' },
            { name: 'AI voiceover, studio quality', price: 'from 2 000 ₽' },
          ],
        },
        {
          title: 'YOUTUBE',
          items: [
            { name: 'Thumbnail', price: 'from 1 500 ₽' },
            { name: 'Editing up to 10 min', price: 'from 6 000 ₽' },
            { name: 'Editing 10-20 min', price: 'from 10 000 ₽' },
            { name: 'Thumbnail bundled with editing', price: '2 000 ₽' },
          ],
        },
      ],
    },
    contact: {
      title: "LET'S WORK",
      contactsTitle: 'CONTACTS',
      formTitle: 'WRITE TO ME',
      form: {
        name: 'Name',
        contact: 'Email or Telegram',
        message: 'Message',
        submit: 'SEND',
        placeholder: {
          name: "What's your name?",
          contact: 'your@email.com or @username',
          message: 'Tell me about your project...',
        },
      },
    },
    footer: {
      copyright: '© 2026 Alexander Abramovich',
      ctaTitle: 'DISCUSS A PROJECT',
      status: 'OPEN FOR WORK',
      timeLabel: 'IRKUTSK',
      reply: 'I REPLY WITHIN MINUTES',
    },
    case: {
      back: '← BACK TO WORKS',
      nextProject: 'NEXT PROJECT',
      year: 'YEAR',
      category: 'CATEGORY',
      tags: 'TAGS',
      gallery: 'GALLERY',
      task: 'TASK',
      solution: 'SOLUTION',
      result: 'RESULT',
      beforeAfter: 'BEFORE / AFTER',
    },
  },
}

export const translations = typoDeep(rawTranslations)

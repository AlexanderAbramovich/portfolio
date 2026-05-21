# Portfolio — Alexander Abramovich

Сайт-портфолио графического дизайнера. React 18 + React Router v6 + Vite.

---

## Быстрый старт

```bash
npm install
npm run dev
```

Откроется на http://localhost:5173

---

## Сборка и деплой на GitHub Pages

### 1. Настройте репозиторий

```bash
git init
git remote add origin https://github.com/ВАШ_USERNAME/portfolio.git
```

> **Важно:** если имя репозитория отличается от `portfolio`, измените `base` в `vite.config.js` и `basename` в `src/main.jsx`.

### 2. Задеплойте

```bash
npm run build
npm run deploy
```

Сайт будет доступен по адресу:
`https://ВАШ_USERNAME.github.io/portfolio/`

Либо задеплойте вручную — папку `dist` после `npm run build` через GitHub Pages → ветку `gh-pages`.

---

## Как добавить изображения проектов

Структура папок уже создана в `public/images/projects/`. Для каждого проекта:

```
public/
└── images/
    └── projects/
        ├── sopka/
        │   ├── cover.jpg   ← обложка карточки (соотношение 4:3, мин. 800×600)
        │   ├── 1.jpg       ← изображения в галерее кейса
        │   ├── 2.jpg
        │   └── 3.jpg
        ├── form/
        │   └── ...
        └── ...  (папки для всех 20 проектов)
```

**Рекомендации по изображениям:**
- Обложка (`cover.jpg`): 1200×900 px, JPEG качество 85
- Галерея (`1.jpg`, `2.jpg`…): 1920×1200 px, JPEG качество 85
- Фото для страницы «О себе»: `public/images/photo.jpg`, соотношение 3:4

**Фоновое видео Hero:**
```
public/videos/hero-bg.mp4
```
Рекомендуемые параметры: mp4, H.264, 1920×1080, без звука, 10–30 сек., ≤ 5 МБ.

---

## Структура проекта

```
src/
├── components/
│   ├── Header/         — фиксированный хедер с бургером и переключателем языка
│   ├── Footer/         — футер с соцсетями
│   ├── CustomCursor/   — кастомный курсор (десктоп)
│   └── ProjectCard/    — карточка проекта
├── context/
│   └── LanguageContext.jsx  — контекст RU/EN
├── data/
│   └── projects.js     — массив всех проектов
├── hooks/
│   └── useScrollReveal.js  — Intersection Observer анимации
├── i18n.js             — все переводы (RU + EN)
├── pages/
│   ├── Home/           — главная с Hero, Stats, Featured, CTA
│   ├── Works/          — сетка работ с фильтром по категориям
│   ├── Case/           — страница кейса с галереей и лайтбоксом
│   ├── About/          — обо мне, инструменты, направления
│   ├── Services/       — услуги и цены
│   └── Contact/        — контакты + форма
└── styles/
    └── global.css      — CSS-переменные, базовые стили, утилиты
```

---

## Добавление нового проекта

1. Откройте `src/data/projects.js`
2. Добавьте объект в массив `projects`:

```js
{
  id: 'my-project',           // уникальный id (URL: /works/my-project)
  title: 'Название',          // на русском
  titleEn: 'Title',           // на английском
  category: 'identity',       // identity | marketplace | social | packaging | presentation | motion | web
  tags: ['Тег 1', 'Тег 2'],
  tagsEn: ['Tag 1', 'Tag 2'],
  cover: `${BASE}images/projects/my-project/cover.jpg`,
  year: 2025,
  location: 'Улан-Удэ',
  description: 'Описание проекта...',
  descriptionEn: 'Project description...',
  images: [
    `${BASE}images/projects/my-project/1.jpg`,
    `${BASE}images/projects/my-project/2.jpg`,
  ],
  featured: false,            // true — показывать на главной (макс. 6)
}
```

3. Создайте папку `public/images/projects/my-project/` и добавьте туда изображения.

---

## Технологии

| Технология | Версия |
|---|---|
| React | 18.x |
| React Router | v6 |
| Vite | 5.x |
| CSS Modules | — |
| Google Fonts | Bebas Neue, Oswald, Inter |

Никаких UI-библиотек. Все стили — собственный CSS.

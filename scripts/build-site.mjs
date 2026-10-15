// Сборка нового сайта для GitHub Pages: страницы из public/lab встают на главный адрес /portfolio/.
//   node scripts/build-site.mjs        → site-dist/portfolio (смотреть локально: preview «portfolio-dist»)
//   npm run deploy                     → сборка + выкладка в ветку gh-pages (только после «ок» Саши)
// Старый сайт на React остаётся в src/ и собирается командой npm run deploy:react.
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const PUB = path.join(root, 'public'), LAB = path.join(PUB, 'lab')
const DIST = path.join(root, 'site-dist'), OUT = path.join(DIST, 'portfolio')
const SITE = 'https://alexanderabramovich.github.io/portfolio/'

// 1. данные работ и кейсов — свежие из src/data/projects.js
execFileSync(process.execPath, [path.join(root, 'scripts/export-lab-data.mjs')], { cwd: root, stdio: 'inherit' })
const works = JSON.parse(fs.readFileSync(path.join(LAB, 'site-data.json'), 'utf8')).works

// 2. всё из public, кроме лаборатории: картинки, ролики, sites/, og.jpg, favicon — старые адреса файлов продолжают работать
fs.rmSync(DIST, { recursive: true, force: true })
fs.mkdirSync(OUT, { recursive: true })
for (const name of fs.readdirSync(PUB)) {
  if (name === 'lab') continue
  fs.cpSync(path.join(PUB, name), path.join(OUT, name), { recursive: true })
}

// 3. страницы и их файлы — только белый список, черновики не уходят
const ASSETS = ['shell.css', 'shell.js', 'curtain.js', 'liquid.js', 'blob.js', 'dela.json', 'head-still.webp', 'bust.glb', 'site-data.json', 'cases.json']
const NB = ' '
const PAGES = {
  'home.html': { out: 'index.html', title: `Александр Абрамович${NB}— графический дизайнер`,
    desc: 'Сайты на Тильде, презентации, наружная реклама и айдентика. Иркутск, работаю по всей России.' },
  'works.html': { out: 'works.html', title: `Работы${NB}— Александр Абрамович`,
    desc: `${works.length} проектов: сайты, презентации, наружка, айдентика, карточки маркетплейсов, моушн.` },
  'services.html': { out: 'services.html', title: `Услуги${NB}— Александр Абрамович`,
    desc: 'Сайты, презентации, маркетплейсы, наружная реклама, айдентика, AI-контент и моушн. Смета после короткого разговора о задаче.' },
  'contacts.html': { out: 'contacts.html', title: `Контакты${NB}— Александр Абрамович`,
    desc: 'Telegram @Abramovich_AB, kapen4design@gmail.com, +7 902 161-14-41. Иркутск, работаю по всей России.' },
  'case.html': { out: 'case.html', title: `Кейс${NB}— Александр Абрамович`,
    desc: 'Проект из портфолио Александра Абрамовича: задача, этапы и материалы.' },
}

// пути: в лаборатории страница лежит в lab/, на сайте — в корне
const fixPaths = (t) => t
  .replace(/(["'(])\.\.\/(images|sites|videos)\//g, '$1$2/')
  .replaceAll('href="home.html"', 'href="./"')

const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
const meta = (p, url) => `
<meta name="description" content="${esc(p.desc)}">
<link rel="canonical" href="${url}">
<meta name="theme-color" content="#F4F2F5">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Александр Абрамович">
<meta property="og:locale" content="ru_RU">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${esc(p.title)}">
<meta property="og:description" content="${esc(p.desc)}">
<meta property="og:image" content="${SITE}og.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="${SITE}og.jpg">`

// старые адреса React-сайта (#/works/argos-site и т.п.) уже разосланы в письмах и КП — ведём их на новые страницы
const REDIRECT = `<script>
(function () {
  var h = location.hash, m;
  if (!/^#\\//.test(h)) return;
  if ((m = h.match(/^#\\/works\\/([^?#/]+)/))) return location.replace('case.html?id=' + m[1]);
  if ((m = h.match(/^#\\/works\\?cat=([a-z]+)/))) return location.replace('works.html?cat=' + m[1]);
  if (/^#\\/works/.test(h)) return location.replace('works.html');
  if (/^#\\/services/.test(h)) return location.replace('services.html');
  if (/^#\\/contact/.test(h)) return location.replace('contacts.html');
  history.replaceState(null, '', location.pathname);   // #/about и прочее — главная
})();
</script>`

for (const [src, p] of Object.entries(PAGES)) {
  let t = fixPaths(fs.readFileSync(path.join(LAB, src), 'utf8'))
  const url = SITE + (p.out === 'index.html' ? '' : p.out)
  t = t.replace(/<title>[^<]*<\/title>/, `<title>${p.title}</title>${meta(p, url)}`)
  if (p.out === 'index.html') t = t.replace('<meta charset="utf-8">', '<meta charset="utf-8">\n' + REDIRECT)
  fs.writeFileSync(path.join(OUT, p.out), t)
}
for (const a of ASSETS) {
  const from = path.join(LAB, a), to = path.join(OUT, a)
  if (/\.(js|css|json)$/.test(a)) fs.writeFileSync(to, fixPaths(fs.readFileSync(from, 'utf8')))
  else fs.copyFileSync(from, to)
}

// 4. 404: адреса без .html (/portfolio/works) ведём на страницу, остальное — на главную
const p404 = { title: `Страница не найдена${NB}— Александр Абрамович`, desc: 'Такой страницы нет. Все работы, услуги и контакты — на главной.' }
fs.writeFileSync(path.join(OUT, '404.html'), `<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<script>
(function () {
  var m = location.pathname.match(/\\/portfolio\\/(works|services|contacts?|case)\\/?$/);
  if (m) location.replace('/portfolio/' + (m[1] === 'contact' ? 'contacts' : m[1]) + '.html' + location.search);
})();
</script>
<title>${p404.title}</title>${meta(p404, SITE)}
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%23E8102A'/%3E%3Cpath d='M32 11 51 53H41.5l-3.4-8H25.9l-3.4 8H13zm0 14-4 11h8z' fill='%23fff'/%3E%3C/svg%3E">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Dela+Gothic+One&family=Unbounded:wght@600&family=Golos+Text:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/portfolio/shell.css">
<style>
  .nf { min-height:100svh; display:flex; flex-direction:column; justify-content:center; padding:12vh 4vw; }
  .nf h1 { font:400 clamp(64px,16vw,260px)/.9 'Dela Gothic One', 'Arial Black', sans-serif; letter-spacing:-.05em; }
  .nf h1 i { font-style:normal; color:var(--red); }
  .nf p { margin-top:4vh; max-width:560px; font:400 clamp(18px,1.8vw,26px)/1.4 'Golos Text', system-ui, sans-serif; }
  .nf nav { margin-top:5vh; display:flex; flex-wrap:wrap; gap:12px; }
  .nf nav a { display:inline-flex; align-items:center; height:52px; padding:0 22px; border-radius:26px; border:1.5px solid var(--fg); font:600 13px 'Unbounded', 'Arial', sans-serif; text-transform:lowercase; }
  .nf nav a:first-child { background:var(--fg); color:var(--bg); }
  .nf nav a:hover { border-color:var(--red); color:var(--red); } .nf nav a:first-child:hover { background:var(--red); color:#fff; }
</style>
</head>
<body>
<main class="nf">
  <h1>404<i>.</i></h1>
  <p>Такой страницы нет. Возможно, ссылка устарела.</p>
  <nav aria-label="Куда дальше"><a href="/portfolio/">главная</a><a href="/portfolio/works.html">работы</a><a href="/portfolio/services.html">услуги</a><a href="/portfolio/contacts.html">контакты</a></nav>
</main>
</body>
</html>
`)

const files = fs.readdirSync(OUT)
console.log('site-dist/portfolio:', files.length, 'entries;', Object.values(PAGES).map((p) => p.out).join(', '), '+ 404.html')

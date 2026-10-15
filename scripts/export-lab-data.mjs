// Выгрузка данных сайта для лабораторных страниц (public/lab): работы, темы, услуги, контакты.
// Источник правды остаётся src/data/projects.js и src/i18n.js; JSON пересобирается этой командой:
//   node scripts/export-lab-data.mjs
import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { tmpdir } from 'node:os'
import { pathToFileURL, fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const tmp = mkdtempSync(join(tmpdir(), 'labdata-'))
const typoUrl = pathToFileURL(join(root, 'src/utils/typo.js')).href
const src = readFileSync(join(root, 'src/data/projects.js'), 'utf8')
  .replace("from '../utils/typo'", `from '${typoUrl}'`)
  .replaceAll('import.meta.env.BASE_URL', "'/portfolio/'")
writeFileSync(join(tmp, 'projects.mjs'), src)
const { projects, categoryLabels } = await import(pathToFileURL(join(tmp, 'projects.mjs')).href)
writeFileSync(join(tmp, 'i18n.mjs'), readFileSync(join(root, 'src/i18n.js'), 'utf8').replace("from './utils/typo'", `from '${typoUrl}'`))
const { translations } = await import(pathToFileURL(join(tmp, 'i18n.mjs')).href)

// пути картинок: в lab страница лежит в /portfolio/lab/, картинки в /portfolio/images/
const rel = (p) => typeof p === 'string' ? p.replace(/^\/portfolio\//, '../') : p
const works = projects.filter(p => !p.aliasOf).map(p => ({
  id: p.id, title: p.title, category: p.category, tags: p.tags || [], year: p.year,
  location: p.location || '', cover: rel(p.cover), description: p.description || '',
  featured: !!p.featured, theme: p.theme || null, liveUrl: p.liveUrl || '',
}))
const t = translations.ru
const out = {
  works,
  categories: categoryLabels.ru,
  worksText: t.works,
  services: t.services,
  contact: t.contact,
}
writeFileSync(join(root, 'public/lab/site-data.json'), JSON.stringify(out, null, 1))

// полные данные кейсов для case.html: всё, что рисует src/pages/Case/Case.jsx, плюс пропорции картинок
const relDeep = (v) => Array.isArray(v) ? v.map(relDeep)
  : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, relDeep(x)])) : rel(v)
const cases = projects.filter(p => !p.aliasOf).map(p => relDeep({
  id: p.id, title: p.title, category: p.category, tags: p.tags || [], year: p.year, location: p.location || '',
  liveUrl: p.liveUrl || '', cover: p.cover, description: p.description || '', steps: p.steps || null, case: p.case || null,
  beforeAfter: p.beforeAfter || null, sections: p.sections || null, images: p.images || [], videos: p.videos || null,
  gridRatio: p.gridRatio || null, theme: p.theme || null,
}))
const ar = JSON.parse(readFileSync(join(root, 'src/data/imageAr.json'), 'utf8'))
writeFileSync(join(root, 'public/lab/cases.json'), JSON.stringify({ cases, categories: categoryLabels.ru, ar }))
console.log('cases', cases.length, 'with sections', cases.filter(c => c.sections).length)
console.log('works', works.length, 'with theme', works.filter(w => w.theme).length,
  'cats', [...new Set(works.map(w => w.category))].join(','))

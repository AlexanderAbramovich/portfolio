// Выкладка site-dist/portfolio в ветку gh-pages (GitHub Pages).
// Своя замена пакету gh-pages: тот на Windows падает с ENAMETOOLONG — удаляет старые файлы одной командой со списком всех путей.
// Здесь удаление одним аргументом «.», дальше копия сборки, коммит и push. Запуск: npm run deploy (после build-site.mjs).
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const SRC = path.join(root, 'site-dist', 'portfolio')
const URL = 'https://github.com/AlexanderAbramovich/portfolio.git'
const WORK = path.join(root, 'node_modules', '.cache', 'gh-pages', 'https!github.com!AlexanderAbramovich!portfolio.git')
const git = (...a) => execFileSync('git', a, { cwd: WORK, stdio: ['ignore', 'pipe', 'inherit'], env: { ...process.env, GIT_TERMINAL_PROMPT: '0' } }).toString().trim()

if (!fs.existsSync(path.join(SRC, 'index.html'))) throw new Error('Нет сборки: сначала node scripts/build-site.mjs')
if (!fs.existsSync(path.join(WORK, '.git'))) {
  fs.mkdirSync(path.dirname(WORK), { recursive: true })
  execFileSync('git', ['clone', '--branch', 'gh-pages', '--single-branch', URL, WORK], { stdio: 'inherit' })
}
git('fetch', 'origin', 'gh-pages')
git('checkout', '-q', 'gh-pages')
git('reset', '-q', '--hard', 'origin/gh-pages')
git('rm', '-r', '-q', '--ignore-unmatch', '.')
fs.cpSync(SRC, WORK, { recursive: true })
git('add', '-A')
if (!git('status', '--porcelain')) { console.log('Изменений нет — выкладывать нечего'); process.exit(0) }
git('commit', '-q', '-m', `Обновление сайта ${new Date().toISOString().slice(0, 16).replace('T', ' ')}`)
git('push', 'origin', 'gh-pages')
console.log('Выложено:', git('log', '-1', '--format=%h %s'), '→ https://alexanderabramovich.github.io/portfolio/ (публикация 1–2 минуты)')

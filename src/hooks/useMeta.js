import { useEffect } from 'react'

const SITE = 'https://alexanderabramovich.github.io/portfolio/'
const DEFAULT_IMAGE = `${SITE}og.jpg`
const BRAND = { ru: 'Александр Абрамович', en: 'Alexander Abramovich' }
const FALLBACK = {
  ru: 'Сайты на Tilda и коде, презентации, карточки маркетплейсов, наружная реклама, AI-контент, моушн.',
  en: 'Websites on Tilda and code, presentations, marketplace cards, outdoor advertising, AI content, motion.',
}

const setTag = (selector, attr, value) => {
  if (!value) return
  let el = document.head.querySelector(selector)
  if (!el) {
    el = document.createElement(selector.startsWith('link') ? 'link' : 'meta')
    const [, key, val] = selector.match(/\[(\w+)="([^"]+)"\]/) || []
    if (key) el.setAttribute(key, val)
    document.head.appendChild(el)
  }
  el.setAttribute(attr, value)
}

/**
 * Заголовок вкладки, описание и карточка ссылки для каждой страницы.
 * Мессенджеры читают только статический index.html, поэтому og здесь -
 * для поисковиков и для тех, кто уже открыл страницу.
 */
export function useMeta({ title, description, image, lang = 'ru', noindex = false } = {}) {
  useEffect(() => {
    const brand = BRAND[lang] || BRAND.ru
    const full = title
      ? `${title} - ${brand}`
      : lang === 'en'
        ? `${brand} - websites that bring leads`
        : `${brand} - сайты, которые приводят заявки`
    const desc = description || FALLBACK[lang] || FALLBACK.ru
    const img = image
      ? (image.startsWith('http') ? image : SITE + image.replace(/^\/?portfolio\//, '').replace(/^\//, ''))
      : DEFAULT_IMAGE
    const url = SITE + (window.location.hash ? window.location.hash : '')

    document.title = full
    document.documentElement.lang = lang

    setTag('meta[name="description"]', 'content', desc)
    setTag('meta[property="og:title"]', 'content', full)
    setTag('meta[property="og:description"]', 'content', desc)
    setTag('meta[property="og:image"]', 'content', img)
    setTag('meta[property="og:url"]', 'content', url)
    setTag('meta[property="og:locale"]', 'content', lang === 'en' ? 'en_US' : 'ru_RU')
    setTag('meta[name="twitter:title"]', 'content', full)
    setTag('meta[name="twitter:description"]', 'content', desc)
    setTag('meta[name="twitter:image"]', 'content', img)
    setTag('link[rel="canonical"]', 'href', url)

    const robots = document.head.querySelector('meta[name="robots"]')
    if (noindex) setTag('meta[name="robots"]', 'content', 'noindex')
    else if (robots) robots.remove()
  }, [title, description, image, lang, noindex])
}

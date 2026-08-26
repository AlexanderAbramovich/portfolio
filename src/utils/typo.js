// Типографика по правилам заказчика:
// 1) длинных и средних тире нет - только дефис;
// 2) короткие предлоги и союзы не висят в конце строки - привязываем неразрывным пробелом.

const NBSP = ' '

const SHORT = [
  'в', 'во', 'к', 'ко', 'о', 'об', 'обо', 'от', 'ото', 'до', 'за', 'из', 'изо', 'на', 'над',
  'под', 'по', 'при', 'про', 'с', 'со', 'у', 'и', 'а', 'но', 'же', 'ли', 'бы', 'не', 'ни',
  'то', 'что', 'как', 'для', 'или', 'без', 'да', 'уж',
  'a', 'an', 'the', 'in', 'on', 'at', 'to', 'of', 'by', 'or', 'and', 'for', 'no', 'is', 'it',
]

const RE = new RegExp(`(^|[\\s(«"'])(${SHORT.join('|')}) +`, 'gi')

export function typo(str) {
  if (typeof str !== 'string' || !str) return str
  let out = str.replace(/[—–]/g, '-')
  // два прохода: подряд идущие короткие слова («и в», «а не») тоже надо склеить
  out = out.replace(RE, (m, pre, word) => pre + word + NBSP)
  out = out.replace(RE, (m, pre, word) => pre + word + NBSP)
  return out
}

// глубокий обход данных: строки чиним, пути и ссылки не трогаем
const SKIP = /^(https?:|\/|#|mailto:|tel:)|\.(jpg|jpeg|png|svg|mp4|webp)$/i

export function typoDeep(value) {
  if (typeof value === 'string') return SKIP.test(value) ? value : typo(value)
  if (Array.isArray(value)) return value.map(typoDeep)
  if (value && typeof value === 'object') {
    const out = {}
    for (const [k, v] of Object.entries(value)) out[k] = typoDeep(v)
    return out
  }
  return value
}

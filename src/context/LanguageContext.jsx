import { createContext, useContext, useEffect, useState } from 'react'

const LanguageContext = createContext()
const KEY = 'lang'

// выбранный язык переживает перезагрузку; при первом заходе смотрим на язык браузера
const initialLang = () => {
  try {
    const saved = localStorage.getItem(KEY)
    if (saved === 'ru' || saved === 'en') return saved
  } catch { /* приватный режим */ }
  if (typeof navigator !== 'undefined' && !/^ru\b/i.test(navigator.language || '')) return 'en'
  return 'ru'
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(initialLang)

  useEffect(() => {
    try { localStorage.setItem(KEY, lang) } catch { /* приватный режим */ }
    document.documentElement.lang = lang
  }, [lang])

  const toggleLang = () => setLang(l => (l === 'ru' ? 'en' : 'ru'))

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}

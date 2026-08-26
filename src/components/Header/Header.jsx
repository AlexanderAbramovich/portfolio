import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { translations } from '../../i18n'
import styles from './Header.module.css'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  // на главной шапка светлая, пока не ушла за тёмный первый экран
  const isHome = useLocation().pathname === '/'
  const [overDark, setOverDark] = useState(isHome)
  useEffect(() => {
    if (!isHome) { setOverDark(false); return }
    const check = () => setOverDark(window.scrollY < window.innerHeight - 80)
    check()
    window.addEventListener('scroll', check, { passive: true })
    window.addEventListener('resize', check)
    return () => {
      window.removeEventListener('scroll', check)
      window.removeEventListener('resize', check)
    }
  }, [isHome])
  const [menuOpen, setMenuOpen] = useState(false)
  const { lang, toggleLang } = useLanguage()
  const location = useLocation()
  const t = translations[lang].nav

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const links = [
    { to: '/',         label: t.home },
    { to: '/works',    label: t.works },
    { to: '/services', label: t.services },
    { to: '/about',    label: t.about },
    { to: '/contact',  label: t.contact },
  ]

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''} ${overDark ? styles.overDark : ''}`}>
      <div className={`${styles.inner} container`}>
        <Link to="/" className={styles.logo} aria-label="Home">
          <div className={styles.logoMark}>
            <span className={styles.logoSolid}>A</span>
            <span className={styles.logoSolid}>A</span>
          </div>
          <div className={styles.logoBar} />
        </Link>

        <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ''}`}>
          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`${styles.link} ${location.pathname === to && (to !== '/' || location.pathname === '/') ? styles.linkActive : ''}`}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className={styles.right}>
          <button className={styles.langBtn} onClick={toggleLang} aria-label="Toggle language">
            <span className={lang === 'ru' ? styles.langOn : ''}>RU</span>
            <span className={styles.langSep}>/</span>
            <span className={lang === 'en' ? styles.langOn : ''}>EN</span>
          </button>

          <button
            className={`${styles.burger} ${menuOpen ? styles.burgerOpen : ''}`}
            onClick={() => setMenuOpen(v => !v)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            <span /><span /><span />
          </button>
        </div>
      </div>
    </header>
  )
}

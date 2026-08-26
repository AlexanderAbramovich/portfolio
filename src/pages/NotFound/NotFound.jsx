import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { translations } from '../../i18n'
import { useMeta } from '../../hooks/useMeta'
import styles from './NotFound.module.css'

export default function NotFound() {
  const { lang } = useLanguage()
  const t = translations[lang]

  useMeta({ ...t.meta.notFound, lang, noindex: true })

  const ru = lang === 'ru'

  return (
    <div className={`page-wrapper ${styles.page}`}>
      <div className="container">
        <span className={`mono ${styles.code}`}>ERROR 404</span>
        <h1 className={styles.title}>
          {ru ? 'СТРАНИЦЫ НЕТ' : 'PAGE NOT FOUND'}
        </h1>
        <p className={styles.text}>
          {ru
            ? 'Ссылка ведёт в пустоту: адрес набран с ошибкой или страницу переименовали. Работы и контакты на месте.'
            : 'This link leads nowhere: the address is mistyped or the page was renamed. The works and contacts are still here.'}
        </p>
        <div className={styles.actions}>
          <Link to="/works" className="btn-accent">{ru ? 'СМОТРЕТЬ РАБОТЫ' : 'VIEW WORKS'}</Link>
          <Link to="/contact" className="btn-outline">{ru ? 'НАПИСАТЬ МНЕ' : 'GET IN TOUCH'}</Link>
        </div>
      </div>
    </div>
  )
}

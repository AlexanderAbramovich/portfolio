import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { translations } from '../../i18n'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import styles from './Services.module.css'

export default function Services() {
  const { lang } = useLanguage()
  const t = translations[lang].services

  useScrollReveal()

  return (
    <div className={`page-wrapper ${styles.page}`}>
      <div className="container">
        <div className={styles.pageHead}>
          <h1 className={`section-title reveal`}>{t.title}</h1>
          <p className={`${styles.subtitle} reveal reveal-delay-1`}>{t.subtitle}</p>
        </div>

        <div className={styles.categories}>
          {t.categories.map((cat, ci) => (
            <div key={ci} className={`${styles.category} reveal`} style={{ transitionDelay: `${ci * 0.07}s` }}>
              <h2 className={styles.catTitle}>{cat.title}</h2>
              <div className={styles.items}>
                {cat.items.map((item, ii) => (
                  <div key={ii} className={styles.item}>
                    <span className={styles.itemName}>{item.name}</span>
                    <span className={styles.itemDivider} />
                    <span className={styles.itemPrice}>
                      <span className={styles.fromLabel}>{t.from} </span>
                      {item.price}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className={`${styles.cta} reveal`}>
          <h2 className={styles.ctaTitle}>{t.ctaTitle}</h2>
          <Link to="/contact" className="btn-accent">
            <span>{t.ctaButton}</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

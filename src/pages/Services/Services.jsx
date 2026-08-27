import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { translations } from '../../i18n'
import { projects } from '../../data/projects'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { useMeta } from '../../hooks/useMeta'
import styles from './Services.module.css'

// категория услуг -> фильтр в работах.
// Спец-обложки 1600x640 (5:2) появятся позже - слот .catCover в CSS ждёт их.
const CATEGORY_META = {
  web:          { cat: 'web' },
  presentation: { cat: 'presentation' },
  marketplace:  { cat: 'marketplace' },
  outdoor:      { cat: 'outdoor' },
  identity:     { cat: 'identity' },
  ai:           { cat: 'ai' },
  motion:       { cat: 'motion' },
  youtube:      { cat: 'youtube' },
  social:       { cat: 'social' },
}

export default function Services() {
  const { lang } = useLanguage()
  const t = translations[lang].services

  useScrollReveal()
  useMeta({ ...translations[lang].meta.services, lang })

  return (
    <div className={`page-wrapper ${styles.page}`}>
      <div className="container">
        <div className={styles.pageHead}>
          <h1 className={`section-title reveal`}>{t.title}</h1>
          <p className={`${styles.subtitle} reveal reveal-delay-1`}>{t.subtitle}</p>
        </div>

        <div className={styles.categories}>
          {t.categories.map((cat, ci) => {
            const meta = CATEGORY_META[cat.id]
            const count = meta
              ? projects.filter((p) => !p.aliasOf && p.category === meta.cat).length
              : 0
            return (
              <div key={cat.id || ci} className={`${styles.category} reveal`} style={{ transitionDelay: `${ci * 0.07}s` }}>
                <div className={styles.catBody}>
                  <h2 className={styles.catTitle}>{cat.title}</h2>
                  <div className={styles.items}>
                    {cat.items.map((item, ii) => (
                      <div key={ii} className={styles.item}>
                        <span className={styles.itemName}>{item.name}</span>
                      </div>
                    ))}
                  </div>
                  {meta && count > 0 && (
                    <Link
                      to={`/works?cat=${meta.cat}`}
                      className={`mono ${styles.worksLink}`}
                      data-cursor="pointer"
                    >
                      {t.viewWorks} · {count} →
                    </Link>
                  )}
                </div>
              </div>
            )
          })}
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

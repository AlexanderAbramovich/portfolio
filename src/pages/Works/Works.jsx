import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { translations } from '../../i18n'
import { projects } from '../../data/projects'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { useMeta } from '../../hooks/useMeta'
import ProjectCard from '../../components/ProjectCard/ProjectCard'
import styles from './Works.module.css'

const ALL_CATEGORIES = ['web', 'presentation', 'marketplace', 'outdoor', 'identity', 'ai', 'motion', 'youtube', 'social']

export default function Works() {
  const { lang } = useLanguage()
  const t = translations[lang].works
  const [params, setParams] = useSearchParams()
  const fromUrl = params.get('cat')
  const [active, setActive] = useState(
    fromUrl && ALL_CATEGORIES.includes(fromUrl) ? fromUrl : 'all'
  )
  const [animating, setAnimating] = useState(false)

  // кнопка «назад» в браузере тоже должна возвращать фильтр
  useEffect(() => {
    const cat = fromUrl && ALL_CATEGORIES.includes(fromUrl) ? fromUrl : 'all'
    setActive(prev => (prev === cat ? prev : cat))
  }, [fromUrl])

  useScrollReveal()
  useMeta({ ...translations[lang].meta.works, lang })

  const companies = projects.filter(p => p.category === 'campaign')
  const regular = projects.filter(p => p.category !== 'campaign')
  const filtered = active === 'all' ? regular : regular.filter(p => p.category === active)
  // категории без работ не показываем
  const CATEGORIES = ['all', ...ALL_CATEGORIES.filter(c => regular.some(p => p.category === c))]

  const handleFilter = (cat) => {
    if (cat === active) return
    setAnimating(true)
    setTimeout(() => {
      setActive(cat)
      setAnimating(false)
      setParams(cat === 'all' ? {} : { cat }, { replace: true })
    }, 220)
  }

  return (
    <div className={`page-wrapper ${styles.page}`}>
      <div className="container">
        <h1 className={`section-title reveal ${styles.heading}`}>{t.title}</h1>

        {/* ── Работы с компаниями ── */}
        <div className={styles.secHead}>
          <h2 className={styles.secTitle}>{t.companiesTitle}</h2>
          <p className={`mono ${styles.companiesSub}`}>{t.companiesSub}</p>
        </div>
        <div className={styles.companiesGrid}>
          {companies.map((p, i) => (
            <div key={p.id} className={`reveal reveal-delay-${Math.min(i + 1, 4)}`}>
              <ProjectCard project={p} showCategory={false} />
            </div>
          ))}
        </div>

        {/* ── Категории ── */}
        <div className={styles.secHead}>
          <h2 className={styles.secTitle}>{t.categoriesTitle}</h2>
        </div>

        <div className={styles.filters}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`${styles.filterBtn} ${active === cat ? styles.filterActive : ''}`}
              onClick={() => handleFilter(cat)}
            >
              {t.filters[cat]}
            </button>
          ))}
        </div>

        <div className={`${styles.grid} ${animating ? styles.gridFading : ''}`}>
          {filtered.map((p, i) => (
            <div
              key={p.id}
              className={styles.cardWrap}
              style={{ animationDelay: `${(i % 9) * 0.06}s` }}
            >
              <ProjectCard project={p} showCategory={active === 'all'} />
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className={styles.empty}>
            {lang === 'ru' ? 'Проекты не найдены' : 'No projects found'}
          </p>
        )}
      </div>
    </div>
  )
}

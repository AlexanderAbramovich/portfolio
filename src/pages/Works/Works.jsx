import { useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { translations } from '../../i18n'
import { projects } from '../../data/projects'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import ProjectCard from '../../components/ProjectCard/ProjectCard'
import styles from './Works.module.css'

const CATEGORIES = ['all', 'identity', 'marketplace', 'social', 'packaging', 'presentation', 'motion', 'web']

export default function Works() {
  const { lang } = useLanguage()
  const t = translations[lang].works
  const [active, setActive] = useState('all')
  const [animating, setAnimating] = useState(false)

  useScrollReveal()

  const filtered = active === 'all' ? projects : projects.filter(p => p.category === active)

  const handleFilter = (cat) => {
    if (cat === active) return
    setAnimating(true)
    setTimeout(() => {
      setActive(cat)
      setAnimating(false)
    }, 220)
  }

  return (
    <div className={`page-wrapper ${styles.page}`}>
      <div className="container">
        <h1 className={`section-title reveal ${styles.heading}`}>{t.title}</h1>

        {/* Filter bar */}
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

        {/* Grid */}
        <div className={`${styles.grid} ${animating ? styles.gridFading : ''}`}>
          {filtered.map((p, i) => (
            <div
              key={p.id}
              className={styles.cardWrap}
              style={{ animationDelay: `${(i % 9) * 0.06}s` }}
            >
              <ProjectCard project={p} />
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

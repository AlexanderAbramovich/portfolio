import { useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { translations } from '../../i18n'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import styles from './About.module.css'

const BASE = import.meta.env.BASE_URL

const TOOLS = [
  { name: 'Adobe Photoshop', icon: 'Ps' },
  { name: 'Adobe Illustrator', icon: 'Ai' },
  { name: 'After Effects', icon: 'Ae' },
  { name: 'Premiere Pro', icon: 'Pr' },
  { name: 'Figma', icon: 'Fig' },
  { name: 'Kling AI', icon: 'KI' },
  { name: 'ChatGPT', icon: 'GPT' },
  { name: 'Claude', icon: 'Cl' },
]

export default function About() {
  const { lang } = useLanguage()
  const t = translations[lang].about
  const [imgError, setImgError] = useState(false)

  useScrollReveal()

  return (
    <div className={`page-wrapper ${styles.page}`}>
      <div className="container">
        <div className={styles.layout}>
          {/* ── LEFT: Photo ─────────────────────────────────────────────── */}
          <div className={`${styles.photoCol} reveal`}>
            <div className={styles.photoWrap}>
              {!imgError ? (
                <img
                  src={`${BASE}images/photo.jpg`}
                  alt="Alexander Abramovich"
                  className={styles.photo}
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className={styles.photoPlaceholder}>
                  <span>AA</span>
                </div>
              )}
              <div className={styles.photoVignette} />
              <div className={styles.photoAccentLine} />
            </div>
          </div>

          {/* ── RIGHT: Info ─────────────────────────────────────────────── */}
          <div className={styles.infoCol}>
            <h1 className={`section-title reveal ${styles.heading}`}>{t.title}</h1>

            <p className={`${styles.bio} reveal reveal-delay-1`}>{t.text}</p>

            {/* Tools */}
            <div className={`${styles.section} reveal reveal-delay-2`}>
              <h2 className={styles.sectionTitle}>{t.skillsTitle}</h2>
              <div className={styles.tools}>
                {TOOLS.map(tool => (
                  <span key={tool.name} className={styles.toolBadge}>
                    <span className={styles.toolIcon}>{tool.icon}</span>
                    <span className={styles.toolName}>{tool.name}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Works With */}
            <div className={`${styles.section} reveal reveal-delay-3`}>
              <h2 className={styles.sectionTitle}>{t.worksWithTitle}</h2>
              <ul className={styles.worksList}>
                {t.worksWith.map(item => (
                  <li key={item} className={styles.worksItem}>
                    <span className={styles.worksArrow}>→</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

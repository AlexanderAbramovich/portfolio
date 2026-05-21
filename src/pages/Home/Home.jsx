import { useRef, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { translations } from '../../i18n'
import { projects } from '../../data/projects'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import ProjectCard from '../../components/ProjectCard/ProjectCard'
import styles from './Home.module.css'

const BASE = import.meta.env.BASE_URL

export default function Home() {
  const { lang } = useLanguage()
  const t = translations[lang].home
  const videoRef = useRef(null)
  const [videoError, setVideoError] = useState(false)

  useScrollReveal()

  const featured = projects.filter(p => p.featured).slice(0, 6)

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    v.play().catch(() => setVideoError(true))
  }, [])

  return (
    <div className={styles.page}>
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.heroBg}>
          {!videoError && (
            <video
              ref={videoRef}
              className={styles.heroVideo}
              src={`${BASE}videos/hero-bg.mp4`}
              autoPlay
              muted
              loop
              playsInline
              onError={() => setVideoError(true)}
            />
          )}
          <div className={styles.heroFallback} />
        </div>
        <div className={styles.heroOverlay} />

        <div className={styles.heroContent}>
          <span className={styles.heroLabel}>{t.label}</span>
          <h1 className={styles.heroTitle}>
            <span className={styles.heroLine1}>{t.title1}</span>
            <span className={styles.heroLine2}>{t.title2}</span>
          </h1>
          <Link to="/works" className={`btn-accent ${styles.heroCta}`}>
            <span>{t.cta}</span>
          </Link>
        </div>

        <div className={styles.scrollIndicator}>
          <span />
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────────────────────── */}
      <section className={styles.stats}>
        <div className="container">
          <div className={styles.statsGrid}>
            {t.stats.map((s, i) => (
              <div key={i} className={styles.statItem}>
                <span className={styles.statNumber}>{s.number}</span>
                <span className={styles.statLabel}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED ─────────────────────────────────────────────────────── */}
      <section className={styles.featured}>
        <div className="container">
          <h2 className={`section-title reveal ${styles.featuredHeading}`}>
            {t.featuredTitle}
          </h2>
          <div className={styles.grid}>
            {featured.map((p, i) => (
              <div
                key={p.id}
                className={`reveal reveal-delay-${Math.min(i + 1, 4)}`}
              >
                <ProjectCard project={p} />
              </div>
            ))}
          </div>
          <div className={styles.worksLink}>
            <Link to="/works" className="btn-outline">
              {lang === 'ru' ? 'ВСЕ РАБОТЫ' : 'ALL WORKS'}
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className={styles.cta}>
        <div className={`container ${styles.ctaInner}`}>
          <h2 className={styles.ctaTitle}>{t.ctaTitle}</h2>
          <Link to="/contact" className="btn-accent">
            <span>{t.ctaButton}</span>
          </Link>
        </div>
      </section>
    </div>
  )
}

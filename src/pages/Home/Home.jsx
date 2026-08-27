import { useRef, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { translations } from '../../i18n'
import { projects } from '../../data/projects'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { useMeta } from '../../hooks/useMeta'
import ProjectCard from '../../components/ProjectCard/ProjectCard'
import Barcode from '../../components/Barcode/Barcode'
import styles from './Home.module.css'

const BASE = import.meta.env.BASE_URL

export default function Home() {
  const { lang } = useLanguage()
  const t = translations[lang].home
  const videoRef = useRef(null)
  const [videoError, setVideoError] = useState(false)

  useScrollReveal()
  useMeta({ ...translations[lang].meta.home, lang })

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    v.play().catch(() => setVideoError(true))
  }, [])

  const featured = projects.filter(p => p.featured).slice(0, 6)
  const tickerLine = [...t.ticker, ...t.ticker]

  return (
    <div className={styles.page}>
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className={`${styles.hero} dark-island`}>
        {!videoError && (
          <div className={styles.heroBg} aria-hidden="true">
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
            <div className={styles.heroVideoOverlay} />
          </div>
        )}

        <div className={styles.heroFrame} aria-hidden="true">
          <span className={styles.cornerTL} />
          <span className={styles.cornerBR} />
        </div>

        <div className={`container ${styles.heroContent}`}>
          <div className={`mono ${styles.heroLabel}`}>
            <span>{t.labelWho}</span>
            <span className={styles.labelSep}> · </span>
            <span className={styles.labelGeo}>{t.labelGeo}</span>
          </div>

          <h1 className={styles.heroTitle}>
            <span className={styles.heroLine1}>{t.title1}</span>
            <span className={styles.heroLine2}>
              <span className={`plate ${styles.heroPlate}`}>{t.title2}</span>
            </span>
          </h1>

          <p className={styles.heroSubtitle}>{t.subtitle}</p>

          <div className={styles.heroActions}>
            <Link to="/works" className="btn-accent">{t.cta}</Link>
            <Link to="/contact" className="btn-outline">{t.cta2}</Link>
          </div>

          <div className={styles.heroMeta}>
            <Barcode />
            <span className="mono">ALX·2026 · TILDA + CODE · AI</span>
          </div>
        </div>

        <div className={styles.scrollIndicator}><span /></div>
      </section>

      {/* ── TICKER ───────────────────────────────────────────────────────── */}
      <div className="ticker">
        <div className="ticker-inner">
          {tickerLine.map((item, i) => (
            <span key={i} className="ticker-item">
              {item} <b>✦</b>
            </span>
          ))}
        </div>
      </div>

      {/* ── STATS ────────────────────────────────────────────────────────── */}
      <section className={styles.stats}>
        <div className="container">
          <div className={styles.statsGrid}>
            {t.stats.map((s, i) => (
              <div key={i} className={`${styles.statItem} reveal reveal-delay-${Math.min(i + 1, 4)}`}>
                <span className={styles.statNumber}>{s.number}</span>
                <span className={`mono ${styles.statLabel}`}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED ─────────────────────────────────────────────────────── */}
      <section className={styles.featured}>
        <div className="container">
          <h2 className={`section-title reveal`}>
            <span className="idx">01</span>
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
          <p className={styles.ctaSubtitle}>{t.ctaSubtitle}</p>
          <Link to="/contact" className="btn-accent">{t.ctaButton}</Link>
          <div className={styles.ctaMeta}>
            <Barcode red />
          </div>
        </div>
      </section>
    </div>
  )
}

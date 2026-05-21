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
          <div className={styles.heroFallback} />
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
        </div>
        <div className={styles.heroOverlay} />

        {/* ── Doodles ──────────────────────────────────────────────────── */}
        <svg className={styles.heroDoodles} viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          {/* top-left: triangle */}
          <polygon points="62,148 104,72 146,148" />
          {/* top-left: X */}
          <line x1="198" y1="52" x2="228" y2="82" /><line x1="228" y1="52" x2="198" y2="82" />
          {/* top-left: small dot-circle */}
          <circle cx="310" cy="38" r="10" />

          {/* top-right: ring */}
          <circle cx="1298" cy="108" r="42" />
          {/* top-right: small ring inside */}
          <circle cx="1298" cy="108" r="22" />
          {/* top-right: diamond */}
          <polygon points="1158,198 1182,154 1206,198 1182,242" />

          {/* mid-left: diamond */}
          <polygon points="36,400 68,358 100,400 68,442" />
          {/* mid-left: plus */}
          <line x1="38" y1="530" x2="38" y2="570" /><line x1="18" y1="550" x2="58" y2="550" />

          {/* mid-right: triangle small */}
          <polygon points="1380,360 1410,308 1440,360" />
          {/* mid-right: cross */}
          <line x1="1392" y1="460" x2="1428" y2="496" /><line x1="1428" y1="460" x2="1392" y2="496" />

          {/* bottom-left: X */}
          <line x1="62" y1="692" x2="106" y2="736" /><line x1="106" y1="692" x2="62" y2="736" />
          {/* bottom-left: small circle */}
          <circle cx="210" cy="808" r="18" />
          {/* bottom-left: plus */}
          <line x1="320" y1="840" x2="320" y2="872" /><line x1="304" y1="856" x2="336" y2="856" />

          {/* bottom-right: triangle */}
          <polygon points="1258,792 1296,724 1334,792" />
          {/* bottom-right: ring */}
          <circle cx="1400" cy="820" r="28" />

          {/* scattered smalls */}
          <circle cx="680" cy="44" r="7" />
          <polygon points="760,840 778,810 796,840" />
          <line x1="500" y1="862" x2="530" y2="862" /><line x1="515" y1="847" x2="515" y2="877" />
        </svg>

        <div className={styles.heroContent}>
          <span className={styles.heroLabel}>{t.label}</span>

          <div className={styles.heroTitleWrap}>
            <div className={styles.decorLineTop} />
            <h1 className={styles.heroTitle}>
              <span className={styles.heroLine1}>{t.title1}</span>
              <span className={styles.heroLine2}>{t.title2}</span>
            </h1>
            <div className={styles.decorLineBottom} />
          </div>

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

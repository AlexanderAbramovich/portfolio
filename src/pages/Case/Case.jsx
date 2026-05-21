import { useState, useEffect, useCallback } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { translations } from '../../i18n'
import { projects, categoryLabels } from '../../data/projects'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import styles from './Case.module.css'

export default function Case() {
  const { id } = useParams()
  const { lang } = useLanguage()
  const t = translations[lang].case
  const navigate = useNavigate()

  const [lightbox, setLightbox] = useState(null) // index or null
  const [coverError, setCoverError] = useState(false)

  useScrollReveal()

  const idx     = projects.findIndex(p => p.id === id)
  const project = projects[idx]
  const next    = projects[(idx + 1) % projects.length]

  useEffect(() => {
    if (!project) navigate('/works')
  }, [project, navigate])

  const closeLightbox = useCallback(() => setLightbox(null), [])

  useEffect(() => {
    if (lightbox === null) return
    const onKey = (e) => {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowRight') setLightbox(i => (i + 1) % project.images.length)
      if (e.key === 'ArrowLeft')  setLightbox(i => (i - 1 + project.images.length) % project.images.length)
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [lightbox, project, closeLightbox])

  if (!project) return null

  const title    = lang === 'en' ? project.titleEn    : project.title
  const desc     = lang === 'en' ? project.descriptionEn : project.description
  const tags     = lang === 'en' ? project.tagsEn     : project.tags
  const catLabel = categoryLabels[lang][project.category]
  const nextTitle = lang === 'en' ? next.titleEn : next.title

  return (
    <div className={`page-wrapper ${styles.page}`}>
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <div className={styles.hero}>
        {!coverError ? (
          <img
            src={project.cover}
            alt={title}
            className={styles.heroCover}
            onError={() => setCoverError(true)}
          />
        ) : (
          <div className={styles.heroCoverFallback} />
        )}
        <div className={styles.heroOverlay} />
        <div className={`container ${styles.heroMeta}`}>
          <span className={styles.heroCat}>{catLabel}</span>
          <h1 className={styles.heroTitle}>{title}</h1>
        </div>
      </div>

      {/* ── INFO ─────────────────────────────────────────────────────────── */}
      <section className={styles.info}>
        <div className="container">
          <div className={styles.infoGrid}>
            <div className={`${styles.infoBlock} reveal`}>
              <span className={styles.infoLabel}>{t.year}</span>
              <span className={styles.infoValue}>{project.year}</span>
            </div>
            <div className={`${styles.infoBlock} reveal reveal-delay-1`}>
              <span className={styles.infoLabel}>{t.category}</span>
              <span className={styles.infoValue}>{catLabel}</span>
            </div>
            <div className={`${styles.infoBlock} reveal reveal-delay-2`}>
              <span className={styles.infoLabel}>{t.tags}</span>
              <div className={styles.tagsList}>
                {tags.map(tag => (
                  <span key={tag} className={styles.tagBadge}>{tag}</span>
                ))}
              </div>
            </div>
          </div>

          <div className={`${styles.desc} reveal reveal-delay-1`}>
            <p>{desc}</p>
          </div>
        </div>
      </section>

      {/* ── GALLERY ──────────────────────────────────────────────────────── */}
      <section className={styles.gallery}>
        <div className="container">
          <h2 className={`section-title reveal ${styles.galleryTitle}`}>{t.gallery}</h2>
          <div className={styles.galleryGrid}>
            {project.images.map((img, i) => (
              <div
                key={i}
                className={`${styles.galleryItem} reveal`}
                style={{ animationDelay: `${i * 0.07}s` }}
                onClick={() => setLightbox(i)}
                data-cursor="pointer"
              >
                <GalleryImage src={img} alt={`${title} — ${i + 1}`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NAV ──────────────────────────────────────────────────────────── */}
      <div className="container">
        <div className={styles.navRow}>
          <Link to="/works" className={`btn-outline ${styles.backBtn}`}>{t.back}</Link>
        </div>
      </div>

      {/* ── NEXT PROJECT ─────────────────────────────────────────────────── */}
      <Link to={`/works/${next.id}`} className={styles.nextProject} data-cursor="pointer">
        <div className={`container ${styles.nextInner}`}>
          <span className={styles.nextLabel}>{t.nextProject}</span>
          <span className={styles.nextTitle}>{nextTitle}</span>
          <span className={styles.nextArrow}>→</span>
        </div>
      </Link>

      {/* ── LIGHTBOX ─────────────────────────────────────────────────────── */}
      {lightbox !== null && (
        <div className={styles.lightbox} onClick={closeLightbox}>
          <button className={styles.lbClose} onClick={closeLightbox} aria-label="Close">✕</button>
          <button
            className={`${styles.lbArrow} ${styles.lbPrev}`}
            onClick={(e) => { e.stopPropagation(); setLightbox(i => (i - 1 + project.images.length) % project.images.length) }}
            aria-label="Previous"
          >‹</button>
          <div className={styles.lbContent} onClick={e => e.stopPropagation()}>
            <img
              src={project.images[lightbox]}
              alt={`${title} — ${lightbox + 1}`}
              className={styles.lbImage}
            />
            <span className={styles.lbCounter}>{lightbox + 1} / {project.images.length}</span>
          </div>
          <button
            className={`${styles.lbArrow} ${styles.lbNext}`}
            onClick={(e) => { e.stopPropagation(); setLightbox(i => (i + 1) % project.images.length) }}
            aria-label="Next"
          >›</button>
        </div>
      )}
    </div>
  )
}

function GalleryImage({ src, alt }) {
  const [error, setError] = useState(false)
  if (error) return <div className="img-placeholder"><span>{alt}</span></div>
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setError(true)}
      className={styles.galleryImg}
    />
  )
}

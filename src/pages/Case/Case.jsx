import { useState, useEffect, useLayoutEffect, useCallback, useRef, useMemo } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { translations } from '../../i18n'
import { projects, categoryLabels, locationEn } from '../../data/projects'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { useMeta } from '../../hooks/useMeta'
import BeforeAfter from '../../components/BeforeAfter/BeforeAfter'
import DeckViewer from '../../components/DeckViewer/DeckViewer'
import VideoPlayer from '../../components/VideoPlayer/VideoPlayer'
import imageAr from '../../data/imageAr.json'
import styles from './Case.module.css'

const THEME_VARS = {
  bg: '--bg',
  bg2: '--bg-2',
  card: '--card',
  cardHover: '--card-hover',
  text: '--cream',
  textMuted: '--cream-dim',
  accent: '--red',
  accent2: '--red-hot',
  line: '--line',
  lineAccent: '--line-red',
}

// пропорция картинки берётся из сгенерированной карты (скрипт scratchpad/brands/layout.py)
const arOf = (src) => {
  const key = src.replace(import.meta.env.BASE_URL, '')
  return imageAr[key] || 4 / 3
}

// раскладка «justified»: набираем ряд, пока суммарная пропорция не дотянет до целевой
const toRows = (items, targetSum, width, gap, minRowH, maxSpread) => {
  const rows = []
  let row = []
  let sum = 0
  for (const it of items) {
    // если из-за новой картинки ряд станет ниже минимума - закрываем ряд заранее,
    // иначе узкая вертикаль рядом с длинной лентой схлопывается в полоску
    if (row.length) {
      const h = width ? (width - gap * row.length) / (sum + it.ar) : Infinity
      const ars = [...row.map(r => r.ar), it.ar]
      const spread = Math.max(...ars) / Math.min(...ars)
      // ряд станет слишком низким либо в нём окажутся несовместимые форматы
      if (h < minRowH || spread > maxSpread) {
        rows.push(row)
        row = []
        sum = 0
      }
    }
    row.push(it)
    sum += it.ar
    if (sum >= targetSum) {
      rows.push(row)
      row = []
      sum = 0
    }
  }
  if (row.length) rows.push(row)
  return rows
}

// ряд картинок одной высоты, растянутый по ширине контейнера
function Justified({ items, gap = 16, maxH = 560, targetSum = 2.4, minRowH = 150, maxSpread = 3, render }) {
  const ref = useRef(null)
  const [width, setWidth] = useState(0)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width))
    ro.observe(el)
    setWidth(el.getBoundingClientRect().width)
    return () => ro.disconnect()
  }, [])

  const narrow = width > 0 && width < 620
  const rows = useMemo(
    () => toRows(items, narrow ? 0.01 : targetSum, width, gap, minRowH, maxSpread),
    [items, targetSum, narrow, width, gap, minRowH, maxSpread]
  )

  return (
    <div className={styles.justified} ref={ref} style={{ gap }}>
      {rows.map((row, ri) => {
        const sum = row.reduce((acc, it) => acc + it.ar, 0)
        const free = Math.max(0, width - gap * (row.length - 1))
        const raw = width ? free / sum : 0
        const h = Math.min(maxH, raw)
        const capped = h < raw - 0.5
        const totalW = h * sum + gap * (row.length - 1)
        return (
          <div
            key={ri}
            className={styles.jRow}
            style={{ gap, justifyContent: totalW < width - 1 ? 'center' : 'flex-start' }}
          >
            {row.map((it, ii) =>
              render(it, {
                width: width ? Math.round(h * it.ar) : undefined,
                height: width ? Math.round(h) : undefined,
                capped,
                index: ii,
              })
            )}
          </div>
        )
      })}
    </div>
  )
}

// плоский список кликабельных картинок кейса - на нём стоит лайтбокс
const flatImages = (sections) =>
  sections.flatMap(sec => [...(sec.images || []), ...(sec.photos || [])])

export default function Case() {
  const { id } = useParams()
  const { lang } = useLanguage()
  const t = translations[lang].case
  const navigate = useNavigate()

  const [lightbox, setLightbox] = useState(null) // index or null
  const [deck, setDeck] = useState(null)     // индекс слайда в режиме презентации
  const [video, setVideo] = useState(null)  // ролик на весь экран

  // тема кейса: перекрашивает весь сайт под бренд клиента, на выходе всё возвращается
  useLayoutEffect(() => {
    const theme = projects.find(p => p.id === id && !p.aliasOf)?.theme
    if (!theme) return
    const root = document.documentElement
    const prev = {}
    Object.entries(THEME_VARS).forEach(([key, cssVar]) => {
      if (!theme[key]) return
      prev[cssVar] = root.style.getPropertyValue(cssVar)
      root.style.setProperty(cssVar, theme[key])
    })
    root.setAttribute('data-case-theme', theme.mode || 'dark')
    return () => {
      Object.entries(prev).forEach(([cssVar, old]) => {
        if (old) root.style.setProperty(cssVar, old)
        else root.style.removeProperty(cssVar)
      })
      root.removeAttribute('data-case-theme')
    }
  }, [id])

  useScrollReveal()

  // витринные карточки (aliasOf) ведут на оригинал и в перелистывании не участвуют
  const cases   = projects.filter(p => !p.aliasOf)
  const idx     = cases.findIndex(p => p.id === id)
  const project = cases[idx]
  const next    = cases[(idx + 1) % cases.length]

  // заголовок вкладки и описание берём из самого кейса
  const metaTitle = project && (lang === 'en' ? project.titleEn : project.title)
  const metaDesc = project && (lang === 'en' ? project.descriptionEn : project.description)
  useMeta({
    title: metaTitle,
    description: metaDesc && metaDesc.length > 180 ? `${metaDesc.slice(0, 177).trimEnd()}...` : metaDesc,
    image: project?.cover,
    lang,
  })

  useEffect(() => {
    if (!project) navigate('/works')
  }, [project, navigate])

  const closeLightbox = useCallback(() => setLightbox(null), [])

  // при переходе на другой кейс оверлеи должны схлопываться,
  // иначе после «назад» висит чужой кадр и заблокированная прокрутка
  useEffect(() => {
    setLightbox(null)
    setDeck(null)
    setVideo(null)
  }, [id])

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

  const singleColumn = ['identity', 'presentation', 'web'].includes(project.category)

  // у моушн-кейсов сверху такая же обложка-кнопка, только открывает ролик
  const firstVideo = project.sections?.flatMap(sec => sec.videos || [])[0] || null

  // презентации и айдентика получают кнопку «посмотреть презентацию»
  const isDeck = ['presentation', 'identity'].includes(project.category) && project.images.length > 1
  // плиткой показываются и они, и сайты - у сайтов это экраны страницы
  const isSheet = ['presentation', 'identity', 'web'].includes(project.category) && project.images.length > 1
  const deckAr = (() => {
    if (!isSheet) return 16 / 9
    const counts = {}
    project.images.forEach((src) => {
      const key = arOf(src).toFixed(2)
      counts[key] = (counts[key] || 0) + 1
    })
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]
    return top ? Number(top[0]) : 16 / 9
  })()

  const title    = lang === 'en' ? project.titleEn    : project.title
  const desc     = lang === 'en' ? project.descriptionEn : project.description
  const tags     = lang === 'en' ? project.tagsEn     : project.tags
  const catLabel = categoryLabels[lang][project.category]
  const locLabel = lang === 'en' ? (locationEn[project.location] || project.location) : project.location
  const nextTitle = lang === 'en' ? next.titleEn : next.title

  return (
    <div className={`page-wrapper ${styles.page}`}>

      {/* ── PAGE HEADER ──────────────────────────────────────────────────── */}
      {project.theme ? (
        // брендовый кейс: плашка в цвете клиента во всю ширину
        <div className={styles.brandHead}>
          <div className="container">
            <Link to="/works" className={styles.brandBack}>{t.back}</Link>
            <h1 className={styles.brandTitle}>{title}</h1>
            <div className={styles.brandMeta}>
              <span>{locLabel}</span>
              <span>{project.year}</span>
              <span>{tags.join(' · ')}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.pageHeader}>
          <div className="container">
            <Link to="/works" className={styles.backLink}>{t.back}</Link>
            <span className={styles.headerCat}>{catLabel}</span>
            <h1 className={styles.headerTitle}>{title}</h1>
            <div className={styles.headerLine} />
          </div>
        </div>
      )}

      {/* ── LIVE HERO: обложка-ссылка на живой сайт ──────────────────────── */}
      {project.liveUrl && (
        <section className={styles.liveHero}>
          <div className="container">
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.liveLink}
              data-cursor="pointer"
            >
              <img src={project.cover} alt={title} className={styles.liveCover} />
              <span className={styles.liveBadge}>
                {lang === 'en' ? 'OPEN LIVE SITE ↗' : 'ОТКРЫТЬ ЖИВОЙ САЙТ ↗'}
              </span>
            </a>
          </div>
        </section>
      )}

      {/* ── VIDEO HERO: обложка-кнопка, открывает ролик ──────────────────── */}
      {firstVideo && (
        <section className={styles.liveHero}>
          <div className="container">
            <button type="button" className={styles.deckLink} onClick={() => setVideo(firstVideo)} data-cursor="pointer">
              <img src={project.cover} alt={title} className={styles.liveCover} />
              <span className={styles.liveBadge}>
                {lang === 'en' ? 'WATCH THE REEL ▸' : 'СМОТРЕТЬ РОЛИК ▸'}
              </span>
            </button>
          </div>
        </section>
      )}

      {/* ── DECK HERO: обложка-кнопка, открывает презентацию ─────────────── */}
      {isDeck && (
        <section className={styles.liveHero}>
          <div className="container">
            <button type="button" className={styles.deckLink} onClick={() => setDeck(0)} data-cursor="pointer">
              <img src={project.cover} alt={title} className={styles.liveCover} />
              <span className={styles.liveBadge}>
                {lang === 'en' ? 'VIEW PRESENTATION ▸' : 'ПОСМОТРЕТЬ ПРЕЗЕНТАЦИЮ ▸'}
              </span>
            </button>
          </div>
        </section>
      )}

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

          {project.steps && (
            <div className={styles.steps}>
              <span className="mono mono-red">{lang === 'en' ? 'WORK STAGES' : 'ЭТАПЫ РАБОТЫ'}</span>
              <ol className={styles.stepsList}>
                {(lang === 'en' && project.stepsEn ? project.stepsEn : project.steps).map((s, i) => (
                  <li key={i} className={`reveal reveal-delay-${Math.min(i + 1, 4)}`}>
                    <span className={styles.stepNum}>{String(i + 1).padStart(2, '0')}</span>
                    <p>{s}</p>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {project.case && (
            <div className={styles.caseGrid}>
              {[
                { label: t.task, text: lang === 'en' ? project.case.taskEn : project.case.task },
                { label: t.solution, text: lang === 'en' ? project.case.solutionEn : project.case.solution },
                { label: t.result, text: lang === 'en' ? project.case.resultEn : project.case.result },
              ].map((b, i) => (
                <div key={i} className={`${styles.caseBlock} reveal reveal-delay-${i + 1}`}>
                  <span className={`mono ${i === 2 ? 'mono-red' : ''}`}>{b.label}</span>
                  <p>{b.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── BEFORE / AFTER ───────────────────────────────────────────────── */}
      {project.beforeAfter && (
        <section className={styles.baSection}>
          <div className="container">
            <h2 className={`section-title reveal ${styles.galleryTitle}`}>{t.beforeAfter}</h2>
            <div className="reveal">
              <BeforeAfter
                before={project.beforeAfter.before}
                after={project.beforeAfter.after}
                labelBefore={project.beforeAfter.labelBefore || (lang === 'en' ? 'BEFORE' : 'ДО')}
                labelAfter={project.beforeAfter.labelAfter || (lang === 'en' ? 'AFTER' : 'ПОСЛЕ')}
              />
            </div>
          </div>
        </section>
      )}

      {/* ── GALLERY: блоки, слайдеры до/после, чистовики ─────────────────── */}
      {project.sections ? (
        <section className={styles.gallery}>
          <div className="container">
            <div className={styles.blocks}>
              {project.sections.map((sec, si) => {
                const offset = flatImages(project.sections.slice(0, si)).length
                const clean = sec.images || []
                const photos = sec.photos || []
                const pairs = sec.pairs || []
                const total = clean.length + photos.length + pairs.length + (sec.videos ? sec.videos.length : 0)
                const secTitle = lang === 'en' ? sec.titleEn : sec.title
                const uniform =
                  sec.layout === 'story' ? styles.storyGrid
                  : sec.layout === 'grid3' ? `${styles.wideGrid} ${styles.wideGrid3}`
                  : project.gridRatio === 'card' ? styles.cardGrid
                  : null
                const maxH =
                  sec.layout === 'tall' ? 680
                  : sec.layout === 'logo' ? 240
                  : sec.layout === 'full' ? 520
                  : 520
                const targetSum = sec.layout === 'tall' ? 0.9 : sec.layout === 'full' ? 0.01 : 2.4

                const tile = (src, i, base, alt, box) => (
                  <div
                    key={`${base}-${i}`}
                    className={`${styles.galleryItem} reveal`}
                    style={box ? { width: box.width, height: box.height, flex: '0 0 auto' } : undefined}
                    onClick={() => setLightbox(base + i)}
                    data-cursor="pointer"
                  >
                    <GalleryImage src={src} alt={alt} fill={!!box} />
                  </div>
                )

                const row = (list, base, kind) =>
                  uniform ? (
                    <div className={uniform}>
                      {list.map((src, i) => tile(src, i, base, `${title} - ${secTitle} - ${i + 1}`))}
                    </div>
                  ) : (
                    <Justified
                      items={list.map((src) => ({ src, ar: arOf(src) }))}
                      maxH={maxH}
                      targetSum={targetSum}
                      minRowH={sec.pack === 'free' ? 0 : 150}
                      maxSpread={sec.pack === 'free' ? 99 : 3}
                      render={(it, box) =>
                        tile(it.src, list.indexOf(it.src), base, `${title} - ${secTitle} - ${kind}`, box)
                      }
                    />
                  )

                return (
                  <div key={sec.slug} className={styles.block}>
                    <div className={`${styles.blockHead} reveal`}>
                      <span className={styles.blockNum}>{String(si + 1).padStart(2, '0')}</span>
                      <h3 className={styles.blockTitle}>{secTitle}</h3>
                      <span className={styles.blockCount}>{total}</span>
                    </div>

                    {sec.note && (
                      <p className={`${styles.blockNote} reveal`}>{lang === 'en' ? sec.noteEn : sec.note}</p>
                    )}

                    {sec.videos && sec.videos.length > 0 && (
                      <div className={sec.layout === 'story' ? styles.storyGrid : styles.videoGrid}>
                        {sec.videos.map((v, i) => (
                          <button
                            key={i}
                            type="button"
                            className={styles.videoTile}
                            onClick={() => setVideo(v)}
                            data-cursor="pointer"
                          >
                            {sec.posters && sec.posters[i] && (
                              <img src={sec.posters[i]} alt={`${title} - ${secTitle} - ${i + 1}`} loading="lazy" />
                            )}
                            <span className={styles.playBadge}>
                              {lang === 'en' ? 'PLAY ▸' : 'СМОТРЕТЬ ▸'}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}

                    {pairs.length > 0 && (
                      <div
                        className={`${styles.pairs} ${sec.pairCols ? styles.pairsGrid : ''}`}
                        style={sec.pairCols ? { '--pair-cols': sec.pairCols } : undefined}
                      >
                        {pairs.map((pr, pi) => (
                          <figure key={pi} className={`${styles.pairItem} reveal`}>
                            {pr.mode === 'pair' ? (
                              <Justified
                                items={[
                                  { src: pr.before, ar: arOf(pr.before), tag: lang === 'en' ? 'BEFORE' : 'БЫЛО' },
                                  { src: pr.after, ar: arOf(pr.after), tag: lang === 'en' ? 'AFTER' : 'СТАЛО', after: true },
                                ]}
                                maxH={640}
                                targetSum={99}
                                render={(it, box) => (
                                  <div
                                    key={it.src}
                                    className={styles.pairHalf}
                                    style={{ width: box.width, height: box.height, flex: '0 0 auto' }}
                                  >
                                    <img src={it.src} alt={it.tag} loading="lazy" />
                                    <span className={`${styles.pairTag} ${it.after ? styles.pairTagAfter : ''}`}>
                                      {it.tag}
                                    </span>
                                  </div>
                                )}
                              />
                            ) : (
                              <BeforeAfter
                                before={pr.before}
                                after={pr.after}
                                ratio={arOf(pr.after)}
                                maxH={sec.pairCols ? 900 : 560}
                                labelBefore={lang === 'en' ? 'BEFORE' : 'БЫЛО'}
                                labelAfter={lang === 'en' ? 'AFTER' : 'СТАЛО'}
                              />
                            )}
                            {(pr.what || pr.whatEn) && (
                              <figcaption className={styles.pairCaption}>
                                {lang === 'en' ? (pr.whatEn || pr.what) : pr.what}
                              </figcaption>
                            )}
                          </figure>
                        ))}
                      </div>
                    )}

                    {photos.length > 0 && (
                      <>
                        <span className={`${styles.subLabel} mono mono-red`}>
                          {lang === 'en' ? 'FINISHED CARRIER' : 'ГОТОВЫЙ НОСИТЕЛЬ'}
                        </span>
                        {row(photos, offset + clean.length, lang === 'en' ? 'photo' : 'фото')}
                      </>
                    )}

                    {clean.length > 0 && (
                      <>
                        {pairs.length > 0 && (
                          <span className={`${styles.subLabel} mono`}>
                            {lang === 'en' ? 'FINAL LAYOUTS' : 'ЧИСТОВИК'}
                          </span>
                        )}
                        {row(clean, offset, lang === 'en' ? 'layout' : 'макет')}
                      </>
                    )}

                  </div>
                )
              })}
            </div>
          </div>
        </section>
      ) : isSheet ? (
        <section className={styles.gallery}>
          <div className="container">
            <h2 className={`section-title reveal ${styles.galleryTitle}`}>
              {project.category === 'web'
                ? (lang === 'en' ? 'SCREENS' : 'ЭКРАНЫ')
                : (lang === 'en' ? 'SLIDES' : 'СЛАЙДЫ')}
            </h2>
            <div className={styles.deckSheet} style={{ '--slide-ar': String(deckAr) }}>
              {project.images.map((img, i) => (
                <button
                  type="button"
                  key={i}
                  className={styles.deckTile}
                  onClick={() => setDeck(i)}
                  data-cursor="pointer"
                >
                  <img src={img} alt={`${title} - ${i + 1}`} loading="lazy" />
                  <span className={styles.deckNum}>{String(i + 1).padStart(2, '0')}</span>
                </button>
              ))}
            </div>
          </div>
        </section>
      ) : project.images.length > 0 && (
        <section className={styles.gallery}>
          <div className="container">
            <h2 className={`section-title reveal ${styles.galleryTitle}`}>{t.gallery}</h2>
            <div className={singleColumn ? styles.galleryGridSingle : styles.galleryGrid}>
              {project.images.map((img, i) => (
                <div
                  key={i}
                  className={`${styles.galleryItem} reveal`}
                  style={{ animationDelay: `${i * 0.07}s` }}
                  onClick={() => setLightbox(i)}
                  data-cursor="pointer"
                >
                  <GalleryImage src={img} alt={`${title} - ${i + 1}`} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── VIDEOS ───────────────────────────────────────────────────────── */}
      {project.videos && project.videos.length > 0 && (
        <section className={styles.videos}>
          <div className="container">
            <h2 className={`section-title reveal ${styles.galleryTitle}`}>{t.gallery}</h2>
            <div className={styles.videosList}>
              {project.videos.map((v, i) => {
                const src = typeof v === 'string' ? v : v.src
                const poster = typeof v === 'object' ? v.poster : undefined
                return (
                  <div key={i} className={`${styles.videoItem} reveal`}>
                    <video
                      src={src}
                      poster={poster}
                      className={styles.videoEl}
                      loop
                      muted
                      playsInline
                      controls
                    />
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── NEXT PROJECT ─────────────────────────────────────────────────── */}
      <Link to={`/works/${next.id}`} className={styles.nextProject} data-cursor="pointer">
        <div className={`container ${styles.nextInner}`}>
          <span className={styles.nextLabel}>{t.nextProject}</span>
          <span className={styles.nextTitle}>{nextTitle}</span>
          <span className={styles.nextArrow}>→</span>
        </div>
      </Link>

      {/* ── РОЛИК НА ВЕСЬ ЭКРАН ──────────────────────────────────────────── */}
      {video && (
        <VideoPlayer src={video} title={title} lang={lang} onClose={() => setVideo(null)} />
      )}

      {/* ── РЕЖИМ ПРЕЗЕНТАЦИИ ────────────────────────────────────────────── */}
      {deck !== null && (
        <DeckViewer
          slides={project.images}
          index={deck}
          onIndex={setDeck}
          onClose={() => setDeck(null)}
          title={title}
          lang={lang}
        />
      )}

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
              alt={`${title} - ${lightbox + 1}`}
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

function GalleryImage({ src, alt, fill }) {
  const [error, setError] = useState(false)
  if (error) return <div className="img-placeholder"><span>{alt}</span></div>
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setError(true)}
      className={`${styles.galleryImg} ${fill ? styles.galleryImgFill : ''}`}
    />
  )
}

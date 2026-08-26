import { useEffect, useCallback, useRef, useState } from 'react'
import styles from './DeckViewer.module.css'

/**
 * Просмотр презентации как в PowerPoint: слайд на весь экран, стрелки, клавиатура,
 * счётчик и полоса прогресса. Ничего не обрезает - слайд вписывается целиком.
 */
export default function DeckViewer({ slides, index, onIndex, onClose, title, lang = 'ru' }) {
  const touch = useRef(null)
  const [ui, setUi] = useState(true)
  const hideTimer = useRef(null)

  const go = useCallback(
    (step) => onIndex((index + step + slides.length) % slides.length),
    [index, slides.length, onIndex]
  )

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') { e.preventDefault(); go(1) }
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); go(-1) }
      if (e.key === 'Home') onIndex(0)
      if (e.key === 'End') onIndex(slides.length - 1)
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [go, onClose, onIndex, slides.length])

  // соседние слайды подгружаем заранее, чтобы листалось без задержки
  useEffect(() => {
    ;[index + 1, index - 1].forEach((i) => {
      const src = slides[(i + slides.length) % slides.length]
      if (src) new Image().src = src
    })
  }, [index, slides])

  const wake = () => {
    setUi(true)
    clearTimeout(hideTimer.current)
    hideTimer.current = setTimeout(() => setUi(false), 2600)
  }

  useEffect(() => {
    wake()
    return () => clearTimeout(hideTimer.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index])

  return (
    <div
      className={`${styles.wrap} ${ui ? '' : styles.idle}`}
      onMouseMove={wake}
      onTouchStart={(e) => { touch.current = e.touches[0].clientX; wake() }}
      onTouchEnd={(e) => {
        if (touch.current == null) return
        const dx = e.changedTouches[0].clientX - touch.current
        if (Math.abs(dx) > 45) go(dx < 0 ? 1 : -1)
        touch.current = null
      }}
    >
      <div className={styles.bar}>
        <span className={styles.deckTitle}>{title}</span>
        <span className={styles.counter}>
          {String(index + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
        </span>
        <button className={styles.close} onClick={onClose} aria-label={lang === 'en' ? 'Close' : 'Закрыть'}>
          {lang === 'en' ? 'CLOSE ✕' : 'ЗАКРЫТЬ ✕'}
        </button>
      </div>

      <div className={styles.stage}>
        <button className={`${styles.zone} ${styles.zonePrev}`} onClick={() => go(-1)} aria-label="Previous">
          <span className={styles.arrow}>‹</span>
        </button>
        <img
          key={slides[index]}
          src={slides[index]}
          alt={`${title} — ${index + 1}`}
          className={styles.slide}
          draggable="false"
        />
        <button className={`${styles.zone} ${styles.zoneNext}`} onClick={() => go(1)} aria-label="Next">
          <span className={styles.arrow}>›</span>
        </button>
      </div>

      <div className={styles.progress}>
        {slides.map((_, i) => (
          <button
            key={i}
            className={`${styles.tick} ${i === index ? styles.tickOn : ''}`}
            onClick={() => onIndex(i)}
            aria-label={`${i + 1}`}
          />
        ))}
      </div>

      <span className={styles.hint}>
        {lang === 'en' ? '← → or space  ·  Esc to close' : '← → или пробел  ·  Esc - закрыть'}
      </span>
    </div>
  )
}

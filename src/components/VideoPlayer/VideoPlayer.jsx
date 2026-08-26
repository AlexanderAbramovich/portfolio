import { useEffect, useRef } from 'react'
import styles from './VideoPlayer.module.css'

/** Ролик на весь экран: открывается по обложке, закрывается по Esc, клику мимо и крестику. */
export default function VideoPlayer({ src, title, onClose, lang = 'ru' }) {
  const ref = useRef(null)

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    ref.current?.play?.().catch(() => {})   // автоплей может не разрешиться - не страшно, есть контролы
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div className={styles.wrap} onClick={onClose}>
      <div className={styles.bar}>
        <span className={styles.title}>{title}</span>
        <button className={styles.close} onClick={onClose} aria-label={lang === 'en' ? 'Close' : 'Закрыть'}>
          {lang === 'en' ? 'CLOSE ✕' : 'ЗАКРЫТЬ ✕'}
        </button>
      </div>
      <div className={styles.stage} onClick={(e) => e.stopPropagation()}>
        <video ref={ref} src={src} className={styles.video} controls playsInline preload="auto" />
      </div>
    </div>
  )
}

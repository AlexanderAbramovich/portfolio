import { useEffect, useRef } from 'react'
import styles from './CustomCursor.module.css'

/*
 * Обычный системный курсор всегда виден.
 * При наведении на интерактив (ссылки, кнопки, [data-cursor])
 * вокруг курсора плавно расцветает красный кружок.
 */
export default function CustomCursor() {
  const ringRef = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return

    const ring = ringRef.current
    let raf

    const move = (e) => {
      raf = requestAnimationFrame(() => {
        ring.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
      })
    }

    const onOver = (e) => {
      if (e.target.closest('a, button, [data-cursor]')) {
        ring.classList.add(styles.active)
      }
    }

    const onOut = (e) => {
      if (e.target.closest('a, button, [data-cursor]')) {
        ring.classList.remove(styles.active)
      }
    }

    window.addEventListener('mousemove', move, { passive: true })
    document.addEventListener('mouseover', onOver)
    document.addEventListener('mouseout', onOut)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', move)
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout', onOut)
    }
  }, [])

  return <span ref={ringRef} className={styles.ring} aria-hidden="true" />
}

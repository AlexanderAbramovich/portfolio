import { useEffect, useRef } from 'react'
import styles from './CustomCursor.module.css'

export default function CustomCursor() {
  const dotRef  = useRef(null)
  const ringRef = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return

    const dot  = dotRef.current
    const ring = ringRef.current
    let raf

    const move = (e) => {
      raf = requestAnimationFrame(() => {
        const x = e.clientX
        const y = e.clientY
        dot.style.transform  = `translate(${x}px, ${y}px)`
        ring.style.transform = `translate(${x}px, ${y}px)`
      })
    }

    const onOver = (e) => {
      const el = e.target.closest('a, button, [data-cursor]')
      if (el) {
        dot.classList.add(styles.active)
        ring.classList.add(styles.active)
      }
    }

    const onOut = (e) => {
      const el = e.target.closest('a, button, [data-cursor]')
      if (el) {
        dot.classList.remove(styles.active)
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

  return (
    <>
      <span ref={dotRef}  className={styles.dot}  aria-hidden="true" />
      <span ref={ringRef} className={styles.ring} aria-hidden="true" />
    </>
  )
}

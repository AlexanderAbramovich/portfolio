import { useRef, useState, useCallback } from 'react'
import styles from './BeforeAfter.module.css'

export default function BeforeAfter({ before, after, labelBefore = 'ДО', labelAfter = 'ПОСЛЕ', ratio, maxH = 560 }) {
  const wrapRef = useRef(null)
  const [pos, setPos] = useState(50)
  const [dragging, setDragging] = useState(false)

  const updateFromEvent = useCallback((clientX) => {
    const el = wrapRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = ((clientX - rect.left) / rect.width) * 100
    setPos(Math.max(2, Math.min(98, x)))
  }, [])

  const onPointerDown = (e) => {
    setDragging(true)
    e.currentTarget.setPointerCapture?.(e.pointerId)
    updateFromEvent(e.clientX)
  }

  const onPointerMove = (e) => {
    if (!dragging) return
    updateFromEvent(e.clientX)
  }

  const stopDrag = () => setDragging(false)

  return (
    <div
      ref={wrapRef}
      className={styles.wrap}
      style={ratio ? { aspectRatio: String(ratio), maxWidth: Math.round(maxH * ratio), margin: '0 auto' } : undefined}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={stopDrag}
      onPointerLeave={stopDrag}
      role="slider"
      aria-label="Before / After"
      aria-valuenow={Math.round(pos)}
      aria-valuemin={0}
      aria-valuemax={100}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft') setPos(p => Math.max(2, p - 4))
        if (e.key === 'ArrowRight') setPos(p => Math.min(98, p + 4))
      }}
    >
      <img src={before} alt={labelBefore} className={styles.imgBase} draggable="false" loading="lazy" decoding="async" />
      <img
        src={after}
        alt={labelAfter}
        className={styles.imgAfter}
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        draggable="false"
        loading="lazy"
        decoding="async"
      />

      <span className={`${styles.label} ${styles.labelLeft}`}>{labelAfter}</span>
      <span className={`${styles.label} ${styles.labelRight}`}>{labelBefore}</span>

      <div className={styles.handle} style={{ left: `${pos}%` }}>
        <div className={styles.handleLine} />
        <div className={styles.handleKnob}>
          <span>◂</span><span>▸</span>
        </div>
      </div>
    </div>
  )
}

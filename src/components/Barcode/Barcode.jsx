import { useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import styles from './Barcode.module.css'

/**
 * Фирменная метка: штрихкод, который при наведении «расшифровывается» в фамилию.
 * Полосы схлопываются в подчёркивание, буквы поднимаются из него по очереди.
 * На тач-экранах то же самое по касанию - там наведения нет.
 */
export default function Barcode({ red = false }) {
  const [open, setOpen] = useState(false)
  const { lang } = useLanguage()
  const name = lang === 'en' ? 'ABRAMOVICH' : 'АБРАМОВИЧ'

  return (
    <span
      className={`${styles.wrap} ${red ? styles.red : ''} ${open ? styles.open : ''}`}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onPointerDown={(e) => { if (e.pointerType === 'touch') setOpen(v => !v) }}
      role="img"
      aria-label={lang === 'en' ? 'Alexander Abramovich' : 'Александр Абрамович'}
      data-cursor="pointer"
    >
      <span className={styles.bars} aria-hidden="true" />
      <span className={styles.name} aria-hidden="true">
        {[...name].map((ch, i) => (
          <span key={i} style={{ transitionDelay: `${i * 26}ms` }}>{ch}</span>
        ))}
      </span>
    </span>
  )
}

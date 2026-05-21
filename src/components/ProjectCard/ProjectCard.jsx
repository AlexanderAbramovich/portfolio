import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { categoryLabels } from '../../data/projects'
import styles from './ProjectCard.module.css'

export default function ProjectCard({ project }) {
  const { lang } = useLanguage()
  const [imgError, setImgError] = useState(false)

  const title    = lang === 'en' ? project.titleEn    : project.title
  const catLabel = categoryLabels[lang][project.category] ?? project.category

  return (
    <Link to={`/works/${project.id}`} className={styles.card} data-cursor="pointer">
      <div className={styles.imageWrap}>
        {!imgError ? (
          <img
            src={project.cover}
            alt={title}
            className={styles.image}
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className={styles.placeholder}>
            <span>{title}</span>
          </div>
        )}
        <div className={styles.overlay} />
        <span className={styles.tag}>{catLabel}</span>
      </div>

      <div className={styles.info}>
        <h3 className={styles.title}>{title}</h3>
        <span className={styles.year}>{project.year}</span>
      </div>
    </Link>
  )
}

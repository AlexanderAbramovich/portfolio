import { useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { translations } from '../../i18n'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import styles from './Contact.module.css'

const CONTACTS = [
  {
    label: 'Telegram',
    value: '@Abramovich_AB',
    href: 'https://t.me/Abramovich_AB',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8l-1.69 7.96c-.12.56-.46.7-.93.43l-2.58-1.9-1.24 1.2c-.14.14-.26.26-.52.26l.18-2.63 4.74-4.27c.2-.18-.05-.28-.32-.1L7.9 14.48l-2.53-.79c-.55-.17-.56-.55.12-.82l9.88-3.8c.46-.17.85.11.27.73z" fill="currentColor"/>
      </svg>
    ),
  },
  {
    label: 'ВКонтакте',
    value: 'vk.com/idkapen',
    href: 'https://vk.com/idkapen',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M15.07 2H8.93C3.33 2 2 3.33 2 8.93v6.14C2 20.67 3.33 22 8.93 22h6.14C20.67 22 22 20.67 22 15.07V8.93C22 3.33 20.67 2 15.07 2zm2.79 13.38h-1.52c-.57 0-.75-.46-1.78-1.5-.89-.87-1.28-.99-1.5-.99-.31 0-.4.09-.4.52v1.37c0 .37-.12.59-1.1.59-1.62 0-3.41-.98-4.67-2.8-1.9-2.67-2.42-4.67-2.42-5.08 0-.22.09-.43.52-.43h1.52c.39 0 .54.18.69.6.76 2.18 2.03 4.09 2.55 4.09.2 0 .28-.09.28-.59V8.76c-.06-.97-.56-1.05-.56-1.4 0-.18.14-.37.38-.37h2.39c.33 0 .45.18.45.56v2.99c0 .33.14.45.24.45.2 0 .36-.12.72-.48 1.12-1.25 1.91-3.17 1.91-3.17.11-.22.28-.43.67-.43h1.52c.46 0 .56.23.46.56-.19.88-2.03 3.47-2.03 3.47-.16.26-.22.38 0 .67.16.2.69.69 1.04 1.1.65.75 1.14 1.38 1.27 1.81.15.43-.07.65-.5.65z" fill="currentColor"/>
      </svg>
    ),
  },
  {
    label: 'Instagram',
    value: '@argib3.0',
    href: 'https://www.instagram.com/argib3.0/',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" fill="currentColor"/>
      </svg>
    ),
  },
  {
    label: 'Email',
    value: 'kapen4design@gmail.com',
    href: 'mailto:kapen4design@gmail.com',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="currentColor"/>
      </svg>
    ),
  },
  {
    label: 'Телефон',
    value: '+7 902 161 14 41',
    href: 'tel:+79021611441',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" fill="currentColor"/>
      </svg>
    ),
  },
]

export default function Contact() {
  const { lang } = useLanguage()
  const t = translations[lang].contact
  const [form, setForm] = useState({ name: '', contact: '', message: '' })

  useScrollReveal()

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    const subject = encodeURIComponent(`Проект от ${form.name}`)
    const body = encodeURIComponent(
      `Имя: ${form.name}\nКонтакт: ${form.contact}\n\nСообщение:\n${form.message}`
    )
    window.location.href = `mailto:kapen4design@gmail.com?subject=${subject}&body=${body}`
  }

  return (
    <div className={`page-wrapper ${styles.page}`}>
      <div className="container">
        <h1 className={`section-title reveal ${styles.heading}`}>{t.title}</h1>

        <div className={styles.layout}>
          {/* ── Contacts ─────────────────────────────────────────────────── */}
          <div className={`${styles.contactsCol} reveal reveal-delay-1`}>
            <h2 className={styles.colTitle}>{t.contactsTitle}</h2>
            <ul className={styles.contactList}>
              {CONTACTS.map(c => (
                <li key={c.label}>
                  <a
                    href={c.href}
                    className={styles.contactItem}
                    target={c.href.startsWith('http') ? '_blank' : undefined}
                    rel={c.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  >
                    <span className={styles.contactIcon}>{c.icon}</span>
                    <span className={styles.contactText}>
                      <span className={styles.contactLabel}>{c.label}</span>
                      <span className={styles.contactValue}>{c.value}</span>
                    </span>
                    <span className={styles.contactArrow}>→</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Form ─────────────────────────────────────────────────────── */}
          <div className={`${styles.formCol} reveal reveal-delay-2`}>
            <h2 className={styles.colTitle}>{t.formTitle}</h2>
            <form className={styles.form} onSubmit={handleSubmit} noValidate>
              <div className={styles.field}>
                <label className={styles.label}>{t.form.name}</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder={t.form.placeholder.name}
                  className={styles.input}
                  required
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>{t.form.contact}</label>
                <input
                  type="text"
                  name="contact"
                  value={form.contact}
                  onChange={handleChange}
                  placeholder={t.form.placeholder.contact}
                  className={styles.input}
                  required
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>{t.form.message}</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder={t.form.placeholder.message}
                  className={`${styles.input} ${styles.textarea}`}
                  rows={6}
                  required
                />
              </div>
              <button type="submit" className={`btn-accent ${styles.submitBtn}`}>
                <span>{t.form.submit}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

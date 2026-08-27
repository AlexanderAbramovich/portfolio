import { useEffect } from 'react'

export function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12 }
    )

    const elements = document.querySelectorAll('.reveal')
    elements.forEach((el) => observer.observe(el))

    // Страховка для Safari: WebKit теряет элементы, которым justified-раскладка
    // передвинула координаты после начала наблюдения - IntersectionObserver для них
    // больше не срабатывает, и плитка навсегда остаётся прозрачной (пустое место
    // на странице). Доводим руками: всё, что прокрутка подняла к экрану, показываем.
    let ticking = false
    const sweep = () => {
      ticking = false
      const line = window.innerHeight * 0.95
      document.querySelectorAll('.reveal:not(.visible)').forEach((el) => {
        if (el.getBoundingClientRect().top < line) el.classList.add('visible')
      })
    }
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(sweep)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    const t = setTimeout(sweep, 400)

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      clearTimeout(t)
    }
  })
}

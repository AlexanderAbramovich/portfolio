import { useEffect, useRef } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'

const KEY = 'scrollPositions'

const read = () => {
  try { return JSON.parse(sessionStorage.getItem(KEY) || '{}') } catch { return {} }
}
const write = (map) => {
  try { sessionStorage.setItem(KEY, JSON.stringify(map)) } catch { /* приватный режим */ }
}

/**
 * Вперёд - страница открывается сверху. Назад - возвращаемся туда, где стояли.
 * Позиция пишется на ходу и живёт в sessionStorage, поэтому переживает перезагрузку.
 */
export default function ScrollRestore() {
  const location = useLocation()
  const navType = useNavigationType()
  const keyRef = useRef(location.key || location.pathname)

  // пишем позицию на ходу, не чаще одного раза за кадр
  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        write({ ...read(), [keyRef.current]: window.scrollY })
        ticking = false
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('pagehide', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('pagehide', onScroll)
    }
  }, [])

  useEffect(() => {
    keyRef.current = location.key || location.pathname
    const saved = read()[keyRef.current]

    if (navType === 'POP' && typeof saved === 'number' && saved > 0) {
      // ждём, пока картинки разложатся по сетке, иначе прыгаем не туда
      const jump = () => window.scrollTo(0, saved)
      jump()
      const t1 = setTimeout(jump, 90)
      const t2 = setTimeout(jump, 260)
      return () => { clearTimeout(t1); clearTimeout(t2) }
    }

    window.scrollTo(0, 0)
  }, [location.key, location.pathname, navType])

  return null
}

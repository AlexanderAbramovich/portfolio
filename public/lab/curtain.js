// Переход между страницами: шторка поднимается снизу, закрывает экран, на новой странице уходит вверх.
// Цвет — лак сайта; ссылка с data-cbg / data-cfg (кейс) красит шторку в цвета проекта.
// Модификаторы (Ctrl/Cmd, средняя кнопка), target=_blank, якоря на той же странице и чужие сайты не трогаются.
// Подключается ПЕРВЫМ в <body>: тогда на новой странице шторка с логотипом есть с первого кадра, без пустого мигания.
(function () {
  const RM = matchMedia('(prefers-reduced-motion: reduce)');
  const st = document.createElement('style');
  st.textContent = `
  @view-transition { navigation:auto; }
  ::view-transition-old(root), ::view-transition-new(root) { animation:none; }
  .curtain { position:fixed; inset:0; z-index:200; display:grid; place-items:center; pointer-events:none;
    background:var(--cbg, linear-gradient(115deg,#E8102A 0%,#FF4F93 38%,#8F3BFF 72%,#3D6BFF 100%)); color:var(--cfg,#fff);
    clip-path:inset(100% 0 0 0); }
  .curtain b { font:400 clamp(64px,12vw,200px)/1 'Dela Gothic One','Arial Black',sans-serif; letter-spacing:-.04em; opacity:0; transform:translateY(30px); }
  .curtain b i { font-style:normal; color:var(--cacc, #0B0A0C); }
  .curtain.in { pointer-events:auto; animation:cIn .5s cubic-bezier(.7,0,.25,1) forwards; }
  .curtain.in b { animation:cLogo .3s .12s cubic-bezier(.2,.8,.2,1) forwards; }
  .curtain.cover { clip-path:inset(0); }
  .curtain.cover b { opacity:1; transform:none; }
  .curtain.out { animation:cOut .62s cubic-bezier(.7,0,.25,1) forwards; }
  .curtain.out b { opacity:1; animation:cLogoOut .62s cubic-bezier(.7,0,.25,1) forwards; }
  @keyframes cIn { from { clip-path:inset(100% 0 0 0); border-radius:50% 50% 0 0 / 12vh 12vh 0 0; } to { clip-path:inset(0); border-radius:0; } }
  @keyframes cOut { from { clip-path:inset(0); } to { clip-path:inset(0 0 100% 0); } }
  @keyframes cLogo { to { opacity:1; transform:none; } }
  @keyframes cLogoOut { from { transform:none; } to { transform:translateY(-12vh); } }   /* логотип уезжает вверх вместе со шторкой, не гаснет */`;
  document.head.appendChild(st);

  const make = (c) => {
    const el = document.createElement('div'); el.className = 'curtain'; el.setAttribute('aria-hidden', 'true');
    el.innerHTML = '<b>А<i>А</i></b>';
    if (c && c.bg) { el.style.setProperty('--cbg', c.bg); el.style.setProperty('--cfg', c.fg || '#fff'); el.style.setProperty('--cacc', c.fg || '#fff'); }
    return el;
  };
  const read = () => { try { const v = sessionStorage.getItem('curtain'); sessionStorage.removeItem('curtain'); return v ? JSON.parse(v) : null; } catch (e) { return null; } };
  const save = (c) => { try { sessionStorage.setItem('curtain', JSON.stringify(c)); } catch (e) {} };

  // пришли сюда через шторку — она закрывает экран и уходит вверх, когда страница готова
  const came = read();
  if (came && !RM.matches) {
    const el = make(came); el.classList.add('cover');
    (document.body || document.documentElement).appendChild(el);     // сразу, до остального содержимого страницы
    const t0 = performance.now();
    const go = () => {
      // держим закрытой минимум 0,25 с — логотип успевает прочитаться — и уводим вверх
      setTimeout(() => { el.classList.remove('cover'); el.style.clipPath = 'inset(0)'; el.classList.add('out'); setTimeout(() => el.remove(), 750); },
        Math.max(0, 250 - (performance.now() - t0)));
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', go); else go();
  }

  let leaving = false;
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href]');
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (a.target === '_blank' || a.hasAttribute('download') || RM.matches || leaving) return;
    const url = new URL(a.getAttribute('href'), location.href);
    if (url.origin !== location.origin || !/(\.html|\/)$/.test(url.pathname)) return;   // свои страницы: *.html и главная по адресу папки
    if (url.pathname === location.pathname && url.search === location.search) return;   // якорь на этой же странице
    e.preventDefault(); leaving = true;
    const c = a.dataset.cbg ? { bg: a.dataset.cbg, fg: a.dataset.cfg } : null;
    save(c || {});
    const el = make(c); document.body.appendChild(el);
    requestAnimationFrame(() => el.classList.add('in'));
    setTimeout(() => { location.href = url.href; }, 600);   // шторка закрыла экран, логотип проявился полностью
  });
  // возврат кнопкой «назад» из кэша: шторку убрать
  addEventListener('pageshow', (e) => { if (e.persisted) { leaving = false; document.querySelectorAll('.curtain').forEach((x) => x.remove()); } });
})();

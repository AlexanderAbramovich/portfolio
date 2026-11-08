// Переключатель «дизайн / продакшн» в шапке и переход между мирами: камера резко пролетает вбок.
// Старая страница уезжает со смазом и полосами скорости, новая влетает с той же стороны и тормозит.
// В продакшн камера летит вправо (страница уезжает влево), обратно в дизайн — зеркально.
// Подключается сразу после curtain.js, первым делом в <body>: на новой странице заслонка есть с первого кадра.
(function () {
  const RM = matchMedia('(prefers-reduced-motion: reduce)');
  const PROD = /production\.html$/.test(location.pathname);
  const DESIGN_URL = location.pathname.includes('/lab/') ? 'home.html' : './';   // в лаборатории главная = home.html, на сайте — корень
  const st = document.createElement('style');
  st.textContent = `
  .mode { position:absolute; left:50%; top:50%; transform:translate(-50%,-50%); z-index:2; display:flex; padding:4px; border-radius:30px;
    font:600 11px 'Unbounded','Arial',sans-serif; letter-spacing:.02em; text-transform:lowercase;
    background:var(--mode-bg, rgba(244,242,245,.82)); -webkit-backdrop-filter:blur(14px) saturate(1.6); backdrop-filter:blur(14px) saturate(1.6);
    box-shadow:inset 0 0 0 1.5px var(--mode-line, rgba(11,10,12,.18)); transition:background-color .4s, box-shadow .4s; }
  .mode a { position:relative; z-index:1; display:flex; align-items:center; height:34px; padding:0 16px; border-radius:26px; white-space:nowrap; transition:color .35s; }
  .mode a[aria-current="true"] { color:#fff; }
  .mode a:not([aria-current="true"]):hover { color:var(--red, #E8102A); }
  .mode i { position:absolute; top:4px; bottom:4px; left:0; border-radius:26px; z-index:0; pointer-events:none;
    background:linear-gradient(100deg,#E8102A,#FF4F93 55%,#8F3BFF); box-shadow:0 6px 18px rgba(232,16,42,.35);
    transition:transform .6s cubic-bezier(.3,1.35,.4,1), width .6s cubic-bezier(.3,1.35,.4,1); }
  @media (min-width:821px) and (max-width:1180px) { .mode { position:static; transform:none; margin-left:2.4vw; } }   /* по центру налезло бы на меню */
  @media (max-width:820px) {
    .mode { position:static; transform:none; margin:0 auto 0 14px; font-size:10px; padding:3px; }
    .mode a { height:32px; padding:0 11px; }
    .mode i { top:3px; bottom:3px; }
  }
  @media (max-width:360px) { .mode a { padding:0 8px; } }
  .whip { position:fixed; inset:0; z-index:300; pointer-events:auto; overflow:hidden; }
  .whip canvas { position:absolute; inset:0; width:100%; height:100%; }
  .whip .pan { position:absolute; top:-10%; bottom:-10%; left:-20%; right:-20%; background:var(--whip-bg,#0B0A0C); will-change:transform; }
  .whip-go { will-change:transform, filter; }`;
  document.head.appendChild(st);

  /* ——— переключатель в шапке ——— */
  const mount = () => {
    const hdr = document.getElementById('hdr');
    if (!hdr || hdr.querySelector('.mode')) return;
    const m = document.createElement('div');
    m.className = 'mode'; m.setAttribute('role', 'navigation'); m.setAttribute('aria-label', 'Направление');
    m.innerHTML = `<i aria-hidden="true"></i><a href="${DESIGN_URL}" data-whip="-1"${PROD ? '' : ' aria-current="true"'}>дизайн</a><a href="production.html" data-whip="1"${PROD ? ' aria-current="true"' : ''}>продакшн</a>`;
    const after = hdr.querySelector('.logo');
    after.insertAdjacentElement('afterend', m);
    const ind = m.querySelector('i');
    const place = () => { const a = m.querySelector('[aria-current="true"]'); ind.style.width = a.offsetWidth + 'px'; ind.style.transform = `translateX(${a.offsetLeft}px)`; };
    place(); document.fonts && document.fonts.ready.then(place); addEventListener('resize', place);
    // подложка под цвет шапки: светлые буквы → тёмное стекло
    const tone = () => {
      const c = getComputedStyle(hdr).color.match(/\d+/g) || [0, 0, 0];
      const light = (+c[0] + +c[1] + +c[2]) / 3 > 140;
      m.style.setProperty('--mode-bg', light ? 'rgba(11,10,12,.62)' : 'rgba(244,242,245,.82)');
      m.style.setProperty('--mode-line', light ? 'rgba(255,245,248,.22)' : 'rgba(11,10,12,.18)');
    };
    tone(); new MutationObserver(() => setTimeout(tone, 420)).observe(hdr, { attributes: true, attributeFilter: ['class'] });
    m._place = place;
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount); else mount();

  /* ——— полосы скорости ——— */
  const streaks = (cv, dir) => {
    const x = cv.getContext('2d'), dpr = Math.min(2, devicePixelRatio || 1);
    const W = cv.width = innerWidth * dpr, H = cv.height = innerHeight * dpr;
    const cols = ['255,79,147', '232,16,42', '143,59,255', '61,107,255', '255,245,248'];
    const L = Array.from({ length: 70 }, () => ({ y: Math.random() * H, w: (60 + Math.random() * 520) * dpr, h: (Math.random() < .2 ? 3 : 1) * dpr,
      x: Math.random() * W, v: (2200 + Math.random() * 3800) * dpr, c: cols[(Math.random() * cols.length) | 0], a: .25 + Math.random() * .6 }));
    let t0 = 0, alpha = 0, run = true;
    const draw = (t) => {
      if (!run) return;
      const dt = Math.min(.04, ((t - (t0 || t)) / 1000)); t0 = t;
      x.clearRect(0, 0, W, H);
      for (const s of L) {
        s.x -= s.v * dt * dir;
        if (dir > 0 && s.x + s.w < 0) s.x = W + Math.random() * W * .3;
        if (dir < 0 && s.x > W) s.x = -s.w - Math.random() * W * .3;
        const g = x.createLinearGradient(s.x, 0, s.x + s.w, 0);
        g.addColorStop(dir > 0 ? 0 : 1, `rgba(${s.c},${s.a * alpha})`); g.addColorStop(dir > 0 ? 1 : 0, `rgba(${s.c},0)`);
        x.fillStyle = g; x.fillRect(s.x, s.y, s.w, s.h);
      }
      requestAnimationFrame(draw);
    };
    requestAnimationFrame(draw);
    return { set a(v) { alpha = v; }, stop() { run = false; } };
  };

  const ease = (k) => 1 - Math.pow(1 - k, 4);           // торможение
  const easeIn = (k) => k * k * k;                        // разгон
  const anim = (ms, fn, done) => { const t0 = performance.now(); const f = (t) => { const k = Math.min(1, (t - t0) / ms); fn(k); if (k < 1) requestAnimationFrame(f); else done && done(); }; requestAnimationFrame(f); };
  const movers = () => [...document.querySelectorAll('body > header, body > main, body > footer')];
  const blurSvg = () => {
    let s = document.getElementById('whipSvg');
    if (!s) {
      s = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); s.id = 'whipSvg'; s.setAttribute('width', 0); s.setAttribute('height', 0); s.style.position = 'absolute';
      s.innerHTML = '<filter id="whipBlur" x="-20%" y="0" width="140%" height="100%"><feGaussianBlur id="whipDev" stdDeviation="0 0"/></filter>';
      document.body.appendChild(s);
    }
    return document.getElementById('whipDev');
  };
  const read = () => { try { const v = sessionStorage.getItem('whip'); sessionStorage.removeItem('whip'); return v ? JSON.parse(v) : null; } catch (e) { return null; } };

  /* ——— прилетели сюда пролётом: заслонка уезжает, страница влетает с той же стороны и тормозит ——— */
  const came = read();
  if (came && !RM.matches) {
    const dir = came.dir;
    const w = document.createElement('div'); w.className = 'whip'; w.setAttribute('aria-hidden', 'true');
    w.style.setProperty('--whip-bg', came.bg);
    w.innerHTML = '<div class="pan"></div><canvas></canvas>';
    (document.body || document.documentElement).appendChild(w);
    const pan = w.querySelector('.pan'), sk = streaks(w.querySelector('canvas'), dir); sk.a = 1;
    const go = () => {
      const els = movers(), dev = blurSvg();
      els.forEach((e) => { e.classList.add('whip-go'); e.style.filter = 'url(#whipBlur)'; });
      anim(760, (k) => {
        const e = ease(k), off = (1 - e) * 38 * dir;
        els.forEach((el) => { el.style.transform = `translate3d(${off}vw,0,0) skewX(${(1 - e) * -4 * dir}deg)`; });
        dev.setAttribute('stdDeviation', `${(1 - e) * 70} 0`);
        pan.style.transform = `translate3d(${-e * 140 * dir}%,0,0) skewX(${-12 * dir}deg)`;
        sk.a = 1 - e;
      }, () => {
        els.forEach((el) => { el.classList.remove('whip-go'); el.style.transform = ''; el.style.filter = ''; });
        sk.stop(); w.remove();
      });
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => requestAnimationFrame(go)); else requestAnimationFrame(go);
  }

  /* ——— уходим: разгон камеры вбок ——— */
  let leaving = false;
  addEventListener('click', (e) => {
    const a = e.target.closest('a[data-whip]');
    if (!a || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault(); e.stopPropagation();            // шторку curtain.js не зовём: у пролёта своя анимация
    if (a.getAttribute('aria-current') === 'true' || leaving) return;
    const dir = +a.dataset.whip, href = a.href, bg = dir > 0 ? '#0B0A0C' : '#F4F2F5';
    const m = a.closest('.mode');
    if (m) { m.querySelectorAll('a').forEach((x) => x.removeAttribute('aria-current')); a.setAttribute('aria-current', 'true'); m._place && m._place(); }
    try { sessionStorage.setItem('whip', JSON.stringify({ dir, bg })); } catch (err) {}
    if (RM.matches) { location.href = href; return; }
    leaving = true;
    const w = document.createElement('div'); w.className = 'whip'; w.setAttribute('aria-hidden', 'true'); w.style.setProperty('--whip-bg', bg);
    w.innerHTML = '<canvas></canvas><div class="pan"></div>';
    document.body.appendChild(w);
    const pan = w.querySelector('.pan'); pan.style.transform = `translate3d(${140 * dir}%,0,0) skewX(${-12 * dir}deg)`;
    const sk = streaks(w.querySelector('canvas'), dir), els = movers(), dev = blurSvg();
    els.forEach((el) => { el.classList.add('whip-go'); el.style.filter = 'url(#whipBlur)'; });
    setTimeout(() => { location.href = href; }, 560);
    anim(540, (k) => {
      const e = easeIn(k);
      els.forEach((el) => { el.style.transform = `translate3d(${-e * 42 * dir}vw,0,0) skewX(${e * 4 * dir}deg)`; });
      dev.setAttribute('stdDeviation', `${e * 80} 0`);
      sk.a = Math.min(1, k * 1.6);
      pan.style.transform = `translate3d(${(1 - easeIn(Math.max(0, (k - .35) / .65))) * 140 * dir}%,0,0) skewX(${-12 * dir}deg)`;
    });
  }, true);
  addEventListener('pageshow', (e) => { if (e.persisted) { leaving = false; document.querySelectorAll('.whip').forEach((x) => x.remove());
    movers().forEach((el) => { el.style.transform = ''; el.style.filter = ''; el.classList.remove('whip-go'); }); } });
})();

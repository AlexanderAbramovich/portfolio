// Общая механика страниц лаборатории: шапка (цвет под секцию, стекло после прокрутки), меню на телефоне,
// курсор-линза, появление блоков, лак в финальном блоке. Страница подключает shell.js и затем свой скрипт.
(function () {
  const $ = (id) => document.getElementById(id);
  const RM = matchMedia('(prefers-reduced-motion: reduce)');
  const IS_TOUCH = matchMedia('(hover: none)').matches;
  const pointer = { x: -9999, y: -9999, last: -1e9 };
  addEventListener('pointermove', (e) => { pointer.x = e.clientX; pointer.y = e.clientY; pointer.last = performance.now(); }, { passive: true });

  /* шапка: тёмная секция под ней — светлые буквы; после начала прокрутки — стекло */
  const hdr = $('hdr');
  let bands = [];
  const readBands = () => { bands = [...document.querySelectorAll('.dark:not(footer)')].map((s) => { const r = s.getBoundingClientRect(); return [r.top + scrollY, r.bottom + scrollY]; }); };
  const headerSync = () => {
    const y = scrollY + 34;
    hdr.classList.toggle('on-dark', bands.some(([a, b]) => y >= a && y <= b));
    hdr.classList.toggle('solid', scrollY > 40);
  };
  let sq = false;
  addEventListener('scroll', () => { if (sq) return; sq = true; requestAnimationFrame(() => { sq = false; headerSync(); }); }, { passive: true });
  const relayout = () => { readBands(); headerSync(); };
  addEventListener('resize', relayout);
  new ResizeObserver(relayout).observe(document.body);
  relayout();

  /* меню на телефоне */
  const menuBtn = $('menuBtn'), nav = $('nav');
  const setMenu = (open, refocus) => { hdr.classList.toggle('open', open); menuBtn.setAttribute('aria-expanded', String(open)); if (!open && refocus) menuBtn.focus(); };
  menuBtn.addEventListener('click', () => setMenu(!hdr.classList.contains('open')));
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && hdr.classList.contains('open')) setMenu(false, true); });
  document.addEventListener('click', (e) => { if (hdr.classList.contains('open') && !hdr.contains(e.target)) setMenu(false); });

  /* появление блоков; новые блоки (после загрузки данных) регистрируются через Shell.reveal() */
  const rio = new IntersectionObserver((es) => es.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); rio.unobserve(en.target); } }), { threshold: .08 });
  const reveal = (root = document) => root.querySelectorAll('.rv:not(.in)').forEach((el) => rio.observe(el));
  reveal();
  // страховка от прыжков (якорь, End, ползунок, ссылка на середину): всё, что уже выше нижнего края экрана, показываем сразу
  let catchT = 0;
  const catchUp = () => document.querySelectorAll('.rv:not(.in)').forEach((el) => { if (el.getBoundingClientRect().top < innerHeight) { el.classList.add('in'); rio.unobserve(el); } });
  addEventListener('scroll', () => { clearTimeout(catchT); catchT = setTimeout(catchUp, 160); }, { passive: true });
  addEventListener('load', catchUp);
  window.__fxOK = true;

  /* курсор — стеклянная линза: карта преломления рисуется один раз, кольцо догоняет мышь и засыпает */
  const ring = $('ring');
  if (ring && !IS_TOUCH) {
    const N = 96, c = document.createElement('canvas'); c.width = c.height = N; const x = c.getContext('2d'), im = x.createImageData(N, N);
    for (let y = 0; y < N; y++) for (let i = 0; i < N; i++) {
      const nx = (i + .5) / N * 2 - 1, ny = (y + .5) / N * 2 - 1, d = Math.min(1, Math.hypot(nx, ny)), f = Math.pow(d, 2.6) * (d < 1 ? 1 : 0);
      const o = (y * N + i) * 4; im.data[o] = 128 - nx * f * 127; im.data[o + 1] = 128 - ny * f * 127; im.data[o + 2] = 128; im.data[o + 3] = 255;
    }
    x.putImageData(im, 0, 0); $('lensMap').setAttribute('href', c.toDataURL());
    let rx = 0, ry = 0, ra = 0, run = false;
    const tick = () => {
      rx += (pointer.x - rx) * .2; ry += (pointer.y - ry) * .2; ra = (ra + 2) % 360;
      ring.style.translate = `${rx}px ${ry}px`; ring.style.setProperty('--a', ra + 'deg');
      if (Math.abs(pointer.x - rx) + Math.abs(pointer.y - ry) < .3 && performance.now() - pointer.last > 160) { run = false; return; }
      requestAnimationFrame(tick);
    };
    addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      ring.style.opacity = 1; ring.classList.toggle('big', !!e.target.closest('a,button,input,textarea,label'));
      if (!run && !RM.matches) { run = true; requestAnimationFrame(tick); }
    }, { passive: true });
    document.addEventListener('pointerleave', () => { ring.style.opacity = 0; });
  }

  /* жидкий лак в блоке .lq: рисуется, только пока блок на экране и вкладка видна; при уменьшенном движении — один кадр */
  document.querySelectorAll('.lq').forEach((sec) => {
    const cv = sec.querySelector('canvas.lq-c');
    const lq = cv && window.Liquid && Liquid(cv, { scale: IS_TOUCH ? .5 : .75, zoom: 3.3, drift: [.16, -.16], angle: -.7 });
    if (!lq) { sec.classList.add('no-gl'); if (cv) cv.remove(); return; }
    let mx = .5, my = .5, T = 20, vis = false, on = false, last = 0;
    const still = () => lq.draw(T * 1000, .5, .5, 1, 0);
    const frame = (t) => {
      const dt = Math.min(.05, (t - (last || t)) / 1000); last = t; T += dt;
      const r = sec.getBoundingClientRect(), has = !IS_TOUCH && pointer.x > -9000;
      const tx = has ? (pointer.x - r.left) / r.width : .5 + .3 * Math.sin(T * .25), ty = has ? 1 - (pointer.y - r.top) / r.height : .5;
      mx += (tx - mx) * .04; my += (ty - my) * .04; lq.draw(T * 1000, mx, my, 1, 0);
      if (on) requestAnimationFrame(frame);
    };
    const sync = () => {
      const go = vis && !document.hidden && !RM.matches;
      if (go && !on) { on = true; last = 0; requestAnimationFrame(frame); }
      if (!go) { on = false; if (vis) still(); }
    };
    new ResizeObserver(() => { lq.resize(sec.clientWidth, sec.clientHeight); still(); }).observe(sec);
    new IntersectionObserver((es) => { vis = es[0].isIntersecting; sync(); }).observe(sec);
    document.addEventListener('visibilitychange', sync); RM.addEventListener('change', sync);
  });

  /* данные сайта (работы, темы, услуги) выгружаются из src скриптом scripts/export-lab-data.mjs */
  let dataP = null;
  const data = () => dataP || (dataP = fetch('site-data.json').then((r) => r.json()));

  /* крупные заголовки: самое длинное слово не должно вылезать за край — кегль уменьшается, пока не влезет */
  const FIT = '.pg-h, .sec-h h2, .svc h2, .lq h1, .lq h2, .reach h2, .c-title, .next b, .blk-h h3';
  const fit = () => document.querySelectorAll(FIT).forEach((el) => {
    el.style.fontSize = '';
    let fs = parseFloat(getComputedStyle(el).fontSize);
    while (el.scrollWidth > el.clientWidth + 1 && fs > 18) { fs -= 2; el.style.fontSize = fs + 'px'; }
  });
  let fitW = 0;
  addEventListener('resize', () => { if (innerWidth !== fitW) { fitW = innerWidth; fit(); } });
  document.fonts.ready.then(fit);

  window.Shell = { $, RM, IS_TOUCH, pointer, reveal, relayout, data, fit, CASE: 'case.html?id=', CASE_TAB: '' };
})();

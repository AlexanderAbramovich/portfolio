// 3D-капля из жидкого лака: хромовая сфера, которая дышит шумом и тянется к курсору.
// mountBlob(container) — сама следит за видимостью и размером контейнера.
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

const NOISE = `
vec3 mod289(vec3 x){ return x - floor(x*(1./289.))*289.; }
vec4 mod289(vec4 x){ return x - floor(x*(1./289.))*289.; }
vec4 permute(vec4 x){ return mod289(((x*34.)+1.)*x); }
vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - .85373472095314*r; }
float snoise(vec3 v){
  const vec2 C = vec2(1./6., 1./3.); const vec4 D = vec4(0., .5, 1., 2.);
  vec3 i = floor(v + dot(v, C.yyy)); vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz); vec3 l = 1. - g; vec3 i1 = min(g.xyz, l.zxy); vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx; vec3 x2 = x0 - i2 + C.yyy; vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(i.z + vec4(0., i1.z, i2.z, 1.)) + i.y + vec4(0., i1.y, i2.y, 1.)) + i.x + vec4(0., i1.x, i2.x, 1.));
  float n_ = .142857142857; vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49. * floor(p * ns.z * ns.z); vec4 x_ = floor(j * ns.z); vec4 y_ = floor(j - 7. * x_);
  vec4 x = x_ * ns.x + ns.yyyy; vec4 y = y_ * ns.x + ns.yyyy; vec4 h = 1. - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy); vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0)*2. + 1.; vec4 s1 = floor(b1)*2. + 1.; vec4 sh = -step(h, vec4(0.));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy; vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x); vec3 p1 = vec3(a0.zw, h.y); vec3 p2 = vec3(a1.xy, h.z); vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.); m = m*m;
  return 42. * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}
uniform float uTime, uAmp, uPull, uFold; uniform vec3 uMouse;
vec3 displace(vec3 p){
  vec3 n = normalize(p);
  float d = snoise(n*.7 + vec3(0., uTime*.16, 0.)) * uAmp
          + snoise(n*1.2 - vec3(uTime*.12)) * uAmp * .08;
  float r = 1. - abs(snoise(n*.62 + vec3(uTime*.08, 0., uTime*.06)));   // острые складки, как у мятого металла
  d += (smoothstep(.15, 1., r) - .45) * uFold;
  float toward = max(0., dot(n, uMouse));
  d += pow(toward, 5.) * uPull;                       // капля тянется к курсору
  return n * (1. + d);
}`;

// окружение для отражений: чёрная студия с полосами лака — розовый, красный, фиолетовый, синий
function lacquerEnv(renderer) {
  const c = document.createElement('canvas'); c.width = 1024; c.height = 512;
  const x = c.getContext('2d');
  x.fillStyle = '#020103'; x.fillRect(0, 0, 1024, 512);
  const bands = [
    [120, 140, 260, 90, '#ff2d7a'], [430, 90, 200, 70, '#ffffff'], [640, 200, 300, 110, '#8f3bff'],
    [880, 120, 160, 60, '#3d6bff'], [260, 330, 380, 80, '#e8102a'], [760, 380, 220, 70, '#ff7ab8'],
    [40, 420, 180, 50, '#62d8ff'], [560, 20, 260, 40, '#ffd2e6'],
  ];
  x.filter = 'blur(22px)';
  for (const [bx, by, bw, bh, col] of bands) {
    const g = x.createLinearGradient(bx, by, bx + bw, by + bh);
    g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(.5, col); g.addColorStop(1, 'rgba(0,0,0,0)');
    x.fillStyle = g; x.beginPath(); x.ellipse(bx + bw / 2, by + bh / 2, bw / 2, bh / 2, -.25, 0, Math.PI * 2); x.fill();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.mapping = THREE.EquirectangularReflectionMapping; tex.colorSpace = THREE.SRGBColorSpace;
  const pm = new THREE.PMREMGenerator(renderer), env = pm.fromEquirectangular(tex).texture;
  pm.dispose(); tex.dispose(); return env;
}

// светлая студия для жемчужной капли на белом: мягкие серые тени снизу, белые софтбоксы, лёгкий перелив
function pearlEnv(renderer) {
  const c = document.createElement('canvas'); c.width = 1024; c.height = 512;
  const x = c.getContext('2d');
  const g = x.createLinearGradient(0, 0, 0, 512);
  g.addColorStop(0, '#ffffff'); g.addColorStop(.4, '#ebe8ee'); g.addColorStop(1, '#3a2c44');
  x.fillStyle = g; x.fillRect(0, 0, 1024, 512);
  x.filter = 'blur(30px)';
  const spots = [[180, 110, 240, 80, '#ffffff'], [620, 80, 300, 70, '#ffffff'], [140, 330, 300, 120, '#ff2d7a'], [440, 380, 340, 130, '#8f3bff'], [760, 340, 320, 120, '#3d6bff'], [960, 420, 220, 110, '#e8102a'], [600, 470, 360, 80, '#ff4f93'], [300, 250, 200, 50, '#62d8ff']];
  for (const [bx, by, bw, bh, col] of spots) { x.fillStyle = col; x.beginPath(); x.ellipse(bx, by, bw / 2, bh / 2, 0, 0, Math.PI * 2); x.fill(); }
  const tex = new THREE.CanvasTexture(c);
  tex.mapping = THREE.EquirectangularReflectionMapping; tex.colorSpace = THREE.SRGBColorSpace;
  const pm = new THREE.PMREMGenerator(renderer), env = pm.fromEquirectangular(tex).texture;
  pm.dispose(); tex.dispose(); return env;
}

// белая студия с яркими цветными полосами — хром на белом фоне
function chromeEnv(renderer) {
  const c = document.createElement('canvas'); c.width = 1024; c.height = 512;
  const x = c.getContext('2d');
  x.fillStyle = '#f4f2f6'; x.fillRect(0, 0, 1024, 512);
  x.filter = 'blur(24px)';
  // широкие мягкие зоны: много белого, крупные пятна маджента/красный/фиолет и пара тёмных складок
  const bands = [[90, '#ff2d7a', 230], [290, '#22052e', 170], [470, '#e8102a', 210], [640, '#ffffff', 110], [800, '#9b3bff', 220], [960, '#2a0838', 130]];
  for (const [bx, col, bw] of bands) for (const off of [-1024, 0, 1024]) {   // повтор по краям — без шва
    x.fillStyle = col; x.beginPath(); x.ellipse(bx + off, 268, bw / 2, 128, 0, 0, Math.PI * 2); x.fill(); }
  x.filter = 'blur(4px)'; x.fillStyle = 'rgba(255,255,255,.95)';      // резкие белые блики
  for (const [hx, hy, hw, hh] of [[180, 200, 210, 9], [560, 240, 260, 8], [880, 300, 190, 8]])
    for (const off of [-1024, 0, 1024]) { x.beginPath(); x.ellipse(hx + off, hy, hw, hh, -.2, 0, Math.PI * 2); x.fill(); }
  x.filter = 'none'; x.fillStyle = '#f7f5f9'; x.fillRect(0, 0, 1024, 96); x.fillStyle = '#d9d4de'; x.fillRect(0, 440, 1024, 72);   // полюса ровные — без «звезды»
  const tex = new THREE.CanvasTexture(c);
  tex.mapping = THREE.EquirectangularReflectionMapping; tex.colorSpace = THREE.SRGBColorSpace;
  const pm = new THREE.PMREMGenerator(renderer), env = pm.fromEquirectangular(tex).texture;
  pm.dispose(); tex.dispose(); return env;
}

// светлая серебряная студия для головы: много белого и серого, цвет лака — только бледными отсветами, чтобы не спорить с текстом
function softChromeEnv(renderer) {
  const c = document.createElement('canvas'); c.width = 1024; c.height = 512;
  const x = c.getContext('2d');
  x.fillStyle = '#eceaef'; x.fillRect(0, 0, 1024, 512);
  x.filter = 'blur(28px)';
  const bands = [[90, '#f2c4d6', 230], [290, '#5e5966', 170], [470, '#f7f6f9', 210], [640, '#d5c9f2', 150], [800, '#8a8592', 220], [960, '#c4cbe6', 130]];
  for (const [bx, col, bw] of bands) for (const off of [-1024, 0, 1024]) {
    x.fillStyle = col; x.beginPath(); x.ellipse(bx + off, 268, bw / 2, 128, 0, 0, Math.PI * 2); x.fill(); }
  x.filter = 'blur(4px)'; x.fillStyle = 'rgba(255,255,255,.9)';
  for (const [hx, hy, hw, hh] of [[180, 200, 210, 9], [560, 240, 260, 8], [880, 300, 190, 8]])
    for (const off of [-1024, 0, 1024]) { x.beginPath(); x.ellipse(hx + off, hy, hw, hh, -.2, 0, Math.PI * 2); x.fill(); }
  x.filter = 'none'; x.fillStyle = '#f7f5f9'; x.fillRect(0, 0, 1024, 96); x.fillStyle = '#cfcbd4'; x.fillRect(0, 440, 1024, 72);
  const tex = new THREE.CanvasTexture(c);
  tex.mapping = THREE.EquirectangularReflectionMapping; tex.colorSpace = THREE.SRGBColorSpace;
  const pm = new THREE.PMREMGenerator(renderer), env = pm.fromEquirectangular(tex).texture;
  pm.dispose(); tex.dispose(); return env;
}

// mountBlob(host, opts): капля в контейнере host.
// opts.place(w, h) → { cx, cy, r } в пикселях контейнера — где стоит капля и какого она радиуса; пересчитывается при любом изменении размера.
// Если WebGL недоступен, возвращает null — страница показывает статичную картинку на том же месте.
export function mountBlob(host, opts = {}) {
  if (host.__blob) return host.__blob;                        // повторный вызов не создаёт вторую сцену
  const pearl = opts.look === 'pearl', chrome = opts.look === 'chrome';
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: !!opts.keep }); }
  catch (e) { console.warn('blob: WebGL недоступен', e); return null; }
  let broken = false;
  renderer.debug.onShaderError = () => { broken = true; host.classList.add('still-on'); renderer.setAnimationLoop(null); };
  renderer.setPixelRatio(Math.min(1.5, devicePixelRatio));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  host.appendChild(renderer.domElement);
  renderer.domElement.setAttribute('aria-hidden', 'true');
  Object.assign(renderer.domElement.style, { position: 'absolute', inset: '0', width: '100%', height: '100%' });

  const scene = new THREE.Scene();
  scene.environment = chrome ? chromeEnv(renderer) : pearl ? pearlEnv(renderer) : lacquerEnv(renderer);
  const FOV = 32, R0 = 1.22;                                  // R0 — видимый радиус при scale 1: с выпуклостями и тягой к курсору
  const camera = new THREE.PerspectiveCamera(FOV, 1, .1, 50); camera.position.set(0, 0, 6.2);

  const uniforms = { uTime: { value: 0 }, uAmp: { value: chrome ? .24 : pearl ? .15 : .2 }, uPull: { value: 0 }, uFold: { value: chrome ? .2 : 0 }, uMouse: { value: new THREE.Vector3(0, 0, 1) } };
  const mat = chrome
    ? new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 1, roughness: .025, envMapIntensity: 1.4,
        clearcoat: 1, clearcoatRoughness: .01, iridescence: .85, iridescenceIOR: 1.8, iridescenceThicknessRange: [150, 750] })
    : pearl
    ? new THREE.MeshPhysicalMaterial({ color: 0xf6f4f7, metalness: .15, roughness: .2, envMapIntensity: 1.3,
        clearcoat: 1, clearcoatRoughness: .08, iridescence: 1, iridescenceIOR: 1.9, iridescenceThicknessRange: [180, 820],
        sheen: .6, sheenRoughness: .4, sheenColor: new THREE.Color(0xffe2ee) })
    : new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 1, roughness: .09, envMapIntensity: 1.7,
        clearcoat: 1, clearcoatRoughness: .05, iridescence: .9, iridescenceIOR: 1.7, iridescenceThicknessRange: [120, 700] });
  mat.onBeforeCompile = sh => {
    Object.assign(sh.uniforms, uniforms);
    sh.vertexShader = NOISE + `
` + sh.vertexShader
      .replace('#include <beginnormal_vertex>', `
        vec3 pd = displace(position);
        vec3 nn = normalize(position);
        vec3 tg = normalize(cross(nn, abs(nn.y) > .9 ? vec3(1.,0.,0.) : vec3(0.,1.,0.)));
        vec3 bt = cross(nn, tg);
        vec3 pa = displace(position + tg * .006), pb = displace(position + bt * .006);
        vec3 objectNormal = normalize(cross(pa - pd, pb - pd));`)
      .replace('#include <begin_vertex>', 'vec3 transformed = pd;');
  };
  const touch = matchMedia('(hover: none)').matches;
  const blob = new THREE.Mesh(new THREE.IcosahedronGeometry(1, chrome ? (touch ? 60 : 90) : 40), mat);
  scene.add(blob);

  // курсор: капля тянется к нему; без мыши сама медленно «ищет»
  const m = { x: 0, y: 0, tx: 0, ty: 0, last: -1e9 };
  const onMove = e => { if (e.pointerType !== 'mouse') return; const r = host.getBoundingClientRect();
    m.tx = ((e.clientX - r.left) / r.width) * 2 - 1; m.ty = -(((e.clientY - r.top) / r.height) * 2 - 1); m.last = performance.now(); };
  addEventListener('pointermove', onMove, { passive: true });

  // своё время капли: после паузы форма продолжается с того же места, без скачка
  let T = 12, last = 0, pull = .2, running = false, visible = false, lost = false;
  const rm = matchMedia('(prefers-reduced-motion: reduce)');
  function draw(dt){
    T += dt;
    if (touch || performance.now() - m.last > 3000) { m.tx = Math.sin(T * .6) * .7; m.ty = Math.cos(T * .8) * .5; }
    const k = dt ? .05 : 1;                                    // статичный кадр — сразу в покое
    m.x += (m.tx - m.x) * k; m.y += (m.ty - m.y) * k;
    const near = Math.max(0, 1 - Math.hypot(m.tx, m.ty) * .7);
    pull += ((touch ? .22 : .18 + near * .25) - pull) * k;
    uniforms.uTime.value = T; uniforms.uPull.value = pull;
    uniforms.uMouse.value.set(m.x, m.y, .9).normalize();
    blob.rotation.y = T * .12 + m.x * .35; blob.rotation.x = -m.y * .25;
    renderer.render(scene, camera);
    if (!broken && !host.dataset.ok) { host.dataset.ok = '1'; host.classList.remove('still-on'); }
  }
  const frame = t => { const dt = Math.min(.05, (t - (last || t)) / 1000); last = t; draw(dt); };
  function sync(){
    const run = visible && !document.hidden && !rm.matches && !lost && !broken;
    if (run !== running) { running = run; last = 0; renderer.setAnimationLoop(run ? frame : null); }
    if (!run && rm.matches && visible && !lost && !broken) draw(0);   // спокойный режим: один неподвижный кадр
  }

  let w = 0, h = 0;
  function size(){
    w = host.clientWidth; h = host.clientHeight; if (!w || !h) return;
    renderer.setSize(w, h, false); camera.aspect = w / h; camera.position.z = w < h ? 7.6 : 6.2; camera.updateProjectionMatrix();
    if (opts.place) {
      const p = opts.place(w, h), k = 2 * Math.tan(FOV * Math.PI / 360) * camera.position.z / h;   // мировых единиц в пикселе
      blob.position.set((p.cx - w / 2) * k, -(p.cy - h / 2) * k, 0); blob.scale.setScalar(p.r * k / R0);
    } else { blob.scale.setScalar(opts.scale || 1); blob.position.set(opts.x || 0, opts.y || 0, 0); }
    if (!running && visible && !lost && !broken) draw(0);
  }
  const ro = new ResizeObserver(size); ro.observe(host); size();
  const io = new IntersectionObserver(es => { visible = es[0].isIntersecting; sync(); }); io.observe(host);
  document.addEventListener('visibilitychange', sync);
  rm.addEventListener('change', sync);
  renderer.domElement.addEventListener('webglcontextlost', e => { e.preventDefault(); lost = true; host.classList.add('still-on'); sync(); });
  renderer.domElement.addEventListener('webglcontextrestored', () => { lost = false; host.classList.remove('still-on'); sync(); });

  function destroy(){
    renderer.setAnimationLoop(null); ro.disconnect(); io.disconnect();
    removeEventListener('pointermove', onMove); document.removeEventListener('visibilitychange', sync); rm.removeEventListener('change', sync);
    blob.geometry.dispose(); mat.dispose(); glass.dispose(); if (scene.environment) scene.environment.dispose();
    renderer.dispose(); renderer.domElement.remove(); delete host.__blob; delete host.dataset.ok;
  }
  return (host.__blob = { renderer, resize: size, destroy });
}

// mountHead(host, opts): хромовый человек по грудь. Поворачивается только голова на шее (кости neck_01 и head), плечи стоят.
// Сама медленно оглядывается, на компьютере смотрит на курсор.
// opts.place(w, h) → { cx, cy, r } — центр и половина высоты кадра «макушка → грудь» в пикселях контейнера. null, если WebGL нет.
export function mountHead(host, opts = {}) {
  if (host.__head) return host.__head;
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: !!opts.keep }); }
  catch (e) { console.warn('head: WebGL недоступен', e); return null; }
  let broken = false;
  renderer.debug.onShaderError = () => { broken = true; host.classList.add('still-on'); renderer.setAnimationLoop(null); };
  renderer.setPixelRatio(Math.min(1.5, devicePixelRatio));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  host.appendChild(renderer.domElement);
  renderer.domElement.setAttribute('aria-hidden', 'true');
  Object.assign(renderer.domElement.style, { position: 'absolute', inset: '0', width: '100%', height: '100%' });

  const scene = new THREE.Scene();
  scene.environment = chromeEnv(renderer);
  const FOV = 28, camera = new THREE.PerspectiveCamera(FOV, 1, .1, 50); camera.position.set(0, 0, 7);
  const mat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 1, roughness: .06, envMapIntensity: 1.35,
    clearcoat: 1, clearcoatRoughness: .03, iridescence: .9, iridescenceIOR: 1.8, iridescenceThicknessRange: [180, 780] });
  // модель — человек MPFB по грудь со скелетом; в extras узла скелета лежит кадр: frame_top (макушка) и frame_bottom (линия груди), метры
  // кадр приводится к -1..1 по высоте, как раньше; ниже груди меш продолжается и уходит за край героя
  // стёкла авиаторов: прозрачные, с бликом лака
  const glass = new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: .2, roughness: .03, envMapIntensity: 1.6, clearcoat: 1,
    transparent: true, opacity: .28, depthWrite: false, iridescence: .6, iridescenceIOR: 1.6 });
  const pivot = new THREE.Group(); scene.add(pivot);
  let head = null, neckBone = null, headBone = null, look = { yaw: 0, pitch: 0 };
  const loader = new GLTFLoader(), draco = new DRACOLoader();
  draco.setDecoderPath('https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/libs/draco/gltf/');
  loader.setDRACOLoader(draco);
  loader.load(opts.model, gltf => {
    const root = gltf.scene; let frame = null;
    root.traverse(o => { if (o.isMesh) { o.material = o.material && o.material.name === 'lens' ? glass : mat; o.frustumCulled = false; } if (o.userData && o.userData.frame_top != null) frame = o.userData; });
    neckBone = root.getObjectByName('neck_01'); headBone = root.getObjectByName('head');
    if (!frame || !neckBone || !headBone) { console.warn('head: в модели нет кадра или костей шеи'); broken = true; host.classList.add('still-on'); return; }
    const half = (frame.frame_top - frame.frame_bottom) / 2, yc = (frame.frame_top + frame.frame_bottom) / 2;
    root.scale.setScalar(1 / half); root.position.y = -yc / half;
    neckBone.userData.rest = neckBone.quaternion.clone(); headBone.userData.rest = headBone.quaternion.clone();
    head = root; pivot.add(root); size(); sync(); draco.dispose();
  }, undefined, e => { console.warn('head: модель не загрузилась', e); broken = true; host.classList.add('still-on'); });

  // поворот головы в мировых осях: шея берёт 40 %, голова 60 %; плечи и грудь не двигаются
  const _q = new THREE.Quaternion(), _pw = new THREE.Quaternion(), _e = new THREE.Euler(0, 0, 0, 'YXZ');
  function turn(bone, f){
    bone.quaternion.copy(bone.userData.rest);
    bone.parent.updateWorldMatrix(true, false); bone.parent.getWorldQuaternion(_pw);
    _q.setFromEuler(_e.set(look.pitch * f, look.yaw * f, 0));
    bone.quaternion.premultiply(_pw.clone().invert().multiply(_q).multiply(_pw));
    bone.updateMatrixWorld(true);
  }

  const m = { x: 0, y: 0, tx: 0, ty: 0, last: -1e9 };
  const onMove = e => { if (e.pointerType !== 'mouse') return; const r = host.getBoundingClientRect();
    m.tx = ((e.clientX - r.left) / r.width) * 2 - 1; m.ty = -(((e.clientY - r.top) / r.height) * 2 - 1); m.last = performance.now(); };
  addEventListener('pointermove', onMove, { passive: true });
  const touch = matchMedia('(hover: none)').matches, rm = matchMedia('(prefers-reduced-motion: reduce)');
  let T = 3, last = 0, running = false, visible = false, lost = false, base = { x: 0, y: 0 };
  function draw(dt){
    if (!head) return;
    T += dt;
    const free = touch || performance.now() - m.last > 2500;             // без курсора — медленно оглядывается сама
    const cl = (v, a) => Math.max(-a, Math.min(a, v));                 // пределы как у живой шеи
    const ty = free ? Math.sin(T * .22) * .5 : cl((m.tx - base.x) * .6, .7), tx = free ? Math.sin(T * .17) * .06 : cl(-(m.ty - base.y) * .3, .22);
    const k = dt ? 1 - Math.pow(.05, dt) : 1;
    look.yaw += (ty - look.yaw) * k; look.pitch += (tx - look.pitch) * k;
    turn(neckBone, .4); turn(headBone, .6);
    renderer.render(scene, camera);
    if (!broken && !host.dataset.ok) { host.dataset.ok = '1'; host.classList.remove('still-on'); }
  }
  const frame = t => { const dt = Math.min(.05, (t - (last || t)) / 1000); last = t; draw(dt); };
  function sync(){
    const run = visible && !document.hidden && !rm.matches && !lost && !broken && !!head;
    if (run !== running) { running = run; last = 0; renderer.setAnimationLoop(run ? frame : null); }
    if (!run && rm.matches && visible && !lost && !broken) draw(0);
  }
  function size(){
    const w = host.clientWidth, h = host.clientHeight; if (!w || !h) return;
    renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
    const p = opts.place(w, h), k = 2 * Math.tan(FOV * Math.PI / 360) * camera.position.z / h;
    const s = p.r * k;                                                      // половина высоты головы в мировых единицах
    pivot.scale.setScalar(s); pivot.position.x = (p.cx - w / 2) * k; base.py = -(p.cy - h / 2) * k; base.s = s; pivot.position.y = base.py;
    base.x = (p.cx / w) * 2 - 1; base.y = -(((p.cy - p.r * .45) / h) * 2 - 1);   // «прямо» = курсор на лице, а не на груди
    if (!running && visible && !lost && !broken) draw(0);
  }
  const ro = new ResizeObserver(size); ro.observe(host); size();
  const io = new IntersectionObserver(es => { visible = es[0].isIntersecting; sync(); }); io.observe(host);
  document.addEventListener('visibilitychange', sync); rm.addEventListener('change', sync);
  renderer.domElement.addEventListener('webglcontextlost', e => { e.preventDefault(); lost = true; host.classList.add('still-on'); sync(); });
  renderer.domElement.addEventListener('webglcontextrestored', () => { lost = false; host.classList.remove('still-on'); sync(); });
  function destroy(){
    renderer.setAnimationLoop(null); ro.disconnect(); io.disconnect();
    removeEventListener('pointermove', onMove); document.removeEventListener('visibilitychange', sync); rm.removeEventListener('change', sync);
    if (head) head.traverse(o => { if (o.isMesh) o.geometry.dispose(); }); mat.dispose(); glass.dispose(); if (scene.environment) scene.environment.dispose();
    renderer.dispose(); renderer.domElement.remove(); delete host.__head; delete host.dataset.ok;
  }
  return (host.__head = { renderer, resize: size, destroy });
}

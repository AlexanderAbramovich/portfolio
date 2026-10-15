// Жидкий лак: глянцевые складки атласа на чёрном, яркие блики, курсор закручивает.
// Использование: const lq = Liquid(canvas, { scale }); lq.draw(timeMs, mouseX01, mouseY01, dim, hole)
window.Liquid = function (canvas, opts = {}) {
  const gl = canvas.getContext('webgl', { antialias: false, premultipliedAlpha: false, preserveDrawingBuffer: !!opts.keep });
  if (!gl) return null;
  const FS = `
precision highp float;
uniform vec2 res, mouse, drift; uniform float t, dim, hole, zoom, ang;
// течение шёлка: координаты много раз закручиваются синусами — получаются длинные плавные ленты
vec2 flow(vec2 p){
  for (int i = 1; i < 7; i++){
    float fi = float(i);
    p.x += .62/fi * sin(fi*1.55*p.y + t*.32 + .9*fi) + .25;
    p.y += .62/fi * cos(fi*1.35*p.x + t*.27 + 1.3*fi) - .15;
  }
  return p;
}
vec2 W;
float height(vec2 p){ W = flow(p); return sin(W.x*1.15 + W.y*.65); }
void main(){
  vec2 uv = gl_FragCoord.xy / res;
  vec2 p = (gl_FragCoord.xy - .5*res) / res.y * zoom;
  vec2 mp = (mouse*res - .5*res) / res.y * zoom;
  vec2 d = p - mp; float l = length(d);
  p += vec2(-d.y, d.x) * exp(-l*l*1.2) * .7;          // курсор закручивает ткань
  p = mat2(cos(ang), -sin(ang), sin(ang), cos(ang)) * p - drift * t;   // ленты по диагонали, поток идёт из правого нижнего угла
  float e = 2. / res.y * zoom;
  float H = height(p); vec2 w = W;
  float Hx = height(p + vec2(e,0.)), Hy = height(p + vec2(0.,e));
  vec3 n = normalize(vec3(-(Hx-H)/e*.32, -(Hy-H)/e*.32, 1.));
  vec3 V = vec3(0.,0.,1.);
  vec3 L1 = normalize(vec3(-.45,.6,.65)), L2 = normalize(vec3(.65,-.35,.55));
  float d1 = max(dot(n,L1),0.), d2 = max(dot(n,L2),0.);
  float s1 = pow(max(dot(reflect(-L1,n),V),0.), 60.);
  float s2 = pow(max(dot(reflect(-L2,n),V),0.), 22.);
  float fres = pow(1. - max(n.z,0.), 2.2);
  vec3 red = vec3(.92,.02,.10), pink = vec3(1.,.30,.62), violet = vec3(.50,.08,.95), blue = vec3(.06,.30,1.), wine = vec3(.30,0.,.05);
  // цвет лентами: красный → розовый → фиолетовый → синий
  float hc = .5 + .5*sin(w.y*.55 - w.x*.35 + 1.3);
  vec3 base = mix(red, pink, smoothstep(.15,.45,hc));
  base = mix(base, violet, smoothstep(.45,.75,hc));
  base = mix(base, blue, smoothstep(.8,1.,hc)*.5);
  // ткань: впадины уходят в чёрный, гребни горят цветом
  float crest = smoothstep(-.75, 1., H);
  float body = crest*crest;
  vec3 c = base * (d1*1.1 + d2*.45) * body + wine * .2 * crest;
  c += s1 * vec3(1.,.96,.98) * body * 1.5;
  c += s2 * mix(pink, vec3(1.), .35) * body * .65;
  c += fres * vec3(.35,.82,1.) * .4 * crest;
  // тёмное окно под имя в герое
  float hw = smoothstep(.75, .05, length((uv - vec2(.5,.6)) * vec2(1., 1.7)));
  c *= 1. - hole * hw * .85;
  c *= dim;
  gl_FragColor = vec4(c, 1.);
}`;
  const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.error(gl.getShaderInfoLog(s)); return null; } return s; };
  const vs = sh(gl.VERTEX_SHADER, 'attribute vec2 p; void main(){ gl_Position = vec4(p,0.,1.); }');
  const fs = sh(gl.FRAGMENT_SHADER, FS); if (!vs || !fs) return null;
  const prog = gl.createProgram(); gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog); gl.useProgram(prog);
  const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const U = {}; ['res', 'mouse', 't', 'dim', 'hole', 'zoom', 'drift', 'ang'].forEach(n => U[n] = gl.getUniformLocation(prog, n));
  const scale = opts.scale || 1;
  return {
    resize(w, h) { canvas.width = Math.round(w * scale); canvas.height = Math.round(h * scale); gl.viewport(0, 0, canvas.width, canvas.height); },
    draw(tms, mx, my, dim = 1, hole = 0) {
      gl.uniform2f(U.res, canvas.width, canvas.height); gl.uniform2f(U.mouse, mx, my);
      gl.uniform1f(U.t, tms / 1000); gl.uniform1f(U.dim, dim); gl.uniform1f(U.hole, hole); gl.uniform1f(U.zoom, opts.zoom || 2.1); gl.uniform2f(U.drift, ...(opts.drift || [0, 0])); gl.uniform1f(U.ang, opts.angle || 0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    },
  };
};

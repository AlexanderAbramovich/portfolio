import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// CSP только в прод-сборку: в dev-режиме Vite и React Refresh живут на inline-скриптах
const CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src https://fonts.gstatic.com",
  "img-src 'self' data:",
  "media-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  // frame-ancestors через <meta> браузеры игнорируют - на GitHub Pages его не задать
].join('; ')

const cspPlugin = {
  name: 'inject-csp',
  apply: 'build',
  transformIndexHtml(html) {
    return html.replace(
      '<meta charset="UTF-8" />',
      `<meta charset="UTF-8" />\n    <meta http-equiv="Content-Security-Policy" content="${CSP}" />`,
    )
  },
}

export default defineConfig({
  plugins: [react(), cspPlugin],
  base: '/portfolio/',
})

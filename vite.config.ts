import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/vozes-da-mare/' : '/',
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['logo.png', 'icons/*.png'],
      manifest: {
        name: 'Vozes da Maré',
        short_name: 'Vozes da Maré',
        description:
          'Clima, maré, pesca, riscos e saúde para pescadoras artesanais de Itapissuma, PE. Com assistente de voz.',
        // Cores oficiais da marca
        theme_color: '#FBEAD6',
        background_color: '#FBEAD6',
        display: 'standalone',
        orientation: 'portrait',
        lang: 'pt-BR',
        categories: ['weather', 'health', 'education'],
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          {
            src: '/icons/maskable-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable',
          },
          {
            src: '/icons/maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
        shortcuts: [
          { name: 'Falar com a Maré', short_name: 'Voz', url: '/voz' },
          { name: 'Mapa de Itapissuma', short_name: 'Mapa', url: '/mapa' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,webmanifest}'],
        // Fontes e tiles do mapa: cache de runtime para a navegação-leve (§19)
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'fontes',
              expiration: { maxEntries: 12, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /^https:\/\/[a-c]\.tile\.openstreetmap\.org\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'tiles-osm',
              // Limite generoso: o mapa precisa funcionar offline depois de usado
              expiration: { maxEntries: 600, maxAgeSeconds: 60 * 60 * 24 * 14 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /^https:\/\/api\.open-meteo\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'clima',
              networkTimeoutSeconds: 6,
              expiration: { maxEntries: 24, maxAgeSeconds: 60 * 60 * 6 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /^https:\/\/[a-z0-9-]+\.supabase\.co\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'supabase',
              networkTimeoutSeconds: 6,
              expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
      devOptions: { enabled: false },
    }),
  ],
  server: {
    host: true,
    // Necessário para testar no celular por um túnel do Cloudflare
    // (`cloudflared tunnel --url`), que chega pelo endereço https.
    // O Vite bloqueia hosts desconhecidos por padrão (proteção contra DNS
    // rebinding). Um ponto inicial casa qualquer subdomínio, que é a sintaxe
    // documentada nesta versão. Nunca usar `true` — liberaria que qualquer
    // site da internet alcançasse o seu servidor de desenvolvimento.
    // Isto vale apenas para `vite dev`; não afeta o build de produção.
    allowedHosts: ['.trycloudflare.com'],
  },
}))
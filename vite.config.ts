import vue from '@vitejs/plugin-vue';
import { URL, fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import ViteInspect from 'vite-plugin-inspect';
import { VitePWA } from 'vite-plugin-pwa';

import Package from './package.json';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      selfDestroying: true,
      injectRegister: null,
      registerType: 'prompt',
      manifestFilename: 'manifest.json',
      manifest: {
        name: 'Freshnet Enterprise',
        short_name: 'Freshnet',
        icons: [
          { src: './icon/logos-129.png', type: 'image/png', sizes: '129x129' },
          { src: './icon/logos-192.png', type: 'image/png', sizes: '192x192' },
          { src: './icon/logos-512.png', type: 'image/png', sizes: '512x512' },
          {
            src: './icon/logos-512.svg',
            type: 'image/svg+xml',
            sizes: '512x512',
          },
        ],
        start_url: '/',
        scope: './',
        display: 'standalone',
        background_color: '#f0f0f0',
        theme_color: '#2f579d',
      },
      workbox: {
        cleanupOutdatedCaches: true,
        globPatterns: ['**/*'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.freshnet\.app\//,
            handler: 'NetworkFirst',
            options: { cacheName: 'api.freshnet.app-precache' },
          },
          {
            urlPattern: /^https:\/\/res\.freshnet\.app\//,
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'res.freshnet.app-precache' },
          },
          {
            urlPattern: /^(?!https:\/\/(?:res|api)\.freshnet\.app\/).*/,
            handler: 'NetworkFirst',
            options: { cacheName: 'external-precache' },
          },
        ],
      },
    }),
    ViteInspect(),
  ],
  define: {
    'import.meta.env.APP_VERSION': JSON.stringify(Package.version),
    'import.meta.env.APP_NAME': JSON.stringify(Package.name),
  },
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
});

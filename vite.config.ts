import vue from '@vitejs/plugin-vue';
import { URL, fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
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
      },
    }),
  ],
  resolve: {
    alias: {
      path: 'path-browserify',
      stream: 'stream-browserify',
      fs: false,
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});

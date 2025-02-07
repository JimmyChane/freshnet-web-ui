// this is the config used chatgpt to convert vue.config.js to vite.config.ts
import vue from '@vitejs/plugin-vue';
import path from 'path';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

const freshnetConfig = require('./freshnet.config.ts');

const appendIdentifierPlugin = () => {
  return {
    name: 'append-identifier-plugin',
    generateBundle(_, bundle) {
      for (const fileName in bundle) {
        if (fileName.endsWith('.js') || fileName.endsWith('.css')) {
          const asset = bundle[fileName];
          const newName = fileName.replace(/(\.js|\.css)$/, '(1)$1');
          delete bundle[fileName];
          bundle[newName] = asset;
        }
      }
    },
  };
};

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
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
    appendIdentifierPlugin(),
  ],

  server: {
    port: freshnetConfig.devPort,
  },

  resolve: {
    alias: {
      path: 'path-browserify',
      stream: 'stream-browserify',
      fs: false,
    },
  },

  build: {
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) {
            return assetInfo.name.replace(/\.css$/, '(1).css');
          }
          return assetInfo.name || '';
        },
      },
    },
  },
});

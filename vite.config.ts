import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: './',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png', 'robots.txt'],
      manifest: {
        name: 'திம்ம கண்ணன் - பில்லிங்',
        short_name: 'திம்ம கண்ணன்',
        description: 'பூஜை பொருட்கள் மற்றும் மளிகை கடை எளிய பில்லிங் செயலி',
        theme_color: '#15803d',
        background_color: '#f8fafc',
        display: 'standalone',
        orientation: 'portrait',
        start_url: './',
        scope: './',
        icons: [
          {
            src: 'favicon.svg',
            sizes: '192x192 512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}']
      }
    })
  ],
  server: {
    port: 3000,
    host: true
  }
});

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Daily Quran',
        short_name: 'DailyQuran',
        theme_color: '#ffffff',
        icons: [
          // Add your icons here
        ],
      },
      devOptions: {
        enabled: process.env.NODE_ENV !== 'development',
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
      },
    }),
  ],
  build: {
    outDir: 'dist',
  },
});

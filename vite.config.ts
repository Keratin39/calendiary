import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      manifest: {
        name: 'Calendiary',
        short_name: 'Calendiary',
        start_url: '/',
        display: 'standalone',
        background_color: '#242424',
        theme_color: '#4ade80',
        icons: [
          {
            src: 'icon.png',
            sizes: '330x330',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
});

import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    // 開発時は base を / に、本番ビルド時は /SamuraiRestaurant_activityLP/ に設定
    // process.env.NODE_ENV が 'production' の場合、またはコマンドが 'build' の場合は base を設定
    const isProduction = process.env.NODE_ENV === 'production' || process.env.VITE_BUILD === 'true';
    const base = isProduction ? '/SamuraiRestaurant_activityLP/' : '/';
    return {
      base,
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});

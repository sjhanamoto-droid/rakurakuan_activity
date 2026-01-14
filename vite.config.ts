import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    // 開発時は base を / に、本番ビルド時はリポジトリ名に合わせて設定
    // process.env.NODE_ENV が 'production' の場合、またはコマンドが 'build' の場合は base を設定
    // GitHub PagesのURL: https://sjhanamoto-droid.github.io/rakurakuan_activity/
    const isProduction = process.env.NODE_ENV === 'production' || process.env.VITE_BUILD === 'true';
    const base = isProduction ? '/rakurakuan_activity/' : '/';
    return {
      base,
      server: {
        port: 5173,
        host: 'localhost',
        strictPort: false,
        open: false,
        hmr: {
          overlay: true,
          port: 5173,
        },
        watch: {
          usePolling: true, // ファイル変更の監視を確実にする
          interval: 300, // ポーリング間隔（ms）
        },
        fs: {
          strict: false, // ファイルシステムの厳密なチェックを無効化
        },
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

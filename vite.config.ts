import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

// ✅ 完整、可用版本
export default defineConfig({
  plugins: [react()],
  base: '/Website/', // ✅ GitHub Pages 專案路徑（你的 repo 名稱）

  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  build: {
    target: 'esnext',
    outDir: 'dist', // ✅ 與 deploy.yml 一致
  },

  server: {
    port: 3000,
    open: true,
  },
});


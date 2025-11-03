import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],

  // 你的網站會部署到 https://headache-treatment-project.github.io/Website/
  // 所以 base 一定要是這個子路徑
  base: '/Website/',

  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    alias: {
      // 只保留你自己用的路徑別名即可；第三方套件不需要 alias
      '@': path.resolve(__dirname, './src'),
    },
  },

  build: {
    target: 'esnext',
    outDir: 'dist', // 與 workflow 的上傳目錄一致
  },

  server: {
    port: 3000,
    open: true,
  },
});

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // GitHub Pages 部署設定 - 重要！
  base: '/migraine-care-system/', // 改成您的 GitHub repository 名稱
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
  
  build: {
    outDir: 'dist',
    sourcemap: false,
    // Code Splitting 優化
    rollupOptions: {
      output: {
        manualChunks: {
          // 將大型套件分離
          'vendor-react': ['react', 'react-dom'],
          'vendor-ui': [
            '@radix-ui/react-accordion',
            '@radix-ui/react-alert-dialog',
            '@radix-ui/react-avatar',
            '@radix-ui/react-checkbox',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-label',
            '@radix-ui/react-popover',
            '@radix-ui/react-select',
            '@radix-ui/react-tabs',
          ],
          'vendor-charts': ['recharts'],
          'vendor-utils': ['date-fns', 'clsx', 'tailwind-merge'],
        },
      },
    },
    // 提高 chunk 大小警告閾值
    chunkSizeWarningLimit: 1000,
  },
  
  // 開發伺服器設定
  server: {
    port: 3000,
    open: true,
  },
  
  // 優化設定
  optimizeDeps: {
    include: ['react', 'react-dom', 'lucide-react'],
  },
});

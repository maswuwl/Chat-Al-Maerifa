
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    // استخدام './' يضمن عمل المسارات بشكل صحيح عند النشر على الاستضافات المختلفة
    base: './',
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    },
    server: {
      port: 3000,
      host: true
    },
    build: {
      outDir: 'dist',
      sourcemap: false, // تعطيل الخرائط لتقليل حجم البناء
      minify: 'esbuild', // تم التغيير من terser إلى esbuild لحل مشكلة الخطأ
      chunkSizeWarningLimit: 2000,
      rollupOptions: {
        output: {
          manualChunks: {
            // تجميع المكتبات الأساسية لتقليل عدد الطلبات
            'vendor-react': ['react', 'react-dom'],
            'vendor-ai': ['@google/genai']
          }
        }
      }
    }
  };
});

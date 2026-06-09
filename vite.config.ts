import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  server: {
    port: 3000
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        courses: resolve(__dirname, 'courses.html'),
        calculator: resolve(__dirname, 'calculator.html'),
        branches: resolve(__dirname, 'branches.html'),
        gallery: resolve(__dirname, 'gallery.html')
      }
    }
  }
});

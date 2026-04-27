import { defineConfig } from 'vite'

import { resolve } from 'path'

export default defineConfig({
  base: './', // Using relative paths for static export
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        demo: resolve(__dirname, 'demo/index.html'),
        'demo-app': resolve(__dirname, 'demo-app/index.html'),
        'demo-web': resolve(__dirname, 'demo-web/index.html'),
      },
    },
  }
})

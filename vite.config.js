import { defineConfig } from 'vite'

import { resolve } from 'path'

export default defineConfig({
  base: './', // Using relative paths for static export
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
    },
  }
})

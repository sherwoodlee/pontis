import { defineConfig } from 'vite'

export default defineConfig({
  base: './', // Using relative paths for static export
  build: {
    outDir: 'dist',
  }
})

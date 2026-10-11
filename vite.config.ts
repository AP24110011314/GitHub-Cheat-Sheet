import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
// `base: './'` keeps asset URLs relative so the static build works
// offline (file://) and on GitHub Pages project sites without edits.
// If you use a project site with a custom repo name and absolute URLs
// are preferred, change this to '/<repo-name>/'.
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
})

/**
 * vite.config.ts — Vite build configuration for Bug Hunt Live Leaderboard.
 *
 * base: "./" — uses relative asset paths in the built HTML so the dist/ folder
 * can be uploaded to any static web host, including subdirectory deployments
 * (e.g. https://example.com/apps/bug-hunt/). Absolute paths (base: "/") would
 * break assets if the app is not at the domain root.
 *
 * No server-side configuration is required — the output is purely static files.
 */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: "./",
})

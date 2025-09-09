import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Detect environment
const isProduction = process.env.NODE_ENV === "production";

// Set API base URL depending on environment
const API_URL = isProduction
  ? "https://your-backend.onrender.com"   // <-- Replace with your backend Render URL
  : "http://localhost:5000";

export default defineConfig({
  plugins: [react()],
  define: {
    __API_URL__: JSON.stringify(API_URL), // 👈 Define a global constant
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000", // used only in dev
        changeOrigin: true
      }
    }
  }
})

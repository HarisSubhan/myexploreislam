// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  base: "./",
  plugins: [react()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@images": path.resolve(__dirname, "./src/assets/images"),
      "@auth": path.resolve(__dirname, "./src/components/auth"),
      "@shared-auth": path.resolve(__dirname, "./src/pages/SharedPortal/auth"),
    },   
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  },
  server: {
    proxy:{
      '/api':{
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      }
    },
    fs: {
      strict: false, // Allows serving from outside root
    },
    hmr: {
      overlay: false, // Disable HMR overlay if causing issues
    },
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "@/components/auth/RequireAuth",
      "@/pages/SharedPortal/auth/RoleRedirector",
    ],
  },
});

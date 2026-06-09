import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
        // Opzionale: se il tuo backend sulla 8080 NON ha il prefisso '/api' nell'URL,
        // questa riga lo rimuove automaticamente prima di mandare la richiesta.
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});

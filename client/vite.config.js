import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
const __dirname = path.dirname(new URL(import.meta.url).pathname);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(
        "C:/Users/Ricardo Freitas/Documents/Projetos/UPDATE2324/client/src"
      ),
    },
  },
});

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      components: resolve(__dirname, "src/components"),
      contracts: resolve(__dirname, "src/contracts"),
      contractUtils: resolve(__dirname, "src/contractUtils"),
      utils: resolve(__dirname, "src/utils"),
      views: resolve(__dirname, "src/views"),
      icons: resolve(__dirname, "src/assets/icons"),
      images: resolve(__dirname, "src/assets/images"),
      http: resolve(__dirname, "src/httpconfig"),
      server: resolve(__dirname, "src/server"),
      store: resolve(__dirname, "src/store"),
    },
  },
});

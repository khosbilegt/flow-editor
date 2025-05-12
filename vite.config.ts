import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import federation from "@originjs/vite-plugin-federation";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "ContactX-Flow-Editor",
      filename: "remoteEntry.js",
      exposes: {
        "./App": "./src/app/MicroWrapper.tsx",
      },
      shared: ["react", "react-dom", "antd", "dayjs", "react-redux"],
    }),
  ],
  build: {
    modulePreload: false,
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        format: "esm",
      },
    },
  },

  server: {
    port: 3001,
    host: "0.0.0.0",
  },
});

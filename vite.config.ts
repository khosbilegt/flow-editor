import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { federation } from "@module-federation/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "ContactX-Flow-Editor",
      filename: "remoteEntry.js",
      exposes: {
        "./MicroWrapper": "./src/app/MicroWrapper.tsx",
      },
      shared: {
        react: {
          singleton: true,
          strictVersion: true,
          requiredVersion: ">=18.0.0",
        },
        "react-dom": {
          singleton: true,
          strictVersion: true,
          requiredVersion: ">=18.0.0",
        },
        antd: {
          singleton: true,
          strictVersion: true,
          requiredVersion: ">=5.0.0",
        },
        dayjs: {
          singleton: true,
          strictVersion: true,
          requiredVersion: ">=1.10.0",
        },
        "react-redux": {
          singleton: true,
          strictVersion: true,
          requiredVersion: ">=8.0.0",
        },
        "@reduxjs/toolkit": {
          singleton: true,
          strictVersion: true,
          requiredVersion: ">=1.9.0",
        },
        "@xyflow/react": {
          singleton: true,
          strictVersion: true,
          requiredVersion: ">=1.0.0",
        },
        jsonata: {
          singleton: true,
          strictVersion: true,
          requiredVersion: ">=1.8.5",
        },
      },
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

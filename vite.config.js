import { defineConfig } from "vite"
import reactRefresh from "@vitejs/plugin-react-refresh"
import twindJsx from "@twind/vite-plugin-jsx"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactRefresh(), twindJsx()],
  esbuild: {
    jsxInject: 'import React from "react"',
  },
})

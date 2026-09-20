import react from "@vitejs/plugin-react"
import { defineConfig } from "vitest/config"

export default defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    env: { VITE_API_URL: "http://localhost/api/" },
    unstubGlobals: true,
    maxWorkers: 4,
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
  },
})

import { readFileSync } from "node:fs"
import { createRequire } from "node:module"
import tailwindcss from "@tailwindcss/vite"
import { tanstackRouter } from "@tanstack/router-plugin/vite"
import react from "@vitejs/plugin-react"
import { defineConfig, type Plugin } from "vite"

const projectRequire = createRequire(import.meta.url)

function mockServiceWorker(): Plugin {
  return {
    name: "template:mock-service-worker",
    apply: (_, { command, mode }) => command === "serve" && mode === "mock",
    configureServer(server) {
      server.middlewares.use("/mockServiceWorker.js", (_, response) => {
        response.setHeader("Content-Type", "text/javascript")
        response.end(
          readFileSync(projectRequire.resolve("msw/mockServiceWorker.js"))
        )
      })
    },
  }
}

export default defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
      quoteStyle: "double",
      semicolons: false,
    }),
    react(),
    tailwindcss(),
    mockServiceWorker(),
  ],
})

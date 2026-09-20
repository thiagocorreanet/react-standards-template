import { readdir, readFile } from "node:fs/promises"
import { join } from "node:path"

const directory = process.argv[2] ?? "dist"
const entries = await readdir(directory, { recursive: true })
for (const entry of entries) {
  if (entry.includes("mockServiceWorker"))
    throw new Error(`Worker de simulação encontrado no build: ${entry}`)
  if (!/\.(js|html)$/.test(entry)) continue
  const content = await readFile(join(directory, entry), "utf8")
  if (/demo12345|demo-csrf-token|mockServiceWorker/.test(content))
    throw new Error(`Código de demonstração encontrado no build: ${entry}`)
}
console.log("Build verificado: sem worker ou credenciais de demonstração.")

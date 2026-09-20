import "@testing-library/jest-dom/vitest"
import { configure } from "@testing-library/react"

configure({ asyncUtilTimeout: 3000 })

window.scrollTo = () => {}

window.matchMedia = (query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addEventListener: () => {},
  removeEventListener: () => {},
  addListener: () => {},
  removeListener: () => {},
  dispatchEvent: () => false,
})

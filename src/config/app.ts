export const appConfig = {
  name: "React App",
  description: "Seu espaço de trabalho",
  locale: "pt-BR",
  currency: "BRL",
  timeZone: "America/Sao_Paulo",
  storageKey: "react-app-template",
} as const

export const isDemo = import.meta.env.DEV && import.meta.env.MODE === "mock"

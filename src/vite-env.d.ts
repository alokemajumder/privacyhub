/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SITE_URL: string
  readonly VITE_SITE_NAME: string
  readonly VITE_OPENROUTER_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
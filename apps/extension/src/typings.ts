interface ImportMetaEnv {
  readonly VITE_APP_MINA_PROXY_DEVNET_URL: string
  readonly VITE_APP_MINA_EXPLORER_DEVNET_URL: string
}

export interface ImportMeta {
  readonly env: ImportMetaEnv
}

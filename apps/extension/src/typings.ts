declare module "mina-signer"

interface ImportMetaEnv {
  readonly VITE_APP_MINA_PROXY_DEVNET_URL: string
  readonly VITE_APP_MINA_EXPLORER_DEVNET_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

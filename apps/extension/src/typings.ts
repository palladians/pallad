declare module "mina-signer"

interface ImportMetaEnv {
  readonly VITE_APP_MINA_PROXY_MAINNET_URL: string
  readonly VITE_APP_MINA_EXPLORER_MAINNET_URL: string
  readonly VITE_APP_MINA_PROXY_DEVNET_URL: string
  readonly VITE_APP_MINA_EXPLORER_DEVNET_URL: string
  readonly VITE_APP_MINA_PROXY_BERKELEY_URL: string
  readonly VITE_APP_MINA_EXPLORER_BERKELEY_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

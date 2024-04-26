declare module "mina-signer"

interface ImportMetaEnv {
  readonly VITE_APP_MODE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

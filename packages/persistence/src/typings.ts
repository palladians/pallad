declare module 'mina-signer'

interface ImportMetaEnv {
  readonly VITE_APP_MODE: string
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface ImportMeta {
  readonly env: ImportMetaEnv
}

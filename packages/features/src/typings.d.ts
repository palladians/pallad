declare module "*.svg" {
  const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>
  export default content
}
interface ImportMetaEnv {
  readonly VITE_APP_MODE: string
  readonly VITE_APP_DEFAULT_NETWORK: string
  readonly VITE_APP_MINA_PROXY_MAINNET_URL: string
  readonly VITE_APP_MINA_PROXY_DEVNET_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

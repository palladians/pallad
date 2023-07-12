declare module '*.svg' {
  const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>
  export default content
}
interface ImportMetaEnv {
  readonly VITE_APP_API_URL: string
  readonly VITE_APP_MODE: string
  readonly VITE_APP_DEFAULT_NETWORK: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

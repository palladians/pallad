declare module '*.svg' {
  const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>
  export default content
}
interface ImportMetaEnv {
  readonly VITE_APP_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

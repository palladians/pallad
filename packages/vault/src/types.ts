import { StoreApi, UseBoundStore } from 'zustand'

export type StoreInstance<T> = ReturnType<
  UseBoundStore<StoreApi<T>>['getState']
>

interface ImportMetaEnv {
  readonly VITE_APP_LADLE: string
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface ImportMeta {
  readonly env: ImportMetaEnv
}

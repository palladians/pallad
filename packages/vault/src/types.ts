import type { StoreApi, UseBoundStore } from "zustand"

export type StoreInstance<T> = ReturnType<
  UseBoundStore<StoreApi<T>>["getState"]
>

interface ImportMetaEnv {
  readonly VITE_APP_LADLE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

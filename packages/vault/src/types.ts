import { StoreApi, UseBoundStore } from 'zustand'

export type StoreInstance<T> = ReturnType<
  UseBoundStore<StoreApi<T>>['getState']
>

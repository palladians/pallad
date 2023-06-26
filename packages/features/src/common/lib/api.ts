import { appStore } from '../store/app.ts'

export const fetcher = (url: string) =>
  fetch(url, {
    headers: { 'p-mina-network': appStore.getState().network }
  }).then((response) => response.json())

import { appStore } from '../store/app'

export const fetcher = (url: string) =>
  fetch(url, {
    headers: { 'p-mina-network': appStore.getState().network }
  }).then((response) => response.json())

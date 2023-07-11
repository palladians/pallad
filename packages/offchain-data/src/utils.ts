export const fetcher = <T>(url: string) =>
  fetch(url).then((response) => response.json() as Promise<T>)

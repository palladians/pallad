export const fetcher = async <T>(url: string) => {
  const request = await fetch(url)
  const body = (await request.json()) as T
  return body
}

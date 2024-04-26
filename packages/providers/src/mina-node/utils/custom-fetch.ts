import JSONbig from "json-bigint"

export const customFetch = async (
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> => {
  const response = await fetch(input, init)
  const text = await response.text()
  const parsed = JSONbig.parse(text)
  return new Response(JSON.stringify(parsed), {
    status: response.status,
    statusText: response.statusText,
    headers: new Headers({
      "Content-Type": "application/json",
      ...response.headers,
    }),
  })
}

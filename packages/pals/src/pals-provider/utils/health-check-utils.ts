import { fetchPals } from "./fetch-utils"

export type HealthCheckResponse = {
  ok: boolean
  message: string
}

export const healthCheck = async (
  url: string,
): Promise<HealthCheckResponse> => {
  const result = await fetchPals(`${url}/health`)
  if (!result.ok) {
    return { ok: result.ok, message: result.message as string }
  }
  return {
    ok: result.ok,
    message: result.data,
  }
}

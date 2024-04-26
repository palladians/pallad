export type HealthCheckResponse = {
  ok: boolean
  message?: string | unknown
}
export interface HealthCheckResponseData {
  __schema: {
    types: Array<{ name: string }>
  }
}

export interface Provider {
  /**
   * @throws ProviderError
   */
  healthCheck(url?: string): Promise<HealthCheckResponse>
}

export type HttpProviderConfigPaths<T extends Provider> = {
  [methodName in keyof T]: string
}

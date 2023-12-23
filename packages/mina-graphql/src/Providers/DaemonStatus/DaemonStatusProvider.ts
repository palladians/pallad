import {
  DaemonStatus,
  DaemonStatusProvider,
  HealthCheckResponse,
  HealthCheckResponseData
} from '@palladxyz/mina-core'
import { gql, request } from 'graphql-request'

import { getDaemonStatus, healthCheckQuery } from './queries'

export class DaemonStatusGraphQLProvider implements DaemonStatusProvider {
  private minaGql: string | null

  constructor(minaGql: string) {
    this.minaGql = minaGql
  }

  public async destroy(): Promise<void> {
    console.log('Destroying DaemonStatusGraphQLProvider...')
    this.minaGql = null
  }

  async changeNetwork(minaGql: string): Promise<void> {
    this.minaGql = minaGql
  }

  async healthCheck(): Promise<HealthCheckResponse> {
    console.log('Initiating health check...')
    const query = gql`
      ${healthCheckQuery}
    `
    try {
      console.log('Sending request for health check...')
      const data = (await request(
        this.minaGql as string,
        query
      )) as HealthCheckResponseData
      console.log('Received response for health check:', data)

      if (data && data.__schema && data.__schema.types.length > 0) {
        return { ok: true }
      } else {
        throw new Error('Invalid schema response')
      }
    } catch (error: unknown) {
      console.error('Error in healthCheck:', error)
      let errorMessage = 'Unknown error'
      if (error instanceof Error) {
        errorMessage = error.message
      }
      return { ok: false, message: errorMessage }
    }
  }

  async getDaemonStatus(): Promise<DaemonStatus> {
    console.log('Initiating getDaemonStatus')
    const query = gql`
      ${getDaemonStatus}
    `
    try {
      console.log('Sending request for daemon status...')
      const data = (await request(
        this.minaGql as string,
        query,
        {}
      )) as DaemonStatus
      console.log('Received response for daemon status:', data)

      if (!data || !data.daemonStatus || !data.daemonStatus.chainId) {
        throw new Error('Invalid daemon status data response')
      }
      return data
    } catch (error: unknown) {
      // this can fail if the node is not available
      // perform health check to see if the node is available
      const healthCheckResponse = await this.healthCheck()
      if (!healthCheckResponse.ok) {
        throw new Error('Node is not available')
      }
      console.error('Error in getDaemonStatus:', error)
      return {
        daemonStatus: {
          chainId: 'N/A'
        }
      }
    }
  }
}

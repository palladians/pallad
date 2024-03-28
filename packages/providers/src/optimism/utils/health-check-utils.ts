export const healthCheckOptimism = async (): Promise<{
  ok: boolean
  message: string
}> => {
  return { ok: true, message: 'all good!' }
}
/*
  export const healthCheckOptimism = async (
    url: string,
  ): Promise<{ ok: boolean; message: string }> => {
      const client = createPublicClient({ 
        chain: optimismGoerli, 
        transport: http(url), 
        }) 
      
  
    if (!result.ok) {
      return {
        ok: false,
        message: result.message || 'Health check failed'
      }
    }
  
    // Check for syncStatus response
    const syncStatus = result.data?.syncStatus
    if (syncStatus !== undefined) {
      return {
        ok: syncStatus === 'SYNCED',
        message: syncStatus
          ? `Sync status: ${syncStatus}`
          : 'No sync status data available'
      }
    }
  
    // Check for __schema response
    const schemaTypes = result.data?.__schema?.types
    if (schemaTypes) {
      return {
        ok: true,
        message: 'Schema types available'
      }
    }
  
    // If neither response is found
    return {
      ok: false,
      message: 'Unexpected response format'
    }
  }*/

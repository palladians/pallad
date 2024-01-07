export const healthCheckQuery = `
  {
    __schema {
      types {
        name
      }
    }
  }
`

export const getDaemonStatus = `
query {
  daemonStatus {
    chainId
  }
}
`

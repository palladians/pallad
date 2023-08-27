import { GroupedCredentials, Network } from '@palladxyz/key-management'

import {
  credentialName,
  SingleCredentialState
} from '../../src/credentials/credentialsState'
import { CredentialStore } from '../../src/credentials/credentialsStore'
import { keyAgentName } from '../../src/keyAgent/keyAgentState'

describe('AccountStore', () => {
  let credential: GroupedCredentials
  let credentialName: credentialName
  let keyAgentName: keyAgentName
  let credentialState: SingleCredentialState

  beforeEach(async () => {
    credential = {
      '@context': ['https://w3id.org/wallet/v1'],
      id: 'did:mina:B62qjsV6WQwTeEWrNrRRBP6VaaLvQhwWTnFi4WP4LQjGvpfZEumXzxb',
      type: 'MinaAddress',
      controller:
        'did:mina:B62qjsV6WQwTeEWrNrRRBP6VaaLvQhwWTnFi4WP4LQjGvpfZEumXzxb',
      name: 'Mina Account',
      description: 'My Mina account.',
      chain: Network.Mina,
      accountIndex: 0,
      addressIndex: 0,
      address: 'B62qjsV6WQwTeEWrNrRRBP6VaaLvQhwWTnFi4WP4LQjGvpfZEumXzxb',
      encryptedPrivateKeyBytes: new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7])
    }
    credentialName = 'credentialName'
    keyAgentName = 'keyAgentName'
    credentialState = {
      credentialName: credentialName,
      keyAgentName: keyAgentName,
      credential: credential
    }
  })

  afterEach(() => {
    // Cleanup after each test if needed
  })

  it('should create an credential store', async () => {
    const credentialStore = new CredentialStore()
    expect(credentialStore).toBeDefined()
  })

  it('should add one Grouped Credentials and remove one from store', async () => {
    const credentialStore = new CredentialStore()
    // add first credential
    await credentialStore.setCredential(credentialState)
    // check that credential is in the store
    const storedCredential = credentialStore.getCredential(credentialName)
    expect(storedCredential.credential).toBeDefined()
    expect(storedCredential.credential).toEqual(credential)
    // remove credential
    credentialStore.removeCredential(credentialName)
    // check that credential is removed
    const storedCredentialRemoved =
      credentialStore.getCredential(credentialName)
    expect(storedCredentialRemoved.credential).toBeUndefined()
  })
})

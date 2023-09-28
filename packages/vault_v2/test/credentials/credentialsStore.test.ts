import { GroupedCredentials, Network } from '@palladxyz/key-management'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

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
  let credentialStateTwo: SingleCredentialState
  let credentialTwo: object

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
    credentialTwo = {
      '@context': ['https://www.w3.org/2018/credentials/v1'],
      id: 'http://example.edu/credentials/3732',
      type: ['VerifiableCredential', 'UniversityDegreeCredential'],
      issuer: 'University of Example',
      issuanceDate: '2010-01-01T00:00:00Z',
      credentialSubject: {
        id: 'did:mina:B62qjsV6WQwTeEWrNrRRBP6VaaLvQhwWTnFi4WP4LQjGvpfZEumXzxb',
        degree: {
          type: 'BachelorDegree',
          name: 'Bachelor of Science and Arts'
        }
      },
      proof: {
        type: 'Kimchi',
        created: '2023-09-19T12:40:16Z',
        proof: {
          publicInput: ['0'],
          publicOutput: ['1'],
          maxProofsVerified: 0,
          proof: 'KChzdGF0ZW1...SkpKSkp'
        }
      }
    }

    credentialName = 'credentialName'
    keyAgentName = 'keyAgentName'
    credentialState = {
      credentialName: credentialName,
      keyAgentName: keyAgentName,
      credential: credential
    }

    credentialStateTwo = {
      credentialName: 'green crocodile credential',
      keyAgentName: 'keyAgentNameTwo',
      credential: credentialTwo
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

  it('should add two Grouped Credentials and search for both separately', async () => {
    const credentialStore = new CredentialStore()
    // add first credential
    await credentialStore.setCredential(credentialState)
    // add second credential
    await credentialStore.setCredential(credentialStateTwo)
    // search for first credential
    const searchQuery = {
      type: 'MinaAddress',
      chain: Network.Mina
    }
    const storedCredentials = credentialStore.searchCredentials(searchQuery)
    console.log(`storedCredentials: ${JSON.stringify(storedCredentials)}`)
    expect(storedCredentials).toBeDefined()
    expect(storedCredentials.length).toEqual(1)
    // search for second credential
    const searchQueryTwo = {
      issuer: 'University of Example',
      type: 'UniversityDegreeCredential'
    }
    // can partially search a credential with an array
    const storedCredentialsTwo =
      credentialStore.searchCredentials(searchQueryTwo)
    expect(storedCredentialsTwo).toBeDefined()
    expect(storedCredentialsTwo.length).toEqual(1)

    // search for second credential with a different query -- nested query
    const searchQueryThree = {
      credentialSubject: {
        degree: {
          type: 'BachelorDegree'
        }
      }
    }
    const storedCredentialsThree =
      credentialStore.searchCredentials(searchQueryThree)
    expect(storedCredentialsThree).toBeDefined()
    expect(storedCredentialsThree.length).toEqual(1)
  })
})

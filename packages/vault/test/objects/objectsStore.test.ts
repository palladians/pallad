import { GroupedCredentials, Network } from '@palladxyz/key-management'
import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import {
  ObjectName,
  SingleObjectState,
  StoredObject,
  useVault
} from '../../src'

describe('ObjectStore', () => {
  let object: GroupedCredentials
  let objectName: ObjectName
  let objectState: SingleObjectState
  let objectStateTwo: SingleObjectState
  let objectTwo: object

  beforeEach(() => {
    object = {
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
    objectTwo = {
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

    objectName = 'credentialName'
    objectState = {
      objectName: objectName,
      object: object as StoredObject
    }

    objectStateTwo = {
      objectName: 'green crocodile credential',
      object: objectTwo as StoredObject
    }
  })

  afterEach(() => {
    const { result } = renderHook(() => useVault())
    act(() => result.current.clear())
  })

  it('should create an objects store', () => {
    const { result } = renderHook(() => useVault())
    expect(result.current.objects).toEqual({})
  })

  it('should add one object and remove one from store', () => {
    let storedObject: SingleObjectState | undefined
    const { result } = renderHook(() => useVault())
    act(() => {
      result.current.setObject(objectState)
      storedObject = result.current.getObject(objectName)
    })
    expect(storedObject?.object).toEqual(object)
    act(() => {
      result.current.removeObject(objectName)
      storedObject = result.current.getObject(objectName)
    })
    // check that object is removed
    expect(storedObject?.object).toBeUndefined()
  })
  it('should add two objects and search for Mina addresses and return them as an array not as a credential object', () => {
    let storedObjects: StoredObject[] | undefined
    // search for first credential
    const searchQuery = {
      type: 'MinaAddress',
      chain: Network.Mina
    }
    // return props
    const props = ['address']
    const { result } = renderHook(() => useVault())
    act(() => {
      // add first credential
      result.current.setObject(objectState)
      // add second credential
      result.current.setObject(objectStateTwo)
      storedObjects = result.current.searchObjects(searchQuery, props)
    })
    expect(storedObjects).toBeDefined()
    expect(storedObjects?.length).toEqual(1)
  })
})

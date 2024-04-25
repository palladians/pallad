import { Mina } from '@palladxyz/mina-core'
import { constructTransaction } from '@palladxyz/pallad-core'
import { test } from 'vitest'

import {
  isConstructedTransaction,
  isFields,
  isMessageBody,
  isZkAppTransaction
} from '../../src/chains/Mina/guards'

describe('Guard functions tests', () => {
  test('isConstructedTransaction', () => {
    const transaction: Mina.TransactionBody = {
      to: 'B62qjsV6WQwTeEWrNrRRBP6VaaLvQhwWTnFi4WP4LQjGvpfZEumXzxb',
      from: 'B62qjsV6WQwTeEWrNrRRBP6VaaLvQhwWTnFi4WP4LQjGvpfZEumXzxb',
      fee: 1,
      amount: 100,
      nonce: 0,
      memo: 'hello Bob',
      validUntil: 321,
      type: 'payment'
    }
    const validPayload: Mina.ConstructedTransaction = constructTransaction(
      transaction,
      Mina.TransactionKind.PAYMENT
    )

    const invalidPayload = { message: 'invalid_payload' }

    expect(isConstructedTransaction(validPayload)).toBeTruthy()
    expect(isConstructedTransaction(invalidPayload)).not.toBeTruthy()
  })

  test('isMessageBody', () => {
    const validPayload: Mina.MessageBody = {
      message: 'anyMessage'
    }

    const invalidPayload = {
      notAMessage: 'invalid_payload'
    }

    expect(isMessageBody(validPayload)).toBeTruthy()
    expect(isMessageBody(invalidPayload)).not.toBeTruthy()
  })

  test('isFields', () => {
    const validPayload: Mina.SignableFields = {
      fields: [10n, 20n, 30n, 340817401n, 2091283n, 1n, 0n]
      // any other properties as per your SignableFields type
    }

    const invalidPayload = {
      fields: ['10n', '20n']
    }

    expect(isFields(validPayload)).toBeTruthy()
    expect(isFields(invalidPayload)).not.toBeFalsy()
  })

  test('should validate zkAppCommand correctly', () => {
    const zkAppCommand: Mina.SignableZkAppCommand = {
      command: {
        zkappCommand: {
          accountUpdates: [],
          memo: 'E4YM2vTHhWEg66xpj52JErHUBU4pZ1yageL4TVDDpTTSsv8mK6YaH',
          feePayer: {
            body: {
              publicKey:
                'B62qjsV6WQwTeEWrNrRRBP6VaaLvQhwWTnFi4WP4LQjGvpfZEumXzxb',
              fee: '100000000',
              validUntil: '100000',
              nonce: '1'
            },
            authorization: ''
          }
        },
        feePayer: {
          feePayer: 'B62qjsV6WQwTeEWrNrRRBP6VaaLvQhwWTnFi4WP4LQjGvpfZEumXzxb',
          fee: '100000000',
          nonce: '1',
          memo: 'test memo'
        }
      }
    }

    const invalidPayload = {
      // missing 'command'
    }

    expect(isZkAppTransaction(zkAppCommand)).toBe(true)
    expect(isZkAppTransaction(invalidPayload)).toBe(false)
  })
})

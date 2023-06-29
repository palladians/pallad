import Client from 'mina-signer'
import * as Json from 'mina-signer/dist/node/mina-signer/src/TSTypes'
import { SignedLegacy } from 'mina-signer/dist/node/mina-signer/src/TSTypes'

import { TransactionBody } from './types'

export type NetworkType = 'mainnet' | 'testnet'

interface NetConfig {
  netType: NetworkType
}

async function getCurrentNetConfig(network: NetworkType): Promise<NetConfig> {
  const netConfig: NetConfig = { netType: network }
  return netConfig
}

export async function getSignClient(network: NetworkType): Promise<Client> {
  const netConfig: NetConfig = await getCurrentNetConfig(network)
  const netType: NetworkType = netConfig.netType || 'mainnet'

  const client = new Client({ network: netType })
  return client
}

export function constructPaymentTx(payment: TransactionBody): Json.Payment {
  const sendFee = BigInt(payment.fee)
  const sendAmount = payment.amount ? BigInt(payment.amount) : BigInt(0)
  const memo = payment.memo || ''
  const validUntil = payment.validUntil ? BigInt(payment.validUntil) : BigInt(0)

  return {
    to: payment.to,
    from: payment.from,
    amount: sendAmount,
    fee: sendFee,
    nonce: BigInt(payment.nonce),
    memo: memo,
    validUntil: validUntil
  }
}

export function constructDelegationTx(
  delegation: TransactionBody
): Json.StakeDelegation {
  const sendFee = BigInt(delegation.fee)
  const memo = delegation.memo || ''
  const validUntil = delegation.validUntil
    ? BigInt(delegation.validUntil)
    : BigInt(0)

  return {
    to: delegation.to,
    from: delegation.from,
    fee: sendFee,
    nonce: BigInt(delegation.nonce),
    memo: memo,
    validUntil: validUntil
  }
}

export async function signPayment(
  privateKey: string,
  payment: TransactionBody,
  network: NetworkType
): Promise<SignedLegacy<Json.Payment>> {
  let signedPayment: SignedLegacy<Json.Payment>

  try {
    const signClient = await getSignClient(network)
    const paymentTx = constructPaymentTx(payment)

    signedPayment = signClient.signPayment(paymentTx, privateKey)
  } catch (err) {
    const errorMessage = getRealErrorMsg(err) || 'Building transaction failed.'
    throw new Error(errorMessage)
  }

  return signedPayment
}

export async function signDelegation(
  privateKey: string,
  delegation: TransactionBody,
  network: NetworkType
): Promise<SignedLegacy<Json.StakeDelegation>> {
  let signedStakingPayment: SignedLegacy<Json.StakeDelegation>

  try {
    const signClient = await getSignClient(network)
    const delegationTx = constructDelegationTx(delegation)

    signedStakingPayment = signClient.signStakeDelegation(
      delegationTx,
      privateKey
    )
  } catch (error) {
    throw new Error('Building transaction failed.')
  }

  return signedStakingPayment
}

function getRealErrorMsg(err: unknown): string | undefined {
  throw new Error(err as string)
}

import { Mina } from '@palladxyz/mina-core'

export function isConstructedTransaction(
  payload: any
): payload is Mina.ConstructedTransaction {
  return (
    payload &&
    typeof payload === 'object' &&
    'type' in payload &&
    'to' in payload &&
    'from' in payload
  )
}

export function isMessageBody(payload: any): payload is Mina.MessageBody {
  return payload && typeof payload === 'object' && 'message' in payload
}

export function isFields(payload: any): payload is Mina.SignableFields {
  return payload && typeof payload === 'object' && 'fields' in payload
}

export function isZkAppTransaction(
  payload: any
): payload is Mina.SignableZkAppCommand {
  return payload && typeof payload === 'object' && 'command' in payload
}

export function isNullifier(payload: any): payload is Mina.CreatableNullifer {
  return payload && typeof payload === 'object' && 'messageNullifier' in payload
}

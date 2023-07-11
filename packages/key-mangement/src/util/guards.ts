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

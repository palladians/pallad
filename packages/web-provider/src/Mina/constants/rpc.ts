export const REQUIRED_METHODS = ['mina_sendTransaction']
export const OPTIONAL_METHODS = [
  'mina_accounts',
  'mina_requestAccounts', // this is a legacy method, could be removed
  'mina_sign',
  'mina_signTransaction',
  'mina_signFields',
  'mina_getBalance',
  'mina_sendTransaction'
]
export const REQUIRED_EVENTS = ['chainChanged', 'accountsChanged']
export const OPTIONAL_EVENTS = [
  'chainChanged',
  'accountsChanged',
  'message',
  'disconnect',
  'connect'
]

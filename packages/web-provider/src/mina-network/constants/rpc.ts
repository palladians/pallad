export const REQUIRED_METHODS = ["mina_sendTransaction"]
export const OPTIONAL_METHODS = [
  "mina_accounts",
  "mina_requestAccounts",
  "mina_sign",
  "mina_signTransaction",
  "mina_signFields",
  "mina_getBalance",
  "mina_sendTransaction",
  "mina_chainId",
  // new methods
  "mina_addChain",
  "mina_requestNetwork",
  "mina_switchChain",
]
export const REQUIRED_EVENTS = ["chainChanged", "accountsChanged"]
export const OPTIONAL_EVENTS = [
  ...REQUIRED_EVENTS,
  "message",
  "disconnect",
  "connect",
]

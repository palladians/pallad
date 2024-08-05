import { info, provider } from "./rpc/provider"

const init = () => {
  ;(window as any).mina = provider
  const announceProvider = () => {
    window.dispatchEvent(
      new CustomEvent("mina:announceProvider", {
        detail: Object.freeze({ info, provider }),
      }),
    )
  }
  window.addEventListener("mina:requestProvider", () => {
    announceProvider()
  })
  announceProvider()
  console.info("[Pallad] RPC has been initialized.")
}

init()

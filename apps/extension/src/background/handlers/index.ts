import type { OnMessageCallback } from "webext-bridge"

export type Handler = OnMessageCallback<any, any>
export * from "./web-provider"
export * from "./wallet"

export const opts = {
  projectId: "test",
  chains: ["Mainnet"],
}

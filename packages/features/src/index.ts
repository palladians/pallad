import "@total-typescript/ts-reset"

import type {} from "graphql-request"
import type {} from "swr"
export { useAppStore } from "./common/store/app"
export { usePendingTransactionStore } from "@palladco/vault"
export { Router } from "./router"
export { WebConnectorRoute } from "./web-connector/routes/web-connector"
export * as Icons from "lucide-react"
export { i18n } from "./lib/i18n"
// @ts-ignore
import "./globals.css"

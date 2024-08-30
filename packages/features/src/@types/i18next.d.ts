import "i18next"
import type ns1 from "../i18n/locales/en/en.json"
import type ns2 from "../i18n/locales/tr/tr.json"

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "ns1"
    resources: {
      ns1: typeof ns1
      ns2: typeof ns2
    }
  }
}

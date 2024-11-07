import "i18next"
import resources from "./resources"
const { ns1, ns2 } = resources

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "ns1"
  }
}

import i18next from "i18next"
import { initReactI18next } from "react-i18next"
import ns1 from "./locales/en/en.json"
import ns2 from "./locales/tr/tr.json"

const defaultNS = "ns1"

const resources = {
  en: {
    ns1,
  },
  tr: {
    ns2,
  },
}

i18next.use(initReactI18next).init({
  debug: true,

  fallbackLng: ["en", "tr"],
  resources: resources,
  defaultNS,
})

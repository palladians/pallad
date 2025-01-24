import i18next from "i18next"
import LanguageDetector from "i18next-browser-languagedetector"
import { initReactI18next } from "react-i18next"
import ns1 from "./locales/en/en.json"
import ns3 from "./locales/es/es.json"
import ns2 from "./locales/tr/tr.json"

const resources = {
  en: {
    ns1,
  },
  tr: {
    ns2,
  },
  es: {
    ns3,
  },
}

i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    debug: true,
    preload: ["ns1", "ns2", "ns3"],
    fallbackNS: ["ns1", "ns2", "ns3"],
    resources,
  })

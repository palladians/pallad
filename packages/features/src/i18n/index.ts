import i18next from "i18next"
import LanguageDetector from "i18next-browser-languagedetector"
import Backend from "i18next-http-backend"
import { initReactI18next } from "react-i18next"
import ns1 from "./locales/en/en.json"
import ns2 from "./locales/tr/tr.json"

const resources = {
  en: {
    ns1,
  },
  tr: {
    ns2,
  },
}

i18next
  .use(initReactI18next)
  .use(Backend)
  .use(LanguageDetector)
  .init({
    debug: true,
    preload: ["ns1", "ns2"],
    fallbackNS: ["ns1", "ns2"],
    resources,
  })

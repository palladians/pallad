import i18n from "i18next"
import LanguageDetector from "i18next-browser-languagedetector"
import { initReactI18next } from "react-i18next"
import ns1 from "./locales/en/en.json"
import ns2 from "./locales/tr/tr.json"

const defaultNS = "ns1"

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: false,
    resources: {
      en: {
        ns1,
      },
      tr: {
        ns2,
      },
    },
    defaultNS,
  })

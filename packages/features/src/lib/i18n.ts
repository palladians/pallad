import i18n from "i18next"
import LanguageDetector from "i18next-browser-languagedetector"
import { initReactI18next } from "react-i18next"
import en from "./locales/en/en.json"
import tr from "./locales/tr/tr.json"

const resources = {
  en: { translation: en },
  tr: { translation: tr },
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    resources,
    interpolation: {
      escapeValue: false,
    },
  })

export { i18n }

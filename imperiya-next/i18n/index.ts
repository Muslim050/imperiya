import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import ru from "./locales/ru";
import uz from "./locales/uz";
import en from "./locales/en";

export const LANGUAGES = [
  { code: "ru", label: "RU" },
  { code: "uz", label: "UZ" },
  { code: "en", label: "EN" },
] as const;

export type LangCode = (typeof LANGUAGES)[number]["code"];

// On the server we want a deterministic default language (RU). The detector
// only runs in the browser, where it picks up localStorage / navigator.
const isBrowser = typeof window !== "undefined";

const chain = isBrowser
  ? i18n.use(LanguageDetector).use(initReactI18next)
  : i18n.use(initReactI18next);

if (!i18n.isInitialized) {
  void chain.init({
    resources: {
      ru: { translation: ru },
      uz: { translation: uz },
      en: { translation: en },
    },
    lng: isBrowser ? undefined : "ru",
    fallbackLng: "ru",
    supportedLngs: ["ru", "uz", "en"],
    interpolation: { escapeValue: false },
    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"],
    },
    react: { useSuspense: false },
  });
}

if (isBrowser) {
  const syncHtmlLang = (lng: string) => {
    document.documentElement.lang = lng;
  };
  syncHtmlLang(i18n.resolvedLanguage ?? "ru");
  i18n.on("languageChanged", syncHtmlLang);
}

export default i18n;

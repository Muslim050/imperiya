import { createInstance, type i18n as I18nInstance } from "i18next";
import { initReactI18next } from "react-i18next";
import ru from "./locales/ru";
import uz from "./locales/uz";
import en from "./locales/en";
import { DEFAULT_LANG, LANG_CODES, type LangCode } from "./config";

export * from "./config";

const resources = {
  ru: { translation: ru },
  uz: { translation: uz },
  en: { translation: en },
};

/**
 * Builds a fresh i18next instance pinned to one language.
 *
 * The language comes from the URL segment, never from the browser: a
 * detector would make `/uz` render Russian for a Russian-preferring
 * visitor, and — worse for SEO — would make the server render a
 * different language than the URL claims. One instance per language
 * also keeps concurrent server renders from leaking one page's language
 * into another, which a module-level singleton cannot guarantee.
 */
export function createI18n(lng: LangCode): I18nInstance {
  const instance = createInstance();

  void instance.use(initReactI18next).init({
    resources,
    lng,
    fallbackLng: DEFAULT_LANG,
    supportedLngs: LANG_CODES as unknown as string[],
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  });

  return instance;
}

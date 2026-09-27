import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import fa from './locales/fa.json';
import en from './locales/en.json';

const saved = localStorage.getItem('eyemind_lang') ?? 'fa';

void i18n.use(initReactI18next).init({
  resources: {
    fa: { translation: fa },
    en: { translation: en },
  },
  lng: saved,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export function applyDocumentLanguage(lang: string) {
  const dir = lang === 'fa' ? 'rtl' : 'ltr';
  document.documentElement.lang = lang;
  document.documentElement.dir = dir;
  localStorage.setItem('eyemind_lang', lang);
}

applyDocumentLanguage(saved);

export default i18n;

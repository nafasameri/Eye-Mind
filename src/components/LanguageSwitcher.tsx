import { useTranslation } from 'react-i18next';
import { applyDocumentLanguage } from '../i18n';
import './LanguageSwitcher.css';

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const next = i18n.language === 'fa' ? 'en' : 'fa';

  return (
    <button
      type="button"
      className="lang-switch"
      aria-label={t('common.language')}
      onClick={() => {
        void i18n.changeLanguage(next);
        applyDocumentLanguage(next);
      }}
    >
      {next === 'fa' ? 'FA' : 'EN'}
    </button>
  );
}

import { useTranslation } from 'react-i18next';
import { ApiClientError } from '../services/api';
import { AUTH_ERROR_KEYS } from '../auth/errorCodes';

export function useApiError() {
  const { t, i18n } = useTranslation();

  return (err: unknown) => {
    if (err instanceof ApiClientError) {
      const key = AUTH_ERROR_KEYS[err.code];
      if (key) {
        const translated = t(key);
        if (translated !== key) return translated;
      }
      // Prefer API message for FA; for EN still show mapped or raw
      if (i18n.language === 'fa' && err.message) return err.message;
      return err.message || t('errors.generic');
    }
    if (err instanceof Error) return err.message;
    return t('errors.generic');
  };
}

import { useTranslation } from 'react-i18next';
import './marketing.css';

export function AboutPage() {
  const { t } = useTranslation();
  return (
    <section className="page-section">
      <div className="container prose-page">
        <h1 className="animate-fade-up">{t('about.title')}</h1>
        <p className="lead animate-fade-up-delay">{t('about.lead')}</p>
        <p className="animate-fade-up-delay">{t('about.body')}</p>
      </div>
    </section>
  );
}

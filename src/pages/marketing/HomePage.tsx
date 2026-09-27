import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '../../design-system';
import './marketing.css';

export function HomePage() {
  const { t } = useTranslation();

  return (
    <section className="hero">
      <div className="hero__atmosphere" aria-hidden>
        <div className="hero__orb" />
        <div className="hero__ring hero__ring--a" />
        <div className="hero__ring hero__ring--b" />
        <div className="hero__veins" />
      </div>
      <div className="container hero__content">
        <p className="hero__brand animate-fade-up">{t('brand')}</p>
        <h1 className="hero__title animate-fade-up-delay">{t('home.headline')}</h1>
        <p className="hero__sub animate-fade-up-delay">{t('home.sub')}</p>
        <div className="hero__cta animate-fade-up-delay">
          <Link to="/signup">
            <Button size="lg">{t('home.ctaTrial')}</Button>
          </Link>
          <Link to="/pricing">
            <Button size="lg" variant="secondary">
              {t('home.ctaPricing')}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

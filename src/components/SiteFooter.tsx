import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import './SiteFooter.css';

export function SiteFooter() {
  const { t } = useTranslation();
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <span className="site-footer__brand">{t('brand')}</span>
        <div className="site-footer__links">
          <Link to="/about">{t('nav.about')}</Link>
          <Link to="/contact">{t('nav.contact')}</Link>
          <Link to="/pricing">{t('nav.pricing')}</Link>
        </div>
        <p className="site-footer__copy">© {new Date().getFullYear()} EyeMind</p>
      </div>
    </footer>
  );
}

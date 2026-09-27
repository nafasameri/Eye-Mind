import { NavLink, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../auth/AuthContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Button } from '../design-system';
import './SiteHeader.css';

export function SiteHeader() {
  const { t } = useTranslation();
  const { isAuthenticated, logout } = useAuth();

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link to="/" className="site-header__brand">
          <span className="site-header__mark" aria-hidden />
          {t('brand')}
        </Link>
        <nav className="site-header__nav" aria-label="Main">
          <NavLink to="/">{t('nav.home')}</NavLink>
          <NavLink to="/about">{t('nav.about')}</NavLink>
          <NavLink to="/pricing">{t('nav.pricing')}</NavLink>
          <NavLink to="/contact">{t('nav.contact')}</NavLink>
          {isAuthenticated ? <NavLink to="/app">{t('nav.app')}</NavLink> : null}
        </nav>
        <div className="site-header__actions">
          <LanguageSwitcher />
          {isAuthenticated ? (
            <Button variant="ghost" size="sm" onClick={logout}>
              {t('nav.logout')}
            </Button>
          ) : (
            <>
              <Link to="/login" className="site-header__text-link">
                {t('nav.login')}
              </Link>
              <Link to="/signup">
                <Button size="sm">{t('nav.signup')}</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

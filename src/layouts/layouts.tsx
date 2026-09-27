import { Outlet } from 'react-router-dom';
import { SiteHeader } from '../components/SiteHeader';
import { SiteFooter } from '../components/SiteFooter';
import './layouts.css';

export function MarketingLayout() {
  return (
    <div className="shell">
      <SiteHeader />
      <main className="shell__main">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  );
}

export function AppShell() {
  return (
    <div className="shell">
      <SiteHeader />
      <main className="shell__main shell__main--app">
        <div className="container">
          <Outlet />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

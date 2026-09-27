import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../auth/AuthContext';
import { Badge, Panel } from '../../design-system';
import type { Role } from '../../types/api';

type LinkItem = { to: string; label: string; roles?: Role[]; trialOk?: boolean };

export function AppHomePage() {
  const { t } = useTranslation();
  const { activeRole, activeRoleTitle, activeTenantId, trial, trialRemainingScans } =
    useAuth();

  const links: LinkItem[] = [
    { to: '/app/entitlement', label: t('commercial.entitlementTitle'), trialOk: true },
    { to: '/app/usage', label: t('commercial.usageHistory'), trialOk: true },
    { to: '/app/licenses', label: t('commercial.licenses') },
    { to: '/app/invoices', label: t('commercial.invoices'), roles: ['SUPER_ADMIN', 'TENANT_ADMIN'] },
    { to: '/app/subscription', label: t('subscriptions.current') },
    { to: '/pricing', label: t('nav.pricing'), trialOk: true },
    { to: '/app/register-member', label: t('auth.registerTitle'), roles: ['SUPER_ADMIN', 'TENANT_ADMIN'] },
    { to: '/app/tenants/create', label: t('tenants.createTitle'), roles: ['SUPER_ADMIN'] },
    { to: '/app/tenants/detail', label: `${t('tenants.name')} (ID)`, roles: ['SUPER_ADMIN'] },
    { to: '/app/tenants/members', label: t('tenants.membersTitle'), roles: ['SUPER_ADMIN', 'TENANT_ADMIN'] },
    { to: '/app/tenants/users', label: t('tenants.usersTitle'), roles: ['SUPER_ADMIN', 'TENANT_ADMIN'] },
    { to: '/app/subscriptions/assign', label: t('subscriptions.assign'), roles: ['SUPER_ADMIN'] },
    { to: '/app/pay-per-screening', label: t('pps.title'), roles: ['SUPER_ADMIN', 'TENANT_ADMIN'] },
    { to: '/app/on-premise', label: t('onprem.title'), roles: ['SUPER_ADMIN', 'TENANT_ADMIN'] },
  ];

  const visible = links.filter((l) => {
    if (l.trialOk && trial) return true;
    if (!activeRole) return Boolean(l.trialOk);
    if (!l.roles) return true;
    return l.roles.includes(activeRole);
  });

  return (
    <section className="stack">
      <div>
        <h1>{t('app.welcome')}</h1>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {trial ? <Badge tone="accent">Trial</Badge> : null}
          {activeRole ? (
            <Badge tone="neutral">{`${t('app.role')}: ${activeRoleTitle || t(`roles.${activeRole}`)}`}</Badge>
          ) : null}
          {activeTenantId ? (
            <Badge tone="neutral">{`${t('app.tenant')}: ${activeTenantId.slice(0, 8)}…`}</Badge>
          ) : null}
          {trial && trialRemainingScans != null ? (
            <Badge tone="success">{t('trial.remaining', { count: trialRemainingScans })}</Badge>
          ) : null}
        </div>
      </div>
      <Panel title={t('app.linksTitle')}>
        <ul className="app-link-list">
          {visible.map((l) => (
            <li key={l.to}>
              <Link to={l.to}>{l.label}</Link>
            </li>
          ))}
        </ul>
      </Panel>
    </section>
  );
}

import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { commercialApi, getErrorMessage } from '../../services/api';
import { useAuth } from '../../auth/AuthContext';
import { Alert, Button, Panel, Spinner } from '../../design-system';
import '../marketing/marketing.css';

function formatPrice(price: number, lang: string) {
  return new Intl.NumberFormat(lang === 'fa' ? 'fa-IR' : 'en-US').format(price);
}

export function PricingPage() {
  const { t, i18n } = useTranslation();
  const { accessToken } = useAuth();
  const query = useQuery({
    queryKey: ['pricing-plans'],
    queryFn: () => commercialApi.pricingPlans(accessToken),
  });

  const plans = useMemo(() => {
    const list = query.data ?? [];
    return list.filter(
      (p) =>
        p.status === 'ACTIVE' &&
        p.product_type === 'SUBSCRIPTION' &&
        (p.billing_type === 'MONTHLY' || p.billing_type === 'YEARLY'),
    );
  }, [query.data]);

  return (
    <section className="page-section">
      <div className="container">
        <h1>{t('pricing.title')}</h1>
        <p className="lead">{t('pricing.lead')}</p>
        {query.isLoading ? <Spinner label={t('common.loading')} /> : null}
        {query.isError ? (
          <Alert tone="danger">{getErrorMessage(query.error)}</Alert>
        ) : null}
        {!query.isLoading && plans.length === 0 ? (
          <p className="empty-state">{t('pricing.empty')}</p>
        ) : null}
        <div className="plan-grid">
          {plans.map((p) => (
            <Panel key={p.id} title={p.name}>
              <p style={{ margin: 0, color: 'var(--color-text)' }}>
                <strong style={{ fontSize: '1.5rem' }}>
                  {formatPrice(p.price, i18n.language)}
                </strong>
                <span style={{ color: 'var(--color-text-dim)' }}>
                  {' '}
                  /{' '}
                  {p.billing_type === 'MONTHLY'
                    ? t('pricing.monthly')
                    : t('pricing.yearly')}
                </span>
              </p>
              <p>
                {p.has_unlimited_usage
                  ? t('pricing.unlimited')
                  : t('pricing.scans', { count: p.included_scans ?? 0 })}
              </p>
              <p style={{ fontSize: '0.9rem' }}>{p.product_name}</p>
              <Link to={`/checkout/${p.id}`}>
                <Button>{t('pricing.select')}</Button>
              </Link>
            </Panel>
          ))}
        </div>
      </div>
    </section>
  );
}

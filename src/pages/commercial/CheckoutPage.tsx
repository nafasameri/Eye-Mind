import { useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { commercialApi, subscriptionsApi } from '../../services/api';
import { useAuth } from '../../auth/AuthContext';
import { useApiError } from '../../hooks/useApiError';
import { Alert, Button, Input, Panel, Spinner } from '../../design-system';

function makeTxId() {
  return `SIM-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function CheckoutPage() {
  const { planId } = useParams();
  const pricingPlanId = Number(planId);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { accessToken, activeTenantId, applySession, isAuthenticated } = useAuth();
  const mapError = useApiError();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const plansQuery = useQuery({
    queryKey: ['pricing-plans'],
    queryFn: () => commercialApi.pricingPlans(accessToken),
  });

  const plan = plansQuery.data?.find((p) => p.id === pricingPlanId);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!accessToken) {
      navigate('/login', { state: { from: `/checkout/${planId}` } });
      return;
    }
    setError(null);
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const tenantName = String(fd.get('tenant_name') || '') || null;
    try {
      const res = await subscriptionsApi.purchase(
        {
          pricing_plan_id: pricingPlanId,
          tenant_id: activeTenantId,
          tenant_name: activeTenantId ? null : tenantName,
          transaction_id: makeTxId(),
        },
        accessToken,
      );
      applySession(res.session, { navigate: false });
      navigate('/app/subscription', {
        state: { purchase: res },
      });
    } catch (err) {
      setError(mapError(err));
    } finally {
      setLoading(false);
    }
  }

  if (plansQuery.isLoading) return <Spinner />;

  return (
    <section className="page-section">
      <div className="container narrow">
        <h1>{t('checkout.title')}</h1>
        {plan ? (
          <p className="lead">
            {plan.name} — {plan.price}
          </p>
        ) : (
          <Alert tone="warning">Plan #{pricingPlanId}</Alert>
        )}
        {!isAuthenticated ? (
          <Alert tone="info">
            <Button onClick={() => navigate('/login')}>{t('nav.login')}</Button>
          </Alert>
        ) : (
          <Panel>
            <form className="form-stack" onSubmit={onSubmit}>
              {error ? <Alert tone="danger">{error}</Alert> : null}
              {!activeTenantId ? (
                <Input
                  label={t('checkout.tenantName')}
                  name="tenant_name"
                  required
                />
              ) : null}
              <div className="form-actions">
                <Button type="submit" loading={loading}>
                  {t('checkout.simulatePay')}
                </Button>
              </div>
            </form>
          </Panel>
        )}
      </div>
    </section>
  );
}

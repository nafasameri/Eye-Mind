import { useState, type FormEvent } from 'react'
import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { getErrorMessage, subscriptionsApi } from '../../services/api';
import { useAuth } from '../../auth/AuthContext';
import { useApiError } from '../../hooks/useApiError';
import type { PurchaseSubscriptionResponse } from '../../types/api';
import { Alert, Badge, Button, Input, Panel, Spinner } from '../../design-system';

export function CurrentSubscriptionPage() {
  const { t } = useTranslation();
  const { accessToken, activeTenantId } = useAuth();
  const location = useLocation();
  const purchase = (location.state as { purchase?: PurchaseSubscriptionResponse } | null)
    ?.purchase;
  const mapError = useApiError();
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const query = useQuery({
    queryKey: ['subscription-current', activeTenantId],
    enabled: Boolean(accessToken),
    queryFn: () =>
      subscriptionsApi.current(accessToken!, activeTenantId ?? undefined),
  });

  async function renew() {
    if (!accessToken || !query.data) return;
    setErr(null);
    try {
      await subscriptionsApi.renew(query.data.id, accessToken);
      setMsg('renewed');
      await query.refetch();
    } catch (error) {
      setErr(mapError(error));
    }
  }

  async function createInvoice() {
    if (!accessToken || !query.data) return;
    setErr(null);
    try {
      const inv = await subscriptionsApi.createInvoice(query.data.id, accessToken);
      setMsg(`invoice #${inv.id}`);
    } catch (error) {
      setErr(mapError(error));
    }
  }

  return (
    <section className="stack">
      <h1>{t('subscriptions.current')}</h1>
      {purchase ? (
        <Alert tone="success">
          {t('checkout.success')} — {purchase.tenant_name}
          {purchase.tenant_created ? ' (created)' : ''}
        </Alert>
      ) : null}
      {err ? <Alert tone="danger">{err}</Alert> : null}
      {msg ? <Alert tone="success">{msg}</Alert> : null}
      {query.isLoading ? <Spinner /> : null}
      {query.isError ? (
        <Alert tone="danger">{getErrorMessage(query.error)}</Alert>
      ) : null}
      {query.data ? (
        <Panel title={query.data.plan_name}>
          <Badge tone="accent">{query.data.status}</Badge>
          <p>
            {query.data.product_name} · {query.data.model} · {query.data.license_type}
          </p>
          <p>
            {query.data.start_date} → {query.data.end_date}
          </p>
          <div className="form-actions">
            <Button onClick={() => void renew()}>{t('subscriptions.renew')}</Button>
            <Button variant="secondary" onClick={() => void createInvoice()}>
              {t('subscriptions.createInvoice')}
            </Button>
          </div>
        </Panel>
      ) : null}
    </section>
  );
}

export function AssignSubscriptionPage() {
  const { t } = useTranslation();
  const { accessToken } = useAuth();
  const mapError = useApiError();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!accessToken) return;
    setLoading(true);
    setError(null);
    setSuccess(null);
    const fd = new FormData(e.currentTarget);
    try {
      const res = await subscriptionsApi.assign(
        {
          tenant_id: String(fd.get('tenant_id') || ''),
          pricing_plan_id: Number(fd.get('pricing_plan_id')),
          license_type: String(fd.get('license_type') || 'CLOUD') as
            | 'CLOUD'
            | 'ON_PREMISE'
            | 'HYBRID',
          start_date: String(fd.get('start_date') || '') || null,
        },
        accessToken,
      );
      setSuccess(`license #${res.id}`);
    } catch (err) {
      setError(mapError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section>
      <h1>{t('subscriptions.assign')}</h1>
      <Panel>
        <form className="form-stack" onSubmit={onSubmit}>
          {error ? <Alert tone="danger">{error}</Alert> : null}
          {success ? <Alert tone="success">{success}</Alert> : null}
          <Input label={t('subscriptions.tenantId')} name="tenant_id" required />
          <Input
            label={t('subscriptions.pricingPlanId')}
            name="pricing_plan_id"
            type="number"
            required
          />
          <Input label={t('subscriptions.licenseType')} name="license_type" defaultValue="CLOUD" />
          <Input label={t('subscriptions.startDate')} name="start_date" type="datetime-local" />
          <Button type="submit" loading={loading}>
            {t('subscriptions.assign')}
          </Button>
        </form>
      </Panel>
    </section>
  );
}

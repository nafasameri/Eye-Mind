import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next';
import { payPerScreeningApi } from '../../services/api';
import { useAuth } from '../../auth/AuthContext';
import { useApiError } from '../../hooks/useApiError';
import type { LicenseType } from '../../types/api';
import { Alert, Button, Input, Panel, Select } from '../../design-system';

export function PayPerScreeningPage() {
  const { t } = useTranslation();
  const { accessToken, activeTenantId, activeRole } = useAuth();
  const mapError = useApiError();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function assign(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!accessToken) return;
    setLoading(true);
    setError(null);
    setSuccess(null);
    const fd = new FormData(e.currentTarget);
    try {
      const res = await payPerScreeningApi.assign(
        {
          tenant_id: String(fd.get('tenant_id') || activeTenantId || ''),
          pricing_plan_id: Number(fd.get('pricing_plan_id')),
          license_type: String(fd.get('license_type') || 'CLOUD') as LicenseType,
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

  async function renew(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!accessToken) return;
    setLoading(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    try {
      const res = await payPerScreeningApi.renew(
        Number(fd.get('license_id')),
        accessToken,
      );
      setSuccess(`renewed #${res.id}`);
    } catch (err) {
      setError(mapError(err));
    } finally {
      setLoading(false);
    }
  }

  async function invoice() {
    if (!accessToken) return;
    setLoading(true);
    setError(null);
    try {
      const inv = await payPerScreeningApi.createInvoice(
        accessToken,
        activeTenantId,
      );
      setSuccess(`invoice #${inv.id}`);
    } catch (err) {
      setError(mapError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="stack">
      <h1>{t('pps.title')}</h1>
      {error ? <Alert tone="danger">{error}</Alert> : null}
      {success ? <Alert tone="success">{success}</Alert> : null}

      {activeRole === 'SUPER_ADMIN' ? (
        <Panel title={t('pps.assign')}>
          <form className="form-stack" onSubmit={assign}>
            <Input
              label={t('subscriptions.tenantId')}
              name="tenant_id"
              defaultValue={activeTenantId ?? ''}
              required
            />
            <Input
              label={t('subscriptions.pricingPlanId')}
              name="pricing_plan_id"
              type="number"
              required
            />
            <Select
              label={t('subscriptions.licenseType')}
              name="license_type"
              options={[
                { value: 'CLOUD', label: 'CLOUD' },
                { value: 'ON_PREMISE', label: 'ON_PREMISE' },
                { value: 'HYBRID', label: 'HYBRID' },
              ]}
            />
            <Button type="submit" loading={loading}>
              {t('pps.assign')}
            </Button>
          </form>
        </Panel>
      ) : null}

      <Panel title={t('pps.renew')}>
        <form className="form-stack" onSubmit={renew}>
          <Input label="License ID" name="license_id" type="number" required />
          <Button type="submit" loading={loading}>
            {t('pps.renew')}
          </Button>
        </form>
      </Panel>

      <Panel title={t('pps.invoice')}>
        <Button loading={loading} onClick={() => void invoice()}>
          {t('pps.invoice')}
        </Button>
      </Panel>
    </section>
  );
}

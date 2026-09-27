import { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { tenantsApi } from '../../services/api';
import { useAuth } from '../../auth/AuthContext';
import { useApiError } from '../../hooks/useApiError';
import type { TenantResponse } from '../../types/api';
import { Alert, Button, Input, Panel } from '../../design-system';

export function TenantDetailPage() {
  const { t } = useTranslation();
  const { accessToken } = useAuth();
  const mapError = useApiError();
  const [error, setError] = useState<string | null>(null);
  const [tenant, setTenant] = useState<TenantResponse | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!accessToken) return;
    setLoading(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    try {
      const res = await tenantsApi.get(String(fd.get('tenant_id') || ''), accessToken);
      setTenant(res);
    } catch (err) {
      setError(mapError(err));
      setTenant(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="stack">
      <h1>{t('tenants.name')}</h1>
      <Panel>
        <form className="form-stack" onSubmit={onSubmit}>
          {error ? <Alert tone="danger">{error}</Alert> : null}
          <Input label={t('subscriptions.tenantId')} name="tenant_id" required />
          <Button type="submit" loading={loading}>
            {t('common.save')}
          </Button>
        </form>
      </Panel>
      {tenant ? (
        <Panel title={tenant.name}>
          <p>
            {tenant.code} — {tenant.status_message}
          </p>
          <p>
            {tenant.contact_person} · {tenant.phone_number} · {tenant.email}
          </p>
          <p>{tenant.address}</p>
        </Panel>
      ) : null}
    </section>
  );
}

import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next';
import { tenantsApi } from '../../services/api';
import { useAuth } from '../../auth/AuthContext';
import { useApiError } from '../../hooks/useApiError';
import type { TenantStatus } from '../../types/api';
import { Alert, Button, Input, Panel, Select } from '../../design-system';

export function CreateTenantPage() {
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
      const res = await tenantsApi.create(
        {
          name: String(fd.get('name') || ''),
          status: String(fd.get('status') || 'ACTIVE') as TenantStatus,
          code: String(fd.get('code') || ''),
          contact_person: String(fd.get('contact_person') || ''),
          phone_number: String(fd.get('phone_number') || ''),
          email: String(fd.get('email') || ''),
          address: String(fd.get('address') || ''),
        },
        accessToken,
      );
      setSuccess(`${res.name} (${res.code}) — ${res.status_message}`);
      e.currentTarget.reset();
    } catch (err) {
      setError(mapError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section>
      <h1>{t('tenants.createTitle')}</h1>
      <Panel>
        <form className="form-stack" onSubmit={onSubmit}>
          {error ? <Alert tone="danger">{error}</Alert> : null}
          {success ? <Alert tone="success">{success}</Alert> : null}
          <Input label={t('tenants.name')} name="name" required />
          <Input label={t('tenants.code')} name="code" required />
          <Input label={t('tenants.contact')} name="contact_person" required />
          <Input label={t('auth.phone')} name="phone_number" required />
          <Input label={t('auth.email')} name="email" type="email" required />
          <Input label={t('tenants.address')} name="address" required />
          <Select
            label={t('tenants.status')}
            name="status"
            options={[
              { value: 'ACTIVE', label: 'ACTIVE' },
              { value: 'INACTIVE', label: 'INACTIVE' },
            ]}
          />
          <Button type="submit" loading={loading}>
            {t('tenants.create')}
          </Button>
        </form>
      </Panel>
    </section>
  );
}

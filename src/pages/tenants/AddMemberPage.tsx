import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next';
import { tenantsApi } from '../../services/api';
import { useAuth } from '../../auth/AuthContext';
import { useApiError } from '../../hooks/useApiError';
import type { Role } from '../../types/api';
import { Alert, Button, Input, Panel, Select } from '../../design-system';

export function AddMemberPage() {
  const { t } = useTranslation();
  const { accessToken, activeRole, activeTenantId } = useAuth();
  const mapError = useApiError();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const roleOptions =
    activeRole === 'SUPER_ADMIN'
      ? [
          { value: 'TENANT_ADMIN', label: t('roles.TENANT_ADMIN') },
          { value: 'DOCTOR', label: t('roles.DOCTOR') },
          { value: 'OPERATOR', label: t('roles.OPERATOR') },
        ]
      : [
          { value: 'DOCTOR', label: t('roles.DOCTOR') },
          { value: 'OPERATOR', label: t('roles.OPERATOR') },
        ];

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!accessToken) return;
    setLoading(true);
    setError(null);
    setSuccess(false);
    const fd = new FormData(e.currentTarget);
    try {
      await tenantsApi.addMember(
        {
          tenant_id: String(fd.get('tenant_id') || '') || activeTenantId,
          username: String(fd.get('username') || ''),
          role: String(fd.get('role') || 'DOCTOR') as Role,
        },
        accessToken,
      );
      setSuccess(true);
      e.currentTarget.reset();
    } catch (err) {
      setError(mapError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section>
      <h1>{t('tenants.membersTitle')}</h1>
      <Panel>
        <form className="form-stack" onSubmit={onSubmit}>
          {error ? <Alert tone="danger">{error}</Alert> : null}
          {success ? <Alert tone="success">OK</Alert> : null}
          {activeRole === 'SUPER_ADMIN' ? (
            <Input
              label={t('subscriptions.tenantId')}
              name="tenant_id"
              placeholder={activeTenantId ?? ''}
            />
          ) : null}
          <Input label={t('auth.username')} name="username" required />
          <Select label={t('auth.role')} name="role" options={roleOptions} />
          <Button type="submit" loading={loading}>
            {t('tenants.addMember')}
          </Button>
        </form>
      </Panel>
    </section>
  );
}

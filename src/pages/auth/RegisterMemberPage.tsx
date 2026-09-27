import { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { authApi } from '../../services/api';
import { useAuth } from '../../auth/AuthContext';
import { useApiError } from '../../hooks/useApiError';
import type { Role } from '../../types/api';
import { Alert, Button, Input, Panel, Select } from '../../design-system';

export function RegisterMemberPage() {
  const { t } = useTranslation();
  const { accessToken, activeRole } = useAuth();
  const mapError = useApiError();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
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
    setError(null);
    setSuccess(null);
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    try {
      const res = await authApi.register(
        {
          first_name: String(fd.get('first_name') || ''),
          last_name: String(fd.get('last_name') || ''),
          phone_number: String(fd.get('phone_number') || ''),
          email: String(fd.get('email') || ''),
          role: String(fd.get('role') || 'DOCTOR') as Role,
          username: String(fd.get('username') || ''),
          password: String(fd.get('password') || ''),
        },
        accessToken,
      );
      setSuccess(`${res.username} — ${res.role_title}`);
      e.currentTarget.reset();
    } catch (err) {
      setError(mapError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section>
      <h1>{t('auth.registerTitle')}</h1>
      <Panel>
        <form className="form-stack" onSubmit={onSubmit}>
          {error ? <Alert tone="danger">{error}</Alert> : null}
          {success ? <Alert tone="success">{success}</Alert> : null}
          <div className="grid-2">
            <Input label={t('auth.firstName')} name="first_name" required />
            <Input label={t('auth.lastName')} name="last_name" required />
          </div>
          <Input label={t('auth.phone')} name="phone_number" required />
          <Input label={t('auth.email')} name="email" type="email" required />
          <Input label={t('auth.username')} name="username" required />
          <Input label={t('auth.password')} name="password" type="password" required minLength={8} />
          <Select label={t('auth.role')} name="role" options={roleOptions} required />
          <div className="form-actions">
            <Button type="submit" loading={loading}>
              {t('common.save')}
            </Button>
          </div>
        </form>
      </Panel>
    </section>
  );
}

import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { authApi } from '../../services/api';
import { useAuth } from '../../auth/AuthContext';
import { useApiError } from '../../hooks/useApiError';
import { Alert, Button, Input, Panel } from '../../design-system';

export function LoginPage() {
  const { t } = useTranslation();
  const { applySession } = useAuth();
  const mapError = useApiError();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    try {
      const res = await authApi.login({
        username: String(fd.get('username') || ''),
        password: String(fd.get('password') || ''),
        tenant_id: null,
      });
      applySession(res);
    } catch (err) {
      setError(mapError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="page-section">
      <div className="container narrow">
        <h1>{t('auth.loginTitle')}</h1>
        <Panel>
          <form className="form-stack" onSubmit={onSubmit}>
            {error ? <Alert tone="danger">{error}</Alert> : null}
            <Input label={t('auth.username')} name="username" required autoComplete="username" />
            <Input
              label={t('auth.password')}
              name="password"
              type="password"
              required
              autoComplete="current-password"
            />
            <div className="form-actions">
              <Button type="submit" loading={loading}>
                {t('auth.submitLogin')}
              </Button>
              <Link to="/signup">{t('nav.signup')}</Link>
            </div>
          </form>
        </Panel>
      </div>
    </section>
  );
}

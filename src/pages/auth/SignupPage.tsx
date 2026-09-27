import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { authApi } from '../../services/api';
import { useAuth } from '../../auth/AuthContext';
import { useApiError } from '../../hooks/useApiError';
import { Alert, Button, Input, Panel } from '../../design-system';

export function SignupPage() {
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
      const res = await authApi.signup({
        first_name: String(fd.get('first_name') || ''),
        last_name: String(fd.get('last_name') || ''),
        phone_number: String(fd.get('phone_number') || ''),
        email: String(fd.get('email') || ''),
        username: String(fd.get('username') || ''),
        password: String(fd.get('password') || ''),
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
        <h1>{t('auth.signupTitle')}</h1>
        <Panel>
          <form className="form-stack" onSubmit={onSubmit}>
            {error ? <Alert tone="danger">{error}</Alert> : null}
            <div className="grid-2">
              <Input label={t('auth.firstName')} name="first_name" required />
              <Input label={t('auth.lastName')} name="last_name" required />
            </div>
            <Input label={t('auth.phone')} name="phone_number" required />
            <Input label={t('auth.email')} name="email" type="email" required />
            <Input label={t('auth.username')} name="username" required />
            <Input
              label={t('auth.password')}
              name="password"
              type="password"
              required
              hint={t('auth.passwordHint')}
              minLength={8}
            />
            <div className="form-actions">
              <Button type="submit" loading={loading}>
                {t('auth.submitSignup')}
              </Button>
              <Link to="/login">{t('nav.login')}</Link>
            </div>
          </form>
        </Panel>
      </div>
    </section>
  );
}

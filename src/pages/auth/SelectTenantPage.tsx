import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { authApi } from '../../services/api';
import { useAuth } from '../../auth/AuthContext';
import { useApiError } from '../../hooks/useApiError';
import { Alert, Button, Panel } from '../../design-system';

export function SelectTenantPage() {
  const { t } = useTranslation();
  const { accessToken, memberships, applySession } = useAuth();
  const mapError = useApiError();
  const [error, setError] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function select(tenantId: string) {
    if (!accessToken) return;
    setError(null);
    setLoadingId(tenantId);
    try {
      const res = await authApi.switchTenant(tenantId, accessToken);
      applySession(res);
    } catch (err) {
      setError(mapError(err));
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <section className="page-section">
      <div className="container narrow">
        <h1>{t('auth.selectTenantTitle')}</h1>
        <p className="lead">{t('auth.selectTenantLead')}</p>
        {error ? <Alert tone="danger">{error}</Alert> : null}
        <div className="stack" style={{ marginTop: '1rem' }}>
          {memberships.map((m) => (
            <Panel key={m.tenant_id}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                }}
              >
                <div>
                  <strong>{m.tenant_name}</strong>
                  <p style={{ margin: '0.25rem 0 0' }}>
                    {m.role_title || t(`roles.${m.role}`)}
                  </p>
                </div>
                <Button
                  loading={loadingId === m.tenant_id}
                  onClick={() => void select(m.tenant_id)}
                >
                  {t('auth.continue')}
                </Button>
              </div>
            </Panel>
          ))}
        </div>
      </div>
    </section>
  );
}

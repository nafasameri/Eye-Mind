import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next';
import { commercialApi } from '../../services/api';
import { useAuth } from '../../auth/AuthContext';
import { useApiError } from '../../hooks/useApiError';
import type { ScreeningEntitlementResponse, UsageType } from '../../types/api';
import { Alert, Badge, Button, Input, Panel, Select } from '../../design-system';

export function EntitlementPage() {
  const { t } = useTranslation();
  const { accessToken } = useAuth();
  const mapError = useApiError();
  const [entitlement, setEntitlement] = useState<ScreeningEntitlementResponse | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function check(usageType: UsageType) {
    if (!accessToken) return;
    setLoading(true);
    setError(null);
    try {
      const res = await commercialApi.entitlement(accessToken, usageType);
      setEntitlement(res);
    } catch (err) {
      setError(mapError(err));
    } finally {
      setLoading(false);
    }
  }

  async function record(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!accessToken) return;
    setError(null);
    setSuccess(null);
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    try {
      const res = await commercialApi.recordScreening(accessToken, {
        usage_type: String(fd.get('usage_type') || 'DR_SCREENING') as UsageType,
        ai_screening_id: Number(fd.get('ai_screening_id')),
      });
      setSuccess(
        `OK — consumed ${res.consumed_scans}, remaining ${res.remaining_scans ?? '∞'}`,
      );
    } catch (err) {
      setError(mapError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="stack">
      <h1>{t('commercial.entitlementTitle')}</h1>
      {error ? <Alert tone="danger">{error}</Alert> : null}
      {success ? <Alert tone="success">{success}</Alert> : null}
      <Panel>
        <div className="form-actions">
          <Button loading={loading} onClick={() => void check('DR_SCREENING')}>
            {t('commercial.check')} (DR)
          </Button>
          <Button
            variant="secondary"
            loading={loading}
            onClick={() => void check('ROP_SCREENING')}
          >
            {t('commercial.check')} (ROP)
          </Button>
        </div>
        {entitlement ? (
          <div className="stack" style={{ marginTop: '1rem' }}>
            <Badge tone={entitlement.allowed ? 'success' : 'danger'}>
              {entitlement.allowed ? 'allowed' : 'denied'}
            </Badge>
            <p>{entitlement.message}</p>
            <p>
              model: {entitlement.model ?? '—'} | consumed:{' '}
              {entitlement.consumed_scans} | remaining:{' '}
              {entitlement.remaining_scans ?? '∞'}
            </p>
          </div>
        ) : null}
      </Panel>
      <Panel title={t('commercial.recordUsage')}>
        <form className="form-stack" onSubmit={record}>
          <Select
            label={t('commercial.usageType')}
            name="usage_type"
            options={[
              { value: 'DR_SCREENING', label: 'DR_SCREENING' },
              { value: 'ROP_SCREENING', label: 'ROP_SCREENING' },
            ]}
          />
          <Input
            label={t('commercial.aiScreeningId')}
            name="ai_screening_id"
            type="number"
            required
          />
          <Button type="submit" loading={loading}>
            {t('commercial.recordUsage')}
          </Button>
        </form>
      </Panel>
    </section>
  );
}

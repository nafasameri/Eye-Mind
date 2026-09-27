import { useState, type FormEvent } from 'react'
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { getErrorMessage, onPremiseApi } from '../../services/api';
import { useAuth } from '../../auth/AuthContext';
import { useApiError } from '../../hooks/useApiError';
import type { LicenseType } from '../../types/api';
import { Alert, Button, Input, Panel, Select, Spinner } from '../../design-system';

export function OnPremisePage() {
  const { t } = useTranslation();
  const { accessToken, activeTenantId, activeRole } = useAuth();
  const mapError = useApiError();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [validation, setValidation] = useState<string | null>(null);

  const current = useQuery({
    queryKey: ['onprem-current', activeTenantId],
    enabled: Boolean(accessToken),
    queryFn: () =>
      onPremiseApi.currentDeployment(accessToken!, activeTenantId ?? undefined),
    retry: false,
  });

  async function run<T>(fn: () => Promise<T>, ok: (r: T) => string) {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fn();
      setSuccess(ok(res));
      await current.refetch();
    } catch (err) {
      setError(mapError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="stack">
      <h1>{t('onprem.title')}</h1>
      {error ? <Alert tone="danger">{error}</Alert> : null}
      {success ? <Alert tone="success">{success}</Alert> : null}

      <Panel title={t('onprem.current')}>
        {current.isLoading ? <Spinner /> : null}
        {current.isError ? (
          <p className="empty-state">{getErrorMessage(current.error)}</p>
        ) : null}
        {current.data ? (
          <div>
            <p>
              #{current.data.id} — {current.data.server_ip}
            </p>
            <Button
              size="sm"
              loading={loading}
              onClick={() =>
                void run(
                  () => onPremiseApi.rotateKey(current.data!.id, accessToken!),
                  (r) => `rotated #${r.id}`,
                )
              }
            >
              {t('onprem.rotate')}
            </Button>
          </div>
        ) : null}
      </Panel>

      <Panel title={t('onprem.provision')}>
        <form
          className="form-stack"
          onSubmit={(e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            void run(
              () =>
                onPremiseApi.provision(
                  {
                    tenant_id: String(fd.get('tenant_id') || '') || activeTenantId,
                    server_ip: String(fd.get('server_ip') || ''),
                  },
                  accessToken!,
                ),
              (r) => `deployment #${r.id}`,
            );
          }}
        >
          {activeRole === 'SUPER_ADMIN' ? (
            <Input
              label={t('subscriptions.tenantId')}
              name="tenant_id"
              defaultValue={activeTenantId ?? ''}
            />
          ) : null}
          <Input label={t('onprem.serverIp')} name="server_ip" required />
          <Button type="submit" loading={loading}>
            {t('onprem.provision')}
          </Button>
        </form>
      </Panel>

      {activeRole === 'SUPER_ADMIN' ? (
        <Panel title={t('onprem.assign')}>
          <form
            className="form-stack"
            onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              void run(
                () =>
                  onPremiseApi.assign(
                    {
                      tenant_id: String(fd.get('tenant_id') || ''),
                      pricing_plan_id: Number(fd.get('pricing_plan_id')),
                      license_type: String(
                        fd.get('license_type') || 'ON_PREMISE',
                      ) as LicenseType,
                      start_date: String(fd.get('start_date') || '') || null,
                    },
                    accessToken!,
                  ),
                (r) => `license #${r.id}`,
              );
            }}
          >
            <Input label={t('subscriptions.tenantId')} name="tenant_id" required />
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
                { value: 'ON_PREMISE', label: 'ON_PREMISE' },
                { value: 'HYBRID', label: 'HYBRID' },
                { value: 'CLOUD', label: 'CLOUD' },
              ]}
            />
            <Button type="submit" loading={loading}>
              {t('onprem.assign')}
            </Button>
          </form>
        </Panel>
      ) : null}

      <Panel title={t('onprem.renew')}>
        <form
          className="form-stack"
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            const id = Number(fd.get('license_id'));
            void run(
              () => onPremiseApi.renew(id, accessToken!),
              (r) => `renewed #${r.id}`,
            );
          }}
        >
          <Input label="License ID" name="license_id" type="number" required />
          <Button type="submit" loading={loading}>
            {t('onprem.renew')}
          </Button>
        </form>
      </Panel>

      <Panel title={t('onprem.invoice')}>
        <form
          className="form-stack"
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            void run(
              () =>
                onPremiseApi.createInvoice(
                  Number(fd.get('license_id')),
                  accessToken!,
                ),
              (r) => `invoice #${r.id}`,
            );
          }}
        >
          <Input label="License ID" name="license_id" type="number" required />
          <Button type="submit" loading={loading}>
            {t('onprem.invoice')}
          </Button>
        </form>
      </Panel>

      <Panel title={t('onprem.validate')}>
        {validation ? <Alert tone="info">{validation}</Alert> : null}
        <form
          className="form-stack"
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            const key = String(fd.get('license_key') || '');
            setLoading(true);
            setError(null);
            void onPremiseApi
              .validate(key)
              .then((res) => {
                setValidation(
                  `valid=${res.valid} healthy=${res.is_healthy} ${res.tenant_name ?? ''} ${res.message ?? ''}`,
                );
              })
              .catch((err) => setError(mapError(err)))
              .finally(() => setLoading(false));
          }}
        >
          <Input label={t('onprem.licenseKey')} name="license_key" required />
          <Button type="submit" loading={loading}>
            {t('onprem.validate')}
          </Button>
        </form>
      </Panel>

      <Panel title={t('onprem.heartbeat')}>
        <form
          className="form-stack"
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            void run(
              () =>
                onPremiseApi.heartbeat(
                  String(fd.get('license_key') || ''),
                  accessToken!,
                ),
              () => 'heartbeat ok',
            );
          }}
        >
          <Input label={t('onprem.licenseKey')} name="license_key" required />
          <Button type="submit" loading={loading}>
            {t('onprem.heartbeat')}
          </Button>
        </form>
      </Panel>
    </section>
  );
}

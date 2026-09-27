import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { commercialApi, getErrorMessage } from '../../services/api';
import { useAuth } from '../../auth/AuthContext';
import { Alert, Badge, Panel, Spinner } from '../../design-system';

export function LicensesPage() {
  const { t } = useTranslation();
  const { accessToken, activeTenantId } = useAuth();
  const query = useQuery({
    queryKey: ['licenses', activeTenantId],
    enabled: Boolean(accessToken),
    queryFn: () =>
      commercialApi.licenses(accessToken!, {
        tenant_id: activeTenantId ?? undefined,
      }),
  });

  return (
    <section>
      <h1>{t('commercial.licenses')}</h1>
      {query.isLoading ? <Spinner /> : null}
      {query.isError ? (
        <Alert tone="danger">{getErrorMessage(query.error)}</Alert>
      ) : null}
      <div className="stack">
        {(query.data ?? []).map((lic) => (
          <Panel key={lic.id} title={lic.plan_name}>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <Badge tone={lic.status === 'ACTIVE' ? 'success' : 'neutral'}>
                {lic.status}
              </Badge>
              <Badge tone="accent">{lic.model}</Badge>
              <Badge tone="neutral">{lic.license_type}</Badge>
            </div>
            <p>
              {lic.product_name} — {lic.price} — {lic.start_date} → {lic.end_date}
            </p>
            <p>
              scans: {lic.has_unlimited_usage ? '∞' : lic.included_scans}
            </p>
          </Panel>
        ))}
        {!query.isLoading && (query.data?.length ?? 0) === 0 ? (
          <p className="empty-state">{t('common.noData')}</p>
        ) : null}
      </div>
    </section>
  );
}

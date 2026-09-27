import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { commercialApi, getErrorMessage } from '../../services/api';
import { useAuth } from '../../auth/AuthContext';
import { Alert, Panel, Spinner } from '../../design-system';

export function UsageHistoryPage() {
  const { t } = useTranslation();
  const { accessToken, activeTenantId } = useAuth();
  const query = useQuery({
    queryKey: ['usage', activeTenantId],
    enabled: Boolean(accessToken),
    queryFn: () =>
      commercialApi.usageHistory(accessToken!, {
        tenant_id: activeTenantId ?? undefined,
        page_number: 1,
        page_size: 25,
      }),
  });

  return (
    <section>
      <h1>{t('commercial.usageHistory')}</h1>
      {query.isLoading ? <Spinner /> : null}
      {query.isError ? (
        <Alert tone="danger">{getErrorMessage(query.error)}</Alert>
      ) : null}
      <Panel>
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Type</th>
              <th>Model</th>
              <th>Count</th>
              <th>Remaining</th>
            </tr>
          </thead>
          <tbody>
            {(query.data?.data ?? []).map((row) => (
              <tr key={row.id}>
                <td>{row.id}</td>
                <td>{row.usage_type}</td>
                <td>{row.model}</td>
                <td>{row.count}</td>
                <td>{row.remaining_scans ?? '∞'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!query.isLoading && (query.data?.data?.length ?? 0) === 0 ? (
          <p className="empty-state">{t('common.noData')}</p>
        ) : null}
      </Panel>
    </section>
  );
}

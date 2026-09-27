import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { getErrorMessage, tenantsApi } from '../../services/api';
import { useAuth } from '../../auth/AuthContext';
import { Alert, Panel, Spinner } from '../../design-system';

export function TenantUsersPage() {
  const { t } = useTranslation();
  const { accessToken } = useAuth();
  const query = useQuery({
    queryKey: ['tenant-users'],
    enabled: Boolean(accessToken),
    queryFn: () => tenantsApi.listUsers(accessToken!, 1, 25),
  });

  return (
    <section>
      <h1>{t('tenants.usersTitle')}</h1>
      {query.isLoading ? <Spinner /> : null}
      {query.isError ? (
        <Alert tone="danger">{getErrorMessage(query.error)}</Alert>
      ) : null}
      <Panel>
        <table className="data-table">
          <thead>
            <tr>
              <th>{t('auth.username')}</th>
              <th>{t('auth.firstName')}</th>
              <th>{t('auth.email')}</th>
              <th>{t('auth.role')}</th>
            </tr>
          </thead>
          <tbody>
            {(query.data?.data ?? []).map((u, i) => (
              <tr key={u.username ?? i}>
                <td>{u.username}</td>
                <td>
                  {[u.first_name, u.last_name].filter(Boolean).join(' ')}
                </td>
                <td>{u.email}</td>
                <td>{u.role_title || u.role}</td>
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

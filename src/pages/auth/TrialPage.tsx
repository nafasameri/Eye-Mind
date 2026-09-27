import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../auth/AuthContext';
import { Button, Panel, Badge } from '../../design-system';

export function TrialPage() {
  const { t } = useTranslation();
  const { trialRemainingScans } = useAuth();

  return (
    <section>
      <h1>{t('trial.title')}</h1>
      <p className="lead">{t('trial.lead')}</p>
      <Panel>
        <p>
          {t('trial.remaining', {
            count: trialRemainingScans ?? 100,
          })}
        </p>
        <Badge tone="accent">Trial</Badge>
        <div className="form-actions" style={{ marginTop: '1rem' }}>
          <Link to="/pricing">
            <Button>{t('trial.buy')}</Button>
          </Link>
          <Link to="/app/entitlement">
            <Button variant="secondary">{t('trial.checkEntitlement')}</Button>
          </Link>
        </div>
      </Panel>
    </section>
  );
}

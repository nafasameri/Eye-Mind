import { useState, type FormEvent } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { commercialApi, getErrorMessage } from '../../services/api';
import { useAuth } from '../../auth/AuthContext';
import { useApiError } from '../../hooks/useApiError';
import { Alert, Badge, Button, Input, Panel, Spinner } from '../../design-system';

function makeTxId() {
  return `INV-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function InvoicesPage() {
  const { t } = useTranslation();
  const { accessToken, activeTenantId, activeRole } = useAuth();
  const mapError = useApiError();
  const qc = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);

  const query = useQuery({
    queryKey: ['invoices', activeTenantId],
    enabled: Boolean(accessToken),
    queryFn: () =>
      commercialApi.invoices(accessToken!, {
        tenant_id: activeTenantId ?? undefined,
        page_number: 1,
        page_size: 25,
      }),
  });

  async function pay(invoiceId: number, amount: number) {
    if (!accessToken) return;
    setBusyId(invoiceId);
    setError(null);
    try {
      await commercialApi.payInvoice(
        invoiceId,
        { amount, transaction_id: makeTxId() },
        accessToken,
      );
      await qc.invalidateQueries({ queryKey: ['invoices'] });
    } catch (err) {
      setError(mapError(err));
    } finally {
      setBusyId(null);
    }
  }

  async function voidInvoice(invoiceId: number) {
    if (!accessToken) return;
    setBusyId(invoiceId);
    setError(null);
    try {
      await commercialApi.voidInvoice(invoiceId, accessToken);
      await qc.invalidateQueries({ queryKey: ['invoices'] });
    } catch (err) {
      setError(mapError(err));
    } finally {
      setBusyId(null);
    }
  }

  return (
    <section className="stack">
      <h1>{t('commercial.invoices')}</h1>
      {error ? <Alert tone="danger">{error}</Alert> : null}
      {query.isLoading ? <Spinner /> : null}
      {query.isError ? (
        <Alert tone="danger">{getErrorMessage(query.error)}</Alert>
      ) : null}
      {(query.data?.data ?? []).map((inv) => (
        <Panel
          key={inv.id}
          title={`#${inv.id}`}
          actions={<Badge tone="neutral">{inv.status}</Badge>}
        >
          <p>
            {inv.total_amount} — {inv.created_date}
          </p>
          <ul>
            {inv.items?.map((item) => (
              <li key={item.id}>
                {item.title} × {item.quantity} = {item.total_price}
              </li>
            ))}
          </ul>
          <div className="form-actions">
            {inv.status !== 'PAID' && inv.status !== 'VOID' ? (
              <Button
                size="sm"
                loading={busyId === inv.id}
                onClick={() => void pay(inv.id, inv.total_amount)}
              >
                {t('commercial.pay')}
              </Button>
            ) : null}
            {activeRole === 'SUPER_ADMIN' && inv.status !== 'VOID' ? (
              <Button
                size="sm"
                variant="danger"
                loading={busyId === inv.id}
                onClick={() => void voidInvoice(inv.id)}
              >
                {t('commercial.void')}
              </Button>
            ) : null}
          </div>
        </Panel>
      ))}
      {!query.isLoading && (query.data?.data?.length ?? 0) === 0 ? (
        <p className="empty-state">{t('common.noData')}</p>
      ) : null}
      <ManualPayForm />
    </section>
  );
}

function ManualPayForm() {
  const { t } = useTranslation();
  const { accessToken } = useAuth();
  const mapError = useApiError();
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!accessToken) return;
    const fd = new FormData(e.currentTarget);
    setErr(null);
    setMsg(null);
    try {
      await commercialApi.payInvoice(
        Number(fd.get('invoice_id')),
        {
          amount: Number(fd.get('amount')),
          transaction_id: String(fd.get('transaction_id') || makeTxId()),
        },
        accessToken,
      );
      setMsg('OK');
    } catch (error) {
      setErr(mapError(error));
    }
  }

  return (
    <Panel title={t('commercial.pay')}>
      {err ? <Alert tone="danger">{err}</Alert> : null}
      {msg ? <Alert tone="success">{msg}</Alert> : null}
      <form className="form-stack" onSubmit={onSubmit}>
        <Input label="Invoice ID" name="invoice_id" type="number" required />
        <Input label={t('commercial.amount')} name="amount" type="number" required />
        <Input label={t('commercial.transactionId')} name="transaction_id" />
        <Button type="submit">{t('commercial.pay')}</Button>
      </form>
    </Panel>
  );
}

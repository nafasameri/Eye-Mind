import { api } from './client';
import type {
  AssignLicenseRequest,
  InvoiceResponse,
  TenantLicenseResponse,
} from '../../types/api';

export const payPerScreeningApi = {
  assign(body: AssignLicenseRequest, token: string) {
    return api<TenantLicenseResponse>(
      '/commercial/pay-per-screening/licenses',
      {
        method: 'POST',
        token,
        body: JSON.stringify(body),
      },
    );
  },

  renew(licenseId: number, token: string) {
    return api<TenantLicenseResponse>(
      `/commercial/pay-per-screening/licenses/${licenseId}/renew`,
      { method: 'POST', token },
    );
  },

  createInvoice(token: string, tenantId?: string | null) {
    return api<InvoiceResponse>('/commercial/pay-per-screening/invoices', {
      method: 'POST',
      token,
      body: JSON.stringify({ tenant_id: tenantId ?? null }),
    });
  },
};

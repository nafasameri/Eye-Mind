import { api } from './client';
import type {
  AssignLicenseRequest,
  InvoiceResponse,
  PurchaseSubscriptionRequest,
  PurchaseSubscriptionResponse,
  TenantLicenseResponse,
} from '../../types/api';

export const subscriptionsApi = {
  purchase(body: PurchaseSubscriptionRequest, token: string) {
    return api<PurchaseSubscriptionResponse>(
      '/commercial/subscriptions/purchase',
      {
        method: 'POST',
        token,
        body: JSON.stringify(body),
      },
    );
  },

  assign(body: AssignLicenseRequest, token: string) {
    return api<TenantLicenseResponse>('/commercial/subscriptions', {
      method: 'POST',
      token,
      body: JSON.stringify(body),
    });
  },

  current(token: string, tenantId?: string) {
    return api<TenantLicenseResponse>('/commercial/subscriptions/current', {
      token,
      query: { tenant_id: tenantId },
    });
  },

  renew(licenseId: number, token: string) {
    return api<TenantLicenseResponse>(
      `/commercial/subscriptions/${licenseId}/renew`,
      { method: 'POST', token },
    );
  },

  createInvoice(licenseId: number, token: string) {
    return api<InvoiceResponse>(
      `/commercial/subscriptions/${licenseId}/invoices`,
      { method: 'POST', token },
    );
  },
};

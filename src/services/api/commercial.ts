import { api } from './client';
import type {
  CommercialModel,
  InvoiceResponse,
  Paginated,
  PaymentResponse,
  PricingPlanResponse,
  ScreeningEntitlementResponse,
  ScreeningUsageResponse,
  TenantLicenseResponse,
  UsageType,
} from '../../types/api';

export const commercialApi = {
  pricingPlans(token?: string | null) {
    return api<PricingPlanResponse[]>('/commercial/pricing-plans', {
      token: token ?? undefined,
    });
  },

  licenses(
    token: string,
    query?: { tenant_id?: string; model?: CommercialModel },
  ) {
    return api<TenantLicenseResponse[]>('/commercial/licenses', {
      token,
      query,
    });
  },

  entitlement(token: string, usageType: UsageType = 'DR_SCREENING') {
    return api<ScreeningEntitlementResponse>(
      '/commercial/usage/entitlement',
      {
        token,
        query: { usage_type: usageType },
      },
    );
  },

  recordScreening(
    token: string,
    body: { usage_type: UsageType; ai_screening_id: number },
  ) {
    return api<ScreeningUsageResponse>('/commercial/usage/screenings', {
      method: 'POST',
      token,
      body: JSON.stringify(body),
    });
  },

  usageHistory(
    token: string,
    query?: { tenant_id?: string; page_number?: number; page_size?: number },
  ) {
    return api<Paginated<ScreeningUsageResponse>>('/commercial/usage', {
      token,
      query,
    });
  },

  invoices(
    token: string,
    query?: { tenant_id?: string; page_number?: number; page_size?: number },
  ) {
    return api<Paginated<InvoiceResponse>>('/commercial/invoices', {
      token,
      query,
    });
  },

  invoice(invoiceId: number, token: string) {
    return api<InvoiceResponse>(`/commercial/invoices/${invoiceId}`, { token });
  },

  payInvoice(
    invoiceId: number,
    body: { amount: number; transaction_id: string },
    token: string,
  ) {
    return api<PaymentResponse>(`/commercial/invoices/${invoiceId}/payments`, {
      method: 'POST',
      token,
      body: JSON.stringify(body),
    });
  },

  voidInvoice(invoiceId: number, token: string) {
    return api<InvoiceResponse>(`/commercial/invoices/${invoiceId}/void`, {
      method: 'POST',
      token,
    });
  },
};

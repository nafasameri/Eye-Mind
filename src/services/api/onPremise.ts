import { api } from './client';
import type {
  AssignLicenseRequest,
  InvoiceResponse,
  OnPremiseDeploymentResponse,
  OnPremiseValidationResponse,
  TenantLicenseResponse,
} from '../../types/api';

export const onPremiseApi = {
  assign(body: AssignLicenseRequest, token: string) {
    return api<TenantLicenseResponse>('/commercial/on-premise/licenses', {
      method: 'POST',
      token,
      body: JSON.stringify(body),
    });
  },

  renew(licenseId: number, token: string) {
    return api<TenantLicenseResponse>(
      `/commercial/on-premise/licenses/${licenseId}/renew`,
      { method: 'POST', token },
    );
  },

  createInvoice(licenseId: number, token: string) {
    return api<InvoiceResponse>(
      `/commercial/on-premise/licenses/${licenseId}/invoices`,
      { method: 'POST', token },
    );
  },

  provision(
    body: { tenant_id?: string | null; server_ip: string },
    token: string,
  ) {
    return api<OnPremiseDeploymentResponse>(
      '/commercial/on-premise/deployments',
      {
        method: 'POST',
        token,
        body: JSON.stringify(body),
      },
    );
  },

  rotateKey(deploymentId: number, token: string) {
    return api<OnPremiseDeploymentResponse>(
      `/commercial/on-premise/deployments/${deploymentId}/rotate-key`,
      { method: 'POST', token },
    );
  },

  currentDeployment(token: string, tenantId?: string) {
    return api<OnPremiseDeploymentResponse>(
      '/commercial/on-premise/deployments/current',
      {
        token,
        query: { tenant_id: tenantId },
      },
    );
  },

  heartbeat(licenseKey: string, token: string) {
    return api<unknown>('/commercial/on-premise/heartbeat', {
      method: 'POST',
      token,
      body: JSON.stringify({ license_key: licenseKey }),
    });
  },

  validate(licenseKey: string) {
    return api<OnPremiseValidationResponse>('/commercial/on-premise/validate', {
      method: 'POST',
      body: JSON.stringify({ license_key: licenseKey }),
    });
  },
};

import { api } from './client';
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  SignupRequest,
  TenantMembershipResponse,
  TenantResponse,
} from '../../types/api';

export const authApi = {
  signup(body: SignupRequest) {
    return api<LoginResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  login(body: LoginRequest) {
    return api<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  register(body: RegisterRequest, token: string) {
    return api<{
      first_name: string;
      last_name: string;
      phone_number: string;
      email: string;
      role: string;
      role_title: string;
      username: string;
      tenant: TenantResponse;
    }>('/auth/register', {
      method: 'POST',
      token,
      body: JSON.stringify(body),
    });
  },

  listTenants(token: string) {
    return api<TenantMembershipResponse[]>('/auth/tenants', { token });
  },

  switchTenant(tenantId: string, token: string) {
    return api<LoginResponse>('/auth/tenant', {
      method: 'POST',
      token,
      body: JSON.stringify({ tenant_id: tenantId }),
    });
  },
};

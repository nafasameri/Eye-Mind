import { api } from './client';
import type {
  AddMemberRequest,
  CreateTenantRequest,
  Paginated,
  TenantResponse,
} from '../../types/api';

export const tenantsApi = {
  create(body: CreateTenantRequest, token: string) {
    return api<TenantResponse>('/tenants', {
      method: 'POST',
      token,
      body: JSON.stringify(body),
    });
  },

  get(tenantId: string, token: string) {
    return api<TenantResponse>(`/tenants/${tenantId}`, { token });
  },

  addMember(body: AddMemberRequest, token: string) {
    return api<unknown>('/tenants/members', {
      method: 'POST',
      token,
      body: JSON.stringify(body),
    });
  },

  listUsers(token: string, pageNumber = 1, pageSize = 25) {
    return api<
      Paginated<{
        username: string;
        first_name?: string;
        last_name?: string;
        email?: string;
        role?: string;
        role_title?: string;
      }>
    >('/tenants/users', {
      token,
      query: { page_number: pageNumber, page_size: pageSize },
    });
  },
};

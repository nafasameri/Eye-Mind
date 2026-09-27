export type Role = 'SUPER_ADMIN' | 'TENANT_ADMIN' | 'DOCTOR' | 'OPERATOR';

export type ProductType = 'SUBSCRIPTION' | 'PAY_PER_USE' | 'ENTERPRISE';
export type BillingType = 'MONTHLY' | 'YEARLY' | 'PER_SCAN' | 'ONE_TIME';
export type CommercialModel =
  | 'PAY_PER_SCREENING'
  | 'SUBSCRIPTION'
  | 'ON_PREMISE'
  | 'TRIAL';
export type LicenseType = 'CLOUD' | 'ON_PREMISE' | 'HYBRID';
export type LicenseStatus = 'ACTIVE' | 'INACTIVE';
export type InvoiceStatus = 'DRAFT' | 'ISSUED' | 'PAID' | 'VOID';
export type PaymentStatus = 'PENDING' | 'SUCCEEDED' | 'FAILED';
export type UsageType =
  | 'DR_SCREENING'
  | 'ROP_SCREENING'
  | 'STORAGE'
  | 'API_CALL';
export type TenantStatus = 'ACTIVE' | 'INACTIVE';
export type PlanStatus = 'ACTIVE' | 'INACTIVE';

export type ApiError = {
  error_code: string;
  error_message: string;
  retryable: boolean;
  error_details: unknown;
};

export type Paginated<T> = {
  total_rows: number;
  page_number: number;
  total_pages: number;
  data: T[];
};

export type TenantMembershipResponse = {
  tenant_id: string;
  tenant_name: string;
  role: Role;
  role_title: string | null;
};

export type LoginResponse = {
  access_token: string;
  active_tenant_id: string | null;
  active_role: Role | null;
  active_role_title: string | null;
  trial: boolean;
  trial_remaining_scans: number | null;
  tenant_selection_required: boolean;
  memberships: TenantMembershipResponse[];
};

export type SignupRequest = {
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  username: string;
  password: string;
};

export type LoginRequest = {
  username: string;
  password: string;
  tenant_id?: string | null;
};

export type RegisterRequest = {
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  role: Role;
  username: string;
  password: string;
};

export type TenantResponse = {
  name: string;
  code: string;
  contact_person: string;
  phone_number: string;
  email: string;
  address: string;
  status: TenantStatus;
  status_message: string;
};

export type CreateTenantRequest = {
  name: string;
  status: TenantStatus;
  code: string;
  contact_person: string;
  phone_number: string;
  email: string;
  address: string;
};

export type AddMemberRequest = {
  tenant_id?: string | null;
  username: string;
  role: Role;
};

export type PricingPlanResponse = {
  id: number;
  product_id: number;
  product_name: string;
  product_type: ProductType;
  metered_usage: UsageType | null;
  name: string;
  billing_type: BillingType;
  price: number;
  included_scans: number | null;
  has_unlimited_usage: boolean;
  status: PlanStatus;
};

export type TenantLicenseResponse = {
  id: number;
  tenant_id: string;
  pricing_plan_id: number;
  plan_name: string;
  product_name: string;
  billing_type: BillingType;
  license_type: LicenseType;
  model: CommercialModel;
  price: number;
  included_scans: number | null;
  has_unlimited_usage: boolean;
  start_date: string;
  end_date: string;
  status: LicenseStatus;
};

export type ScreeningEntitlementResponse = {
  allowed: boolean;
  model: CommercialModel | null;
  license_id: number | null;
  license_end: string | null;
  consumed_scans: number;
  remaining_scans: number | null;
  message: string | null;
};

export type InvoiceItemResponse = {
  id: number;
  title: string;
  quantity: number;
  unit_price: number;
  total_price: number;
};

export type InvoiceResponse = {
  id: number;
  tenant_id: string;
  tenant_license_id: number | null;
  total_amount: number;
  status: InvoiceStatus;
  period_start: string | null;
  period_end: string | null;
  created_date: string;
  items: InvoiceItemResponse[];
};

export type PaymentResponse = {
  id: number;
  invoice_id: number;
  amount: number;
  transaction_id: string;
  status: PaymentStatus;
  paid_at: string;
  invoice_status: InvoiceStatus;
};

export type ScreeningUsageResponse = {
  id: number;
  model: CommercialModel;
  usage_type: UsageType;
  ai_screening_id: number | null;
  count: number;
  unit_price: number;
  total_price: number;
  billable: boolean;
  consumed_scans: number;
  remaining_scans: number | null;
};

export type PurchaseSubscriptionRequest = {
  pricing_plan_id: number;
  tenant_id?: string | null;
  tenant_name?: string | null;
  transaction_id: string;
};

export type PurchaseSubscriptionResponse = {
  tenant_id: string;
  tenant_name: string;
  tenant_created: boolean;
  role: Role;
  role_title: string | null;
  license: TenantLicenseResponse;
  invoice: InvoiceResponse;
  payment: PaymentResponse;
  session: LoginResponse;
};

export type AssignLicenseRequest = {
  tenant_id: string;
  pricing_plan_id: number;
  license_type: LicenseType;
  start_date?: string | null;
};

export type OnPremiseValidationResponse = {
  valid: boolean;
  is_healthy: boolean;
  license_end: string | null;
  tenant_name: string | null;
  message: string | null;
};

export type OnPremiseDeploymentResponse = {
  id: number;
  tenant_id: string;
  server_ip: string;
  license_key?: string | null;
  status?: string | null;
  created_date?: string | null;
};

import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './auth/AuthContext';
import { ProtectedRoute, RoleGate } from './components/ProtectedRoute';
import { AppShell, MarketingLayout } from './layouts/layouts';
import { HomePage } from './pages/marketing/HomePage';
import { AboutPage } from './pages/marketing/AboutPage';
import { ContactPage } from './pages/marketing/ContactPage';
import { LoginPage } from './pages/auth/LoginPage';
import { SignupPage } from './pages/auth/SignupPage';
import { SelectTenantPage } from './pages/auth/SelectTenantPage';
import { TrialPage } from './pages/auth/TrialPage';
import { RegisterMemberPage } from './pages/auth/RegisterMemberPage';
import { PricingPage } from './pages/commercial/PricingPage';
import { CheckoutPage } from './pages/commercial/CheckoutPage';
import { EntitlementPage } from './pages/commercial/EntitlementPage';
import { UsageHistoryPage } from './pages/commercial/UsageHistoryPage';
import { LicensesPage } from './pages/commercial/LicensesPage';
import { InvoicesPage } from './pages/commercial/InvoicesPage';
import { PayPerScreeningPage } from './pages/commercial/PayPerScreeningPage';
import { CreateTenantPage } from './pages/tenants/CreateTenantPage';
import { AddMemberPage } from './pages/tenants/AddMemberPage';
import { TenantUsersPage } from './pages/tenants/TenantUsersPage';
import { TenantDetailPage } from './pages/tenants/TenantDetailPage';
import {
  AssignSubscriptionPage,
  CurrentSubscriptionPage,
} from './pages/subscriptions/SubscriptionPages';
import { OnPremisePage } from './pages/onPremise/OnPremisePage';
import { AppHomePage } from './pages/app/AppHomePage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, retry: 1 },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route element={<MarketingLayout />}>
              <Route index element={<HomePage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="pricing" element={<PricingPage />} />
              <Route path="checkout/:planId" element={<CheckoutPage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="signup" element={<SignupPage />} />
              <Route
                path="select-tenant"
                element={
                  <ProtectedRoute>
                    <SelectTenantPage />
                  </ProtectedRoute>
                }
              />
            </Route>

            <Route
              path="app"
              element={
                <ProtectedRoute>
                  <AppShell />
                </ProtectedRoute>
              }
            >
              <Route index element={<AppHomePage />} />
              <Route path="trial" element={<Navigate to="/trial" replace />} />
              <Route path="entitlement" element={<EntitlementPage />} />
              <Route path="usage" element={<UsageHistoryPage />} />
              <Route path="licenses" element={<LicensesPage />} />
              <Route path="subscription" element={<CurrentSubscriptionPage />} />
              <Route
                path="invoices"
                element={
                  <RoleGate allow={['SUPER_ADMIN', 'TENANT_ADMIN']}>
                    <InvoicesPage />
                  </RoleGate>
                }
              />
              <Route
                path="register-member"
                element={
                  <RoleGate allow={['SUPER_ADMIN', 'TENANT_ADMIN']}>
                    <RegisterMemberPage />
                  </RoleGate>
                }
              />
              <Route
                path="tenants/create"
                element={
                  <RoleGate allow={['SUPER_ADMIN']}>
                    <CreateTenantPage />
                  </RoleGate>
                }
              />
              <Route
                path="tenants/detail"
                element={
                  <RoleGate allow={['SUPER_ADMIN']}>
                    <TenantDetailPage />
                  </RoleGate>
                }
              />
              <Route
                path="tenants/members"
                element={
                  <RoleGate allow={['SUPER_ADMIN', 'TENANT_ADMIN']}>
                    <AddMemberPage />
                  </RoleGate>
                }
              />
              <Route
                path="tenants/users"
                element={
                  <RoleGate allow={['SUPER_ADMIN', 'TENANT_ADMIN']}>
                    <TenantUsersPage />
                  </RoleGate>
                }
              />
              <Route
                path="subscriptions/assign"
                element={
                  <RoleGate allow={['SUPER_ADMIN']}>
                    <AssignSubscriptionPage />
                  </RoleGate>
                }
              />
              <Route
                path="pay-per-screening"
                element={
                  <RoleGate allow={['SUPER_ADMIN', 'TENANT_ADMIN']}>
                    <PayPerScreeningPage />
                  </RoleGate>
                }
              />
              <Route
                path="on-premise"
                element={
                  <RoleGate allow={['SUPER_ADMIN', 'TENANT_ADMIN']}>
                    <OnPremisePage />
                  </RoleGate>
                }
              />
            </Route>

            <Route
              path="trial"
              element={
                <ProtectedRoute>
                  <AppShell />
                </ProtectedRoute>
              }
            >
              <Route index element={<TrialPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

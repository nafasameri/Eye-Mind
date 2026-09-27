import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useNavigate } from 'react-router-dom';
import type { LoginResponse, Role } from '../types/api';

const TOKEN_KEY = 'eyemind_token';
const SESSION_KEY = 'eyemind_session';

type SessionState = {
  accessToken: string | null;
  activeTenantId: string | null;
  activeRole: Role | null;
  activeRoleTitle: string | null;
  trial: boolean;
  trialRemainingScans: number | null;
  tenantSelectionRequired: boolean;
  memberships: LoginResponse['memberships'];
};

type AuthContextValue = SessionState & {
  isAuthenticated: boolean;
  applySession: (res: LoginResponse, options?: { navigate?: boolean }) => void;
  logout: () => void;
};

const emptySession: SessionState = {
  accessToken: null,
  activeTenantId: null,
  activeRole: null,
  activeRoleTitle: null,
  trial: false,
  trialRemainingScans: null,
  tenantSelectionRequired: false,
  memberships: [],
};

function loadSession(): SessionState {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    const token = localStorage.getItem(TOKEN_KEY);
    if (!raw || !token) return emptySession;
    return { ...JSON.parse(raw), accessToken: token };
  } catch {
    return emptySession;
  }
}

function persist(session: SessionState) {
  if (session.accessToken) {
    localStorage.setItem(TOKEN_KEY, session.accessToken);
    localStorage.setItem(
      SESSION_KEY,
      JSON.stringify({ ...session, accessToken: undefined }),
    );
  } else {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(SESSION_KEY);
  }
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [session, setSession] = useState<SessionState>(() => loadSession());

  const applySession = useCallback(
    (res: LoginResponse, options?: { navigate?: boolean }) => {
      const next: SessionState = {
        accessToken: res.access_token,
        activeTenantId: res.active_tenant_id,
        activeRole: res.active_role,
        activeRoleTitle: res.active_role_title,
        trial: res.trial,
        trialRemainingScans: res.trial_remaining_scans,
        tenantSelectionRequired: res.tenant_selection_required,
        memberships: res.memberships ?? [],
      };
      setSession(next);
      persist(next);

      if (options?.navigate === false) return;

      if (res.tenant_selection_required) {
        navigate('/select-tenant');
        return;
      }
      if (res.trial) {
        navigate('/trial');
        return;
      }
      navigate('/app');
    },
    [navigate],
  );

  const logout = useCallback(() => {
    setSession(emptySession);
    persist(emptySession);
    navigate('/');
  }, [navigate]);

  const value = useMemo<AuthContextValue>(
    () => ({
      ...session,
      isAuthenticated: Boolean(session.accessToken),
      applySession,
      logout,
    }),
    [session, applySession, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

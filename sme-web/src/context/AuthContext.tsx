import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { api, setApiAccessToken, setUnauthorizedHandler, type AuthResponse } from '../lib/api';

export type Role = 'SA' | 'OA' | 'PM' | 'SME' | 'RE' | 'VI';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
  org: string;
  orgId?: string;
}

export const MOCK_USERS: Record<Role, User> = {
  SA: { id: 'u1', name: 'Alex Carter', email: 'alex@genque.io', role: 'SA', avatar: 'AC', org: 'OpenEyes Technologies', orgId: 'org-platform' },
  OA: { id: 'u2', name: 'Morgan Lee', email: 'morgan@acme.com', role: 'OA', avatar: 'ML', org: 'Acme Corp', orgId: 'org1' },
  PM: { id: 'u3', name: 'Jordan Smith', email: 'jordan@acme.com', role: 'PM', avatar: 'JS', org: 'Acme Corp', orgId: 'org1' },
  SME: { id: 'u4', name: 'Taylor Brown', email: 'taylor@acme.com', role: 'SME', avatar: 'TB', org: 'Acme Corp', orgId: 'org1' },
  RE: { id: 'u5', name: 'Casey Wilson', email: 'casey@acme.com', role: 'RE', avatar: 'CW', org: 'Acme Corp', orgId: 'org1' },
  VI: { id: 'u6', name: 'Riley Evans', email: 'riley@acme.com', role: 'VI', avatar: 'RE', org: 'Acme Corp', orgId: 'org1' },
};

export const ROLE_LABELS: Record<Role, string> = {
  SA: 'Super Admin',
  OA: 'Org Admin',
  PM: 'Project Manager',
  SME: 'Subject Matter Expert',
  RE: 'Reviewer/Editor',
  VI: 'Viewer/Stakeholder',
};

const LOCAL_STORAGE_TOKEN_KEY = 'genque_access_token';
const LOCAL_STORAGE_USER_KEY = 'genque_user';
const DEMO_PASSWORD = 'demo1234';

const DEMO_USERS_BY_EMAIL = Object.values(MOCK_USERS).reduce<Record<string, User>>((users, user) => {
  users[user.email.toLowerCase()] = user;
  return users;
}, {});

interface AuthContextValue {
  user: User | null;
  role: Role;
  setRole: (role: Role) => void;
  accessToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  MOCK_USERS: Record<Role, User>;
  ROLE_LABELS: Record<Role, string>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function toAuthResponse(user: User, tokenPrefix = 'demo-local'): AuthResponse {
  return {
    accessToken: `${tokenPrefix}-${user.role.toLowerCase()}-${user.id}`,
    tokenType: 'bearer',
    user,
  };
}

const DEFAULT_USER = MOCK_USERS.SME;
const DEFAULT_AUTH_RESPONSE = toAuthResponse(DEFAULT_USER, 'demo-direct');

export function authenticateDemoUser(email: string, password: string): AuthResponse {
  const user = DEMO_USERS_BY_EMAIL[email.trim().toLowerCase()];
  if (!user || password !== DEMO_PASSWORD) {
    throw new Error('Invalid demo credentials. Use one of the listed users with password demo1234.');
  }
  return toAuthResponse(user);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<Role>(DEFAULT_USER.role);
  const [user, setUser] = useState<User | null>(DEFAULT_USER);
  const [accessToken, setAccessToken] = useState<string | null>(DEFAULT_AUTH_RESPONSE.accessToken);
  const [isLoading] = useState(false);

  // Restore a saved session if present; otherwise keep the built-in dashboard user.
  useEffect(() => {
    try {
      const token = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);
      const userJson = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
      if (token && userJson) {
        const savedUser = JSON.parse(userJson) as User;
        setApiAccessToken(token);
        setAccessToken(token);
        setUser(savedUser);
        setRoleState(savedUser.role);
      } else {
        setApiAccessToken(DEFAULT_AUTH_RESPONSE.accessToken);
      }
    } catch {
      localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
      localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
      setApiAccessToken(DEFAULT_AUTH_RESPONSE.accessToken);
    }
  }, []);

  // Keep expired demo sessions on the dashboard instead of sending users to login.
  useEffect(() => {
    setUnauthorizedHandler(() => {
      setApiAccessToken(DEFAULT_AUTH_RESPONSE.accessToken);
      setAccessToken(DEFAULT_AUTH_RESPONSE.accessToken);
      setUser(DEFAULT_USER);
      setRoleState(DEFAULT_USER.role);
    });
  }, []);

  const setRole = (nextRole: Role) => {
    setRoleState(nextRole);
    setUser(MOCK_USERS[nextRole]);
  };

  const login = async (email: string, password: string) => {
    let response: AuthResponse;
    try {
      response = await api.login(email, password);
    } catch (error) {
      try {
        response = authenticateDemoUser(email, password);
      } catch {
        throw error instanceof Error ? error : new Error('Unable to sign in. Please try again.');
      }
    }
    const u = response.user as unknown as User;
    setApiAccessToken(response.accessToken);
    setAccessToken(response.accessToken);
    setUser(u);
    setRoleState(u.role);
    localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, response.accessToken);
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(u));
    return response;
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch {
      // ignore demo logout errors
    }
    setApiAccessToken(DEFAULT_AUTH_RESPONSE.accessToken);
    setAccessToken(DEFAULT_AUTH_RESPONSE.accessToken);
    setUser(DEFAULT_USER);
    setRoleState(DEFAULT_USER.role);
    localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
    localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
  };

  const isAuthenticated = !!accessToken && !!user;

  const value = useMemo(
    () => ({ user, role, setRole, accessToken, isLoading, isAuthenticated, login, logout, MOCK_USERS, ROLE_LABELS }),
    [accessToken, role, user, isLoading, isAuthenticated],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}

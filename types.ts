
export enum ViewType {
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  FORGOT_PASSWORD = 'FORGOT_PASSWORD',
  RESET_PASSWORD = 'RESET_PASSWORD',
  DASHBOARD = 'DASHBOARD',
  ADMIN_DASHBOARD = 'ADMIN_DASHBOARD',
  SETTINGS = 'SETTINGS',
  CODE_VIEWER = 'CODE_VIEWER',
  DATABASE_SCHEMA = 'DATABASE_SCHEMA',
  AI_AUDITOR = 'AI_AUDITOR',
  MAIL_LOG = 'MAIL_LOG'
}

export interface User {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'user';
  is_active: boolean;
  created_at: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export interface BackendFile {
  path: string;
  language: string;
  description: string;
  content: string;
}

export interface SimulatedMail {
  id: string;
  to: string;
  subject: string;
  body: string;
  timestamp: string;
  type: 'welcome' | 'reset';
}

export interface User {
    id: string;
    username: string;
    email: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  checkingAuth: boolean;
  error: string | null;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}
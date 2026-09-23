export interface AuthUser {
  name: string;
  email: string;
  role: 'guest' | 'subscriber' | 'admin';
  isSubscribed: boolean;
}

export class AuthService {
  private static USER_KEY = 'digital_heroes_user';

  static getCurrentUser(): AuthUser | null {
    if (typeof window === 'undefined') return null;
    try {
      const stored = localStorage.getItem(this.USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  static setCurrentUser(user: AuthUser): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  static logout(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem('digital_heroes_demo_role');
  }
}

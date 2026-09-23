'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'guest' | 'subscriber' | 'admin';

export interface User {
  name: string;
  email: string;
  role: UserRole;
  isSubscribed: boolean;
}

interface AuthContextType {
  role: UserRole;
  user: User | null;
  setRole: (role: UserRole) => void;
  loginAs: (role: UserRole, email?: string, name?: string, isSubscribed?: boolean) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<UserRole>('guest');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Load persisted user and role from localStorage if available
    try {
      const savedUser = localStorage.getItem('digital_heroes_user');
      const savedRole = localStorage.getItem('digital_heroes_demo_role') as UserRole | null;
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        setRoleState(parsed.role || 'subscriber');
      } else if (savedRole && ['guest', 'subscriber', 'admin'].includes(savedRole)) {
        setRoleState(savedRole);
        if (savedRole !== 'guest') {
          // Check if active subscription exists in storage
          let hasActiveSub = false;
          try {
            const activeSubJson = localStorage.getItem('digital_heroes_active_subscription');
            if (activeSubJson) {
              const parsedSub = JSON.parse(activeSubJson);
              hasActiveSub = parsedSub.status === 'active';
            }
          } catch {}

          const fallback = {
            name: savedRole === 'admin' ? 'Abhishek Choudhari' : 'Abhishek Choudhari',
            email: savedRole === 'admin' ? 'admin@digitalheroes.co.in' : 'agchoudhari2110@gmail.com',
            role: savedRole,
            isSubscribed: savedRole === 'admin' ? true : hasActiveSub,
          };
          setUser(fallback);
          localStorage.setItem('digital_heroes_user', JSON.stringify(fallback));
        }
      }
    } catch (e) {
      console.error('Error loading auth from localStorage:', e);
    }
  }, []);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    localStorage.setItem('digital_heroes_demo_role', newRole);
    if (newRole === 'guest') {
      setUser(null);
      localStorage.removeItem('digital_heroes_user');
    } else {
      let hasActiveSub = false;
      try {
        const activeSubJson = localStorage.getItem('digital_heroes_active_subscription');
        if (activeSubJson) {
          const parsedSub = JSON.parse(activeSubJson);
          hasActiveSub = parsedSub.status === 'active';
        }
      } catch {}

      const newUser = {
        name: newRole === 'admin' ? 'Abhishek Choudhari' : 'Abhishek Choudhari',
        email: newRole === 'admin' ? 'admin@digitalheroes.co.in' : 'agchoudhari2110@gmail.com',
        role: newRole,
        isSubscribed: newRole === 'admin' ? true : hasActiveSub,
      };
      setUser(newUser);
      localStorage.setItem('digital_heroes_user', JSON.stringify(newUser));
    }
  };

  const loginAs = (loginRole: UserRole, email?: string, name?: string, isSubscribed?: boolean) => {
    setRoleState(loginRole);
    localStorage.setItem('digital_heroes_demo_role', loginRole);
    const resolvedName = name || (loginRole === 'admin' ? 'Abhishek Choudhari' : 'Abhishek Choudhari');
    const resolvedEmail = email || (loginRole === 'admin' ? 'admin@digitalheroes.co.in' : 'agchoudhari2110@gmail.com');

    let finalSubscribed = isSubscribed;
    if (finalSubscribed === undefined) {
      if (loginRole === 'admin') {
        finalSubscribed = true;
      } else {
        try {
          const activeSubJson = localStorage.getItem('digital_heroes_active_subscription');
          if (activeSubJson) {
            const parsedSub = JSON.parse(activeSubJson);
            finalSubscribed = parsedSub.status === 'active';
          } else {
            finalSubscribed = false;
          }
        } catch {
          finalSubscribed = false;
        }
      }
    }

    const newUser = {
      name: resolvedName,
      email: resolvedEmail,
      role: loginRole,
      isSubscribed: finalSubscribed,
    };
    setUser(newUser);
    localStorage.setItem('digital_heroes_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setRoleState('guest');
    localStorage.removeItem('digital_heroes_demo_role');
    localStorage.removeItem('digital_heroes_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ role, user, setRole, loginAs, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

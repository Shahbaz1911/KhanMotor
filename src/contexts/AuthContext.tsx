
"use client";

import type { ReactNode } from 'react';
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User as FirebaseUser } from 'firebase/auth';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { useFirebaseApp } from '@/firebase';

// This is the user object we'll use throughout the app.
// It can be a simplified version of the Firebase user.
interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  avatarUrl?: string;
}

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { app } = useFirebaseApp();
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!app) return;
    
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || 'Admin',
          avatarUrl: firebaseUser.photoURL || `https://i.pravatar.cc/150?u=${firebaseUser.uid}`
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [app]);

  const login = async (email: string, pass: string) => {
    if (!app) throw new Error("Firebase not initialized");
    const auth = getAuth(app);
    await signInWithEmailAndPassword(auth, email, pass);
    // onAuthStateChanged will handle setting the user state
  };

  const logout = async () => {
    if (!app) throw new Error("Firebase not initialized");
    const auth = getAuth(app);
    await signOut(auth);
    // onAuthStateChanged will handle setting the user state to null
  };
  
  const value = { user, loading, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

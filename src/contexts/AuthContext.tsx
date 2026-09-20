import React, { createContext, useContext, useState, useEffect } from "react";
import {
  AppUser,
  getCurrentUserSync,
  loginUser,
  registerUser,
  logoutUser,
  updateUserProfile,
  deleteUserData,
} from "../services/firebase";

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (name: string, email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<AppUser>) => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    try {
      const stored = getCurrentUserSync();
      if (stored) {
        setUser(stored);
      }
    } catch (e) {
      console.error("Error retrieving stored user:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, pass: string) => {
    setLoading(true);
    try {
      const loggedUser = await loginUser(email, pass);
      setUser(loggedUser);
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, pass: string) => {
    setLoading(true);
    try {
      const newUser = await registerUser(name, email, pass);
      setUser(newUser);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await logoutUser();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<AppUser>) => {
    if (!user) return;
    const updated = await updateUserProfile(user.uid, updates);
    setUser(updated);
  };

  const deleteAccount = async () => {
    if (!user) return;
    await deleteUserData(user.uid);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

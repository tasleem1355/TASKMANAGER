import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  picture?: string;
  provider?: string;
}

interface AuthContextType {
  currentUser: AuthUser | null;
  loginWithGoogle: (token: string) => Promise<void>;
  login: (user: AuthUser) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
  getCurrentUser: () => AuthUser | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function decodeJwt(token: string) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (err) {
    console.error("Failed to decode JWT", err);
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const { loginWithOAuth, logout: appLogout } = useApp();
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const stored = localStorage.getItem("auth_user");
      if (stored) {
        const parsed: AuthUser = JSON.parse(stored);
        setCurrentUser(parsed);
        // sync with AppContext
        loginWithOAuth({ id: parsed.id, name: parsed.name, email: parsed.email });
      }
    } catch (err) {
      console.error("Failed to load auth_user from localStorage", err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loginWithGoogle = async (token: string) => {
    try {
      const decoded: any = decodeJwt(token);
      if (!decoded) throw new Error("Invalid token");

      const user: AuthUser = {
        id: decoded.sub || decoded.sub || crypto.randomUUID(),
        name: decoded.name || "",
        email: decoded.email || "",
        picture: decoded.picture || "",
        provider: "google",
      };

      // check existing users in localStorage
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      let existing = users.find((u: any) => u.email === user.email || u.id === user.id || u.googleId === user.id);

      if (!existing) {
        // create user
        const newUser = { id: user.id, name: user.name, email: user.email, provider: "google", picture: user.picture };
        users.push(newUser);
        localStorage.setItem("users", JSON.stringify(users));
        existing = newUser;
      }

      // persist auth
      localStorage.setItem("auth_user", JSON.stringify({ id: existing.id, name: existing.name, email: existing.email, picture: existing.picture, provider: existing.provider }));
      setCurrentUser({ id: existing.id, name: existing.name, email: existing.email, picture: existing.picture, provider: existing.provider });

      // sync with AppContext
      loginWithOAuth({ id: existing.id, name: existing.name, email: existing.email });

      navigate("/dashboard");
    } catch (err) {
      console.error("Google login failed", err);
      throw err;
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem("auth_user");
      setCurrentUser(null);
      appLogout();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const login = (user: AuthUser) => {
    try {
      localStorage.setItem("auth_user", JSON.stringify(user));
      setCurrentUser(user);
      loginWithOAuth({ id: user.id, name: user.name, email: user.email });
      navigate("/dashboard");
    } catch (err) {
      console.error("Login failed", err);
    }
  };

  const isAuthenticated = () => !!currentUser;
  const getCurrentUser = () => currentUser;

  return (
    <AuthContext.Provider value={{ currentUser, loginWithGoogle, login, logout, isAuthenticated, getCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export default AuthContext;

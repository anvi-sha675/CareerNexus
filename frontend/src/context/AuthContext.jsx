import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { AUTH_STORAGE_KEY } from "../utils/constants";
import * as authService from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed?.user?.role && parsed?.token) {
          setUser(parsed.user);
          setToken(parsed.token);
        } else {
          localStorage.removeItem(AUTH_STORAGE_KEY);
        }
      } catch {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
    setLoading(false);
  }, []);

  const persist = (nextUser, nextToken) => {
    setUser(nextUser);
    setToken(nextToken);
    localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({ user: nextUser, token: nextToken }),
    );
  };

  const login = useCallback(async (email, role) => {
    const result = await authService.login({ email, role });
    if (!result?.user?.role || !result?.token) {
      throw new Error("Login failed — received an unexpected response.");
    }
    persist(result.user, result.token);
    return result.user;
  }, []);

  const register = useCallback(async (payload) => {
    const result = await authService.register(payload);
    if (!result?.user?.role || !result?.token) {
      throw new Error("Registration failed — received an unexpected response.");
    }
    persist(result.user, result.token);
    return result.user;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }, []);

  const updateProfile = useCallback(
    (patch) => {
      setUser((prev) => {
        const next = { ...prev, ...patch };
        localStorage.setItem(
          AUTH_STORAGE_KEY,
          JSON.stringify({ user: next, token }),
        );
        return next;
      });
    },
    [token],
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

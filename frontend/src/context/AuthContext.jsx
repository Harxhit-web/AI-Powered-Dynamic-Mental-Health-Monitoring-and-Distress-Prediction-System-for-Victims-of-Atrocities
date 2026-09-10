import { createContext, useCallback, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export const getInitials = (name = "") => name.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "MC";

export const AuthProvider = ({ children, enabled }) => {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(enabled);

  const refreshAccount = useCallback(async () => {
    if (!enabled) {
      setAccount(null);
      setLoading(false);
      return null;
    }
    setLoading(true);
    try {
      const { data } = await api.get("/auth/me");
      setAccount(data);
      return data;
    } catch {
      setAccount(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => { refreshAccount(); }, [refreshAccount]);

  return <AuthContext.Provider value={{ account, loading, refreshAccount }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider.");
  return context;
};

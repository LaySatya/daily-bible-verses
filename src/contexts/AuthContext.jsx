import { createContext, useState, useEffect, useContext } from "react";
import { isValidToken } from "../utils/validators";
import { logoutApi } from "../api/auth/authApi";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    const stored = localStorage.getItem("token");
    return isValidToken(stored) ? stored : null;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [logoutMessage, setLogoutMessage] = useState("");

  const login = (token) => {
    setToken(token);
    localStorage.setItem("token", token);
  };

  const logout = async () => {
    setIsLoading(true);
    setLogoutMessage("");
    try {
      if (token) {
        const data = await logoutApi(token);
        setLogoutMessage(data.message || "Logged out successfully");
      }
    } catch (e) {
      setLogoutMessage(e.message);
    } finally {
      setToken(null);
      localStorage.removeItem("token");
      localStorage.removeItem("userName");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Optionally, re-validate token on mount
    if (token && !isValidToken(token)) logout();
    // eslint-disable-next-line
  }, []);

  return (
    <AuthContext.Provider value={{ token, login, logout, isLoading, setIsLoading, logoutMessage }}>
      {children}
    </AuthContext.Provider>
  );
}
// import { API_BASE_URL } from "../config";


export function BibleVerseProvider({ children }) {
  
  return (
    <AuthContext.Provider value={{}}>
      {children}
    </AuthContext.Provider>
  );
}


export function useAuth() {
  return useContext(AuthContext);
}
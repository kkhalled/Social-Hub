import axiosInstance from "../api/axiosInstance";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  // console.log("ana");
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }

    setLoading(false);
  }, []);

  if (loading) return null;

  return (
    <>
      <AuthContext.Provider value={{ token, setToken, user, setUser }}>
        {children}
      </AuthContext.Provider>
    </>
  );
}

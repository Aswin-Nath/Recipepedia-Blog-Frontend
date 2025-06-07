import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true); 
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp > Date.now() / 1000) {
          setUserId(decoded.user_id);
        } else {
          localStorage.removeItem("token");
        }
      } catch {
        localStorage.removeItem("token");
      }
    }
    setLoading(false); 
  }, []);

  const login=(token)=>{
   try {
      localStorage.setItem("token", token);
      const decoded = jwtDecode(token);
      setUserId(decoded.user_id);
    } catch (error) {
      console.error("Login error:", error);
      logout();
    }
  }
  

  const logout = () => {
    localStorage.removeItem("token");
    setUserId(null);
  };
  return (
    <UserContext.Provider value={{ userId, setUserId, loading,logout,login }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

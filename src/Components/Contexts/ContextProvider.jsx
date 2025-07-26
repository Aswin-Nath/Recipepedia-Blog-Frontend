  import { createContext, useContext, useState, useEffect } from "react";
  import { jwtDecode } from "jwt-decode";
  import { useNavigate } from "react-router-dom";
  const UserContext = createContext();

  export const UserProvider = ({ children }) => {
    const navigate=useNavigate();
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(true); 
    const [userName,setuserName]=useState("");
    useEffect(() => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decoded = jwtDecode(token);
          if (decoded.exp > Date.now() / 1000) {
            setUserId(decoded.user_id);
            setuserName(decoded.user_name);
            localStorage.setItem("type",decoded.type);
          } else {
            localStorage.removeItem("token");
          }
        } catch {
          localStorage.removeItem("type");
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
        setuserName(decoded.user_name);
        localStorage.setItem("type",decoded.type);
        if(decoded.type=="admin"){
          navigate("/admin");
        }
        else if(decoded.type=="super-admin"){
          navigate("/super-admin");
        }
        else{
          navigate("/home");
        }
      } catch (error) {
        console.error("Login error:", error);
        logout();
      }
    }
    

    const logout = () => {
      setUserId(null);
      localStorage.removeItem("type");
      localStorage.removeItem("token");
    };

    return (
      <UserContext.Provider value={{ userId, setUserId,userName,setuserName, loading,logout,login }}>
        {children}
      </UserContext.Provider>
    );
  };

  export const useUser = () => useContext(UserContext);

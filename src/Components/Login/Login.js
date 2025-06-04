import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import axios from "axios";
import { useUser } from "../Contexts/ContextProvider";
const Login = () => {
    const navigate=useNavigate();
    const {setUserId,userId,loading}=useUser();
        useEffect(() => {
            if (userId) {
            navigate("/home");
        }
        }, [userId, loading, navigate]);
    const [user_detail, setdetail] = useState("");
    const [password, setpassword] = useState("");
    const HandleLogin= async ()=>{
        if(!user_detail || !password){
            alert("provide all the details");
            return ;
        }
        const API="http://127.0.0.1:5000/is-user-there";
        const data={    
            "detail":user_detail,
            "password":password
        }
        const response=await axios.post(API,data,{
            headers:{
                "Content-Type":"application/json"
            }
        })
        
        const user_id=response.data.id;
        const message=response.data.message;
        localStorage.setItem("token",response.data.currentToken);
        
        if(message==="user found"){
            setUserId(user_id);
            navigate("/home");
        }
        else if(message!=="user not found"){
            alert("Error occured",message);
        }
        else{
            alert("user not available");
        }
        return ;

    }
    return (
        <div>
            <div className="login">
                <h1>Login</h1>
                <div className="login-form">
                    <div className="login-details">
                        <input
                            type="text"
                            className="custom-input"
                            placeholder="Enter username or email"
                            value={user_detail}
                            onChange={(e) => setdetail(e.target.value)}
                        />
                        <input
                            type="password"
                            className="custom-input"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setpassword(e.target.value)}
                        />
                    </div>
                </div>
                <div className="login-button">
                    <button className="custom-button" onClick={HandleLogin}>
                        Login
                    </button>
                    
                </div>
                <div className="goto-signup">
                    <span>Don't have an account?</span>
                    <button 
                        className="custom-button" 
                        onClick={() => navigate("/signup")}
                    >
                        Signup
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Login;
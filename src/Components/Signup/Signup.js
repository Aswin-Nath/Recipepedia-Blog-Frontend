import React, { useState } from "react";
import "./Signup.css"
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "../Contexts/ContextProvider";
const Signup = () => {
    const {setUserId}=useUser();
    const navigate = useNavigate();
    const [Email, setemail] = useState("");
    const [Password, setpassword] = useState("");
    const [Username, setusername] = useState("");

        const HandleSignup= async (e)=>{
        e.preventDefault();
        if(!Email || !Password || !Username){
            alert("Provide all the details to form a account");
            return;
        }   
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        console.log(Email);
        if(!regex.test(Email)){
            alert("Provide a valid Email address");
            return ;
        }

        if(Password.length<8){
            alert("Password length should be atleast 8");
            return ;
        }
        const API="http://127.0.0.1:5000/duplicate-user-checker";
        const data={
            "username":Username,
            "mail":Email
        }
        try{
            const response=await axios.post(API,data,{
                headers:{
                    "Content-Type":"application/json"
                }
                });
                const mail_check=response.data.mail;
                const name_check=response.data.name;
                if(name_check){
                    alert("User with same username exist,try different username");
                    return;
                }
                if(mail_check){
                    alert("Email is already registered try with an alternate email");
                    return ;
                }
                console.log("FIRST RESPONSE",mail_check,name_check);
                const ADD_API="http://127.0.0.1:5000/add-user";
                try{
                    const data={
                        "username":Username,
                        "email":Email,
                        "password":Password
                    }
                    const insert_response=await axios.post(ADD_API,data,{
                        headers:{
                            "Content-Type":"application/json"
                        }
                    })
                    setUserId(insert_response.data.user_id);
                    console.log("INSERTED data",insert_response);
                    navigate("/home");
                }
                catch(err){
                    alert("Error occured while inserting the user into the db");
                    console.log("Error occured",err.message);
                }
                }
        catch(err){
            console.log("Error occured",err.message);
        }

    }

    return (
        <div>
            <div className="signup">
                <h1>Signup</h1>
                <div className="signup-form">
                    <div className="signup-details">
                        <input
                            type="email"
                            className="custom-input"
                            placeholder="Email"
                            value={Email}
                            onChange={(e) => setemail(e.target.value)}
                        />
                        <input
                            type="text"
                            className="custom-input"
                            placeholder="Username"
                            value={Username}
                            onChange={(e) => setusername(e.target.value)}
                        />
                        <input
                            type="password"
                            className="custom-input"
                            placeholder="Password"
                            value={Password}
                            onChange={(e) => setpassword(e.target.value)}
                        />
                    </div>
                    <div className="signup-button">
                        <button 
                            className="custom-button large" 
                            onClick={HandleSignup}
                        >
                            Signup
                        </button>
                    </div>
                    <div className="have-account">
                        <span>Already have an account?</span>
                        <button 
                            className="custom-button"
                            onClick={() => navigate("/login")}
                        >
                            Login
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Signup;
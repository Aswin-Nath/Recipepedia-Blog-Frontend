import React, { useState } from "react";
import "./Signup.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "../../Contexts/ContextProvider";

// Material UI imports
import { Card, CardContent, Typography, TextField, Button, Box } from "@mui/material";
import AuthNavbar from "../../Navbars/AuthNavbar/AuthNavbar";

const Signup = () => {
    const { setUserId, login } = useUser();
    const navigate = useNavigate();
    const [Email, setemail] = useState("");
    const [Password, setpassword] = useState("");
    const [Username, setusername] = useState("");

    const HandleSignup = async (e) => {
        e.preventDefault();
        if (!Email || !Password || !Username) {
            alert("Provide all the details to form a account");
            return;
        }
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!regex.test(Email)) {
            alert("Provide a valid Email address");
            return;
        }

        if (Password.length < 8) {
            alert("Password length should be atleast 8");
            return;
        }
        const API = "https://recipepedia-blog-backend.onrender.com/api/users/check";
        try {
            const response = await axios.get(API, { params: { Username, Email } });
            const mail_check = response.data.mail;
            const name_check = response.data.name;
            if (name_check) {
                alert("User with same username exist,try different username");
                return;
            }
            if (mail_check) {
                alert("Email is already registered try with an alternate email");
                return;
            }
            const ADD_API = "https://recipepedia-blog-backend.onrender.com/api/signup";
            const data1 = {
                "username": Username,
                "email": Email,
                "password": Password
            }
            const insert_response = await axios.post(ADD_API, data1, {
                headers: {
                    "Content-Type": "application/json"
                }
            })
            localStorage.setItem("token", insert_response.data.currentToken);
            login(insert_response.data.user_id);
            navigate("/home");
        }
        catch (err) {
            if (err.response) {
                console.log("Server responded with error:", err.response.data);
                alert("Server error: " + err.response.data.message);
            } else if (err.request) {
                console.log("No response received:", err.request);
                alert("No response from server.");
            } else {
                console.log("Error setting up request:", err.message);
                alert("Error: " + err.message);
            }
        }
    }

    return (
        <>
            <AuthNavbar />
            <Box sx={{
                minHeight: "664px",
                background: "linear-gradient(135deg, #fffbe6 0%, #ffe082 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}>
                <Card sx={{
                    minWidth: 450,
                    maxWidth: 450,
                    boxShadow: 6,
                    borderRadius: 4,
                    background: "#fff",
                }}>
                    <CardContent>
                        <Typography variant="h4" align="center" fontWeight={700} color="#b86e00" gutterBottom>
                            Signup
                        </Typography>
                        <Box component="form" onSubmit={HandleSignup} sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
                            <TextField
                                label="Email"
                                type="email"
                                value={Email}
                                onChange={(e) => setemail(e.target.value)}
                                variant="outlined"
                                required
                                fullWidth
                            />
                            <TextField
                                label="Username"
                                type="text"
                                value={Username}
                                onChange={(e) => setusername(e.target.value)}
                                variant="outlined"
                                required
                                fullWidth
                            />
                            <TextField
                                label="Password"
                                type="password"
                                value={Password}
                                onChange={(e) => setpassword(e.target.value)}
                                variant="outlined"
                                required
                                fullWidth
                                helperText="At least 8 characters"
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                sx={{
                                    background: "linear-gradient(90deg, #ffb347 0%, #ffcc33 100%)",
                                    color: "#3d2c00",
                                    fontWeight: 600,
                                    borderRadius: 2,
                                    mt: 1,
                                    '&:hover': {
                                        background: "linear-gradient(90deg, #ffcc33 0%, #ffb347 100%)",
                                    }
                                }}
                                fullWidth
                            >
                                Signup
                            </Button>
                        </Box>
                        <Box sx={{ mt: 3, textAlign: "center" }}>
                            <Typography variant="body2" color="text.secondary">
                                Already have an account?
                            </Typography>
                            <Button
                                variant="text"
                                sx={{ color: "#b86e00", fontWeight: 600 }}
                                onClick={() => navigate("/login")}
                            >
                                Login
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </>
    )
}

export default Signup;
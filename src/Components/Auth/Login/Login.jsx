import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "../../Contexts/ContextProvider";
import AuthNavbar from "../../Navbars/AuthNavbar/AuthNavbar";
import { Card, CardContent, Typography, TextField, Button, Box } from "@mui/material";

const Login = () => {
    const navigate = useNavigate();
    const { userId, loading, login } = useUser();

    useEffect(() => {
        if (userId) {
            const type = localStorage.getItem("type");
            if (type === "normal") {
                navigate("/home");
            } else if (type === "admin") {
                navigate("/admin");
            } else {
                navigate("/super-admin");
            }
        }
    }, [userId, loading, navigate]);

    const [user_detail, setdetail] = useState("");
    const [password, setpassword] = useState("");

    const HandleLogin = async (e) => {
        e.preventDefault();
        if (!user_detail || !password) {
            alert("Provide all the details");
            return;
        }
        const API = "https://recipepedia-blog-backend.onrender.com/api/login";
        const data = {
            "detail": user_detail,
            "password": password
        }
        try {
            const response = await axios.post(API, data, {
                headers: {
                    "Content-Type": "application/json"
                }
            });

            const user_id = response.data.id;
            const message = response.data.message;
            localStorage.setItem("token", response.data.currentToken);

            if (message === "user found") {
                login(response.data.currentToken);
            } else if (message !== "user not found") {
                alert("Error occurred: " + message);
            } else {
                alert("User not available");
            }
        } catch (err) {
            alert("Login failed. Please try again.");
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
                // paddingTop: 4
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
                            Login
                        </Typography>
                        <Box component="form" onSubmit={HandleLogin} sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
                            <TextField
                                label="Username or Email"
                                type="text"
                                value={user_detail}
                                onChange={(e) => setdetail(e.target.value)}
                                variant="outlined"
                                required
                                fullWidth
                            />
                            <TextField
                                label="Password"
                                type="password"
                                value={password}
                                onChange={(e) => setpassword(e.target.value)}
                                variant="outlined"
                                required
                                fullWidth
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
                                Login
                            </Button>
                        </Box>
                        <Box sx={{ mt: 3, textAlign: "center" }}>
                            <Typography variant="body2" color="text.secondary">
                                Don't have an account?
                            </Typography>
                            <Button
                                variant="text"
                                sx={{ color: "#b86e00", fontWeight: 600 }}
                                onClick={() => navigate("/signup")}
                            >
                                Signup
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </>
    )
}

export default Login;
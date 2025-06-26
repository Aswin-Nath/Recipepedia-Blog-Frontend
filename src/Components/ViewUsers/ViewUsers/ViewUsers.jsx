import { useParams } from "react-router-dom";
import Navbar from "../../Navbars/Navbar/Navbar";
import { useEffect, useState } from "react";
import axios from "axios";
import IndividualHomeBlogDisplayer from "../../OutsideDisplayer/IndividualHomeBlogDisplayer/IndividualHomeBlogDisplayer";
// We can display his primary details and blogs that he has published and reactions of him other posts
import { Avatar, Box, Typography, Paper, Grid, Divider, CircularProgress } from "@mui/material";

const ViewUsers=()=>{
    const {user_slug}=useParams();
    const tem=user_slug.split("-");
    const userId=parseInt(tem[0]);
    const token=localStorage.getItem("token");
    const user_name=tem[1];
    const [userMail, setUserMail] = useState("");
    const [profileUrl, setProfileUrl] = useState("");
    const [userBlogs,setBlogs]=useState([]);
    useEffect(()=>{
        const fetchBlogs = async () => {
            const API = "http://127.0.0.1:5000/api/users/blogs";
            try {
                const response = await axios.get(API, { params: { userId } });
                setBlogs(response.data.blogs);
                console.log(response.data.blogs);
            }
            catch (error) {
                console.log("Error occured", error);
            }
        }
        const fetchDetails = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/user-details", {
            params: { userId },
            headers: {
                Authorization: `Bearer ${token}`,
            },
            });
            const user = res.data.details[0];
            setUserMail(user.user_mail);
            setProfileUrl(user.profile_url);
        } catch (error) {
            alert("Failed to load user details");
        }
        };
    fetchBlogs();
    fetchDetails();
    },[])
    
    return (
        <div>
            <Navbar></Navbar>
            <Box display="flex" flexDirection="column" alignItems="center" p={3}>
                <Avatar
                src={profileUrl}
                alt={user_name}
                sx={{ width: 110, height: 110, mb: 2, boxShadow: 3 }}
                />
                <Typography variant="h5" fontWeight={600} gutterBottom>
                {user_name}
                </Typography>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                {userMail}
                </Typography>
          </Box>
            <div className="my-blogs-content">
                <h1>Blogs</h1>
                <div className="posts-grid">
                    {userBlogs.map((blog) => (
                        <IndividualHomeBlogDisplayer key={blog.blog_id} blog={blog} />
                    ))}
                </div>
            </div>
        </div>
    )
}
export default ViewUsers;
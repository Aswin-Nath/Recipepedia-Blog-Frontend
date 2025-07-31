import { useParams } from "react-router-dom";
import Navbar from "../../Navbars/Navbar/Navbar";
import { useEffect, useState } from "react";
import axios from "axios";
import IndividualHomeBlogDisplayer from "../../OutsideDisplayer/IndividualHomeBlogDisplayer/IndividualHomeBlogDisplayer";
// We can display his primary details and blogs that he has published and reactions of him other posts
import { Avatar, Box, Typography, Paper, Grid, Divider, CircularProgress } from "@mui/material";
import { useUser } from "../../Contexts/ContextProvider";
import {Button} from "@mui/material";
const ViewUsers=()=>{
    const {userId,loading}=useUser();
    const {user_slug}=useParams();
    const tem=user_slug.split("-");
    const target_user_id=parseInt(tem[0]);
    const token=localStorage.getItem("token");
    const user_name=tem[1];
    const [userMail, setUserMail] = useState("");
    const [profileUrl, setProfileUrl] = useState("");
    const [userBlogs,setBlogs]=useState([]);
    const [followers, setFollowers] = useState([]);
    const [followStatus,setFollowStatus]=useState(false);
    const handleConnect = async (targetId) => {
        try {
        await axios.post("https://recipepedia-blog-backend.onrender.com/api/connect", {
            follower_id: userId,
            following_id: targetId,
        });
        setFollowStatus(followStatus===true?false:true);
        } catch (err) {
        console.error("Failed to connect:", err);
        }
    };
    const handleUnfollow = async (followingId) => {
        try {
        await axios.post("https://recipepedia-blog-backend.onrender.com/api/unfollow", {
            follower_id: userId,
            following_id: followingId,
        });
        setFollowStatus(followStatus===true?false:true);
        } catch (err) {
        console.error("Failed to unfollow", err);
        }
    };

    useEffect(()=>{
        const fetchBlogs = async () => {
            const API = "https://recipepedia-blog-backend.onrender.com/api/users/blogs";
            try {
                const response = await axios.get(API, { params: { userId:target_user_id } });
                setBlogs(response.data.blogs);
            }
            catch (error) {
                console.log("Error occured", error);
            }
        }
        const fetchDetails = async () => {
        try {
            const res = await axios.get("https://recipepedia-blog-backend.onrender.com/api/user-details", {
            params: { userId:target_user_id },
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
    fetchDetails();
    fetchBlogs();
    },[])
    useEffect(()=>{
        if(!userId){
            return;
        }
        const fetchNetwork = async () => {
            try {
                console.log("called");
            const API3=`http://127.0.0.1:5000/api/following/${userId}`
            const API4=`https://recipepedia-blog-backend.onrender.com/api/following/${userId}`
            const resFollowers = await axios.get(API3);
            for(var who_are_following_target_user in resFollowers.data){
                const current=resFollowers.data[who_are_following_target_user];
                if(current.following_id==target_user_id){
                    setFollowStatus(true);
                    break;
                }
            }
            console.log("followers",resFollowers) 
            setFollowers(resFollowers.data);
            } catch (err) {
            console.error("Failed to fetch network data", err);
            }
        };
        fetchNetwork();
        console.log("following",followers,userId,target_user_id);
    },[userId])
    if(!userId || !target_user_id){
        return (<div>{userId}</div>)
    }
    if(userId){
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
                {userId!=target_user_id && followStatus===true && (
                    <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() =>handleUnfollow(target_user_id)}>
                    UnFollow
                    </Button>
                )}
                {userId!=target_user_id && followStatus===false && (
                <Button variant="contained" size="small" onClick={() => handleConnect(target_user_id)}>
                  Follow
                </Button>
                )}
          </Box>
            <div className="my-blogs-content">
                <h1>Blogs</h1>
                {userBlogs.length===0?(<div>
                    No Blogs 
                </div>):(
                    <div className="posts-grid">
                    {userBlogs.map((blog) => (
                        <IndividualHomeBlogDisplayer key={blog.blog_id} blog={blog} />
                    ))}
                </div>
                )}
                
            </div>
        </div>
    )
    }
}
export default ViewUsers;
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "../../Navbars/Navbar/Navbar";
import { useUser } from '../../Contexts/ContextProvider';
import axios from 'axios';
import IndividualHomeBlogDisplayer from '../../OutsideDisplayer/IndividualHomeBlogDisplayer/IndividualHomeBlogDisplayer';
import './MyBlogs.css';

const MyBlogs = () => {
    const { userId, loading } = useUser();
    const [blogs, setblogs] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (loading) {
            return;
        }
        if (!userId) {
            navigate("/login");
            return;
        }
        const fetchBlogs = async () => {
            const API = "http://127.0.0.1:5000/api/users/blogs";
            try {
                const response = await axios.get(API, { params: { userId } });
                setblogs(response.data.blogs);
            }
            catch (error) {
                console.log("Error occured", error);
            }
        }
        fetchBlogs();
    }, [userId, loading,navigate])

    return (
        <div className="my-blogs-container">
            <Navbar />
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
                    {blogs.map((blog) => (
                        <IndividualHomeBlogDisplayer key={blog.blog_id} blog={blog} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MyBlogs;
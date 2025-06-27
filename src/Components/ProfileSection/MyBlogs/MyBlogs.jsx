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
            const API = "https://recipepedia-blog-backend.onrender.com/api/users/blogs";
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
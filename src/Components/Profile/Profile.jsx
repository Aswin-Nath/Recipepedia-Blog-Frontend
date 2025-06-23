import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "../Navbar/Navbar";
import './Profile.css';
import { useUser } from '../Contexts/ContextProvider';
import axios from 'axios';
import IndividualHomeDisplayer from '../IndividualHomeBlogDisplayer/IndividualHomeBlogDisplayer';

const Profile = () => {
    const { userId, loading } = useUser();
    const [blogs, setblogs] = useState([]);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('blogs');

    const handleBookmarks = () => {
        navigate('/profile/bookmarks');
    };

    const handleCreatePost = () => {
        navigate('/new-blog');
    };

    const handleViewAllBlogs = () => {
        navigate('/profile/my-blogs');  
    };
    
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
    <div className="profile-container">
        <Navbar />
        <div className="profile-content">
            <div className="action-buttons">
                <button className="bookmark-btn" onClick={handleBookmarks}>Bookmarks</button>
                <button className="create-post-btn" onClick={handleCreatePost}>Create a Post</button>
            </div>

            <div className="activity-section">
                <h2>Activity</h2>
                <div className="activity-tabs">
                    <button 
                        className={`tab ${activeTab === 'blogs' ? 'active' : ''}`}
                        onClick={() => setActiveTab('blogs')}
                    >
                        Blogs
                    </button>
                </div>

                {activeTab === "blogs" && (
                    <>
                        <div className="posts-grid">
                            {blogs.slice(0, 2).map((blog) => (
                                <IndividualHomeDisplayer 
                                    key={blog.blog_id} 
                                    blog={blog} 
                                />
                            ))}
                        </div>
                        {blogs.length > 2 && (
                            <div className="view-all-button">
                                <button onClick={handleViewAllBlogs}>
                                    View All My Blogs
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    </div>
);
};

export default Profile;
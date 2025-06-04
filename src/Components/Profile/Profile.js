import { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "../Navbar/Navbar";
import './Profile.css';
import { useUser } from '../Contexts/ContextProvider';
import axios from 'axios';
import IndividualHomeDisplayer from '../IndividualHomeBlogDisplayer/IndividualHomeBlogDisplayer';
const Profile = () => {
    const {userId}=useUser();
    const [blogs,setblogs]=useState([]);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('blogs');

    const handleBookmarks = () => {
        navigate('/bookmarks');
    };

    const handleCreatePost = () => {
        navigate('/create-post');
    };
    useEffect(()=>{
        const fetchBlogs= async ()=>{
            const API="http://127.0.0.1:5000/blog-for-each-user";
            const data={"user_id":userId};
            try{
                const response=await axios.post(API,data,{headers:{"Content-Type":"application/json"}});
                setblogs(response.data.blogs);
            }
            catch(error){
                console.log("Error occured",error);
            }  
        }
        fetchBlogs();
    },[])


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

                    {activeTab==="blogs" && (<div className="posts-grid">
                        {blogs.map((blog,index)=>{
                            return <IndividualHomeDisplayer key={blog.blog_id} blog={blog}/>
                                })}
                    </div>)
                    }

                </div>
            </div>
        </div>
    );
};

export default Profile;
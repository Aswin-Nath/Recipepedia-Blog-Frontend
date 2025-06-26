import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "../../Navbars/Navbar/Navbar";
import './Profile.css'; 
import { useUser } from '../../Contexts/ContextProvider';
import axios from 'axios';
import IndividualHomeBlogDisplayer from '../../OutsideDisplayer/IndividualHomeBlogDisplayer/IndividualHomeBlogDisplayer';
import IndividualHomeDraftDisplayer from "../../OutsideDisplayer/IndividualHomeDraftDisplayer/IndividualHomeDraftDisplayer";
import IndividualHomeScheduledBlogDisplayer from "../../OutsideDisplayer/IndividualHomeScheduledBlogDisplayer/IndividualhomeScheduledBlogDisplayer";
import EditProfile from '../EditDetails/EditDetails';
const Profile = () => {
  const { userId, loading } = useUser();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('blogs');
  const [blogs, setBlogs] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [scheduled, setScheduled] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    if (loading || !userId) return;

    const fetchBlogs = async () => {
      const res = await axios.get("http://127.0.0.1:5000/api/users/blogs", { params: { userId } });
      setBlogs(res.data.blogs || []);
    };

    const fetchDrafts = async () => {
      const res = await axios.get("http://127.0.0.1:5000/api/users/drafts", { params: { userId } });
      setDrafts(res.data.drafts || []);
    };

    const fetchScheduled = async () => {
      const res = await axios.get("http://127.0.0.1:5000/api/get/scheduled_blogs", { params: { userId } });
      setScheduled(res.data.schedule_blogs || []);
    };

    const fetchBookmarks = async () => {
      const res = await axios.get("http://127.0.0.1:5000/api/bookmarks", { params: { userId } });
      setBookmarks(res.data.bookmarks || []);
    };

    fetchBlogs();
    fetchDrafts();
    fetchScheduled();
    fetchBookmarks();
  }, [loading, userId]);
  return (
    <div className="profile-container">
      <Navbar />
      <div className="profile-content">
        <div className="activity-section">
          <h2>Activity</h2>

          {/* Tab Buttons */}
          <div className="activity-tabs">
            <button className={`tab ${activeTab === 'blogs' ? 'active' : ''}`} onClick={() => setActiveTab('blogs')}>Blogs</button>
            <button className={`tab ${activeTab === 'drafts' ? 'active' : ''}`} onClick={() => setActiveTab('drafts')}>Drafts</button>
            <button className={`tab ${activeTab === 'scheduled' ? 'active' : ''}`} onClick={() => setActiveTab('scheduled')}>Scheduled</button>
            <button className={`tab ${activeTab === 'bookmarks' ? 'active' : ''}`} onClick={() => setActiveTab('bookmarks')}>Bookmarks</button>
            <button className={`tab ${activeTab === 'edit' ? 'active' : ''}`} onClick={()=>setActiveTab("edit")}>Edit Details</button>
          </div>

          {/* Tab Contents */}
          <div className="posts-grid">
            {activeTab === 'blogs' && (
              blogs.length > 0 ? (
                blogs.map(blog => (
                  <IndividualHomeBlogDisplayer key={blog.blog_id} blog={blog} />
                ))
              ) : (
                <p>No blogs found.</p>
              )
            )}

            {activeTab === 'drafts' && (
              drafts.length > 0 ? (
                drafts.map(draft => (
                  <IndividualHomeDraftDisplayer key={draft.blog_id} blog={draft} />
                ))
              ) : (
                <p>No drafts found.</p>
              )
            )}

            {activeTab === 'scheduled' && (
              scheduled.length > 0 ? (
                scheduled.map(sch => (
                  <IndividualHomeScheduledBlogDisplayer key={sch.blog_id} blog={sch} />
                ))
              ) : (
                <p>No scheduled blogs found.</p>
              )
            )}

            {activeTab === 'bookmarks' && (
              bookmarks.length > 0 ? (
                bookmarks.map(bookmark => (
                  <IndividualHomeBlogDisplayer key={bookmark.blog_id} blog={bookmark} />
                ))
              ) : (
                <p>No bookmarks found.</p>
              )
            )}

            {activeTab==="edit" && <EditProfile/>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

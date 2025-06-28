import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Components/Auth/Login/Login';
import Signup from './Components/Auth/Signup/Signup';
import Home from './Components/HomePages/Home/Home';
import EditDetails from './Components/ProfileSection/EditDetails/EditDetails';
import IndividualBlogDisplayer from './Components/Displayer/IndividualBlogDisplayer/IndividualBlogDisplayer';
import Profile from './Components/ProfileSection/Profile/Profile';
import Bookmarks from './Components/Bookmarks/Bookmarks';
import CreateBlog from './Components/Creater/CreateBlog/CreateBlog';
import MyBlogs from './Components/ProfileSection/MyBlogs/MyBlogs';
import EditBlog from './Components/Editor/EditBlog/EditBlog';
import AdminHomePage from './Components/HomePages/NormalAdmin/Admin';
import SuperAdminHomePage from './Components/HomePages/SuperAdmin/SuperAdmin';
import MyDrafts from './Components/ProfileSection/MyDrafts/MyDrafts';
import IndividualDraftDisplayer from './Components/Displayer/IndividualDraftDisplayer/IndividualDraftDisplayer';
import MyScheduledBlogs from './Components/ProfileSection/MyScheduledBlogs/MyScheduledBlogs';
import IndividualScheduleBlogDisplayer from './Components/Displayer/IndividualScheduledBlogDisplayer/IndividualScheduledBlogDisplayer';
import Network from './Components/NetworkPage/Network/Network';
import ViewUsers from './Components/ViewUsers/ViewUsers/ViewUsers';

import ProtectedRoute from './Components/Auth/ProtectedRoute';

function App() {
  return (
    <div className="App">
        <Routes>
          <Route path="" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/blog/:blog_id/:blog_title" element={<IndividualBlogDisplayer />} />

          {/* Protected Routes */}
          <Route path="/draft/:blog_id" element={<ProtectedRoute><IndividualDraftDisplayer /></ProtectedRoute>} />
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/home/search" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/profile/bookmarks" element={<ProtectedRoute><Bookmarks /></ProtectedRoute>} />
          <Route path="/new-blog" element={<ProtectedRoute><CreateBlog /></ProtectedRoute>} />
          <Route path="/profile/my-blogs" element={<ProtectedRoute><MyBlogs /></ProtectedRoute>} />
          <Route path="/edit-post/:blog_id" element={<ProtectedRoute><EditBlog /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><AdminHomePage /></ProtectedRoute>} />
          <Route path="/super-admin" element={<ProtectedRoute><SuperAdminHomePage /></ProtectedRoute>} />
          <Route path="/profile/drafts" element={<ProtectedRoute><MyDrafts /></ProtectedRoute>} />
          <Route path="/profile/schedule" element={<ProtectedRoute><MyScheduledBlogs /></ProtectedRoute>} />
          <Route path="/scheduled/:blog_id" element={<ProtectedRoute><IndividualScheduleBlogDisplayer /></ProtectedRoute>} />
          <Route path="/network" element={<ProtectedRoute><Network /></ProtectedRoute>} />
          <Route path="/edit-details" element={<ProtectedRoute><EditDetails /></ProtectedRoute>} />
          <Route path="/user/:user_slug" element={<ProtectedRoute><ViewUsers /></ProtectedRoute>} />
        </Routes>
    </div>
  );
}

export default App;

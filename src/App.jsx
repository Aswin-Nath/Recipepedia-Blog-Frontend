import './App.css';
import { BrowserRouter as Router,Routes,Route, Navigate } from 'react-router-dom';
import Login from './Components/Login/Login';
import Signup from './Components/Signup/Signup';
import Home from './Components/Home/Home';
import IndividualBlogDisplayer from './Components/IndividualBlogDisplayer/IndividualBlogDisplayer';
import Profile from './Components/Profile/Profile';
import Bookmarks from './Components/Bookmarks/Bookmarks';
import CreateBlog from './Components/CreateBlog/CreateBlog';
import MyBlogs from './Components/MyBlogs/MyBlogs';
import EditBlog from './Components/EditBlog/EditBlog';
import AdminHomePage from './Components/NormalAdmin/Admin';
import SuperAdminHomePage from './Components/SuperAdmin/SuperAdmin';
import MyDrafts from './Components/MyDrafts/MyDrafts';
import IndividualDraftDisplayer from './Components/IndividualDraftDisplayer/IndividualDraftDisplayer';
import MyScheduledBlogs from './Components/MyScheduledBlogs/MyScheduledBlogs';
import IndividualScheduleBlogDisplayer from './Components/IndividualScheduledBlogDisplayer/IndividualScheduledBlogDisplayer';
import Network from './Components/Network/Network';
function App() {
  return (
    <div className="App">
        <Routes>
          <Route path="" element={<Navigate to="/login"/>}/>
          <Route path='/login' element={<Login/>}></Route>
          <Route path='/signup' element={<Signup/>}></Route>
          <Route path="/home" element={<Home />} />
          <Route path="/home/search" element={<Home />} />
          <Route path="/blog/:blog_id/:blog_title" element={<IndividualBlogDisplayer />} />
          <Route path="/draft/:blog_id/" element={<IndividualDraftDisplayer/>}/>
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/bookmarks" element={<Bookmarks />} />
          <Route path="/new-blog" element={<CreateBlog/>}/>
          <Route path="/profile/my-blogs" element={<MyBlogs />} />
          <Route path='/edit-post/:blog_id' element={<EditBlog/>}/>
          <Route path='/admin' element={<AdminHomePage/>}/>
          <Route path='/super-admin' element={<SuperAdminHomePage/>}/>
          <Route path="/profile/drafts" element={<MyDrafts/>}/>
          <Route path="/profile/schedule" element={<MyScheduledBlogs/>}/>
          <Route path="/scheduled/:blog_id" element={<IndividualScheduleBlogDisplayer/>}/>
          <Route path="/network" element={<Network/>}/>
        </Routes>
    </div>
  );
}

export default App;

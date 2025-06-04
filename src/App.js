import './App.css';
import { BrowserRouter as Router,Routes,Route, Navigate } from 'react-router-dom';
import Login from './Components/Login/Login';
import Signup from './Components/Signup/Signup';
import Home from './Components/Home/Home';
import IndividualBlogDisplayer from './Components/IndividualBlogDisplayer/IndividualBlogDisplayer';
import Profile from './Components/Profile/Profile';
import CreateBlog from './Components/CreateBlog/CreateBlog';
import Bookmarks from './Components/Bookmarks/Bookmarks';
function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="" element={<Navigate to="/signup"/>}/>
          <Route path='/login' element={<Login/>}></Route>
          <Route path='/signup' element={<Signup/>}></Route>
          <Route path="/home" element={<Home/>}></Route>
          <Route path="/blog/:blog_title" element={<IndividualBlogDisplayer />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/bookmarks" element={<Bookmarks />} />
          <Route path="/create-post" element={<CreateBlog />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

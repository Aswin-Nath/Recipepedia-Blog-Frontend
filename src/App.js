import './App.css';
import { BrowserRouter as Router,Routes,Route, Navigate } from 'react-router-dom';
import Login from './Components/Login/Login';
import Signup from './Components/Signup/Signup';
import Home from './Components/Home/Home';
import IndividualBlogDisplayer from './Components/IndividualBlogDisplayer/IndividualBlogDisplayer';
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
        </Routes>
      </Router>
    </div>
  );
}

export default App;

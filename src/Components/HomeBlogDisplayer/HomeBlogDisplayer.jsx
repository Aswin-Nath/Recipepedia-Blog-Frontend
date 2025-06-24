import {useEffect,useState} from "react";
import axios from "axios";
import IndividualHomeBlogDisplayer from "../IndividualHomeBlogDisplayer/IndividualHomeBlogDisplayer";
const HomeBlog=()=>{
    const [blogs,setblogs]=useState([]);

useEffect(() => {
  const fetchBlogs = async () => {
    const API = "http://127.0.0.1:5000/api/get/blogs";
    try {
      const response = await axios.get(API);
      setblogs(response.data.message);
    } catch (error) {
      alert("Error occurred: " + error.message);
    }
  };
  
  fetchBlogs();
}, []);
    
    return (
        <div>
            { blogs && (
                 blogs.map((blog,index)=>{
                    return <IndividualHomeBlogDisplayer key={blog.blog_id} blog={blog}/>
                })
            )
            }
        </div>
    )
}
export default HomeBlog;

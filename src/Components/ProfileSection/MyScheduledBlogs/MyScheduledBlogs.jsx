import Navbar from "../../Navbars/Navbar/Navbar";
import "./MyScheduledBlogs.css";
// import "../MyDrafts/MyDrafts/MyDrafts.css";

import axios from "axios";
import { useUser } from "../../Contexts/ContextProvider";
import { useEffect, useState } from "react";
// import IndividualHomeScheduledBlogDisplayer from "../IndividualHomeScheduledBlogDisplayer/IndividualScheduledBlogDisplayer";
import IndividualHomeScheduledBlogDisplayer from "../../OutsideDisplayer/IndividualHomeScheduledBlogDisplayer/IndividualHomeScheduledBlogDisplayer";
// import IndividualHomeDisplayer from "../IndividualHomeBlogDisplayer/IndividualHomeBlogDisplayer";
const MyScheduledBlogs=()=>{
    const {loading,userId}=useUser();
    const [scheduled_blog,setblogs]=useState();

    useEffect(()=>{
        if(loading || !userId){
            return;
        }
        const fetchBlogs=async ()=>{
            const API="https://recipepedia-blog-backend.onrender.com/api/get/scheduled_blogs";
            try{
                const response=await axios.get(API,{params:{userId}});
                setblogs(response.data.schedule_blogs);
                console.log(response.data.schedule_blogs);
            }
            catch(error){
                return alert("Error occured while getting the scheduled blogs",error);
            }
        }
        fetchBlogs();
    },[loading,userId]);
    return (
        <div>
            <Navbar/>
            <div className="my-blogs-content">
                <h1>All My Drafts</h1>
                <div className="posts-grid">
                    {userId && scheduled_blog && scheduled_blog.map((blog) => (
                        <IndividualHomeScheduledBlogDisplayer key={blog.blog_id} blog={blog}/>
                    ))}
                </div>
            </div>
        </div>
    )
}
export default MyScheduledBlogs;
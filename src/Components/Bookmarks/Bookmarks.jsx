import Navbar from "../Navbars/Navbar/Navbar";
import { useUser } from "../Contexts/ContextProvider";
import axios from "axios";
import { useEffect, useState } from "react";
import IndividualHomeDisplayer from "../OutsideDisplayer/IndividualHomeBlogDisplayer/IndividualHomeBlogDisplayer";
import { useNavigate } from "react-router-dom";
const Bookmarks = () => {
    const {loading,userId}=useUser();
    const navigate=useNavigate();
    const [bookmarks,setbookmarks]=useState([]);
    useEffect(()=>{
        if(loading){
            return;
        }
        if(!userId){
            navigate("/login");
            return;
        }
        const fetchBookmarks=async ()=>{
            try{
                const response=await axios.get("http://127.0.0.1:5000/api/bookmarks",{params:{userId}});
                setbookmarks(response.data.bookmarks);
            }
            catch(error){
                console.log("Error occured",error);
            }
        }
        fetchBookmarks();
    },[loading,userId,navigate]);
    return (
        <div>
            <Navbar />
            <div className="bookmarks-container">
                <h1>Your Bookmarks</h1>
                {
                    bookmarks.map((bookmark,index)=>{
                        return <IndividualHomeDisplayer key={bookmark.blog_id} blog={bookmark}/>
                    })
                }
            </div>
        </div>
    );
};

export default Bookmarks;
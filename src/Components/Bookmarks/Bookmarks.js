import Navbar from "../Navbar/Navbar";
import { useUser } from "../Contexts/ContextProvider";
import axios from "axios";
import { useEffect, useState } from "react";
import IndividualHomeDisplayer from "../IndividualHomeBlogDisplayer/IndividualHomeBlogDisplayer";
const Bookmarks = () => {
    const {userId}=useUser();
    const [bookmarks,setbookmarks]=useState([]);
    useEffect(()=>{
        const fetchBookmarks=async ()=>{
            try{
                const response=await axios.post("http://127.0.0.1:5000/bookmark",{"user_id":userId},{headers:{"Content-Type":"application/json"}});
                setbookmarks(response.data.bookmarks);
            }
            catch(error){
                console.log("Error occured",error);
            }
        }
        fetchBookmarks();
    },[]);
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
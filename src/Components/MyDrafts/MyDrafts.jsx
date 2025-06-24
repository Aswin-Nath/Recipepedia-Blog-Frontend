import { useEffect, useState } from "react";
import { useUser } from "../Contexts/ContextProvider";
import axios from "axios";
import '../MyBlogs/MyBlogs.css';
// import IndividualDraftDisplayer from "../IndividualDraftDisplayer/IndividualDraftDisplayer";
// import IndividualHomeDisplayer from "../IndividualHomeDraftDisplayer/IndividualHomeDraftDisplayer";
import IndividualHomeDraftDisplayer from "../IndividualHomeDraftDisplayer/IndividualHomeDraftDisplayer";
import Navbar from "../Navbar/Navbar";
const MyDrafts=()=>{
    const {loading,  userId}=useUser();
    const [Drafts,setDrafts]=useState([]);
    useEffect(()=>{
        console.log(loading);
        if(!userId){
            return;
        };
        const fetchDrafts=async ()=>{
            try{
                const API="http://127.0.0.1:5000/api/users/drafts";
                const response=await axios.get(API,{params:{userId}});
                setDrafts(response.data.drafts);
                console.log(response);
            }
            catch(error){
                return alert("Error occurred ",error);
            }
        }
        fetchDrafts();
    },[userId,loading])
    return (
        <div>
            <Navbar/>
            <div className="my-blogs-content">
                <h1>All My Drafts</h1>
                <div className="posts-grid">
                    {userId && Drafts && Drafts.map((draft) => (
                        <IndividualHomeDraftDisplayer key={draft.blog_id} blog={draft}/>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default MyDrafts;

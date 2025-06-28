import { useEffect, useState } from "react";
import { useUser } from "../../Contexts/ContextProvider";
import axios from "axios";
import './MyDrafts.css';
// import IndividualDraftDisplayer from "../IndividualDraftDisplayer/IndividualDraftDisplayer";
// import IndividualHomeDisplayer from "../IndividualHomeDraftDisplayer/IndividualHomeDraftDisplayer";
import IndividualHomeDraftDisplayer from "../../OutsideDisplayer/IndividualHomeDraftDisplayer/IndividualHomeDraftDisplayer";
import Navbar from "../../Navbars/Navbar/Navbar";
const MyDrafts=()=>{
    const {loading,  userId}=useUser();
    const [Drafts,setDrafts]=useState([]);
    useEffect(()=>{
        if(!userId){
            return;
        };
        const fetchDrafts=async ()=>{
            try{
                const API="https://recipepedia-blog-backend.onrender.com/api/users/drafts";
                const response=await axios.get(API,{params:{userId}});
                setDrafts(response.data.drafts);
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

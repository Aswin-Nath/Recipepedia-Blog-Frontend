import Navbar from "../Navbar/Navbar";
import HomeBlog from "../HomeBlogDisplayer/HomeBlogDisplayer";
import { useUser } from "../Contexts/ContextProvider";
import { useEffect, useState } from "react";
const Home=()=>{
    const {userId,loading}=useUser();
    useEffect(()=>{
        if(!loading){
        console.log(userId);
        }
    },[userId,loading])
    console.log(userId);
    return (
        <div>
            <Navbar/>
            <HomeBlog/>
        </div>
    )
};

export default Home;
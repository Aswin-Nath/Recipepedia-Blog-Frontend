import Navbar from "../../Navbars/Navbar/Navbar";
import HomeBlog from "../../Displayer/HomeBlogDisplayer/HomeBlogDisplayer";
import { useUser } from "../../Contexts/ContextProvider";
import { useEffect, useState } from "react";
const Home=()=>{
    const {userId,loading}=useUser();
    useEffect(()=>{
        if(!loading){
        }
    },[userId,loading])
    return (
        <div>
            <Navbar/>
            <HomeBlog/>
        </div>
    )
};

export default Home;
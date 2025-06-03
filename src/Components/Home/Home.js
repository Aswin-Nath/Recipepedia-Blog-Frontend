import React from "react";
import Navbar from "../Navbar/Navbar";
import HomeBlog from "../HomeBlogDisplayer/HomeBlogDisplayer";

const Home=()=>{
    return (
        <div>
            <Navbar/>
            <HomeBlog user_id={1}/>
        </div>
    )
};

export default Home;
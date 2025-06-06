import Navbar from "../Navbar/Navbar";
import HomeBlog from "../HomeBlogDisplayer/HomeBlogDisplayer";
import { useUser } from "../Contexts/ContextProvider";
import { useEffect } from "react";
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
            <HomeBlog user_id={1}/>
        </div>
    )
};

export default Home;
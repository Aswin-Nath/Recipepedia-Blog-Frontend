import { useNavigate } from "react-router-dom";
import "./Navbar.css";
import { useState } from "react";
const Navbar=()=>{
    const navigate=useNavigate();
    const [show,setshow]=useState(0);
    const toggle=()=>{
        if(show===0){
            setTimeout(() => {
                setshow(1);
            }, 200);
        }
        else{
            setshow(0);
        }
    }
    return (
            <div className="containers">
                <div className="container">
                    <div className="content-displayer">
                        <h1 style={{color:"cyan"}}>Recipepedia</h1>
                        <h1 style={{color:"blue"}} className="home-button" onClick={()=>{navigate("/home")}}>Home</h1>
                    </div>
                    <div onClick={toggle} className="profile-button">
                        <p>Profile</p>
                    </div>
                </div>
                
                    {(
                    <div className={`profile-div ${show === 1 ? "show" : ""}`}>
                        <h1>View Profile</h1>
                        <h1>Log out</h1>
                    </div>
                    )}
            </div>
    )
}

export default Navbar;

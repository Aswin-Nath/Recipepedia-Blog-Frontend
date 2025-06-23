import { useNavigate } from "react-router-dom";
import "./CreateBlogNavbar.css";
import { useState } from "react";
import { useUser } from "../Contexts/ContextProvider";

const CreateBlogNavbar = () => {
    const {userId,logout} = useUser();
    const navigate = useNavigate();
    const [show,setshow] = useState(0);
    
    const toggle = () => {
        if(show === 0){
            setTimeout(() => {
                setshow(1);
            }, 200);
        } else {
            setshow(0);
        }
    }

    return (
        <div className="containers">
            <div className="container">
                <div className="content-displayer">
                    <h1 className="brand">Recipepedia</h1>
                    <h1 className="nav-link" onClick={() => {navigate("/home",{state:{userId}})}}>Home</h1>
                </div>
                <div className="nav-actions">
                    <div onClick={toggle} className="profile-button">
                        <span className="profile-initial">P</span>
                    </div>
                </div>
            </div>

            <div className={`profile-div ${show === 1 ? "show" : ""}`}>
                <div className="profile-menu-item" onClick={() => navigate("/profile")}>
                    <i className="fas fa-user"></i>
                    <span>View Profile</span>
                </div>
                <div className="profile-menu-item">
                    <i className="fas fa-sign-out-alt"></i>                
                    <span onClick={() => {
                        logout();
                        navigate("/login");
                    }}>
                        Log out
                    </span>
                </div>
            </div>
        </div>
    );
}

export default CreateBlogNavbar;


import { useNavigate } from "react-router-dom";
import "./Navbar.css";
import { useState } from "react";
import { useUser } from "../Contexts/ContextProvider";

const Navbar = () => {
    const {userId,logout,setUserId} = useUser();
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
                    <h1 className="nav-link" onClick={() => {navigate("/network")}}>Network</h1>
                </div>
                <div className="nav-actions">
                    {localStorage.getItem("type")=="normal" && (
                        <button 
                            className="create-blog-nav-btn"
                            onClick={() => navigate('/new-blog')}
                            aria-label="Create new recipe blog"
                        >
                            <span className="button-icon">✏️</span>
                            <span className="button-text">Write Recipe</span>
                        </button>
                    )}
                    
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
                        navigate("/login");
                        // logout();
                        localStorage.removeItem("token");
                        setUserId(null);
                    }}>
                        Log out
                    </span>
                </div>
            </div>
        </div>
    );
}

export default Navbar;
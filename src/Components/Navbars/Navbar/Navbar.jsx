import { useNavigate } from "react-router-dom";
import "./Navbar.css";
import { useState, useEffect, useRef } from "react";
import { useUser } from "../../Contexts/ContextProvider";
import Notification from "../../Notifications/Notification/Notification";

const Navbar = () => {
    const { userId, logout, setUserId } = useUser();
    const navigate = useNavigate();
    const [show, setshow] = useState(0);
    const [value, setvalue] = useState("ppambu");
    const [openNotification, setNotification] = useState(false);
    const notificationRef = useRef(null);

    const toggle = () => {
        if (show === 0) {
            setTimeout(() => {
                setshow(1);
            }, 200);
        } else {
            setshow(0);
        }
    };

    // Close notification panel when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                notificationRef.current &&
                !notificationRef.current.contains(event.target) &&
                !event.target.closest(".notification-bell")
            ) {
                setNotification(false);
            }
        };
        if (openNotification) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [openNotification]);

    return (
        <div className="containers" style={{ position: "relative" }}>
            <div className="container">
                <div className="content-displayer">
                    <h1 className="brand">Recipepedia</h1>
                    <h1 className="nav-link" onClick={() => { navigate("/home", { state: { userId } }) }}>Home</h1>
                    <h1 className="nav-link" onClick={() => { navigate("/network") }}>Network</h1>
                    <div
                        onClick={() => setNotification((prev) => !prev)}
                        className="nav-link notification-bell"
                        style={{ position: "relative", cursor: "pointer" }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="30" height="30" fill="white">
                            <path fillRule="evenodd" clipRule="evenodd" d="M6.20374 15.8174C6.18177 15.8563 6.15975 15.8945 6.13771 15.9322H17.8623C17.8403 15.8945 17.8182 15.8563 17.7963 15.8174C16.8756 14.1898 16.3333 12.0111 16.3333 9.21793C16.3333 6.93819 14.4012 5.07507 12 5.07507C9.5988 5.07507 7.66667 6.93819 7.66667 9.21793C7.66667 12.0111 7.12442 14.1898 6.20374 15.8174ZM20 17.9322H4.00001C3.00196 17.9322 2.61971 16.6307 3.45925 16.091C3.66114 15.9612 4.0464 15.5691 4.46294 14.8327C5.20893 13.5139 5.66667 11.6748 5.66667 9.21793C5.66667 5.81702 8.51018 3.07507 12 3.07507C15.4898 3.07507 18.3333 5.81702 18.3333 9.21793C18.3333 11.6748 18.7911 13.5139 19.5371 14.8327C19.9536 15.5691 20.3389 15.9612 20.5408 16.091C21.3803 16.6307 20.9981 17.9322 20 17.9322ZM12.9372 19.2783C13.2219 18.805 13.8363 18.6521 14.3096 18.9368C14.7828 19.2215 14.9357 19.836 14.651 20.3092C14.0976 21.2292 13.0875 21.7902 12 21.7902C10.9125 21.7902 9.90245 21.2292 9.34903 20.3092C9.06434 19.836 9.2172 19.2215 9.69045 18.9368C10.1637 18.6521 10.7781 18.805 11.0628 19.2783C11.2515 19.5919 11.6085 19.7902 12 19.7902C12.3915 19.7902 12.7485 19.5919 12.9372 19.2783Z"></path>
                        </svg>
                    </div>
                    <h1>{value}</h1>
                </div>
                <div className="nav-actions">
                    {localStorage.getItem("type") === "normal" && (
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

            {/* Notification Panel */}
            {openNotification && (
                <div
                    ref={notificationRef}
                    style={{
                        position: "absolute",
                        top: 60,
                        left:"550px",
                        width: 370,
                        maxHeight: 500,
                        background: "#23272f",
                        color: "#fff",
                        borderRadius: 12,
                        boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
                        zIndex: 100,
                        overflowY: "auto",
                        padding: "0 0 10px 0",
                        border: "1px solid #333"
                    }}
                >
                    <div style={{
                        padding: "18px 22px 10px 22px",
                        borderBottom: "1px solid #333",
                        fontWeight: 600,
                        fontSize: "1.15em",
                        letterSpacing: "0.5px"
                    }}>
                        Notifications
                    </div>
                    <div style={{ padding: "10px 18px 0 18px" }}>
                        <Notification userId={userId} />
                    </div>
                </div>
            )}

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
};

export default Navbar;
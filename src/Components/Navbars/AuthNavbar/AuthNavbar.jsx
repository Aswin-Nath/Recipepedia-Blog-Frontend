import { useNavigate } from "react-router-dom";
import "./AuthNavbar.css";
const AuthNavbar = () => {
    const navigate = useNavigate();
    return (
        <div className="containers" style={{ position: "relative" }}>
            <div className="container">
                <div className="content-displayer">
                    <h1 onClick={()=>navigate("/Explore")} className="brand">Recipepedia</h1>
                </div>
            </div>

        </div>
    );
};

export default AuthNavbar;
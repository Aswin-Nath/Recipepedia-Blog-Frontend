import { useNavigate } from "react-router-dom";
import "./ExploreNavbar.css";
const ExploreNavbar = () => {
    const navigate = useNavigate();
    return (
        <div className="containers" style={{ position: "relative" }}>
            <div className="container">
                <div className="content-displayer">
                    <h1 onClick={()=>navigate("/Explore")} className="brand">Recipepedia</h1>
                    <h1 className="nav-link" onClick={() => { navigate("/login") }}>Login</h1>
                </div>
            </div>

        </div>
    );
};

export default ExploreNavbar;
import { useLocation,useNavigate } from "react-router-dom";
import { useState,useEffect } from "react";
import "./IndividualBlogDisplayer.css";
import Navbar from "../Navbar/Navbar";
import Comment from "../Comment/Comment";
import axios from "axios";

const IndividualBlogDisplayer = () => {
  const { state } = useLocation();
  const { blog } = state; 


  const [loaded,setloaded]=useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  const toggleBookmark = () => {
    setBookmarked(!bookmarked);
  };

  const {
    blog_id,
    title,
    content,
    categories,
    ingredients,
    likes,
    createdat,
    user_id,
    difficulty
  } = blog;

    const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this recipe?")) {
      return;
    }

    setIsDeleting(true);
    try {
      await axios.delete(`http://127.0.0.1:5000/api/blogs/${blog_id}`);
      navigate('/'); // Redirect to home page after deletion
    } catch (error) {
      console.error("Error deleting blog:", error);
      alert("Failed to delete recipe. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };


  useEffect(()=>{
     const InitialCheck= async()=>{
      const data={
        user_id,blog_id
      }
      const API="http://127.0.0.1:5000/api/bookmark-checker";
      try{
        const response=await axios.get(API,{params:data})
        setloaded(true);
        setBookmarked(response.data.message);
      }
      catch(error){
        console.log("Error occured",error.message);
      }
     };
     InitialCheck();
  },[])

  useEffect(()=>{
    if(!loaded){
      return;
    }
    const updateBookMark=async ()=>{
      const data={
        "user_id":user_id,
        "blog_id":blog_id,
        "condition":bookmarked
      }
      const API="http://127.0.0.1:5000/api/add/bookmark";
      try{
      await axios.post(API,data,{headers:{"Content-Type":"application/json"}})
      }
      catch(error){
        console.log("Error occured",error.message);
      }
    }
    updateBookMark();
  },[bookmarked])
  const difficultyLevel = difficulty;

  return (
    <div>
      <Navbar />
      <div className="full-blog-container">
        <div className="full-blog-card">
          <div className="blog-header">
            <h1 className="blog-title-caps">{title.toUpperCase()}</h1>
            <div className="blog-header-right" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span className="blog-date">
                {new Date(createdat).toLocaleDateString()}
              </span>
              <span className="heart-icon">❤️ {likes}</span>
              <span className="difficulty-level">{difficultyLevel}</span>

              <span
                onClick={toggleBookmark}
                role="button"
                title={bookmarked ? "Bookmarked" : "Add to Bookmarks"}
                aria-label={bookmarked ? "Remove bookmark" : "Add bookmark"}
                style={{
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  backgroundColor: bookmarked ? "gold" : "white",
                  transition: "all 0.3s ease",
                  border: bookmarked ? "2px solid black" : "2px solid #aaa",
                  boxShadow: bookmarked ? "0 0 8px rgba(0,0,0,0.6)" : "0 0 3px rgba(0,0,0,0.3)",
                  marginLeft: "8px"
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="22"
                  viewBox="0 0 14 18"
                  fill={bookmarked ? "black" : "black"}
                  stroke={bookmarked ? "black" : "black"}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2 1h10v16l-5-3-5 3V1z" />
                </svg>
              </span>
              
              {user_id === blog.user_id && ( // Only show delete button for blog author
                    <span
                      onClick={handleDelete}
                      role="button"
                      title="Delete Recipe"
                      aria-label="Delete recipe"
                      style={{
                        cursor: isDeleting ? "not-allowed" : "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        backgroundColor: "#ff4444",
                        transition: "all 0.3s ease",
                        border: "2px solid #cc0000",
                        boxShadow: "0 0 3px rgba(0,0,0,0.3)",
                        marginLeft: "8px",
                        opacity: isDeleting ? 0.7 : 1
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M3 6h18" />
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                      </svg>
                    </span>
                  )}
            </div>
          </div>

          {ingredients && ingredients.length > 0 && (
            <div className="ingredients-section">
              <h3>Ingredients:</h3>
              <ul>
                {ingredients.map((ingredient, idx) => (
                  <li key={idx}>{ingredient}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="blog-content">
            <h3>Recipe Instructions</h3>
            <div className="content-box">
              {content.split('\n').map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
          </div>

          <div className="blog-categories">
            <h3>Categories:</h3>
            <div className="categories-tags">
              {categories && categories.length > 0
                ? categories.map((category, idx) => (
                  <span key={idx} className="category-tag">{category}</span>
                ))
                : 'N/A'
              }
            </div>
          </div>

          <Comment blog_id={blog_id} user_id={user_id} />

        </div>
      </div>
    </div>
  );
};

export default IndividualBlogDisplayer;

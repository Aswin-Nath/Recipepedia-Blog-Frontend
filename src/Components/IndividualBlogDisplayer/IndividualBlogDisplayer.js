import { useLocation } from "react-router-dom";
import "./IndividualBlogDisplayer.css";
import Navbar from "../Navbar/Navbar";
import Comment from "../Comment/Comment";
const IndividualBlogDisplayer = () => {
  const { state } = useLocation();
  const { blog } = state;
  


  const {
    blog_id,
    title,
    content,
    categories,
    ingredients,
    likes,
    createdat,
    user_id
  } = blog;

  const difficultyLevel = "Medium";

  
  return (
    <div>
      <Navbar />
      <div className="full-blog-container">
        <div className="full-blog-card">
          <div className="blog-header">
            <h1 className="blog-title-caps">{title.toUpperCase()}</h1>
            <div className="blog-header-right">
              <span className="blog-date">
                {new Date(createdat).toLocaleDateString()}
              </span>
              <span className="heart-icon">❤️ {likes}</span>
              <span className="difficulty-level">{difficultyLevel}</span>
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

          {/* Comments Section */}
          <Comment blog_id={blog_id} user_id={user_id} />

        </div>
      </div>
    </div>
  );
};

export default IndividualBlogDisplayer;

import React from "react";
import { useNavigate } from "react-router-dom";
import "./IndividualHomeBlogDisplayer.css";

const IndividualHomeDisplayer = ({ blog }) => {
  const navigate = useNavigate();
  const { blog_id, title: blog_title, content: blog_content, categories } = blog;
  
  const handleReadMore = () => {
    const slug = blog_title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    navigate(`/blog/${slug}`, { state: { blog } });
  };

  return (
    <div className="blog-container">
      <div className="blog-card">
        <div className="blog-header">
          <h2 className="blog-title">{blog_title}</h2>
          <button onClick={handleReadMore} className="read-more-btn">
            Read More
            <span className="arrow">→</span>
          </button>
        </div>
        
        <div className="blog-content-preview">
          <p>{blog_content.split('\n').slice(0, 10).join('\n')}</p>
        </div>
        
        <div className="blog-footer">
          <div className="blog-categories">
            {categories && categories.length > 0 ? (
              categories.map((category, index) => (
                <span key={index} className="category-tag">
                  {category}
                </span>
              ))
            ) : (
              <span className="category-tag">Uncategorized</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndividualHomeDisplayer;
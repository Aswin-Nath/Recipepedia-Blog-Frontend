import React from "react";
import { useNavigate } from "react-router-dom";
import "./IndividualHomeBlogDisplayer.css";

const IndividualHomeDisplayer = ({ blog }) => {
  const navigate = useNavigate();
  const { blog_id, title: blog_title, content: blog_content, categories } = blog;
  const handleReadMore = () => {
    const slug = blog_title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')  // Replace spaces and symbols with hyphens
      .replace(/(^-|-$)/g, '');     // Trim hyphens from the start/end

    navigate(`/blog/${slug}`, { state: { blog } });
  };

  return (
    <div className="blog-container">
      <button className="read-more-btn" onClick={handleReadMore}>
        Read more
      </button>
      
      <div className="blog-card">
        <h2 className="blog-title">{blog_title}</h2>
        <div className="blog-content-preview">
          <p>{blog_content.split('\n').slice(0, 10).join('\n')}</p>
        </div>
        <div className="blog-categories">
          Categories: {categories && categories.length > 0 ? categories.join(', ') : 'N/A'}
        </div>
      </div>
    </div>
  );
};

export default IndividualHomeDisplayer;
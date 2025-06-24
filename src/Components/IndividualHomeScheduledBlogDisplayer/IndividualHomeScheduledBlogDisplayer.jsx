import { useNavigate } from "react-router-dom";
const IndividualHomeScheduledBlogDisplayer= ({ blog }) => {
  const navigate = useNavigate();
  const { blog_id, title: blog_title, content: blog_content, categories,type } = blog;

  const handleReadMore = () => {
    const slug = blog_title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    console.log("DRAFT ID",blog_id);
    navigate(`/scheduled/${blog_id}`);
  };

  const getContentPreview = (content) => {
    const words = content.split(' ').slice(0, 50); 
    return words.join(' ') + (words.length >= 50 ? '...' : '');
  };
  
  return (
    <div className="blog-container">
      <div className="blog-card">
        <div className="blog-header">
          <h2 className="blog-title">{blog_title}</h2>
          <button onClick={handleReadMore} className="read-more-btn">
            {type=="Publish"?"Read More":"Finish"}
            <span className="arrow">→</span>
          </button>
        </div>
        
        <div className="blog-content-preview">
          <p>{getContentPreview(blog_content)}</p>
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
export default IndividualHomeScheduledBlogDisplayer;
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import IndividualHomeBlogDisplayer from "../../OutsideDisplayer/IndividualHomeBlogDisplayer/IndividualHomeBlogDisplayer";
import "./HomeBlogDisplayer.css";

const HomeBlog = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Extract `q` from /home/search?q=...
  const queryParams = new URLSearchParams(location.search);
  const defaultSearch = queryParams.get("q") || "";

  const [blogs, setBlogs] = useState([]);
  const [searchContent, setContent] = useState(defaultSearch);

  const fetchBlogs = async () => {
    const API = `https://recipepedia-blog-backend.onrender.com/api/get/blogs${
      searchContent.trim() ? `?search=${encodeURIComponent(searchContent)}` : ""
    }`;

    try {
      const response = await axios.get(API);
      setBlogs(response.data.message);
    } catch (error) {
      alert("Error occurred: " + error.message);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [location.search]);

  return (
    <div className="blog_displayer">
      <div className="search-wrapper">
        <div className="search-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              fillRule="evenodd"
              d="M4.092 11.06a6.95 6.95 0 1 1 13.9 0 6.95 6.95 0 0 1-13.9 0m6.95-8.05a8.05 8.05 0 1 0 5.13 14.26l3.75 3.75a.56.56 0 1 0 .79-.79l-3.73-3.73A8.05 8.05 0 0 0 11.042 3z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <input
          value={searchContent}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const encoded = encodeURIComponent(searchContent.trim());
              navigate(encoded ? `/home/search?q=${encoded}` : `/home`);
            }
          }}
          type="text"
          className="search-input"
          placeholder="Search"
        />
      </div>

      {blogs.map((blog) => (
        <IndividualHomeBlogDisplayer key={blog.blog_id} blog={blog} />
      ))}
    </div>
  );
};

export default HomeBlog;

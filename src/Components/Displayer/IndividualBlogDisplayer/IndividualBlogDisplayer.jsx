import { useNavigate, useParams } from "react-router-dom";
import { useState,useEffect,useRef } from "react";
import "./IndividualBlogDisplayer.css";
import Navbar from "../../Navbars/Navbar/Navbar";
import Comment from "../../Comment/Comment";
import axios from "axios";
import { useUser } from "../../Contexts/ContextProvider";
import Avatar from '@mui/material/Avatar'; // Add at the top if not present
import { 
    TextField, 
    Button, 
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Chip,
    CircularProgress,
    Alert,
    LinearProgress,
    Typography,
    IconButton,
    Box,
} from '@mui/material';
const LoadingSpinner = () => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    gap: '1rem'
  }}>
    <div style={{
      width: '50px',
      height: '50px',
      border: '5px solid #f3f3f3',
      borderTop: '5px solid #3498db',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }} />
    <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Loading recipe...</p>
  </div>
);

const IndividualBlogDisplayer = () => {
  const { userId, loading,userName } = useUser();
  const { blog_id } = useParams();
  const [image_urls, setimage_url] = useState([]);
  const [video_url, setvideo_url] = useState("");
  const [blog, setblog] = useState({});
  const [pageloading, setload] = useState(true);

  // Bookmarks
  const [bookmarked, setBookmarked] = useState(false);
  const [bookmarkLoaded, setBookmarkLoaded] = useState(false);
  const bookmarkFirstLoad = useRef(true);

  // Likes
  const [initially_liked, setInitial_liked] = useState(false);
  const [like_status, setlike_status] = useState(0);
  const [isLiking, setIsLiking] = useState(false);
  const [like_count,setlike_count]=useState(0);
  // Report
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');

  // Misc
  const averageWPM = 200;
  const [readTimeInMinutes, setReadtime] = useState(0);

  // Image overlay
  const [selectedImage, setSelectedImage] = useState(null);
  const [overlayActive, setOverlayActive] = useState(false);

  // Delete
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch blog details
  const [mentions,setmentions]=useState([]);
  useEffect(() => {
    const fetchBlog = async () => {
      const API1 = `http://127.0.0.1:5000/api/blogs/${blog_id}`;
      const API2 = `https://recipepedia-blog-backend.onrender.com/api/blogs/${blog_id}`;
      const response = await axios.get(API2);
      setblog(response.data.blog);
      console.log(response.data.blog);
      setmentions(response.data.mentions);
      setReadtime(Math.ceil(response.data.blog.content.split(" ").length / averageWPM));
      setload(false);
    };


    fetchBlog();
  }, [blog_id]);


    // Fetch like status
    useEffect(() => {
      if (loading) return;
      const API = "https://recipepedia-blog-backend.onrender.com/api/get/blogs/like_status";
      const fetchLikeStatus = async () => {
        try {
          const response = await axios.get(API, { params:{userId, blog_id} });
          setInitial_liked(response.data.status==0?false:true);
          setlike_status(response.data.status);
          console.log(like_status,like_count);
        } catch (error) {
          console.log("Error occured while getting like status", error);
        }
      };
      const fetchLikeCount = async () => {
        const API = "https://recipepedia-blog-backend.onrender.com/api/get/blogs/likes_count";
        // const API="http://127.0.0.1:5000/api/get/blogs/likes_count";
        try {
          const response = await axios.get(API, {
            params: {
              user_Id: userId,
              blog_id: blog_id
            }
          });
          const count = response.data.count;
          console.log(count);
          setlike_count(response.data.count); // Assuming you have a useState like: const [likeCount, setLikeCount] = useState(0);
        } catch (error) {
          console.log("Error occurred while fetching like count:", error);
        }
      };
      fetchLikeCount();
      fetchLikeStatus();
    }, [userId, blog_id, loading]);

  // Like handler
  const handleLikeClick = async () => {
    if (isLiking) return;
    setIsLiking(true);
    const prevStatus = like_status;
    const newLikeStatus = prevStatus === 1 ? 0 : 1;
    setlike_status(newLikeStatus); // Optimistic UI

    const data = { userId, blog_id: parseInt(blog_id) };
    try {
      const API1="http://127.0.0.1:5000/api/blogs/likes"
      const API2="https://recipepedia-blog-backend.onrender.com/api/blogs/likes";
        await axios.post(API2, data);
    } catch (error) {
      setlike_status(prevStatus); // rollback
      console.error("Error updating like:", error);
    } finally {
      setIsLiking(false);
    }
  };

  // Bookmarks: Check status on mount/user/blog change
  useEffect(() => {
    if (!userId || !blog_id) return;
    const API = "https://recipepedia-blog-backend.onrender.com/api/bookmark-checker";
    axios
      .get(API, { params: { user_id: userId, blog_id } })
      .then((res) => {
        setBookmarked(res.data.message);
        setBookmarkLoaded(true);
        bookmarkFirstLoad.current = true;
      })
      .catch((err) => {
        setBookmarkLoaded(false);
        console.log("Bookmark check error", err.message);
      });
  }, [userId, blog_id]);

  // Bookmarks: Update backend only on user toggle (not on initial load)
  useEffect(() => {
    if (!bookmarkLoaded) return;
    if (bookmarkFirstLoad.current) {
      bookmarkFirstLoad.current = false;
      return;
    }
    const updateBookMark = async () => {
      const data = {
        user_id: userId,
        blog_id: blog_id,
        condition: bookmarked
      };
      const API = "https://recipepedia-blog-backend.onrender.com/api/add/bookmark";
      try {
        await axios.post(API, data, {
          headers: { "Content-Type": "application/json" }
        });
      } catch (error) {
        setBookmarked((prev) => !prev); // rollback
        alert("Error updating bookmark");
      }
    };
    updateBookMark();
  }, [bookmarked, bookmarkLoaded, userId, blog_id]);

  // Bookmarks: Toggle handler
  const toggleBookmark = () => {
    if (!bookmarkLoaded) return;
    setBookmarked((prev) => !prev);
  };
  
  // Image overlay handlers
  const handleImageClick = (imageUrl, index) => {
    setSelectedImage({ url: imageUrl, index });
    setOverlayActive(true);
  };
  const handleCloseOverlay = () => {
    setSelectedImage(null);
    setOverlayActive(false);
  };
  const handlePrevImage = () => {
    if (selectedImage.index > 0) {
      setSelectedImage({
        url: image_urls[selectedImage.index - 1].image_url,
        index: selectedImage.index - 1
      });
    }
  };
  const handleNextImage = () => {
    if (selectedImage.index < image_urls.length - 1) {
      setSelectedImage({
        url: image_urls[selectedImage.index + 1].image_url,
        index: selectedImage.index + 1
      });
    }
  };

  // Fetch images
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const API = `https://recipepedia-blog-backend.onrender.com/api/get/blogs/images/${blog_id}`;
        const response = await axios.get(API);
        setimage_url(response.data.image_urls);
      } catch (error) {
        console.log("Error occurred", error);
      }
    };
    fetchImages();
  }, [blog_id]);

  // Fetch videos
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const API = `https://recipepedia-blog-backend.onrender.com/api/get/blogs/videos/${blog_id}`;
        const response = await axios.get(API);
        setvideo_url(response.data.video_url);
      } catch (error) {
        console.log("Error occured", error);
      }
    };
    fetchVideos();
  }, [blog_id]);

  // Delete handler
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this recipe?")) {
      return;
    }
    setIsDeleting(true);
    try {
      await axios.delete(`https://recipepedia-blog-backend.onrender.com/api/blogs/${blog_id}`,{data:{userId}});
      navigate('/');
    } catch (error) {
      console.error("Error deleting blog:", error);
      alert("Failed to delete recipe. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Report modal
  const handleReportClick = () => setShowReportModal(true);

  const {
    title,
    content,
    categories,
    ingredients,
    createdat,
    user_id,
    difficulty,
    user_name
  } = blog;

  const difficultyLevel = difficulty;

  if (loading || pageloading) {
    return <LoadingSpinner />;
  }
  
  return (
    <div>
      <Navbar />
      <div className="full-blog-container">
        <div className="full-blog-card">
          <div className="blog-header">
            <h3>Read time {readTimeInMinutes} Minutes</h3>
            <h1 className="blog-title-caps">{title?.toUpperCase()}</h1>
            <div className="blog-header-right" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span className="blog-date" onClick={()=>{ navigate(`/user/${user_id}-${user_name}`)}}>
                Blog by {user_name}
              </span>
              <span className="blog-date">
                {createdat ? new Date(createdat).toLocaleDateString() : ""}
              </span>
              <span
                className="heart-icon"
                onClick={handleLikeClick}
                style={{ cursor: isLiking ? 'not-allowed' : 'pointer', opacity: isLiking ? 0.5 : 1 }}
              >
                {like_status == 1  ? "❤️" : "🤍"} {parseInt(like_count) + parseInt(initially_liked ? 0 : (like_status === 1 ? 1 : 0))}
              </span>
              <span className="difficulty-level">{difficultyLevel}</span>
              <span
                onClick={toggleBookmark}
                role="button"
                title={bookmarked ? "Bookmarked" : "Add to Bookmarks"}
                aria-label={bookmarked ? "Remove bookmark" : "Add bookmark"}
                style={{
                  cursor: bookmarkLoaded ? "pointer" : "not-allowed",
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
              <div className="report-blog">
                <span className="report-icon" onClick={handleReportClick}>
                  <i className="fas fa-flag"></i>
                </span>
              </div>
              {/* Report Modal */}
              {showReportModal && (
                <div className="report-overlay">
                  <div className="report-modal">
                    <h3>Report Content</h3>
                    <textarea
                      value={reportReason}
                      onChange={(e) => setReportReason(e.target.value)}
                      placeholder="Please provide a reason for reporting..."
                    />
                    <div className="modal-actions">
                      <button
                        onClick={async () => {
                          const API = "https://recipepedia-blog-backend.onrender.com/api/post/report-posts";
                          const data = { userId, blog_id, reportReason };
                          try {
                            await axios.post(API, data, { headers: { 'Content-Type': "application/json" } });
                            alert("Reported");
                            setShowReportModal(false);
                            setReportReason('');
                          } catch (error) {
                            alert("Error occured while adding the Report", error.message);
                          }
                        }}
                      >
                        Submit
                      </button>
                      <button
                        onClick={() => {
                          setShowReportModal(false);
                          setReportReason('');
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {!loading && userId === blog.user_id && (
                <div>
                  <span
                    onClick={() => { navigate(`/edit-post/${blog_id}`); }}
                    role="button"
                    title="Edit Recipe"
                    aria-label="Edit recipe"
                    style={{
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      backgroundColor: "#4CAF50",
                      transition: "all 0.3s ease",
                      border: "2px solid #388E3C",
                      boxShadow: "0 0 3px rgba(0,0,0,0.3)",
                      marginLeft: "8px"
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
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </span>
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
                </div>
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
          {image_urls && image_urls.length > 0 && (
            <>
              <div className="recipe-image-gallery">
                <h3>Recipe Photos</h3>
                <div className="image-grid">
                  {image_urls.map((url, index) => (
                    <div
                      key={index}
                      className="image-container"
                      onClick={() => handleImageClick(url.image_url, index)}
                    >
                      <img
                        src={url.image_url}
                        alt={`Recipe step ${index + 1}`}
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className={`overlay ${overlayActive ? 'active' : ''}`}>
                <button className="close-button" onClick={handleCloseOverlay}>
                  ×
                </button>
                {selectedImage && (
                  <>
                    <img
                      src={selectedImage.url}
                      alt="Selected recipe"
                      className="overlay-image"
                    />
                    <div className="overlay-navigation">
                      <button
                        className="nav-button"
                        onClick={handlePrevImage}
                        style={{ visibility: selectedImage.index > 0 ? 'visible' : 'hidden' }}
                      >
                        ←
                      </button>
                      <button
                        className="nav-button"
                        onClick={handleNextImage}
                        style={{
                          visibility: selectedImage.index < image_urls.length - 1
                            ? 'visible'
                            : 'hidden'
                        }}
                      >
                        →
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
          {video_url && video_url.length > 0 && (
            <div className="recipe-video-section">
              <h3>Recipe Video</h3>
              <div className="video-container">
                <video
                  controls
                  className="recipe-video"
                  poster={image_urls.length > 0 ? image_urls[0].image_url : null}
                >
                  <source src={video_url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          )}
          <div className="blog-content">
            <h3>Recipe Instructions</h3>
            <div className="content-box">
              {content?.split('\n').map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
          </div>
          {mentions.length>0 && (
            <div className="mentions-section" style={{ marginTop: 24, marginBottom: 16 }}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>Mentions</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}> 
                  {mentions.map(user => (
                      <Chip
                          key={user.id}
                          avatar={<Avatar src={user.avatar} />}
                          label={user.name}
                          onClick={()=>{ navigate(`/user/${user.id}-${user.name}`)}}
                          sx={{ mb: 1 }}
                      />
                  ))}
              </Box>
          </div>
          )}
            
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
          <Comment blog_id={blog_id} ownerId={user_id} />
        </div>
      </div>
    </div>
  );
};

export default IndividualBlogDisplayer;
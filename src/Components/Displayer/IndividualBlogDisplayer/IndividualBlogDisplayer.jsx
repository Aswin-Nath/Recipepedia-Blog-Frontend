import { useNavigate, useParams } from "react-router-dom";
import { useState,useEffect,useRef } from "react";
import "./IndividualBlogDisplayer.css";
import Navbar from "../../Navbars/Navbar/Navbar";
import Comment from "../../Comment/Comment";
import axios from "axios";
import { useUser } from "../../Contexts/ContextProvider";
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
  const {userId,loading}=useUser();
  const {blog_id}=useParams();
  
  const [image_urls,setimage_url]=useState([]);
  const [video_url,setvideo_url]=useState("");
  const [blog,setblog]=useState({});
  const [loaded,setloaded]=useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [pageloading,setload]=useState(true);
  const [initially_liked,setInitial_liked]=useState(false);
  const [like_status,setlike_status]=useState(0);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');

  const averageWPM = 200;
  const [readTimeInMinutes,setReadtime]=useState(0);
  const handleReportClick = () => {
    setShowReportModal(true);
  };
  useEffect(()=>{
    const fetchBlog=async ()=>{
      const API=`http://127.0.0.1:5000/api/blogs/${blog_id}`;
      const response=await axios.get(API);
      setblog(response.data.blog[0]);
      console.log("BLOG",response.data.blog);
      setReadtime(Math.ceil(response.data.blog[0].content.split(/\s+/).length / averageWPM));
      setload(false);
    }
    fetchBlog();
  },[blog_id])

  useEffect(()=>{
    if(loading){
      return;
    }
    const API="http://127.0.0.1:5000/api/get/blogs/likes";
    const fetchLikeStatus=async ()=>{
      try{
        console.log("DATA", { userId, blog_id: parseInt(blog_id) });
        const response=await axios.post(API,{userId,blog_id});
        const status=response.data.status;
        console.log("STATUS",response.data.status)
        if(status==-1){
          return;
        }
        setInitial_liked(true);
        console.log("LIKE STATUS",status);
        setlike_status(1);
      }
      catch(error){
        console.log("Error occured while getting like status",error);
      }
    }
    fetchLikeStatus();
  },[userId,blog_id])

  
  const [isLiking, setIsLiking] = useState(false);

const handleLikeClick = async () => {
  if (isLiking) return;

  setIsLiking(true);
  const prevStatus = like_status;
  const newLikeStatus = prevStatus === 1 ? 0 : 1;
  setlike_status(newLikeStatus); // Optimistically update UI

  const data = { userId, blog_id: parseInt(blog_id),newLikeStatus};
  try {
    if (initially_liked) {
      // If initially liked, toggle like off or on
      await axios.put("http://127.0.0.1:5000/api/edit/blogs/likes/", data);
    } else {
      await axios.post("http://127.0.0.1:5000/api/add/blogs/likes/", data);
      setInitial_liked(true); // lock in that it's created now
    }
  } catch (error) {
    setlike_status(prevStatus); // rollback to old state
    console.error("Error updating like:", error);
  } finally {
    setIsLiking(false);
  }
};


  const toggleBookmark = () => {
    setBookmarked(!bookmarked);
  };

  const [selectedImage, setSelectedImage] = useState(null);
  const [overlayActive, setOverlayActive] = useState(false);

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
  const {
    title,
    content,
    categories,
    ingredients,
    likes,
    createdat,
    user_id,
    difficulty
  } = blog;

  // console.log("likes",likes);

    const navigate = useNavigate(); 
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this recipe?")) {
      return;
    }

    setIsDeleting(true);
    try {
      await axios.delete(`http://127.0.0.1:5000/api/blogs/${blog_id}`);
      navigate('/');
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
        userId,blog_id
      }
      const API="http://127.0.0.1:5000/api/bookmark-checker";
      try{
        const response=await axios.get(API,{params:data})
        setloaded(true);
        console.log("BOOKMARK",response.data);
        setBookmarked(response.data.message);
      }
      catch(error){
        console.log("Error occured",error.message);
      }
     };
     InitialCheck();
  },[userId,blog_id])


  useEffect(()=>{
    const fetchImages= async ()=>{
      try{
        const API=`http://127.0.0.1:5000/api/get/blogs/images/${blog_id}`;
        const response=await axios.get(API);
        const urls=response.data.image_urls;
        console.log("IMAGE URLS",urls);
        setimage_url(urls);
      }
      catch(error){
        console.log("Error occurred",error);
      }
    }
    fetchImages();
  },[blog_id])

  const toggleMenu=()=>{

  }

  useEffect(()=>{
    const fetchVideos=async ()=>{
      try{
        const API=`http://127.0.0.1:5000/api/get/blogs/videos/${blog_id}`;
        // console.log("VIDEO",blog_id);
        const response=await axios.get(API);

        const urls=response.data.video_url;
        setvideo_url(urls);
      }
      catch(error){
        console.log("Error occured",error);
      }
    }
    fetchVideos();
  },[blog_id]);

const firstLoadRef = useRef(true);

useEffect(() => {
  if (!loaded || firstLoadRef.current) {
    firstLoadRef.current = false;
    return;
  }

  const updateBookMark = async () => {
    const data = {
      user_id: userId,
      blog_id: blog_id,
      condition: bookmarked
    };
    const API = "http://127.0.0.1:5000/api/add/bookmark";
    try {
      await axios.post(API, data, {
        headers: { "Content-Type": "application/json" }
      });
    } catch (error) {
      console.log("Error occurred", error.message);
    }
  };

  updateBookMark();
}, [bookmarked]);



  const difficultyLevel = difficulty;

  if (loading || pageloading) {
      return <LoadingSpinner/>;
}

  return (
    <div>
      <Navbar />

      <div className="full-blog-container">
        <div className="full-blog-card">
          <div className="blog-header">
            <h3>Read time {readTimeInMinutes} Minutes</h3>
            <h1 className="blog-title-caps">{title.toUpperCase()}</h1>
            <div className="blog-header-right" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span className="blog-date">
                {new Date(createdat).toLocaleDateString()}
              </span>
              <span 
                className="heart-icon" 
                onClick={handleLikeClick}
                style={{ cursor: isLiking ? 'not-allowed' : 'pointer', opacity: isLiking ? 0.5 : 1 }}
              >
                {like_status === 1 ? "❤️" : "🤍"} {likes +(initially_liked==true?0:(like_status ==1 ? 1 : 0))} 
              </span>

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
              <div className="report-blog">
                <span className="report-icon" onClick={handleReportClick}>
                  <i className="fas fa-flag"></i> {/* Font Awesome flag icon */}
                </span>
              </div>
                {/* Have to Send user_id,post_id,reason */}
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
                          const API="http://127.0.0.1:5000/api/post/report-posts";
                          const data={
                            userId,blog_id,reportReason,
                          }
                          try{
                            await axios.post(API,data,{headers:{'Content-Type':"application/json"}})
                            alert("Reported");
                            console.log('Report submitted:', reportReason);
                            setShowReportModal(false);
                            setReportReason('');
                          }
                          catch(error){
                            alert("Error occured while adding the Report",error.message);
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
            onClick={() => {navigate(`/edit-post/${blog_id}`);}}
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

    {/* Image Overlay */}
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

{/* After the image gallery section, add: */}
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

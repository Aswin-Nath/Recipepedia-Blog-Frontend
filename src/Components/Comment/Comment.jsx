import axios from "axios";
import React, { useState, useEffect } from "react";
import "./Comment.css";
import { useUser } from "../Contexts/ContextProvider";
import { useNavigate } from "react-router-dom";

const Comments = ({ blog_id, ownerId }) => {
  const navigate=useNavigate();
  const {userId,userName}=useUser();
  const [ParentData, setParentData] = useState([]);
  const [Parent_to_child, setParent_to_child] = useState(new Map());
  const [addcomment, setaddcomment] = useState("");
  const [expandedReplies, setExpandedReplies] = useState(new Set());
  const [showMenu, setShowMenu] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [currentCommentId, setCurrentCommentId] = useState(null);


  const handleReport = (comment_id) => {
    setCurrentCommentId(comment_id); // Store the comment ID being reported
    setShowReportModal(true);
    setShowMenu(false);
  };

  const handleDelete = async (comment_id) => {
    // Add your delete logic here
    const API=`https://recipepedia-blog-backend.onrender.com/api/delete/comments/${comment_id}`;
    // const API=`http://127.0.0.1:5000/api/delete/comments/${comment_id}/${blog_id}`;
    try{
      await axios.delete(API);
    }
    catch(error){
      return alert("Error occured while deleting comment",error);
    }
    setShowMenu(false);
    fetchComments();
  };

  const buildComment = (currentComment) => {
    currentComment.date = currentComment.createdat.slice(0, 10);
    let [hours, minutes] = currentComment.createdat
      .slice(11, 16)
      .split(":")
      .map(Number);

    minutes += 30;
    hours += 5 + Math.floor(minutes / 60);
    minutes = minutes % 60;
    hours = hours % 24;
    currentComment.time = `${String(hours).padStart(2, "0")}:${String(
      minutes
    ).padStart(2, "0")}`;

    delete currentComment.createdat;
    if (currentComment.parent_id === currentComment.comment_id) {
      setParentData((prev) => {
        if (prev.some((c) => c.comment_id === currentComment.comment_id))
          return prev;
        return [currentComment, ...prev];
      });
    } else {
      setParent_to_child((prev) => {
        const newMap = new Map(prev);
        const parent_id = currentComment.parent_id;
        if (!newMap.has(parent_id)) {
          newMap.set(parent_id, []);
        }
        const arr = newMap.get(parent_id);
        if (!arr.some((c) => c.comment_id === currentComment.comment_id)) {
          arr.unshift(currentComment);
        }
        return newMap;
      });
    }
  };

  const DisplayComment = ({
    comment,
    expandedReplies,
    setExpandedReplies,
    handleReport,
  }) => {
    const [showMenu, setShowMenu] = useState(false);
    const CommentContent = comment.content;
    const toggleMenu = () => {
      setShowMenu(!showMenu);
    };
    const likes = comment.likes;
    const child_array = Parent_to_child.get(comment.comment_id);
    const time = comment.time;
    const Date = comment.date;
    const reply_count = child_array ? child_array.length : 0;
    const [child_addcomment, setchild_addcomment] = useState("");
    const [want_to_reply, setwant_to_reply] = useState(false);
    const show_replies = expandedReplies.has(comment.comment_id);
    const comment_id = comment.comment_id;
    const toggleReplies = () => {
      if (show_replies) {
        setExpandedReplies((prev) => {
          const newSet = new Set(prev);
          newSet.delete(comment.comment_id);
          return newSet;
        });
      } else {
        setExpandedReplies((prev) => new Set(prev).add(comment.comment_id));
      }
    };

    return (
      <div className="individual-comments">
        <div className="comment-header">
          <div className="comment-user">
            <div
              className="user-avatar"
              onClick={() => navigate(`/user/${comment.user_id}-${comment.user_name}`)}
            >
              {comment.profile_url ? (
                <img src={comment.profile_url} alt={comment.user_name} />
              ) : (
                comment.user_name?.charAt(0).toUpperCase() || "?"
              )}
            </div>

            <div className="user-info" onClick={() => navigate(`/user/${comment.user_id}-${comment.user_name}`)}>
              <h4>{comment.user_name || "User"}</h4>
              <span className="comment-date">
                Created on {Date} at {time}
              </span>
            </div>
          </div>

          <div className="comment-menu">
            <span className="menu-dots" onClick={toggleMenu}>
              •••
            </span>
            {showMenu && (
              <div className="dropdown-menu">
                <button onClick={()=>{handleDelete(comment_id)}}>Delete</button>
                <button onClick={() => handleReport(comment_id)}>Report</button>
              </div>
            )}
          </div>
        </div>

        <div className="comment-body">
          <p>{CommentContent}</p>
        </div>

        <div className="comment-actions">
          <button className="action-btn">
            <span>❤️</span>
            <span>{likes}</span>
          </button>
          <button
            className="action-btn"
            onClick={() => setwant_to_reply(!want_to_reply)}
          >
            Reply
          </button>
          {reply_count > 0 && (
            <button className="action-btn replies-btn" onClick={toggleReplies}>
              {show_replies ? "Hide replies" : `${reply_count} replies`}
            </button>
          )}
        </div>

        {want_to_reply && (
          <div className="reply-input-wrapper">
            <textarea
              value={child_addcomment}
              onChange={(e) => {
                setchild_addcomment(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = e.target.scrollHeight + "px";
              }}
              className="custom-input-comment"
              placeholder="Write a reply..."
            />
            <div className="comment-buttons">
              <button
                className="cancel-btn"
                onClick={() => {
                  setchild_addcomment("");
                  setwant_to_reply(false);
                }}
              >
                Cancel
              </button>
              <button
                className="respond-btn"
                onClick={() => {
                  AddComment(child_addcomment, comment.comment_id);
                  setchild_addcomment("");
                  setwant_to_reply(false);
                }}
              >
                Reply
              </button>
            </div>
          </div>
        )}

        <div className="nested-replies">
          {reply_count > 0 &&
            show_replies &&
            child_array.map((child_comment) => (
              <DisplayComment
                key={child_comment.comment_id}
                comment={child_comment}
                expandedReplies={expandedReplies}
                setExpandedReplies={setExpandedReplies}
                handleReport={handleReport}
              />
            ))}
        </div>
      </div>
    );
  };

  const AddComment = async (current_addcomment, parent_id) => {
    if (!current_addcomment) {
      return alert("comment should contain at least 3 characters");
    }
    const API1 = "https://recipepedia-blog-backend.onrender.com/api/add/comment";
    const API2 = "http://127.0.0.1:5000/api/add/comment";
    try {
      const result = await axios.post(
        API1,
        {
          blog_id,
          userId,
          content: current_addcomment,
          parent_id,
          ownerId,
          userName
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      const newComment = result.data.comment;
      buildComment(newComment);
      if (parent_id) {
        setExpandedReplies((prev) => new Set(prev).add(parent_id));
      }
      setaddcomment("");
    } catch (error) {
      console.error("Error occurred while adding the comment:", error);
      alert("Failed to add comment. Please try again.");
    }
  };

  const fetchComments = async () => {
    // const API=`http://127.0.0.1:5000/api/get/${blog_id}/comment`;
      const API = `https://recipepedia-blog-backend.onrender.com/api/get/${blog_id}/comment`;
      try {
        const response = await axios.get(API, { params: { blog_id } });
        const commentsData = response.data.message;
        let temParentData = [];
        let temParent_to_child = new Map();

        commentsData.forEach((currentComment) => {
          const parent_id = currentComment.parent_id;
          currentComment.date = currentComment.createdat.slice(0, 10);
          currentComment.time = currentComment.createdat.slice(11, 16);
          delete currentComment.createdat;

          if (currentComment.parent_id === currentComment.comment_id) {
            temParentData.push(currentComment);
          } else {
            if (!temParent_to_child.has(parent_id)) {
              temParent_to_child.set(parent_id, []);
            }
            temParent_to_child.get(parent_id).push(currentComment);
          }
        });

        setParentData(temParentData);
        setParent_to_child(temParent_to_child);
      } catch (error) {
        throw new Error(
          "Error occurred while fetching comments: " + error.message
        );
      }
    };
    
  useEffect(() => {
    const fetchComments = async () => {
      const API1 = `https://recipepedia-blog-backend.onrender.com/api/get/${blog_id}/comment`;
      const API2 = `http://127.0.0.1:5000/api/get/${blog_id}/comment`;

      try {
        const response = await axios.get(API1, { params: { blog_id } });
        const commentsData = response.data.message;
        console.log("Oombey",commentsData);
        let temParentData = [];
        let temParent_to_child = new Map();

        commentsData.forEach((currentComment) => {
          const parent_id = currentComment.parent_id;
          currentComment.date = currentComment.createdat.slice(0, 10);
          currentComment.time = currentComment.createdat.slice(11, 16);
          delete currentComment.createdat;

          if (currentComment.parent_id === currentComment.comment_id) {
            temParentData.push(currentComment);
          } else {
            if (!temParent_to_child.has(parent_id)) {
              temParent_to_child.set(parent_id, []);
            }
            temParent_to_child.get(parent_id).push(currentComment);
          }
        });

        setParentData(temParentData);
        setParent_to_child(temParent_to_child);
      } catch (error) {
        throw new Error(
          "Error occurred while fetching comments: " + error.message
        );
      }
    };
    fetchComments();
  }, [blog_id]);

  return (
    <div>
      <div className="comment-input-wrapper">
        <textarea
          value={addcomment}
          onChange={(e) => {
            setaddcomment(e.target.value);
            e.target.style.height = "auto";
            e.target.style.height = e.target.scrollHeight + "px";
          }}
          className="custom-input-comment"
          placeholder="share your thoughts about the blog"
        />
        <div className="comment-buttons">
          <button className="cancel-btn" onClick={() => setaddcomment("")}>
            Cancel
          </button>
          <button
            className="respond-btn"
            onClick={() => AddComment(addcomment, null)}
          >
            Respond
          </button>
        </div>
      </div>
      {ParentData.map((value) => (
        <DisplayComment
          key={value.comment_id}
          comment={value}
          expandedReplies={expandedReplies}
          setExpandedReplies={setExpandedReplies}
          handleReport={handleReport}
        />
      ))}
      {showReportModal && (
        <div className="report-modal-overlay">
          <div className="report-modal">
            <h3>Report Comment</h3>
            <textarea
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              placeholder="Please provide a reason for reporting..."
            />
            <div className="modal-buttons">
              <button
                onClick={async () => {
                  if (!reportReason) {
                    return alert("Provide the reason to report");
                  }
                  const API =
                    "https://recipepedia-blog-backend.onrender.com/api/post/report-comments";
                  const data = {
                    userId,
                    blog_id,
                    reportReason,
                    comment_id: currentCommentId,
                  };
                  try {
                    await axios.post(API, data, {
                      headers: { "Content-Type": "application/json" },
                    });
                    alert("Reported");
                    setShowReportModal(false);
                    setReportReason("");
                  } catch (error) {
                    alert(
                      "Error occurred while adding the Report: " +
                        error.message
                    );
                  }
                }}
              >
                Submit
              </button>
              <button
                onClick={() => {
                  setShowReportModal(false);
                  setReportReason("");
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Comments;
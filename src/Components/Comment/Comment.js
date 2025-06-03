import axios from "axios";
import React from "react";
import { useState, useEffect } from "react";
import "./Comment.css";

const Comments = ({blog_id, user_id}) => {
  const [ParentData, setParentData] = useState([]);
  const [Parent_to_child, setParent_to_child] = useState(new Map());
  const [addcomment, setaddcomment] = useState("");
  const [expandedReplies, setExpandedReplies] = useState(new Set());

  const buildComment = (currentComment) => {
    currentComment.date = currentComment.createdat.slice(0,10);
    currentComment.time = currentComment.createdat.slice(11,16);
    delete currentComment.createdat;
    
    if (currentComment.parent_id === currentComment.comment_id) {
      setParentData(prev => {
        if (prev.some(c => c.comment_id === currentComment.comment_id)) return prev;
        return [currentComment, ...prev];
      });
    } else {
      setParent_to_child(prev => {
        const newMap = new Map(prev);
        const parent_id = currentComment.parent_id;
        if (!newMap.has(parent_id)) {
          newMap.set(parent_id, []);
        }
        const arr = newMap.get(parent_id);
        if (!arr.some(c => c.comment_id === currentComment.comment_id)) {
          arr.unshift(currentComment);
        }
        return newMap;
      });
    }
  }

  const DisplayComment = ({comment, expandedReplies, setExpandedReplies}) => {
    const CommentContent = comment.content;
    const likes = comment.likes;
    const child_array = Parent_to_child.get(comment.comment_id);
    const time = comment.time;
    const Date = comment.date;
    const reply_count = child_array ? child_array.length : 0;
    const [child_addcomment, setchild_addcomment] = useState("");
    const [want_to_reply, setwant_to_reply] = useState(false);
    const show_replies = expandedReplies.has(comment.comment_id);

    const toggleReplies = () => {
      if (show_replies) {
        setExpandedReplies(prev => {
          const newSet = new Set(prev);
          newSet.delete(comment.comment_id);
          return newSet;
        });
      } else {
        setExpandedReplies(prev => new Set(prev).add(comment.comment_id));
      }
    }

    return (
      <div className="individual-comments">
        <p>{CommentContent}</p>
        <h3>❤️ {likes}</h3>
        <h3 onClick={() => setwant_to_reply(!want_to_reply)}>Reply</h3>
        <p>Created on {Date} at {time}</p>
        <h5 onClick={toggleReplies} style={{display: (reply_count > 0) ? "block" : "none"}}>
          {show_replies ? "hide replies" : `${reply_count} replies`}
        </h5>
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
              placeholder="share your thoughts about the blog"
            />
            <div className="comment-buttons">
              <button className="cancel-btn" onClick={() => setchild_addcomment("")}>Cancel</button>
              <button className="respond-btn" onClick={() => {
                AddComment(child_addcomment, comment.comment_id);
                setchild_addcomment("");
                setwant_to_reply(false);
              }}>Respond</button>
            </div>
          </div>
        )}
        {reply_count > 0 && show_replies && child_array.map((child_comment) => (
          <DisplayComment 
            key={child_comment.comment_id} 
            comment={child_comment}
            expandedReplies={expandedReplies}
            setExpandedReplies={setExpandedReplies}
          />
        ))}
      </div>
    );
  }

  const AddComment = async (current_addcomment, parent_id) => {
    if (!current_addcomment) {
      return alert("comment should contain at least 3 characters");
    }
    const API = "http://127.0.0.1:5000/insert-comment";
    try {
      const result = await axios.post(API, {
        blog_id,
        user_id,
        content: current_addcomment,
        parent_id
      }, {
        headers: { "Content-Type": "application/json" }
      });
      const newComment = result.data.comment;
      buildComment(newComment);
      if (parent_id) {
        setExpandedReplies(prev => new Set(prev).add(parent_id));
      }
      setaddcomment("");
    } catch (error) {
      console.error("Error occurred while adding the comment:", error);
      alert("Failed to add comment. Please try again.");
    }
  }

  useEffect(() => {
    const fetchComments = async () => {
      const API = "http://127.0.0.1:5000/get-comment";
      try {
        const response = await axios.post(API, { blog_id }, { headers: { "Content-Type": "application/json" }});
        const commentsData = response.data.message;
        let temParentData = [];
        let temParent_to_child = new Map();
        
        commentsData.forEach(currentComment => {
          const parent_id = currentComment.parent_id;
          currentComment.date = currentComment.createdat.slice(0,10);
          currentComment.time = currentComment.createdat.slice(11,16);
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
        throw new Error("Error occurred while fetching comments: " + error.message);
      }
    }
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
          <button className="cancel-btn" onClick={() => setaddcomment("")}>Cancel</button>
          <button className="respond-btn" onClick={() => AddComment(addcomment, null)}>Respond</button>
        </div>
      </div>
      {ParentData.map((value) => (
        <DisplayComment 
          key={value.comment_id} 
          comment={value}
          expandedReplies={expandedReplies}
          setExpandedReplies={setExpandedReplies}
        />
      ))}
    </div>
  );
}

export default Comments;
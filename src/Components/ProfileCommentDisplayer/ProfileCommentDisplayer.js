import { useNavigate } from "react-router-dom";
const ProfileComment=({comment})=>{
    const navigate=useNavigate();
    const {
        comment_id,
        blog_id,
        user_id,
        parent_id,
        content,
        createdat,
        likes
    }=comment;
    return (
        <div onClick={()=>{}}>
            {comment_id}
            {content}
            {blog_id}
            {user_id}
            {likes}            
        </div>
    )
}

export default ProfileComment;
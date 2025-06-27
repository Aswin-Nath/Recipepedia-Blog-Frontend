import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Notification.css";
import { useUser } from "../../Contexts/ContextProvider";
import socket from "../../Sockets/SocketConnect";

const Notification = () => {
  const { userId, loading } = useUser();
  const [notifications, setNotifications] = useState([]);
  const [Loading, setLoading] = useState(true);

  // Fetch notifications from local backend
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const [blogRes, commentRes] = await Promise.all([
        axios.get("https://recipepedia-blog-backend.onrender.com/api/notifications/blog", { params: { userId } }),
        axios.get("https://recipepedia-blog-backend.onrender.com/api/notifications/comment", { params: { userId } }),
      ]);
      // Add a type field to each notification for identification
      const blogs = (blogRes.data.notifications || []).map(n => ({ ...n, type: "blog" }));
      const comments = (commentRes.data.notifications || []).map(n => ({ ...n, type: "comment" }));
      // Merge and sort by notification_time descending
      const all = [...blogs, ...comments].sort(
        (a, b) => new Date(b.notification_time) - new Date(a.notification_time)
      );
      setNotifications(all);
    } catch (err) {
      setNotifications([]);
    }
    setLoading(false);
  };

  useEffect(()=>{
    socket.on("connect",()=>{
        console.log("connected the socket",socket.id);
    })
    socket.on("disconnect",()=>{
        console.log("disconnected the socket",socket.id);
    })
    const ReFetch=()=>fetchNotifications();
    socket.on("notify",ReFetch);

    return ()=>{
      socket.off("connected");
      socket.off("disconnect");
      socket.off("notify",ReFetch);
    }
  },[])
  useEffect(() => {
    if (loading || !userId) return;
    fetchNotifications();
  }, [userId, loading]);

  // Mark notification as read
  const markAsRead = async (notification) => {
    try {
      if (notification.type === "blog") {
        await axios.put("https://recipepedia-blog-backend.onrender.com/api/notifications/blog/read", { notificationId: notification.notification_id });
      } else {
        await axios.put("https://recipepedia-blog-backend.onrender.com/api/notifications/comment/read", { notificationId: notification.notification_id });
      }
      setNotifications((prev) =>
        prev.map((n) =>
          n.notification_id === notification.notification_id && n.type === notification.type
            ? { ...n, is_read: true }
            : n
        )
      );
    } catch (err) {
      // handle error if needed
    }
  };

  const renderNotification = (n) => (
    <div
      key={n.type + "-" + n.notification_id}
      className={`notification-item ${n.is_read ? "read" : "unread"}`}
      onClick={() => !n.is_read && markAsRead(n)}
      style={{
        cursor: n.is_read ? "default" : "pointer",
        background: n.is_read ? "#f3f3f3" : "#e0f7fa",
        borderLeft: n.is_read ? "4px solid #bbb" : "4px solid #00796b",
        marginBottom: "10px",
        padding: "12px 18px",
        borderRadius: "6px",
        transition: "background 0.2s",
      }}
    >
      <div style={{ fontWeight: n.is_read ? 400 : 600 }}>
        {n.type === "blog"
          ? `Blog Notification for Blog #${n.blog_id}`
          : `Comment Notification on Blog #${n.blog_id}, Comment #${n.comment_id}`}
      </div>
      <div style={{ fontSize: "0.85em", color: "#666", marginTop: 4 }}>
        {new Date(n.notification_time).toLocaleString()}
      </div>
      {!n.is_read && (
        <span
          style={{
            color: "#fff",
            background: "#00796b",
            borderRadius: "10px",
            padding: "2px 8px",
            fontSize: "0.75em",
            marginLeft: 8,
          }}
        >
          New
        </span>
      )}
    </div>
  );

  return (
    <div style={{ maxWidth: 500, margin: "0 auto", padding: 24 }}>
      <h2 style={{ marginBottom: 18 }}>Notifications</h2>
      {Loading ? (
        <div>Loading...</div>
      ) : notifications.length === 0 ? (
        <div style={{ color: "#888" }}>No notifications.</div>
      ) : (
        notifications.map(renderNotification)
      )}
    </div>
  );
};

export default Notification;
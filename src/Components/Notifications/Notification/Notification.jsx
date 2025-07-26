import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Notification.css";
import { useUser } from "../../Contexts/ContextProvider";
import socket from "../../Sockets/SocketConnect";

const Notification = () => {
  const { userId, loading } = useUser();
  const [notifications, setNotifications] = useState([]);
  const [Loading, setLoading] = useState(true);

  // Fetch all notifications from unified /all API
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const API1="http://127.0.0.1:5000/api/notifications/all";
      const API2="https://recipepedia-blog-backend.onrender.com/api/notifications/all"
      const res = await axios.get(API2, { params: { userId } });
      const all = (res.data.notifications || []).map(n => ({ ...n, type: n.type }));
      all.sort((a, b) => new Date(b.notification_time) - new Date(a.notification_time));
      console.log(all,userId);
      setNotifications(all);
    } catch (err) {
      setNotifications([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected the socket", socket.id);
    });
    socket.on("disconnect", () => {
      console.log("disconnected the socket", socket.id);
    });
    const ReFetch = () => fetchNotifications();
    socket.on("notify", ReFetch);
    
    return () => {
      socket.off("connected");
      socket.off("disconnect");
      socket.off("notify", ReFetch);
    };
  }, []);
  useEffect(() => {
    if (loading || !userId) return;
    fetchNotifications();
  }, [userId, loading]);

  // Mark notification as read using the /read API (works for all types)
  const markAsRead = async (notification) => {
    try {
      await axios.put("https://recipepedia-blog-backend.onrender.com/api/notifications/read", { notificationId: notification.notification_id,userId });
      setNotifications((prev) =>
        prev.map((n) =>
          n.notification_id === notification.notification_id
            ? { ...n, is_read: true }
            : n
        )
      );
    } catch (err) {
      alert("Error occured while marking the notifications");
    }
  };

  // Count unread notifications
  const unreadCount = notifications.filter(n => !n.is_read).length;

const renderNotification = (n) => (
  <div
    key={n.type + "-" + n.notification_id}
    className={`notification-item ${n.is_read ? "read" : "unread"}`}
    onClick={() => !n.is_read && markAsRead(n)}
    style={{
      cursor: n.is_read ? "default" : "pointer",
      background: n.is_read ? "#f3f3f3" : "#e53935",
      borderLeft: n.is_read ? "4px solid #bbb" : "4px solid #e53935",
      marginBottom: "10px",
      padding: "12px 18px",
      borderRadius: "6px",
      transition: "background 0.2s",
      position: "relative"
    }}
  >
    <div style={{ fontWeight: n.is_read ? 400 : 700 }}>
      {n.type === "blog"
        ? `Blog Notification for Blog #${n.blog_id}`
        : n.type === "comment"
        ? `Comment Notification on Blog #${n.blog_id}, Comment #${n.comment_id}`
        : n.type === "follow"
        ? `You were followed by User #${n.follower_id}`
        : n.type === "blog_mention"
        ? `You were mentioned in Blog #${n.blog_id}`
        : "Notification"}
    </div>
    <div style={{ fontSize: "0.85em", color: "#666", marginTop: 4 }}>
      {new Date(n.notification_time).toLocaleString()}
    </div>
    {!n.is_read && (
      <span
        className="new-badge"
        style={{
          background: "#fff",
          color: "#e53935",
          border: "2px solid #e53935",
          borderRadius: "12px",
          padding: "2px 10px",
          fontWeight: 700,
          fontSize: "0.85em",
          position: "absolute",
          top: 10,
          right: 10,
          boxShadow: "0 0 4px #e53935"
        }}
      >
        NEW
      </span>
    )}
  </div>
);


  return (
    <div style={{ maxWidth: 500, margin: "0 auto", padding: 24 }}>
      <h2 style={{ marginBottom: 18, position: "relative", display: "inline-block" }}>
        Notifications
        {unreadCount > 0 && (
          <span
            style={{
              background: "#e53935",
              color: "#fff",
              borderRadius: "50%",
              padding: "4px 10px",
              fontSize: "0.9em",
              fontWeight: 700,
              marginLeft: 10,
              position: "absolute",
              top: "-8px",
              right: "-30px",
              minWidth: 24,
              textAlign: "center",
              boxShadow: "0 0 0 2px #fff"
            }}
            aria-label={`${unreadCount} unread notifications`}
          >
            {unreadCount}
          </span>
        )}
      </h2>
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
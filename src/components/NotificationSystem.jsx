import React, { useEffect, useState } from "react";
import { BellIcon, X } from "lucide-react";
import { io } from "socket.io-client";

const socket = io(process.env.REACT_APP_BACKEND_URL || "http://localhost:5000");

const NotificationSystem = ({ analytics, spotifyStatus }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const notify = [];

    // Campaign Milestone example
    const totalClicks = analytics.reduce((sum, c) => sum + c.clicks, 0);
    if (totalClicks >= 100) {
      notify.push({
        type: "success",
        message: "🎉 Your campaigns reached 100 clicks!",
      });
    }

    // Spotify Connection
    if (spotifyStatus) {
      notify.push({
        type: "info",
        message: "Spotify connected successfully",
      });
    }

    // Tip
    notify.push({
      type: "tip",
      message: "💡 Tip: Create campaigns around trending playlists",
    });

    setNotifications(notify);
  }, [analytics, spotifyStatus]);

  const removeNotification = (index) => {
    setNotifications((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    socket.on("campaignReleased", (data) => {
      // Optionally, show a toast notification:
      toast.success(`Campaign ${data.title} is now live!`);
      // Optionally update local state for real-time analytics
    });
  
    // Cleanup on unmount
    return () => {
      socket.off("campaignReleased");
    };
  }, []);

  return (
    <div className="mt-6 space-y-2">
      {notifications.map((note, index) => (
        <div
          key={index}
          className={`flex items-center justify-between p-3 rounded shadow ${
            note.type === "success"
              ? "bg-green-100 text-green-700"
              : note.type === "info"
              ? "bg-blue-100 text-blue-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          <div className="flex items-center gap-2">
            <BellIcon size={16} />
            <span>{note.message}</span>
          </div>
          <button onClick={() => removeNotification(index)}>
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default NotificationSystem;

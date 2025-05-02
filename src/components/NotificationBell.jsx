import React, { useState, useEffect } from "react";
import { BellIcon } from "lucide-react";

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Dummy notifications (you can later fetch from DB)
    setNotifications([
      "Welcome to Aday Smartlinks!",
      "You created your first campaign 🎉",
      "Spotify connected successfully",
    ]);
  }, []);

  return (
    <div className="relative">
      <button
        className="relative"
        onClick={() => setShow((prev) => !prev)}
      >
        <BellIcon />
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 w-3 h-3 rounded-full"></span>
        )}
      </button>

      {show && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 text-black dark:text-white rounded shadow-lg p-2 z-50">
          <h4 className="text-sm font-bold mb-2">Notifications</h4>
          <ul className="space-y-1 text-sm">
            {notifications.length === 0 ? (
              <li>No new notifications</li>
            ) : (
              notifications.map((note, index) => (
                <li key={index} className="border-b pb-1">
                  {note}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;

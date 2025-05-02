import React, { useEffect, useState } from "react";
import { ClockIcon } from "lucide-react";

const ActivityTimeline = ({ user }) => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    // Dummy data (You will later connect to backend events)
    const dummy = [
      { type: "campaign", message: "You created 'Summer Promo'", time: "2 hours ago" },
      { type: "click", message: "Someone clicked your link", time: "5 hours ago" },
      { type: "email", message: "Email collected: john@example.com", time: "1 day ago" },
      { type: "spotify", message: "Spotify account connected", time: "3 days ago" },
    ];
    setActivities(dummy);
  }, [user]);

  return (
    <div className="mt-6 bg-white dark:bg-gray-800 p-4 rounded shadow">
      <h3 className="text-lg font-bold mb-3">Recent Activity</h3>
      <ul className="space-y-2 text-sm">
        {activities.length === 0 ? (
          <p>No activity yet</p>
        ) : (
          activities.map((act, index) => (
            <li key={index} className="flex items-start gap-2">
              <ClockIcon size={16} className="mt-1 text-blue-500" />
              <div>
                <p>{act.message}</p>
                <span className="text-gray-500 text-xs">{act.time}</span>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default ActivityTimeline;

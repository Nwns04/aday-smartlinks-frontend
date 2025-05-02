import React from "react";

const ActivityFeed = ({ activities }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow mb-4">
      <h3 className="text-lg mb-2">Recent Activity</h3>
      <ul className="space-y-2">
        {activities.length === 0 ? (
          <p>No recent activity yet.</p>
        ) : (
          activities.map((act, index) => (
            <li key={index} className="text-sm text-gray-700 dark:text-gray-300">
              • {act}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default ActivityFeed;

// src/components/analytics/StatusTabs.jsx
import React from "react";

const StatusTabs = ({ current, setStatus }) => (
  <div className="flex border-b mb-6">
    {['all', 'active', 'paused', 'completed'].map(status => (
      <button
        key={status}
        onClick={() => setStatus(status)}
        className={`px-4 py-2 text-sm ${
          current === status
            ? 'border-b-2 border-purple-600 text-purple-600'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </button>
    ))}
  </div>
);

export default StatusTabs;

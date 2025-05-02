// src/components/analytics/MetricCard.jsx
import React from "react";

const MetricCard = ({ title, value, change }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow border">
      <p className="text-sm text-gray-500">{title}</p>
      <h3 className="text-xl font-bold mt-1">{value}</h3>
      {change && (
        <p className="text-xs text-gray-500 mt-2">{change}</p>
      )}
    </div>
  );
};

export default MetricCard;

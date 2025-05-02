// src/components/analytics/InsightCard.jsx
import React from "react";

const InsightCard = ({ title, data, metric1, metric2, emptyMessage }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow border">
      <h4 className="font-medium mb-2">{title}</h4>
      {data?.title ? (
        <>
          <p className="text-lg font-semibold truncate">{data.title}</p>
          <div className="flex justify-between mt-2 text-sm">
            <span>{metric1}</span>
            <span>{metric2}</span>
          </div>
        </>
      ) : (
        <p className="text-gray-500">{emptyMessage}</p>
      )}
    </div>
  );
};

export default InsightCard;

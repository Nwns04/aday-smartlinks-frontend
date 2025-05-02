import React from "react";

const PerformanceMetrics = ({ analytics }) => {
  const totalClicks = analytics.reduce((sum, c) => sum + c.clicks, 0);
  const totalEmails = analytics.reduce((sum, c) => sum + c.emailCount, 0);
  const totalCampaigns = analytics.length;

  const ctr = totalCampaigns ? (totalClicks / totalCampaigns).toFixed(2) : 0;
  const conversionRate = totalClicks
    ? ((totalEmails / totalClicks) * 100).toFixed(1)
    : 0;

  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow text-center">
        <p className="text-sm text-gray-500">Click-Through Rate (CTR)</p>
        <h3 className="text-xl font-bold">{ctr}</h3>
      </div>
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow text-center">
        <p className="text-sm text-gray-500">Conversion Rate</p>
        <h3 className="text-xl font-bold">{conversionRate}%</h3>
      </div>
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow text-center">
        <p className="text-sm text-gray-500">Geo Distribution</p>
        <h3 className="text-md font-semibold text-gray-400">Coming Soon 🌍</h3>
      </div>
    </div>
  );
};

export default PerformanceMetrics;

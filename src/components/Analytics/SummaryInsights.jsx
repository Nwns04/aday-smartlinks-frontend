// src/components/analytics/SummaryInsights.jsx
import React from "react";

const SummaryInsights = ({ campaigns, raw }) => {
  const totalCampaigns = campaigns.length;
  const totalClicks = campaigns.reduce((sum, c) => sum + c.clicks, 0);
  const totalEmails = campaigns.reduce((sum, c) => sum + c.emailCount, 0);
  const activeCampaigns = raw.filter(c => c.status === "active").length;

  return (
    <div className="bg-white p-4 rounded-lg shadow border">
      <h4 className="font-medium mb-2">📊 Performance Summary</h4>
      <div className="space-y-2">
        <p className="text-sm">
          <span className="font-medium">Avg. Clicks:</span> {Math.round(totalClicks / totalCampaigns) || 0} per campaign
        </p>
        <p className="text-sm">
          <span className="font-medium">Avg. Emails:</span> {Math.round(totalEmails / totalCampaigns) || 0} per campaign
        </p>
        <p className="text-sm">
          <span className="font-medium">Active Campaigns:</span> {activeCampaigns}
        </p>
      </div>
    </div>
  );
};

export default SummaryInsights;

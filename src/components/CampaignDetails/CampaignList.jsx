import React from "react";
import { useNavigate } from "react-router-dom";
import CopyShare from "../CopyShare";

const CampaignList = ({ campaigns }) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      {campaigns.map((campaign) => (
        <div
          key={campaign.slug}
          className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border cursor-pointer hover:bg-gray-50"
          onClick={() => navigate(`/analytics/${campaign.slug}`)}
        >
          <div>
            <h4 className="font-semibold">{campaign.title}</h4>

            {/* 🔥 Badges */}
            <div className="flex gap-2 text-xs mt-1">
              {campaign.lowCTR && <span className="text-yellow-600 font-semibold">⚠️ Low CTR</span>}
              {campaign.spike && <span className="text-red-500 font-semibold">🔥 Spike</span>}
              {campaign.inactive && <span className="text-gray-500 font-semibold">💤 Inactive</span>}
            </div>

            <p className="text-sm text-gray-500">Clicks: {campaign.clicks}</p>
            <p className="text-sm text-gray-500">Status: {campaign.status || "Active"}</p>
          </div>

          <div className="flex gap-3 items-center">
            <CopyShare latestLink={`${process.env.REACT_APP_FRONTEND_URL}/link/${campaign.slug}`} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default CampaignList;

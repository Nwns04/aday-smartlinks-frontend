import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const badgeLabels = {
  firstCampaign: "First Campaign Created",
  hundredClicks: "100 Clicks Reached",
  // add other achievement mappings here...
};

const BadgeDisplay = () => {
  const { user } = useContext(AuthContext);

  if (!user?.achievements || user.achievements.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {user.achievements.map((badge, idx) => (
        <span
          key={idx}
          className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium"
        >
          {badgeLabels[badge] || badge}
        </span>
      ))}
    </div>
  );
};

export default BadgeDisplay;

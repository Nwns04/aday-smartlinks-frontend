import React from "react";
import { useNavigate } from "react-router-dom";

const LastEditNotice = ({ lastEdit, campaignId }) => {
  const navigate = useNavigate();

  if (!lastEdit) return null;

  return (
    <div className="text-sm text-gray-600 mb-2 italic">
      Last changed by <strong>{lastEdit.user?.name}</strong>{" "}
      on {new Date(lastEdit.timestamp).toLocaleString()}.
      <button
        onClick={() => navigate(`/audit?campaignId=${campaignId}`)}
        className="underline ml-2"
      >
        View trail
      </button>
    </div>
  );
};

export default LastEditNotice;

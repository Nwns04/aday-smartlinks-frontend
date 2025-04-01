import React from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <h2 className="text-2xl mb-4">Welcome to your Dashboard</h2>
      <button
        className="bg-green-500 text-white px-4 py-2 rounded"
        onClick={() =>
          (window.location.href = "http://localhost:5000/auth/spotify")
        }
      >
        Connect Spotify
      </button>
      <br />
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
        onClick={() => navigate("/create")}
      >
        Create Campaign
      </button>
    </div>
  );
};

export default Dashboard;

import React from "react";
import { Plus, BarChart2 } from "lucide-react";

const DashboardHeader = ({ greeting, user, onCreateLink, onAnalyticsClick }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
          {greeting} {user?.name}
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </p>

        {!user?.isVerifiedArtist && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded mt-4">
            <p className="text-sm text-yellow-800 font-medium">
              Want access to deeper insights?{" "}
              <button
                onClick={() =>
                  window.location.href = `${process.env.REACT_APP_BACKEND_URL || "http://localhost:5000"}/auth/spotify?email=${user?.email}`
                }
                className="underline cursor-pointer text-blue-600 focus:outline-none"
              >
                Get verified
              </button>{" "}
              to unlock Fan Funnel, Geo Insights & Top Fans.
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 w-full md:w-auto">
        <button
          onClick={onCreateLink}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={18} />
          Create Link
        </button>
        <button
          onClick={onAnalyticsClick}
          className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-4 py-2 rounded-lg transition-colors"
        >
          <BarChart2 size={18} />
          Analytics
        </button>
      </div>
    </div>
  );
};

export default DashboardHeader;

// src/components/analytics/CampaignsTable.jsx
import React from "react";
import { ArrowDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CampaignsTable = ({ campaigns, sortBy, setSortBy }) => {
  const navigate = useNavigate();

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow border mb-6">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-gray-100">
          <tr>
            {['title', 'clicks', 'emailCount', 'ctr', 'status'].map((column) => (
              <th
                key={column}
                className="px-4 py-3 border cursor-pointer"
                onClick={() => setSortBy(column === 'ctr' ? 'emailCount' : column)}
              >
                <div className="flex items-center">
                  {column === 'title' ? 'Title' :
                    column === 'emailCount' ? 'Emails' :
                    column === 'ctr' ? 'CTR (%)' :
                    column.charAt(0).toUpperCase() + column.slice(1)}
                  {sortBy === column && <ArrowDown size={14} className="ml-1" />}
                </div>
              </th>
            ))}
            <th className="px-4 py-3 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {campaigns.map((c) => (
            <tr key={c.slug} className="hover:bg-gray-50">
              <td className="border px-4 py-3">{c.title}</td>
              <td className="border px-4 py-3">{c.clicks}</td>
              <td className="border px-4 py-3">{c.emailCount}</td>
              <td className="border px-4 py-3">{c.ctr}%</td>
              <td className="border px-4 py-3">
                <span className={`text-xs px-2 py-1 rounded ${
                  c.status === "paused" ? "bg-yellow-100 text-yellow-800" :
                  c.status === "completed" ? "bg-gray-100 text-gray-800" :
                  "bg-green-100 text-green-800"
                }`}>
                  {c.status || "active"}
                </span>
              </td>
              <td className="border px-4 py-3">
                <button
                  onClick={() => navigate(`/analytics/${c.slug}`)}
                  className="text-sm text-purple-600 hover:underline"
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CampaignsTable;

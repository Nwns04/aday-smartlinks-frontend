import React, { useState } from "react";
import { Copy, Pencil, PauseCircle, PlayCircle } from "lucide-react";

const CampaignTable = ({ campaigns }) => {
  const [sortKey, setSortKey] = useState("title");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const sorted = [...campaigns].sort((a, b) => {
    const valA = a[sortKey];
    const valB = b[sortKey];
    if (typeof valA === "string") {
      return sortOrder === "asc"
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    } else {
      return sortOrder === "asc" ? valA - valB : valB - valA;
    }
  });

  const paginated = sorted.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(campaigns.length / itemsPerPage);

  const handleCopy = (slug) => {
    const url = `${window.location.origin}/link/${slug}`;
    navigator.clipboard.writeText(url);
    alert("Link copied!");
  };

  const toggleStatus = (campaign) => {
    alert(`Toggled status for ${campaign.title} (demo only)`);
    // You can implement actual backend update later
  };

  return (
    <div className="mt-6 bg-white dark:bg-gray-800 p-4 rounded shadow">
      <h3 className="text-lg font-bold mb-3">Campaigns</h3>
      <table className="w-full text-left text-sm">
        <thead>
          <tr>
            <th onClick={() => handleSort("title")} className="cursor-pointer">Title</th>
            <th onClick={() => handleSort("clicks")} className="cursor-pointer">Clicks</th>
            <th onClick={() => handleSort("emailCount")} className="cursor-pointer">Emails</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map((campaign, i) => (
            <tr key={i} className="border-t border-gray-300 dark:border-gray-600">
              <td className="py-2">{campaign.title}</td>
              <td>{campaign.clicks}</td>
              <td>{campaign.emailCount}</td>
              <td>
                <span
                  className={`px-2 py-1 text-xs rounded ${
                    campaign.status === "paused"
                      ? "bg-yellow-500 text-white"
                      : campaign.status === "completed"
                      ? "bg-gray-500 text-white"
                      : "bg-green-500 text-white"
                  }`}
                >
                  {campaign.status || "active"}
                </span>
              </td>
              <td className="flex gap-2 py-2">
                <button onClick={() => handleCopy(campaign.slug)}>
                  <Copy size={16} />
                </button>
                <button onClick={() => alert("Edit functionality (TBD)")}>
                  <Pencil size={16} />
                </button>
                <button onClick={() => toggleStatus(campaign)}>
                  {campaign.status === "paused" ? (
                    <PlayCircle size={16} />
                  ) : (
                    <PauseCircle size={16} />
                  )}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-end mt-4 gap-2">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded ${
              currentPage === i + 1
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CampaignTable;

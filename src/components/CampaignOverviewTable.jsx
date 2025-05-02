import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Copy, ExternalLink } from "lucide-react";
import Tooltip from "../components/Tooltip";

const CampaignOverviewTable = ({ campaigns }) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const campaignsPerPage = 5;
  const [copiedSlug, setCopiedSlug] = useState(null);

  const indexOfLast = currentPage * campaignsPerPage;
  const indexOfFirst = indexOfLast - campaignsPerPage;
  const currentCampaigns = campaigns.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(campaigns.length / campaignsPerPage);

  const handleCopy = (slug) => {
    const url = `${process.env.REACT_APP_FRONTEND_URL}/link/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clicks</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
          {currentCampaigns.map((c) => (
  <tr key={c.slug} className="hover:bg-gray-50 transition-colors">
    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 cursor-pointer" onClick={() => navigate(`/analytics/${c.slug}`)}>
    <div className="flex items-center gap-2">
  <span>{c.title}</span>

  {c.user?.isVerifiedArtist && (
  <Tooltip text="This artist is verified by ADAY for authenticity and deeper analytics access.">
    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium text-blue-700 bg-blue-100 rounded-full cursor-help">
      <svg className="w-3.5 h-3.5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm2.93-10.58a.75.75 0 00-1.06-1.06L9 9.293 8.13 8.42a.75.75 0 10-1.06 1.06l1.5 1.5a.75.75 0 001.06 0l3.3-3.3z" clipRule="evenodd" />
      </svg>
      Verified
    </span>
  </Tooltip>
)}


  {c.spike && <span className="text-red-500 text-xs font-semibold">🔥</span>}
  {c.inactive && <span className="text-gray-400 text-xs font-semibold">💤</span>}
  {c.lowCTR && <span className="text-yellow-500 text-xs font-semibold">⚠️</span>}
</div>

    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{c.clicks}</td>
    <td className="px-6 py-4 whitespace-nowrap">
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(c.status)}`}>
        {c.status}
      </span>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleCopy(c.slug);
        }}
        className="text-gray-400 hover:text-gray-600 transition-colors"
        title="Copy link"
      >
        <Copy className="h-4 w-4" />
        {copiedSlug === c.slug && (
          <span className="ml-1 text-xs text-green-600">Copied!</span>
        )}
      </button>
    </td>
  </tr>
))}

          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
          <div className="flex-1 flex justify-between items-center">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                currentPage === 1 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Previous
            </button>
            <span className="text-sm text-gray-700">
              Page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span>
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignOverviewTable;
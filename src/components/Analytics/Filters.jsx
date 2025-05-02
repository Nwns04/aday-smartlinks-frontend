// src/components/analytics/Filters.jsx
import React from "react";

const Filters = ({ searchTerm, setSearchTerm, timeRange, setTimeRange, sortBy, setSortBy }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
    <input
      type="text"
      placeholder="Search campaigns..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="border rounded px-3 py-2 text-sm w-full"
    />
    <select
      value={timeRange}
      onChange={(e) => setTimeRange(e.target.value)}
      className="border rounded px-3 py-2 text-sm"
    >
      <option value="24h">Last 24h</option>
      <option value="7d">Last 7 days</option>
      <option value="30d">Last 30 days</option>
      <option value="all">All time</option>
    </select>
    <select
      value={sortBy}
      onChange={(e) => setSortBy(e.target.value)}
      className="border rounded px-3 py-2 text-sm"
    >
      <option value="clicks">Sort by Clicks</option>
      <option value="emailCount">Sort by Emails</option>
      <option value="createdAt">Sort by Date</option>
    </select>
  </div>
);

export default Filters;

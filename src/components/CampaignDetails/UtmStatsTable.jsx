import React, { useEffect, useState } from "react";
import axios from "axios";
import API from "../../services/api"; 
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from "recharts";

const UtmStatsTable = ({ slug }) => {
  const [utmStats, setUtmStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  const fetchStats = async () => {
    try {
      setLoading(true);
      const params = {};
      if (dateRange.start) params.start = dateRange.start;
      if (dateRange.end) params.end = dateRange.end;

      const res = await API.get(`/campaigns/${slug}/utm-stats`, { params });
      setUtmStats(res.data);
    } catch (err) {
      console.error("Failed to fetch UTM stats", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStats(); }, [slug, dateRange]); 

  const renderTable = (title, data) => (
    <div className="mt-6">
      <h4 className="text-md font-semibold mb-2">{title}</h4>
      <table className="w-full border border-gray-200 rounded">
        <thead className="bg-gray-50">
          <tr>
            <th className="text-left px-4 py-2">Label</th>
            <th className="text-left px-4 py-2">Clicks</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d, i) => (
            <tr key={i} className="border-t border-gray-100">
              <td className="px-4 py-2">{d.label}</td>
              <td className="px-4 py-2">{d.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="mt-6">
      <h3 className="text-lg font-bold mb-4">UTM Tracking Insights</h3>

      <div className="flex items-center gap-4 mb-6">
        <div>
          <label className="text-sm text-gray-500">Start Date:</label>
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
            className="border px-2 py-1 rounded ml-2"
          />
        </div>
        <div>
          <label className="text-sm text-gray-500">End Date:</label>
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
            className="border px-2 py-1 rounded ml-2"
          />
        </div>
        <button
          onClick={fetchStats}
          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition"
        >
          Apply
        </button>
      </div>

      <div className="w-full h-64">
        <ResponsiveContainer>
          <BarChart data={utmStats?.sources || []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {utmStats && (
        <>
          {renderTable("UTM Sources", utmStats.sources)}
          {renderTable("UTM Campaigns", utmStats.campaigns)}
          {renderTable("UTM Mediums", utmStats.mediums)}
        </>
      )}
    </div>
  );
};

export default UtmStatsTable;

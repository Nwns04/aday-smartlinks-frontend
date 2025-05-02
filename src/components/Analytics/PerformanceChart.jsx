// src/components/analytics/PerformanceChart.jsx
import React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { hasFeature } from "../../utils/subscription";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const PerformanceChart = ({ data }) => {
  const { user } = useContext(AuthContext);

  if (!hasFeature(user, "premium")) {
    return (
      <div className="p-4 bg-yellow-50 text-yellow-800 rounded mb-6">
        Premium only. Upgrade to unlock performance insights.
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow border mb-6">
      <h3 className="font-medium mb-4">Top Campaigns Performance</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="title" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="clicks" fill="#8884d8" name="Clicks" />
            <Bar dataKey="emailCount" fill="#82ca9d" name="Emails" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PerformanceChart;

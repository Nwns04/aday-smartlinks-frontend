import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const LinkAnalytics = ({ clickData }) => {
  if (!clickData || clickData.length === 0) {
    return (
      <div className="bg-white p-4 rounded-lg shadow border text-center">
        <p className="text-gray-500">No click data available yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow border mb-6">
      <h3 className="text-lg font-semibold mb-4">📊 Link Click Timeline</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={clickData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#8884d8" name="Clicks" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LinkAnalytics;

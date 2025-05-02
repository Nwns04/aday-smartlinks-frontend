import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import API from "../services/api";

const EmailTimelineChart = ({ slug }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        const res = await API.get(`/campaigns/timeline/emails/${slug}`);
        setData(res.data);
      } catch (err) {
        console.error("Failed to load email timeline", err);
      }
    };

    if (slug) fetchTimeline();
  }, [slug]);

  if (data.length === 0) {
    return (
      <div className="bg-white p-4 rounded-lg shadow border text-center">
        <p className="text-gray-500">No email signup data yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow border mb-6">
      <h3 className="text-lg font-semibold mb-4">📧 Email Signups Over Time</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#82ca9d" name="Signups" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default EmailTimelineChart;

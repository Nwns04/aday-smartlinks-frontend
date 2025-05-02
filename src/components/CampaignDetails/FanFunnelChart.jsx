import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import API from "../../services/api";

const FanFunnelChart = ({ slug }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`/campaigns/${slug}/funnel`)
      .then((res) => setData(res.data.funnelSteps || []))
      .catch((err) => console.error("Fan Funnel error:", err))
      .finally(() => setLoading(false));
  }, [slug]);

  return (
    <div className="w-full h-64 bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-2">Fan Funnel</h3>
      {loading ? (
        <p className="text-sm text-gray-400">Loading funnel...</p>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="step" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#6366f1" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default FanFunnelChart;

import React, { useEffect, useState } from 'react';
import {
  ResponsiveContainer, LineChart, Line,
  XAxis, YAxis, Tooltip, Legend
} from 'recharts';
import API from '../../services/api';

export default function ForecastChart({ slug, range = 14 }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    let alive = true;
    API.get(`/campaigns/forecast/${slug}`, { params: { range } })
      .then(res => alive && setData(res.data))
      .catch(err => {
           if (err.response?.status === 404) return setData([]);  // silent hide
           console.error("Forecast error:", err);
         });
    return () => { alive = false; };
  }, [slug, range]);
  

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm mb-6">
      <h3 className="text-lg font-semibold mb-4">Forecast vs Actual (last {range} days)</h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={data}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="actual" name="Actual Clicks" />
            <Line type="monotone" dataKey="forecast" name="Forecast" strokeDasharray="5 5" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import API from "../services/api";

const GeoInsights = ({ slug }) => {
  const [geoData, setGeoData] = useState({ topCountries: [], topCities: [], topRegions: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`/campaigns/${slug}/geo`)
      .then((res) => setGeoData(res.data))
      .catch((err) => console.error("Geo Insights error:", err))
      .finally(() => setLoading(false));
  }, [slug]);

  const renderBar = (title, data, color) => (
    <div className="bg-white p-4 rounded-lg shadow border border-gray-200 mb-6">
      <h4 className="font-semibold mb-2">{title}</h4>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="clicks" fill={color} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  if (loading) {
    return <p className="text-sm text-gray-400">Loading Geo Insights...</p>;
  }

  return (
    <div className="space-y-6">
      {renderBar("🌍 Top Countries", geoData.topCountries, "#6366F1")}
      {renderBar("🏙️ Top Cities", geoData.topCities, "#10B981")}
      {renderBar("🗺️ Top Regions", geoData.topRegions, "#F59E0B")}
    </div>
  );
};

export default GeoInsights;

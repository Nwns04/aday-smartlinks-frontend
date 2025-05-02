import React from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { Globe } from "lucide-react";
import GeoHeatmap from "./GeoHeatmap";
import ForecastChart from "./ForecastChart";
import UtmStatsTable from "./UtmStatsTable";

const sectionBlock = (title, children) => (
  <motion.div
    variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
    className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow mb-8"
  >
    <div className="flex justify-between items-center mb-4">
      <h3 className="font-medium text-gray-800 flex items-center gap-2">
        <Globe size={18} className="text-indigo-500" /> {title}
      </h3>
    </div>
    <div className="h-64">{children}</div>
  </motion.div>
);

const GeoAndForecastSection = ({ campaign, user }) => {
  const isPremium = user?.isPremium;
  const slug = campaign.slug;

  return (
    <motion.div
      variants={{ show: { transition: { staggerChildren: 0.1 } } }}
      initial="hidden"
      animate="show"
    >
      {isPremium && (
        <motion.div variants={{ hidden: {}, show: {} }}>
          <GeoHeatmap geoData={campaign.topCities || []} />
        </motion.div>
      )}

      {sectionBlock("Top Cities", isPremium ? (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={campaign.topCities || []}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" stroke="#888" />
            <YAxis stroke="#888" />
            <Tooltip />
            <Bar dataKey="clicks" fill="#10B981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="p-4 bg-yellow-50 text-yellow-800 rounded">Premium only.</div>
      ))}

      {sectionBlock("Top Regions", (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={campaign.topRegions || []}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" stroke="#888" />
            <YAxis stroke="#888" />
            <Tooltip />
            <Bar dataKey="clicks" fill="#F59E0B" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      ))}

      {isPremium && (
        <motion.div variants={{ hidden: {}, show: {} }}>
          <ForecastChart slug={slug} range={14} />
        </motion.div>
      )}

      {isPremium && (
        <motion.div variants={{ hidden: {}, show: {} }} className="mb-8">
          <UtmStatsTable slug={slug} />
        </motion.div>
      )}
    </motion.div>
  );
};

export default GeoAndForecastSection;

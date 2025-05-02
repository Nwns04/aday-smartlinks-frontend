// components/CampaignDetails/MetricCard.jsx
import React from "react";
import { motion } from "framer-motion";

const MetricCard = ({ icon, title, value, change }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all"
  >
    <div className="flex items-center justify-between">
      <div className="p-2.5 rounded-lg bg-indigo-50">{icon}</div>
      <span
        className={`text-xs px-2 py-1 rounded-full ${
          change.startsWith("+")
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800"
        }`}
      >
        {change}
      </span>
    </div>
    <div className="mt-3">
      <p className="text-xs text-gray-500 font-medium">{title}</p>
      <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
    </div>
  </motion.div>
);

export default MetricCard;

// components/CampaignDetails/ChartsSection.jsx
import React from "react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Clock,
  Smartphone,
  FiMusic,
} from "lucide-react";
import { Music }  from "lucide-react"; 
import LinkAnalytics from "./LinkAnalytics";
import EmailTimelineChart from "./EmailTimelineChart";

const COLORS = ["#6366F1", "#10B981", "#F59E0B", "#EF4444"];

const ChartsSection = ({
  timeSeriesData = [],
  clickTimeline = [],
  slug,
  deviceData = [],
  browserData = [],
  platformData = [],
  user,
}) => {
  const chartCard = (title, icon, children) => (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
      className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium text-gray-800 flex items-center gap-2">
          {icon} {title}
        </h3>
      </div>
      <div className="h-64">{children}</div>
    </motion.div>
  );

  const pieChart = (data) => (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={80}
          dataKey="value"
          nameKey="name"
          labelLine={false}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );

  return (
    <motion.div
      variants={{ show: { transition: { staggerChildren: 0.1 } } }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
    >
      {chartCard(
        "Activity Over Time",
        <Clock size={18} className="text-indigo-500" />,
        user?.isPremium ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip />
              <Legend />
              <Bar dataKey="clicks" fill="#6366F1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="emails" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="p-4 bg-yellow-50 text-yellow-800 rounded">
            Upgrade to Premium to view this chart.
          </div>
        )
      )}

      {user?.isPremium && (
        <>
          <motion.div variants={{ show: {}, hidden: {} }}>
            <LinkAnalytics clickData={clickTimeline} />
          </motion.div>
          <motion.div variants={{ show: {}, hidden: {} }}>
            <EmailTimelineChart slug={slug} />
          </motion.div>
        </>
      )}

      {chartCard(
        "Device Breakdown",
        <Smartphone size={18} className="text-indigo-500" />,
        user?.isPremium ? pieChart(deviceData) : (
          <div className="p-4 bg-yellow-50 text-yellow-800 rounded">Premium only.</div>
        )
      )}

      {chartCard(
        "Browser Breakdown",
        <Smartphone size={18} className="text-indigo-500" />,
        user?.isPremium ? pieChart(browserData) : (
          <div className="p-4 bg-yellow-50 text-yellow-800 rounded">Premium only.</div>
        )
      )}

      {chartCard(
        "Platform Breakdown",
        <Music  size={18} className="text-indigo-500" />,
        user?.isPremium ? pieChart(platformData) : (
          <div className="p-4 bg-yellow-50 text-yellow-800 rounded">Premium only.</div>
        )
      )}
    </motion.div>
  );
};

export default ChartsSection;

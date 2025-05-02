// components/CampaignDetails/MetricSection.jsx
import React from "react";
import { MousePointer, Mail, BarChart2, TrendingUp } from "lucide-react";
import MetricCard from "./MetricCard";

const MetricSection = ({ clicks, emails, ctr, conversionRate }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
      <MetricCard
        icon={<MousePointer size={20} className="text-blue-500" />}
        title="Total Clicks"
        value={clicks}
        change="+12%"
      />
      <MetricCard
        icon={<Mail size={20} className="text-green-500" />}
        title="Emails Collected"
        value={emails}
        change="+8%"
      />
      <MetricCard
        icon={<BarChart2 size={20} className="text-indigo-500" />}
        title="CTR"
        value={`${ctr}%`}
        change="+2.5%"
      />
      <MetricCard
        icon={<TrendingUp size={20} className="text-orange-500" />}
        title="Conversion Rate"
        value={`${conversionRate}%`}
        change="+1.8%"
      />
    </div>
  );
};

export default MetricSection;

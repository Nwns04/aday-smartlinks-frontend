import React from "react";

const features = [
  {
    title: "Smartlink Campaigns",
    essential: true,
    premium: true,
  },
  {
    title: "Custom Subdomains",
    essential: false,
    premium: true,
  },
  {
    title: "Analytics Dashboard",
    essential: "Basic",
    premium: "Advanced + Geo Insights",
  },
  {
    title: "Email Collection",
    essential: true,
    premium: true,
  },
  {
    title: "Fan Funnel Tracking",
    essential: false,
    premium: true,
  },
  {
    title: "Spotify Presave + Artist Verification",
    essential: true,
    premium: true,
  },
  {
    title: "Automatic Metadata Detection (UPC)",
    essential: false,
    premium: true,
  },
  {
    title: "Campaign Scheduling & Auto Release",
    essential: false,
    premium: true,
  },
  {
    title: "Export Reports",
    essential: "Limited",
    premium: "Unlimited + CSV/PDF",
  },
  {
    title: "Link Click Alerts",
    essential: false,
    premium: true,
  },
  {
    title: "Priority Support",
    essential: false,
    premium: true,
  },
];

const FeatureComparison = () => {
  return (
    <div className="mt-12 overflow-x-auto">
      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="text-left py-3 px-4 text-lg font-semibold">Features</th>
            <th className="text-center py-3 px-4 font-medium">Essential</th>
            <th className="text-center py-3 px-4 font-medium">Premium</th>
          </tr>
        </thead>
        <tbody>
          {features.map((item, idx) => (
            <tr key={idx} className="border-b">
              <td className="py-3 px-4">{item.title}</td>
              <td className="text-center py-3 px-4">
                {item.essential === true ? "✅" : item.essential || "❌"}
              </td>
              <td className="text-center py-3 px-4">
                {item.premium === true ? "✅" : item.premium || "❌"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FeatureComparison;

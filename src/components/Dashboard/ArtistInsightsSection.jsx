import React from "react";
import { Sparkles } from "lucide-react";
import SectionCard from "../common/SectionCard";
import FanFunnelChart from "../FanFunnelChart";

const ArtistInsightsSection = ({ user, analytics }) => {
  if (!user?.isVerifiedArtist) return null;

  return (
    <SectionCard
      title="Artist Insights"
      icon={<Sparkles size={18} />}
      isExpanded={true}
      onToggle={() => {}}
      badge="Verified Only"
    >
      <div className="space-y-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <h4 className="font-semibold mb-2">🎯 Fan Funnel</h4>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            See how fans engage step-by-step — from link clicks to email submissions and presaves.
          </p>
          {analytics.length > 0 ? (
            <FanFunnelChart slug={analytics[0].slug} />
          ) : (
            <p className="text-sm text-gray-400 italic">No campaigns found to display funnel data.</p>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <h4 className="font-semibold mb-2">🌍 Geo Insights</h4>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Know where your fans are coming from — top countries, cities, and regions.
          </p>
          {/* GeoChart component will go here */}
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <h4 className="font-semibold mb-2">🔥 Top Fans</h4>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Discover your most engaged fans based on actions and referral influence.
          </p>
          {/* TopFansTable will go here */}
        </div>
      </div>
    </SectionCard>
  );
};

export default ArtistInsightsSection;

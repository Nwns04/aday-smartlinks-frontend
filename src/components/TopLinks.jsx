import React from "react";
import { TrendingUp, Link as LinkIcon } from "lucide-react";

const TopLinks = ({ campaigns }) => {
  const topLinks = [...campaigns]
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 3);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
          <TrendingUp className="h-5 w-5 text-blue-500 mr-2" />
          Top Performing Links
        </h3>
      </div>
      
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {topLinks.map((campaign, index) => (
          <div key={campaign.slug} className="px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center min-w-0">
                <LinkIcon className="flex-shrink-0 h-4 w-4 text-gray-400 mr-3" />
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {campaign.title}
                </p>
              </div>
              <div className="ml-2 flex-shrink-0 flex">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {campaign.clicks} clicks
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {topLinks.length === 0 && (
        <div className="px-5 py-4 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No campaign data available
          </p>
        </div>
      )}
    </div>
  );
};

export default TopLinks;
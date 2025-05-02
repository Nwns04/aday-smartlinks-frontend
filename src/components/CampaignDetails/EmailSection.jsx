import React from "react";
import { motion } from "framer-motion";
import { Download } from "lucide-react";
import CampaignNotes from "./CampaignNotes";

const EmailSection = ({ campaign, emailCount, handleExport }) => {
  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
      initial="hidden"
      animate="show"
      className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium text-gray-800">
          Collected Emails ({emailCount})
        </h3>
        {emailCount > 0 && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleExport("emails")}
            className="text-sm flex items-center text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            <Download size={16} className="mr-1" /> Export List
          </motion.button>
        )}
      </div>

      {emailCount === 0 ? (
        <p className="text-sm text-gray-500 py-4">
          No emails collected yet.
        </p>
      ) : (
        <div className="max-h-96 overflow-y-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Collected</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(campaign.emails || []).map((emailObj, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{emailObj.email}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {new Date(emailObj.collectedAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {campaign && <CampaignNotes campaignId={campaign._id} />}
    </motion.div>
  );
};

export default EmailSection;

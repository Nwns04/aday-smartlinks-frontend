import React from "react";
import { motion } from "framer-motion";
import { Download, Lock, Rocket, Sheet, BarChart, Mail } from "lucide-react";
import DownloadPressKitButton from "./DownloadPressKitButton";
import PressKitEditor from "./PressKitEditor";

const PremiumActions = ({ user, campaign, handleExport, handleSendBlast, sendingBlast }) => {
  if (!user?.isPremium) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-400 p-4 rounded-lg"
      >
        <div className="flex items-start gap-3">
          <Lock className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-blue-800 mb-1">Premium Features Locked</h4>
            <p className="text-sm text-blue-700">
              Upgrade to unlock advanced export options, email blasts, and press kit tools.
            </p>
            <button
              onClick={() => (window.location.href = "/pricing")}
              className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors inline-flex items-center gap-1"
            >
              Upgrade to Premium
              <Rocket className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Email Actions Section */}
      <div className="space-y-4 w-full">
        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider flex items-center gap-2">
          <Mail className="w-4 h-4 text-gray-500 flex-shrink-0" />
          Email Tools
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleExport("emails")}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg hover:border-indigo-200 hover:bg-indigo-50 transition-colors w-full"
          >
            <Download className="w-5 h-5 text-indigo-600 flex-shrink-0" />
            <span className="text-sm font-medium text-left flex-grow">Export Email List</span>
          </motion.button>

          <motion.button
            whileHover={sendingBlast ? {} : { y: -2 }}
            whileTap={sendingBlast ? {} : { scale: 0.98 }}
            onClick={handleSendBlast}
            disabled={sendingBlast}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-colors w-full ${
              sendingBlast
                ? "bg-gray-100 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            {sendingBlast ? (
              <>
                <svg
                  className="animate-spin w-5 h-5 text-gray-600 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    className="opacity-25"
                  />
                  <path
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    className="opacity-75"
                  />
                </svg>
                <span className="text-sm font-medium flex-grow">Sending Campaign...</span>
              </>
            ) : (
              <>
                <Mail className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-medium flex-grow">Send Email Blast</span>
              </>
            )}
          </motion.button>
        </div>
      </div>

      {/* Analytics Section */}
      <div className="space-y-4 w-full">
        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider flex items-center gap-2">
          <BarChart className="w-4 h-4 text-gray-500 flex-shrink-0" />
          Data Export
        </h3>
        <motion.button
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleExport("analytics")}
          className="w-full flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg hover:border-indigo-200 hover:bg-indigo-50 transition-colors"
        >
          <Download className="w-5 h-5 text-indigo-600 flex-shrink-0" />
          <span className="text-sm font-medium text-left flex-grow">Export Analytics Data</span>
        </motion.button>
      </div>

      {/* Press Kit Section - Now with full width */}
      <div className="space-y-4 w-full">
        {/* <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider flex items-center gap-2">
          <Sheet className="w-4 h-4 text-gray-500 flex-shrink-0" />
          Press Kit Tools
        </h3> */}
        <div className="space-y-4 w-full">
          <DownloadPressKitButton campaign={campaign} />
          <div className="w-full">
            <PressKitEditor campaign={campaign} className="w-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumActions;
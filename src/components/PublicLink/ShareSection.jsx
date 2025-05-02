import React, { useState, useContext } from 'react';
import { FiLink, FiCopy, FiCheckCircle, FiExternalLink } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { AuthContext } from '../../context/AuthContext';
import { getPlatformName } from '../../utils/platformHelpers';

export default function ShareLinks({ slug, smartLinks, campaignType }) {
  const { user } = useContext(AuthContext);
  const [copied, setCopied] = useState(false);

  const landingUrl = `${window.location.origin}/${slug}`;

  const copy = text => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!user) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="mt-6 bg-white/80 backdrop-blur-md max-w-md mx-auto rounded-2xl shadow-2xl p-6 border border-white/30"
    >
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center justify-center">
        <FiLink className="mr-2 text-indigo-500" />
        Share this {campaignType === 'presave' ? 'Pre-Save' : 'SmartLink'}
      </h3>

      {/* Landing URL */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Landing Page URL
        </label>
        <div className="flex">
          <input
            readOnly
            value={landingUrl}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md text-sm bg-gray-50/90 truncate"
          />
          <button
            onClick={() => copy(landingUrl)}
            className={`bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-r-md text-sm flex items-center ${
              copied ? 'bg-green-500 hover:bg-green-600' : ''
            }`}
          >
            {copied ? (
              <>
                <FiCheckCircle className="mr-1" /> Copied!
              </>
            ) : (
              <>
                <FiCopy className="mr-1" /> Copy
              </>
            )}
          </button>
        </div>
      </div>

      {/* Direct Platform Links (presave only) */}
      {campaignType === 'presave' && smartLinks && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Platform Direct Links
          </label>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(smartLinks)
              .filter(([, url]) => url)
              .map(([platform, url]) => (
                <button
                  key={platform}
                  onClick={() => copy(url)}
                  className="flex items-center justify-between bg-gray-100/90 hover:bg-gray-200 text-gray-800 px-3 py-2 rounded text-xs transition-all"
                >
                  <span className="truncate mr-2">
                    {getPlatformName(platform)}
                  </span>
                  <FiExternalLink className="flex-shrink-0" />
                </button>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

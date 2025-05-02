import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { FiLink, FiCopy, FiCheckCircle } from 'react-icons/fi';
import { AuthContext } from '../../context/AuthContext';

export default function ShareSectionBio({ slug }) {
  const { user } = useContext(AuthContext);
  const [copied, setCopied] = useState(false);

  const profileUrl = `${window.location.origin}/link/${slug}`;

  const copy = text => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!user) return null;

  return (
    <motion.div
      className="mt-6 bg-white/90 backdrop-blur-sm max-w-md mx-auto rounded-lg shadow-xl p-6 border border-white/20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center justify-center">
        <FiLink className="mr-2 text-indigo-500" />
        Share This Profile
      </h3>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Profile URL
        </label>
        <div className="flex">
          <input
            type="text"
            readOnly
            value={profileUrl}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md text-sm bg-gray-50/90 truncate"
          />
          <button
            onClick={() => copy(profileUrl)}
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
    </motion.div>
  );
}

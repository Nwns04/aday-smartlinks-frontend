// src/components/PlatformButton.jsx
import React from 'react';
import { motion } from 'framer-motion';
import {
  getPlatformIcon,
  getPlatformColor,
  getPlatformName
} from '../../utils/platformHelpers';

const PlatformButton = ({ platform, url, onClick, disabled }) => {
  return (
    <motion.button
      onClick={() => onClick(url, platform)}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      disabled={disabled}
      className={`
        ${getPlatformColor(platform)} 
        text-white px-4 py-3 rounded-lg w-full flex items-center justify-center
        transition-all shadow-md hover:shadow-lg
        disabled:opacity-50 disabled:cursor-not-allowed
      `}
    >
      {getPlatformIcon(platform)}
      <span className="font-medium">
        {getPlatformName(platform)}
      </span>
    </motion.button>
  );
};

export default PlatformButton;

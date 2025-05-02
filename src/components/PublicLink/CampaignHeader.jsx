// src/components/PublicLink/CampaignHeader.jsx
import React from 'react';
import { motion } from 'framer-motion';
import CountdownTimer from '../CountdownTimer';  // adjust path if needed
import { FiExternalLink } from 'react-icons/fi';

export default function CampaignHeader({
  artwork,
  title,
  artist,
  isReleased,
  releaseDate,
  type,     // 'presave' | 'smartlink'
}) {
  const releaseDateFormatted = new Date(releaseDate).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <div className="flex flex-col items-center mb-6 space-y-4">
      <motion.div whileHover={{ scale: 1.03 }} className="relative group">
        <img
          src={artwork}
          alt={`${title} artwork`}
          className="w-48 h-48 rounded-xl shadow-2xl object-cover border-4 border-white/60"
        />
        <div className="absolute inset-0 bg-black/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <FiExternalLink className="text-white text-2xl" />
        </div>
      </motion.div>

      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
        {artist && <p className="text-gray-600 text-lg">{artist}</p>}
      </div>

      {type === 'presave' && !isReleased && (
        <div className="text-center">
          <CountdownTimer endTime={releaseDate} />
          <p className="text-sm text-gray-500 mt-2">
            Releases on {releaseDateFormatted}
          </p>
        </div>
      )}
    </div>
  );
}

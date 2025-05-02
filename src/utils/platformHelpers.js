// src/utils/platformHelpers.js
import React from 'react';
import { FaSpotify, FaApple, FaYoutube, FaInstagram, FaTwitter, FaTiktok, FaFacebook, FaDeezer, FaSoundcloud } from 'react-icons/fa';
import { SiAudiomack, SiTidal, SiAmazon } from 'react-icons/si';
import { FiExternalLink } from 'react-icons/fi';

/** Icon for a given platform key. */
export function getPlatformIcon(platform) {
  switch (platform.toLowerCase()) {
    case 'spotify':     return <FaSpotify className="mr-2" />;
    case 'apple':
    case 'applemusic':  return <FaApple className="mr-2" />;
    case 'youtube':     return <FaYoutube className="mr-2" />;
    case 'instagram':   return <FaInstagram className="mr-2" />;
    case 'twitter':     return <FaTwitter className="mr-2" />;
    case 'tiktok':      return <FaTiktok className="mr-2" />;
    case 'facebook':    return <FaFacebook className="mr-2" />;
    case 'boomplay':    return <FiExternalLink className="mr-2" />;
    case 'audiomack':   return <SiAudiomack className="mr-2" />;
    case 'deezer':      return <FaDeezer className="mr-2" />;
    case 'soundcloud':  return <FaSoundcloud className="mr-2" />;
    case 'tidal':       return <SiTidal className="mr-2" />;
    case 'amazon':
    case 'amazonmusic': return <SiAmazon className="mr-2" />;
    default:            return <FiExternalLink className="mr-2" />;
  }
}

/** Background color classes for buttons. */
export function getPlatformColor(platform) {
  switch (platform.toLowerCase()) {
    case 'spotify':     return 'bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700';
    case 'apple':
    case 'applemusic':  return 'bg-gradient-to-br from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-600';
    case 'youtube':     return 'bg-red-500 hover:bg-red-600';
    case 'instagram':   return 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600';
    case 'twitter':     return 'bg-blue-400 hover:bg-blue-500';
    case 'tiktok':      return 'bg-black hover:bg-gray-800';
    case 'facebook':    return 'bg-blue-600 hover:bg-blue-700';
    case 'boomplay':    return 'bg-yellow-500 hover:bg-yellow-600';
    case 'audiomack':   return 'bg-orange-500 hover:bg-orange-600';
    case 'deezer':      return 'bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600';
    case 'soundcloud':  return 'bg-orange-500 hover:bg-orange-600';
    case 'tidal':       return 'bg-black hover:bg-gray-900';
    case 'amazon':
    case 'amazonmusic': return 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600';
    default:            return 'bg-indigo-500 hover:bg-indigo-600';
  }
}

/** Human-readable platform name. */
export function getPlatformName(platform) {
  switch (platform.toLowerCase()) {
    case 'spotify':     return 'Spotify';
    case 'apple':
    case 'applemusic':  return 'Apple Music';
    case 'youtube':     return 'YouTube';
    case 'instagram':   return 'Instagram';
    case 'twitter':     return 'Twitter';
    case 'tiktok':      return 'TikTok';
    case 'facebook':    return 'Facebook';
    case 'boomplay':    return 'Boomplay';
    case 'audiomack':   return 'Audiomack';
    case 'deezer':      return 'Deezer';
    case 'soundcloud':  return 'SoundCloud';
    case 'tidal':       return 'Tidal';
    case 'amazon':
    case 'amazonmusic': return 'Amazon Music';
    default:            return platform.charAt(0).toUpperCase() + platform.slice(1);
  }
}

/** Category for filtering links (music, social, other) */
export function getPlatformCategory(platform) {
    switch (platform.toLowerCase()) {
      case 'spotify':
      case 'apple':
      case 'applemusic':
      case 'youtube':
      case 'boomplay':
      case 'audiomack':
      case 'deezer':
      case 'soundcloud':
      case 'tidal':
      case 'amazon':
      case 'amazonmusic':
        return 'music';
      case 'instagram':
      case 'twitter':
      case 'tiktok':
      case 'facebook':
        return 'social';
      default:
        return 'other';
    }
  }
  

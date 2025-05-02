import { FaSpotify, FaApple, FaYoutube, FaInstagram, FaTwitter, FaTiktok, FaLink } from "react-icons/fa";

export const getPlatformIcon = (platform) => {
  switch (platform) {
    case "spotify": return <FaSpotify className="text-green-500" />;
    case "apple": return <FaApple className="text-black" />;
    case "youtube": return <FaYoutube className="text-red-500" />;
    case "instagram": return <FaInstagram className="text-pink-500" />;
    case "twitter": return <FaTwitter className="text-blue-400" />;
    case "tiktok": return <FaTiktok className="text-black" />;
    default: return <FaLink className="text-blue-500" />;
  }
};

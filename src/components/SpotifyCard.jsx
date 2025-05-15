import React, { useState, useEffect } from "react";
import API from "../services/api";
import { toast } from "react-hot-toast";
import { FiMusic, FiUser, FiLink2, FiX } from "react-icons/fi";

const SpotifyCard = ({ user, setSpotifyProfile }) => {
  const [recentTracks, setRecentTracks] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [connectionError, setConnectionError] = useState(null);

  useEffect(() => {
    if (user?.email) {
      fetchSpotifyData();
    }
  }, [user]);

  const fetchSpotifyData = async () => {
    try {
      setLoading(true);
      setConnectionError(null);

      // Get profile
      const profileRes = await API.get(`/auth/spotify/profile/${user.email}`);
      setProfile(profileRes.data);
      setSpotifyProfile(profileRes.data);

      // Get recent tracks
      const [recentRes] = await Promise.allSettled([
        API.get(`/auth/spotify/recent/${user.email}`),
      ]);

      if (recentRes.status === "fulfilled") {
        setRecentTracks(recentRes.value.data.tracks || []);
      } else {
        console.log("Couldn't fetch recent tracks:", recentRes.reason);
      }
    } catch (err) {
      console.error("Error fetching Spotify data:", err);
      setConnectionError("Failed to load Spotify data. Please try reconnecting.");
      if (err.response?.status === 401 || err.response?.status === 403) {
        setProfile(null);
        setSpotifyProfile(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const disconnectSpotify = async () => {
    try {
      setLoading(true);
      await API.post(`/auth/spotify/disconnect/${user.email}`);
      toast.success("Disconnected from Spotify");
      setSpotifyProfile(null);
      setProfile(null);
      setRecentTracks([]);
    } catch (error) {
      toast.error("Failed to disconnect");
    } finally {
      setLoading(false);
    }
  };

  const reconnectSpotify = () => {
    window.location.href = `http://localhost:5000/auth/spotify?email=${encodeURIComponent(user.email)}`;
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("spotify") === "connected") {
      toast.success("Spotify account connected!");
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  return (
    <div
      id="spotify-section"
      className="p-6 rounded-xl mb-8 shadow-md bg-gradient-to-br from-[#1DB954] to-emerald-700 text-white relative overflow-hidden"
    >
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12"></div>

      <div className="relative z-10">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <FiMusic className="text-white" />
          Spotify Connection
        </h3>

        {connectionError && (
          <div className="mb-4 p-3 bg-red-100/20 backdrop-blur-sm text-white rounded-lg text-sm flex items-center justify-between">
            <span>{connectionError}</span>
            <button
              onClick={reconnectSpotify}
              className="ml-2 text-white underline flex items-center gap-1"
            >
              <FiLink2 size={14} />
              Reconnect
            </button>
          </div>
        )}

        {loading && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center rounded-xl z-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        )}

        {profile ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={profile.images?.[0]?.url || "https://via.placeholder.com/50"}
                    alt="Spotify"
                    className="w-12 h-12 rounded-full object-cover border-2 border-white"
                  />
                  {user?.isVerifiedArtist && (
                    <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-black text-xs px-1 rounded-full">
                      ✓
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-semibold flex items-center gap-2">
                    {profile.display_name}
                  </p>
                  <p className="text-xs opacity-80 flex items-center gap-1">
                    <FiUser size={12} />
                    {profile.followers?.total?.toLocaleString() || "0"} followers
                  </p>
                </div>
              </div>
              <button
                onClick={disconnectSpotify}
                className="bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1 transition-colors"
                disabled={loading}
              >
                <FiX size={14} />
                Disconnect
              </button>
            </div>

            {recentTracks.length > 0 && (
              <div className="bg-black/10 p-3 rounded-lg">
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                  <FiMusic size={14} />
                  Recently Played
                </h4>
                <ul className="space-y-2">
                  {recentTracks.slice(0, 5).map((track, index) => (
                    <li 
                      key={index} 
                      className="flex items-center gap-2 p-2 hover:bg-white/5 rounded transition-colors"
                    >
                      <img 
                        src={track.album?.images?.[2]?.url || "https://via.placeholder.com/40"} 
                        className="w-8 h-8 rounded" 
                        alt="Album cover" 
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{track.name}</p>
                        <p className="text-xs opacity-80 truncate">
                          {track.artists.map((a) => a.name).join(", ")}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-4">
            <div className="bg-white/10 p-6 rounded-lg">
              <FiMusic size={32} className="mx-auto mb-3 text-white/50" />
              <p className="text-sm opacity-80 mb-4">Connect your Spotify account to see your profile and recent activity</p>
              <button
                onClick={reconnectSpotify}
                className="bg-white text-green-600 hover:bg-gray-100 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 mx-auto transition-colors"
              >
                <FiLink2 size={16} />
                Connect Spotify
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpotifyCard;
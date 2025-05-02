import React, { useState, useEffect } from "react";
import API from "../services/api";
import { toast } from "react-hot-toast";

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
      // Clean the URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);
  

  return (
    <div
      id="spotify-section"
      className="p-6 rounded-xl mb-8 shadow-md bg-gradient-to-r from-[#1DB954] to-emerald-600 text-white"
    >
      {/* <h3 className="text-lg font-bold mb-4">Spotify Account</h3> */}

      {connectionError && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded text-sm">
          {connectionError}
          <button
            onClick={reconnectSpotify}
            className="ml-2 text-red-700 underline"
          >
            Reconnect
          </button>
        </div>
      )}
      {user?.isVerifiedArtist && (
  <p className="text-xs mt-1 text-yellow-300">
    ✅ Verified Spotify Artist
  </p>
)}

      {profile ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src={profile.images?.[0]?.url || "https://via.placeholder.com/50"}
                alt="Spotify"
                className="w-12 h-12 rounded-full"
              />
              <div>
              <p className="font-medium" title={profile.display_name}>
  {profile.display_name}
</p>
<p className="font-medium flex items-center gap-2" title={profile.display_name}>
  {profile.display_name}
  {user?.isVerifiedArtist && (
    <span className="bg-yellow-300 text-black text-xs px-2 py-0.5 rounded-full">
      Verified Artist
    </span>
  )}
</p>
                <p className="font-medium">{profile.display_name}</p>
                {/* <p className="text-xs opacity-80">
                  {profile.email || "No email provided"}
                </p> */}
              </div>
            </div>
            <button
              onClick={disconnectSpotify}
              className="bg-white text-green-600 px-3 py-1 rounded text-sm"
              disabled={loading}
            >
              {loading ? "Disconnecting..." : "Disconnect"}
            </button>
          </div>

          {recentTracks.length > 0 && (
            <div>
              <h4 className="font-semibold text-sm">Recently Played</h4>
              <ul className="text-xs mt-2 space-y-1">
                {recentTracks.slice(0, 5).map((track, index) => (
                  <li key={index} className="border-b border-white/30 py-1">
                    {track.name} - {track.artists.map((a) => a.name).join(", ")}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-4">
          <p className="text-sm opacity-80 mb-3">Spotify account not connected</p>
          <button
            onClick={reconnectSpotify}
            className="bg-white text-green-600 px-4 py-2 rounded text-sm"
          >
            Connect Spotify
          </button>
        </div>
      )}
    </div>
  );
};

export default SpotifyCard;

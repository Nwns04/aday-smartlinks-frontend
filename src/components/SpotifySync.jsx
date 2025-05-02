import React, { useState } from "react";
import API from "../services/api";
import toast from "react-hot-toast";

const SpotifySync = ({ user, setSpotifyProfile }) => {
  const [loading, setLoading] = useState(false);

  const handleSync = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/auth/spotify/profile/${user.email}`);
      setSpotifyProfile(res.data);
      toast.success("Spotify profile synced!");
    } catch (error) {
      toast.error("Failed to sync Spotify data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSync}
      className="bg-purple-600 text-white px-3 py-2 rounded mt-2"
      disabled={loading}
    >
      {loading ? "Syncing..." : "Sync Spotify Stats"}
    </button>
  );
};

export default SpotifySync;

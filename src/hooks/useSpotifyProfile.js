import { useEffect, useState } from "react";
import API from "../services/api";
import { toast } from "react-hot-toast";

const useSpotifyProfile = (user, setUser) => {
  const [spotifyStatus, setSpotifyStatus] = useState(false);
  const [spotifyProfile, setSpotifyProfile] = useState(null);

  const updateSpotifyUser = async () => {
    try {
      const res = await API.get(`/auth/user/${user.email}`);
      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
      toast.success("Spotify connected!");
    } catch (error) {
      console.error("Error updating user state:", error);
      toast.error("Failed to update account");
    }
  };

  useEffect(() => {
    if (user?.spotifyId) {
      setSpotifyStatus(true);
    }
  }, [user]);

  return {
    spotifyStatus,
    spotifyProfile,
    setSpotifyProfile,
    updateSpotifyUser,
  };
};

export default useSpotifyProfile;

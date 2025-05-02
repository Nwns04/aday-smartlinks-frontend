import React from "react";
import SpotifyCard from "../SpotifyCard";

const SpotifyConnectPrompt = ({ user, setSpotifyProfile }) => {
  if (!user?.spotifyId) {
    return (
      <div className="mt-6">
        <SpotifyCard user={user} setSpotifyProfile={setSpotifyProfile} />
      </div>
    );
  }

  return null;
};

export default SpotifyConnectPrompt;

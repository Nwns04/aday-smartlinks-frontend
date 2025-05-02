import React, { useEffect, useState } from "react";
import API from "../services/api";
import Leaderboard from "./Leaderboard";

const TopFansWidget = ({ slug }) => {
  const [fans, setFans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`/campaigns/${slug}/top-fans`)
      .then((res) => setFans(res.data.topFans || []))
      .catch((err) => console.error("Top Fans error:", err))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <p className="text-sm text-gray-400">Loading Top Fans...</p>;

  if (fans.length === 0) return <p className="text-sm text-gray-400">No fans found yet.</p>;

  return (
    <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
      <h3 className="text-lg font-semibold mb-3">🔥 Top Fans</h3>
      <Leaderboard />
      <ul className="space-y-2">
        {fans.map((fan) => (
            <li
  key={fan.email}
  className="flex items-start justify-between text-sm text-gray-700"
>
  <div>
    <span className="font-medium">{fan.email}</span>{" "}
    {fan.followed && <span className="ml-1 text-green-500">✓ Followed</span>}
    {fan.referralCount > 0 && (
      <span className="ml-2 text-blue-500">+{fan.referralCount} referrals</span>
    )}
  </div>
  <div className="text-right">
    <span className="text-xs text-gray-400 block">
      Score: <span className="font-semibold">{fan.superfanScore}</span>
    </span>
    <span className="text-xs text-gray-400">
      {new Date(fan.clickedAt).toLocaleDateString()}
    </span>
  </div>
</li>

        ))}
      </ul>
    </div>
  );
};

export default TopFansWidget;

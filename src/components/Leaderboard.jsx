// src/components/Leaderboard.jsx
import React, { useEffect, useState } from 'react';
import API from '../services/api';

export default function Leaderboard({ campaignId }) {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    API.get(`/loyalty/${campaignId}/leaderboard`)
      .then(r => setLeaders(r.data))
      .catch(console.error);
  }, [campaignId]);

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Top Fans</h3>
      <ul className="space-y-2">
        {leaders.map((l, i) => (
          <li key={l._id} className="flex items-center space-x-2">
            <span>#{i + 1} {l.user.name} — {l.points} pts</span>
            {l.badges?.map(badge => (
              <span
                key={badge.name}
                className="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-full"
              >
                {badge.name}
              </span>
            ))}
          </li>
        ))}
      </ul>
    </div>
  );
}

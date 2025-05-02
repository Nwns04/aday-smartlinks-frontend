import React, { useEffect, useState } from "react";
import API from "../../services/api";

const TopFansTable = ({ slug }) => {
  const [fans, setFans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`/campaigns/${slug}/top-fans`)
       .then((res) => setFans(res.data.topFans || []))
      .catch(err => {
        if ([403, 404].includes(err.response?.status)) return; // widget stays empty
        console.error("Top Fans error:", err);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return <p className="text-sm text-gray-400">Loading top fans...</p>;
  }

  if (fans.length === 0) {
    return <p className="text-sm text-gray-500">No top fans yet.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left">Fan</th>
            <th className="px-4 py-2 text-left">Clicks</th>
            <th className="px-4 py-2 text-left">Referrals</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {fans.map((fan, idx) => (
            <tr key={idx} className="hover:bg-gray-50">
              <td className="px-4 py-2 font-medium text-gray-800">{fan.name}</td>
              <td className="px-4 py-2 text-gray-600">{fan.clicks}</td>
              <td className="px-4 py-2 text-gray-600">{fan.referrals}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TopFansTable;

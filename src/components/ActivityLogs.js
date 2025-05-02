import React, { useEffect, useState } from "react";
import API from "../services/api";

const ActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await API.get("/activity-logs"); // Make sure to create this backend endpoint
        setLogs(res.data);
      } catch (error) {
        console.error("Error fetching activity logs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  if (loading) return <p>Loading activity logs...</p>;

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
      {logs.length === 0 ? (
        <p>No recent activity.</p>
      ) : (
        <ul className="space-y-2">
          {logs.map((log, idx) => (
            <li key={idx} className="text-sm">
              {new Date(log.timestamp).toLocaleString()} - {log.action}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ActivityLogs;

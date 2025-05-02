// src/components/AuditLogPanel.jsx
import React, { useContext, useEffect, useState } from "react";
import API from "../services/api";
import { WorkspaceContext } from "../contexts/WorkspaceContext";

export default function AuditLogPanel({ campaignId }) {
  const { current } = useContext(WorkspaceContext);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    if (!current) return;
    API.get(`/audit`, {
      params: { workspace: current._id, campaignId }
    }).then(r => setLogs(r.data));
  }, [current, campaignId]);

  return (
    <div>
      <h3>Audit Trail</h3>
      <ul>
        {logs.map(l => (
          <li key={l._id}>
            <strong>{l.user.name}</strong> {l.action} @ {new Date(l.timestamp).toLocaleString()}
            {l.message && ` — ${l.message}`}
          </li>
        ))}
      </ul>
    </div>
  );
}

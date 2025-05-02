import React, { useContext, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import WorkspaceContext from '../context/WorkspaceContext';

export default function AuditTrail() {
  const { user } = useContext(AuthContext);
  const { current: workspace } = useContext(WorkspaceContext);
  const [logs, setLogs] = useState([]);
  const [params] = useSearchParams();
  const campaignId = params.get('campaignId');

  useEffect(() => {
    if (!user || !workspace) return;
    API.get(`/api/audit?workspace=${workspace._id}` + (campaignId ? `&campaignId=${campaignId}` : ''))
      .then(r => setLogs(r.data))
      .catch(err => {
        console.error(err);
        toast.error('Could not load audit logs');
      });
  }, [user, workspace, campaignId]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Audit Trail</h2>
      {campaignId && <p className="text-sm text-gray-600 mb-2">Filtering by campaign: {campaignId}</p>}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">When</th>
              <th className="px-4 py-2 text-left">Who</th>
              <th className="px-4 py-2 text-left">Action</th>
              <th className="px-4 py-2 text-left">Before → After</th>
              <th className="px-4 py-2 text-left">IP</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <tr key={log._id} className="even:bg-gray-50">
                <td className="px-4 py-2">{new Date(log.timestamp).toLocaleString()}</td>
                <td className="px-4 py-2">{log.user?.name || '—'}</td>
                <td className="px-4 py-2">{log.action}</td>
                <td className="px-4 py-2">
                  <pre className="whitespace-pre-wrap text-xs">
                    {JSON.stringify(log.before, null, 1)} → {JSON.stringify(log.after, null, 1)}
                  </pre>
                </td>
                <td className="px-4 py-2">{log.ip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

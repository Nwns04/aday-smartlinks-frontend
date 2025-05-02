import React, { useState, useEffect } from 'react';
import API from '../services/api';

export default function SegmentPanel({ slug }) {
  const [filters, setFilters] = useState({ device: '', country: '', from: '', to: '' });
  const [data, setData] = useState([]);

  const fetchData = () => {
    const q = new URLSearchParams(filters).toString();
    API.get(`/api/segments/${slug}?${q}`)
       .then(r => setData(r.data.clicks));
  };

  const exportCsv = () => {
    const q = new URLSearchParams(filters).toString();
    window.open(`${process.env.REACT_APP_BACKEND_URL}/api/segments/${slug}/export?${q}`, '_blank');
  };

  useEffect(fetchData, [filters, slug]);

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 mb-8">
      <h3 className="font-medium text-gray-800 mb-4">Advanced Segmentation</h3>
      <div className="grid grid-cols-4 gap-4 mb-4">
        <input type="text" placeholder="Device" value={filters.device}
               onChange={e=>setFilters(f=>({...f,device:e.target.value}))}
               className="border px-2 py-1 rounded" />
        <input type="text" placeholder="Country" value={filters.country}
               onChange={e=>setFilters(f=>({...f,country:e.target.value}))}
               className="border px-2 py-1 rounded" />
        <input type="date" value={filters.from}
               onChange={e=>setFilters(f=>({...f,from:e.target.value}))}
               className="border px-2 py-1 rounded" />
        <input type="date" value={filters.to}
               onChange={e=>setFilters(f=>({...f,to:e.target.value}))}
               className="border px-2 py-1 rounded" />
      </div>
      <button onClick={exportCsv}
              className="mb-4 px-4 py-2 bg-indigo-600 text-white rounded">
        Export CSV
      </button>
      <table className="w-full text-sm">
        <thead>
          <tr><th>When</th><th>Device</th><th>Country</th><th>Browser</th></tr>
        </thead>
        <tbody>
          {data.map(c=>(
            <tr key={c._id}>
              <td>{new Date(c.timestamp).toLocaleString()}</td>
              <td>{c.device}</td>
              <td>{c.country}</td>
              <td>{c.browser}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

import React, { useContext } from 'react';
import WorkspaceContext from '../context/WorkspaceContext';

export default function Header() {
  const { workspaces, current, setCurrent } = useContext(WorkspaceContext);

  return (
    <header className="flex items-center justify-between p-4 bg-white shadow">
      {/* … your logo/nav … */}
      <select
        className="border rounded px-2 py-1"
        value={current?._id || ''}
        onChange={e => {
          const ws = workspaces.find(w => w._id === e.target.value);
          setCurrent(ws);
        }}
      >
        {workspaces.map(ws => (
          <option key={ws._id} value={ws._id}>{ws.name}</option>
        ))}
      </select>
    </header>
  );
}

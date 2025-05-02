// src/components/WorkspaceList.jsx
import React, { useContext, useState } from "react";
import API from "../services/api";
import { WorkspaceContext } from "../contexts/WorkspaceContext";

export default function WorkspaceList() {
  const { workspaces, setCurrent } = useContext(WorkspaceContext);
  const [name, setName] = useState("");

  const create = async () => {
    const r = await API.post("/workspaces", { name });
    setCurrent(r.data);
    window.location.reload();
  };

  return (
    <div>
      <h2>Your Workspaces</h2>
      <ul>
        {workspaces.map(ws => (
          <li key={ws._id}>
            <button onClick={() => setCurrent(ws)}>
              {ws.name}
            </button>
          </li>
        ))}
      </ul>
      <input
        placeholder="New workspace name"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={create}>Create Workspace</button>
    </div>
  );
}

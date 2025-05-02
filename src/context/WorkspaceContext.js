import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../services/api';
import { AuthContext } from './AuthContext';

const WorkspaceContext = createContext();

export function WorkspaceProvider({ children }) {
  const { user } = useContext(AuthContext);
  const [workspaces, setWorkspaces] = useState([]);
  const [current, setCurrent] = useState(null);

  useEffect(() => {
    if (!user) return;
    API.get('/api/workspaces')
      .then(r => {
        setWorkspaces(r.data);
        if (r.data.length && !current) setCurrent(r.data[0]);
      })
      .catch(console.error);
  }, [user]);

  return (
    <WorkspaceContext.Provider value={{ workspaces, current, setCurrent }}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export default WorkspaceContext;

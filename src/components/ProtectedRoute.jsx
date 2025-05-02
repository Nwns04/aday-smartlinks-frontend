import React, { useContext } from 'react';
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const now = Date.now();

  if (loading) {
    return <div className="text-center p-8">Loading...</div>; // Or a spinner
  }

  const isPremium         = user?.isPremium;
  const activeEssential   =
    user?.subscriptionPlan === "essential" &&
    user.trialExpiresAt &&
    new Date(user.trialExpiresAt) > now;

  // if not logged in OR no active plan
  if (!user || (!isPremium && !activeEssential)) {
    return <Navigate to="/price" replace />;
  }
  return children;
};

export default ProtectedRoute;

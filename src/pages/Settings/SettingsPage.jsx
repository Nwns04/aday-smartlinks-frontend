// src/pages/Settings/SettingsPage.jsx
import React, { useContext, useMemo } from "react";
import { AuthContext }        from "../../context/AuthContext";
import { useNavigate }        from "react-router-dom";
import ProfileInfo            from "../../components/Settings/ProfileInfo";
import SubdomainSettings      from "../../components/Settings/SubdomainSettings";
import CustomDomainSettings   from "../../components/Settings/CustomDomainSettings";
import PasswordSettings       from "../../components/Settings/PasswordSettings";
import TwoFactorSettings      from "../../components/TwoFactorSettings";

const SettingsPage = () => {
  const { user } = useContext(AuthContext);
  const navigate  = useNavigate();

  // 📅 how many days until trial expires (or 0)
  const daysLeft = useMemo(() => {
    if (user?.subscriptionPlan === "essential" && user.trialExpiresAt) {
      const diffMs = new Date(user.trialExpiresAt) - Date.now();
      return diffMs > 0 
        ? Math.ceil(diffMs / (1000 * 60 * 60 * 24))
        : 0;
    }
    return 0;
  }, [user]);

  return (
    <div className="p-6 max-w-lg mx-auto space-y-6">
      <h2 className="text-2xl font-semibold">Account Settings</h2>

      {/* ─── Trial / Upgrade Banner ─── */}
      {user?.subscriptionPlan === "essential" && daysLeft > 0 && (
        <div className="bg-yellow-100 border-l-4 border-yellow-400 p-4 flex justify-between items-center">
          <div>
            <p className="font-medium text-yellow-800">
              You have <strong>{daysLeft} day{daysLeft>1?'s':''}</strong> of free trial left.
            </p>
            <p className="text-sm text-yellow-700">Upgrade now to lock in Premium pricing.</p>
          </div>
          <button
            onClick={() => navigate("/price")}
            className="ml-4 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
          >
            Upgrade to Premium
          </button>
        </div>
      )}


      {/* If no plan at all, invite start trial */}
      {!user?.subscriptionPlan && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 flex justify-between items-center">
          <div>
            <p className="font-medium text-blue-800">Start your 14-day free Essential trial now!</p>
          </div>
          <button
            onClick={() => navigate("/price")}
            className="ml-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Start Free Trial
          </button>
        </div>
      )}

      {/* ─── Settings Sections ─── */}
      <ProfileInfo user={user} setUser={() => {}} />
      {user?.isPremium && <SubdomainSettings user={user} setUser={() => {}} />}
      {user?.isPremium && <CustomDomainSettings user={user} setUser={() => {}} />}
      <PasswordSettings user={user} />
      <TwoFactorSettings />
    </div>
  );
};

export default SettingsPage;

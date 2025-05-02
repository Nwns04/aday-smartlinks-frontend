// src/pages/CampaignsPage.jsx
import { useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import useDashboardData from "../hooks/useDashboardData";
import LoadingScreen from "../components/common/LoadingScreen";
import CampaignTable from "../components/Dashboard/CampaignTable";

export default function CampaignsPage() {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { analytics, loading } = useDashboardData(
    user,
    setUser,
    navigate,
    searchParams
  );

  if (loading) return <LoadingScreen message="Loading campaigns..." />;
  const totalEmails = analytics.reduce((sum, c) => sum + (c.emailCount||0), 0);
    const tasks = [
      { text: "Create your first campaign", completed: analytics.length > 0 },
      { text: "Collect at least 10 emails", completed: totalEmails >= 10 },
    ];
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Your Campaigns</h1>
      <CampaignTable campaigns={analytics} tasks={tasks} />
    </div>
  );
}

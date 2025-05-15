import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import LoadingScreen from "../../components/common/LoadingScreen"; // adjust path accordingly
import useDashboardData from "../../hooks/useDashboardData";
import { 
   BarChart2, Mail,
  Link as LinkIcon, Activity, ArrowUpRight
} from "lucide-react";

import { AuthContext } from "../../context/AuthContext";
import { useTour } from "../../context/TourContext";
import PerformanceChart from "../../components/PerformanceChart";
import CelebrationModal from "../../components/CelebrationModal";
import LinkTypeSelector from "../../components/LinkTypeSelector";
import StatCard from "../../components/common/StatCard";
import SectionCard from "../../components/common/SectionCard";
import CampaignTable from "../../components/Dashboard/CampaignTable"; 
import ArtistInsightsSection from "../../components/Dashboard/ArtistInsightsSection";
import QuickActionsSection from "../../components/Dashboard/QuickActionsSection";
import DashboardHeader from "../../components/Dashboard/DashboardHeader";
import SpotifyConnectPrompt from "../../components/Dashboard/SpotifyConnectPrompt";
import SpotifyCard from "../../components/SpotifyCard";




const DashboardPage = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { startTour } = useTour();
  const {
    analytics,
    loading,
    spotifyStatus,
    activities,
    showCelebration,
    greeting,
    setShowCelebration,
    setSpotifyProfile // ✅ now available
  } = useDashboardData(user, setUser, navigate, searchParams);
  const [showLinkSelector, setShowLinkSelector] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    performance: true,
    campaigns: true,
    quickActions: true
  });


  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const totalClicks = analytics.reduce((sum, c) => sum + c.clicks, 0);
  const totalEmails = analytics.reduce((sum, c) => sum + c.emailCount, 0);

  const chartData = analytics.map((c) => ({
    name: c.title,
    clicks: c.clicks,
    emails: c.emailCount,
  }));

  const tasks = [
    { text: "Create your first campaign", completed: analytics.length > 0 },
    { text: "Connect your Spotify account", completed: spotifyStatus },
    { text: "Collect at least 10 emails", completed: totalEmails >= 10 },
  ];

  if (loading) return <LoadingScreen message="Loading your dashboard..." />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <DashboardHeader 
  greeting={greeting}
  user={user}
  onCreateLink={() => setShowLinkSelector(true)}
  onAnalyticsClick={() => navigate("/analytics")}
/>


        <CelebrationModal
          show={showCelebration}
          onClose={() => setShowCelebration(false)}
          message="Your campaigns reached 100 clicks! Keep it up 🎯"
        />

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <StatCard 
            icon={<LinkIcon className="text-blue-500" />}
            title="Total Campaigns"
            value={analytics.length}
            change="+2 this week"
            color="blue"
            onClick={() => navigate("/campaigns")}
          />
          <StatCard 
            icon={<Activity className="text-green-500" />}
            title="Total Clicks"
            value={totalClicks}
            change="+24% from last week"
            color="green"
            onClick={() => navigate("/analytics")}
          />
          <StatCard 
            icon={<Mail className="text-purple-500" />}
            title="Emails Collected"
            value={totalEmails}
            change="+12 new"
            color="purple"
            onClick={() => navigate("/leads")}
          />
        </div>

        {/* Main Content - Optimized Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column (3/4 width) */}
          <div className="lg:col-span-3 space-y-6">
            {/* Performance Chart */}
            <SectionCard 
              title="Performance Overview"
              icon={<BarChart2 size={18} />}
              isExpanded={expandedSections.performance}
              onToggle={() => toggleSection('performance')}
            >
              <PerformanceChart data={chartData} />
            </SectionCard>
            <ArtistInsightsSection user={user} analytics={analytics} />


            {/* Campaigns Table with Getting Started below */}
            <SectionCard 
              title="Your Campaigns"
              icon={<LinkIcon size={18} />}
              isExpanded={expandedSections.campaigns}
              onToggle={() => toggleSection('campaigns')}
              badge={`${analytics.length} total`}
              action={
                <button 
                  onClick={() => navigate("/campaigns")}
                  className="text-sm flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  View all <ArrowUpRight size={16} className="ml-1" />
                </button>
              }
            >
             <CampaignTable campaigns={analytics} tasks={tasks} />

            </SectionCard>
          </div>

          {/* Right Column (1/4 width) */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <QuickActionsSection 
              analytics={analytics}
              totalEmails={totalEmails}
              totalClicks={totalClicks}
              isExpanded={expandedSections.quickActions}
              onToggle={() => toggleSection('quickActions')}
            />
 {/* Spotify Card */}
            <SpotifyCard
              user={user}
              setSpotifyProfile={setSpotifyProfile}
            />

           
          </div>
        </div>

        {/* Spotify Integration */}
        {/* <SpotifyConnectPrompt user={user} setSpotifyProfile={setSpotifyProfile} /> */}

      </div>

      {showLinkSelector && (
        <LinkTypeSelector onClose={() => setShowLinkSelector(false)} />
      )}
    </div>
  );
};



export default DashboardPage;
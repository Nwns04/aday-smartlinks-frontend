import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import LoadingScreen from "../../components/common/LoadingScreen";
import { 
  Plus, BarChart2, Trophy, Mail, Zap, Target, ChevronDown, ChevronUp,
  Link as LinkIcon, Activity, CheckCircle, Sparkles, User, Clock, ArrowUpRight
} from "lucide-react";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { useTour } from "../context/TourContext";
import PerformanceChart from "../components/PerformanceChart";
import CampaignOverviewTable from "../components/CampaignOverviewTable";
import TaskSuggestions from "../components/TaskSuggestions";
import TopLinks from "../components/TopLinks";
import EmailProgress from "../components/EmailProgress";
import GoalTracker from "../components/GoalTracker";
import CelebrationModal from "../components/CelebrationModal";
import LinkTypeSelector from "../components/LinkTypeSelector";
import ActivityTimeline from "../components/ActivityTimeline";
import SpotifyCard from "../components/SpotifyCard";
import FanFunnelChart from "../components/FanFunnelChart";



const Dashboard = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { startTour } = useTour();

  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [spotifyStatus, setSpotifyStatus] = useState(false);
  const [spotifyProfile, setSpotifyProfile] = useState(null);
  const [activities, setActivities] = useState([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showLinkSelector, setShowLinkSelector] = useState(false);
  const [greeting, setGreeting] = useState("");

  const welcomeMessages = [
    "Good to see you again,",
    "You're back on the grind,",
    "Let's get things rolling,",
    "Hey Rockstar,",
    "Ready to dominate today,",
    "Welcome back, legend",
    "Another day, another win,",
    "Time to make moves,",
    "Look who's back,",
    "Back to the dashboard,",
  ];

  // Collapsible sections state
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

  const fetchAnalytics = async () => {
    try {
      if (!user?._id) return;
      const res = await API.get(`/campaigns/analytics/${user._id}`);
      setAnalytics(res.data);

      const activity = ["Fetched your campaign analytics"];
      if (res.data.length > 0) {
        activity.push(`Your top campaign is '${res.data[0].title}'`);
      }
      setActivities((prev) => [...prev, ...activity]);
    } catch (error) {
      console.error("Analytics Fetch Error:", error.response?.data || error.message);
      toast.error("Failed to load analytics");
    }
  };

  const updateUser = async () => {
    try {
      const res = await API.get(`/auth/user/${user.email}`);
      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
      toast.success("Spotify connected!");
    } catch (error) {
      console.error("Error updating user state:", error);
      toast.error("Failed to update account");
    }
  };

  useEffect(() => {
    const loadUserAndData = async () => {
      if (!user) {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          setLoading(false);
          return;
        }
      }

      const spotifyParam = searchParams.get("spotify");

      if (spotifyParam === "connected") {
        await updateUser();
        navigate("/dashboard", { replace: true });
      } else if (spotifyParam === "error") {
        toast.error("Failed to connect Spotify");
        navigate("/dashboard", { replace: true });
      }

      await fetchAnalytics();

      if (user?.spotifyId) {
        setSpotifyStatus(true);
        setActivities((prev) => [...prev, "Spotify account connected"]);
      }

      setLoading(false);
    };

    loadUserAndData();
  }, [user, searchParams, navigate]);

  useEffect(() => {
    const hasCelebrated = localStorage.getItem("hasCelebrated");
    const totalClicks = analytics.reduce((sum, c) => sum + c.clicks, 0);
  
    if (totalClicks >= 100 && !hasCelebrated) {
      setShowCelebration(true);
      localStorage.setItem("hasCelebrated", "true");
    }
  }, [analytics]);
  // localStorage.removeItem("hasCelebrated")

  useEffect(() => {
    const hasTakenTour = localStorage.getItem("hasTakenTour");
    if (!hasTakenTour && !loading) {
      setTimeout(() => {
        startTour();
      }, 2000);
    }
  }, [loading, startTour]);

  useEffect(() => {
    if (!loading) {
      const randomMessage =
        welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
      setGreeting(randomMessage);
    }
  }, [loading]);

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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
              {greeting} {user?.name}
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
            {!user?.isVerifiedArtist && (
  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded mt-4">
    <p className="text-sm text-yellow-800 font-medium">
      Want access to deeper insights?{" "}
      <button
  onClick={() =>
    window.location.href = `${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'}/auth/spotify?email=${user?.email}`
  }
  className="underline cursor-pointer text-blue-600 focus:outline-none"
>
  Get verified
</button>

      to unlock Fan Funnel, Geo Insights & Top Fans.
    </p>
  </div>
)}

          </div>
          
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <button
              onClick={() => setShowLinkSelector(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Plus size={18} />
              Create Link
            </button>
            <button
              onClick={() => navigate("/analytics")}
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-4 py-2 rounded-lg transition-colors"
            >
              <BarChart2 size={18} />
              Analytics
            </button>
          </div>
        </div>

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
            {user?.isVerifiedArtist && (
  <SectionCard
    title="Artist Insights"
    icon={<Sparkles size={18} />}
    isExpanded={true}
    onToggle={() => {}}
    badge="Verified Only"
  >
    <div className="space-y-4">
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
  <h4 className="font-semibold mb-2">🎯 Fan Funnel</h4>
  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
    See how fans engage step-by-step — from link clicks to email submissions and presaves.
  </p>
  {analytics.length > 0 ? (
    <FanFunnelChart slug={analytics[0].slug} />
  ) : (
    <p className="text-sm text-gray-400 italic">No campaigns found to display funnel data.</p>
  )}
</div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
        <h4 className="font-semibold mb-2">🌍 Geo Insights</h4>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Know where your fans are coming from — top countries, cities, and regions.
        </p>
        {/* GeoChart component will go here */}
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
        <h4 className="font-semibold mb-2">🔥 Top Fans</h4>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Discover your most engaged fans based on actions and referral influence.
        </p>
        {/* TopFansTable will go here */}
      </div>
    </div>
  </SectionCard>
)}

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
              <div className="space-y-6">
                <CampaignOverviewTable campaigns={analytics} />
                
                {/* Getting Started moved here */}
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-800">
                    <h3 className="font-medium flex items-center gap-2">
                      <Sparkles size={18} className="text-yellow-500" />
                      Getting Started
                    </h3>
                  </div>
                  <div className="p-4">
                    <TaskSuggestions tasks={tasks} />
                  </div>
                </div>
              </div>
            </SectionCard>
          </div>

          {/* Right Column (1/4 width) */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <SectionCard 
              title="Quick Actions"
              icon={<Zap size={18} />}
              isExpanded={expandedSections.quickActions}
              onToggle={() => toggleSection('quickActions')}
            >
              <div className="space-y-4">
                <TopLinks campaigns={analytics} />
                <EmailProgress totalEmails={totalEmails} />
                <GoalTracker totalClicks={totalClicks} />
              </div>
            </SectionCard>

            {/* Recent Activity */}
            {/* <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-gray-700 dark:to-gray-800">
                <h3 className="font-medium flex items-center gap-2">
                  <Clock size={18} className="text-purple-500" />
                  Recent Activity
                </h3>
              </div>
              <div className="p-4">
                <ActivityTimeline activities={activities} />
              </div>
            </div> */}
          </div>
        </div>

        {/* Spotify Integration */}
        {!spotifyStatus && (
          <div className="mt-6">
            <SpotifyCard user={user} setSpotifyProfile={setSpotifyProfile} />
          </div>
        )}
      </div>

      {showLinkSelector && (
        <LinkTypeSelector onClose={() => setShowLinkSelector(false)} />
      )}
    </div>
  );
};

// Reusable Stat Card Component
const StatCard = ({ icon, title, value, change, color, onClick }) => {
  const colorClasses = {
    blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    green: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
    purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
  };

  return (
    <div 
      onClick={onClick}
      className={`bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
    >
      <div className="flex items-center justify-between">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
        {change && (
          <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full">
            {change}
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{value}</h3>
      </div>
    </div>
  );
};

// Reusable Section Card Component
const SectionCard = ({ title, icon, children, isExpanded, onToggle, badge, action }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Use div instead of button to avoid nesting issue */}
      <div
        onClick={onToggle}
        className="w-full cursor-pointer p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="font-medium">{title}</h3>
          {badge && (
            <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full">
              {badge}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {action && <div onClick={(e) => e.stopPropagation()}>{action}</div>}
          {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </div>
      {isExpanded && (
        <div className="p-4">
          {children}
        </div>
      )}
    </div>
  );
};


export default Dashboard;
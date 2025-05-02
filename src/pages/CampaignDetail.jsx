import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import LinkAnalytics from "../components/LinkAnalytics";
import EmailTimelineChart from "../components/EmailTimelineChart";
import GeoHeatmap from "../components/GeoHeatmap"; 
import { FiMusic } from "react-icons/fi";
import UtmStatsTable from "../components/UtmStatsTable";
import FanFunnelChart from "../components/FanFunnelChart";
import GeoInsights from "../components/GeoInsights";
import TopFansTable from "../components/TopFansTable";
import TopFansWidget from "../components/TopFansWidget";
import { hasFeature } from "../utils/subscription"; 
import { motion } from "framer-motion";
import CampaignNotes from "../components/CampaignNotes";
import DownloadPressKitButton from "../components/DownloadPressKitButton";
import PressKitEditor from "../components/PressKitEditor";
import { io } from "socket.io-client";
import toast from "react-hot-toast";
import { PUBLIC_VAPID_KEY } from "../config";
import WorkspaceContext from "../context/WorkspaceContext";
import ForecastChart from '../components/ForecastChart';
import ABTestBuilder from '../components/ABTestBuilder';
import ReactPlayer from 'react-player';
import SegmentPanel from '../components/SegmentPanel';
import {
  BarChart2,
  Calendar,
  Clock,
  Download,
  Globe,
  ArrowLeft,
  MousePointer,
  Mail,
  Smartphone,
  TrendingUp,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";

const CampaignDetail = () => {
  const { user } = useContext(AuthContext);
  const { current: workspace } = useContext(WorkspaceContext);
  const { slug } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("7d");
  const [clickTimeline, setClickTimeline] = useState([]);
  const [lastEdit, setLastEdit] = useState(null);
  

// initialize socket once per bundle
 const socket = io(process.env.REACT_APP_BACKEND_URL || "http://localhost:5000");

  // ─── Web‑Push subscription ─────────────────────────────
  useEffect(() => {
    if (!("serviceWorker" in navigator) || !user?.isPremium) return;
 
    navigator.serviceWorker
      .register("/sw.js")
      .then(reg => reg.pushManager.getSubscription()
        .then(sub => {
          if (sub) return sub;
          return reg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: PUBLIC_VAPID_KEY
          });
       })
      )
      .then(subscription => {
        // send to backend
        return API.post("/api/push/subscribe", {
          campaignId: slug,
          subscription
        });
      })
      .catch(console.error);
  }, [slug, user]);


 // ─── Real‑Time Click Toasts ────────────────────────────────────────────
    useEffect(() => {
      // join the room named by this slug
      socket.emit("joinCampaign", slug);
  
        // listen for click events
        socket.on("click", ({ at, ip }) => {
          toast(`👆 New click at ${new Date(at).toLocaleTimeString()} from ${ip}`, {
            duration: 4000
          });
        });
  
        return () => {
          socket.off("click");
          socket.emit("leaveCampaign", slug);
        };
      }, [slug]);
  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        const res = await API.get(
                  `/campaigns/timeline/${slug}` +
                  `?range=${timeRange}` +
                  `&workspace=${workspace?._id}`
                );
        setClickTimeline(res.data);
      } catch (err) {
        console.error("Error fetching timeline", err);
      }
    };

    if (user) fetchTimeline();
  }, [slug, user, timeRange]);

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        if (!user) return;
        const res = await API.get(
          `/campaigns/analytics/detail/${slug}` +
          `?range=${timeRange}` +
          `&workspace=${workspace?._id} `
        );
        setCampaign(res.data);
      } catch (error) {
        console.error("Error fetching campaign details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaign();
  }, [slug, user, timeRange]);

  const emailCount = campaign?.emails?.length || 0;
  const ctr = emailCount
    ? ((campaign.clicks / emailCount) * 100).toFixed(1)
    : 0;

  const conversionRate = campaign?.clicks
    ? ((emailCount / campaign.clicks) * 100).toFixed(1)
    : 0;
  
  const timeSeriesData = campaign?.timeSeries || [];
  const deviceData = campaign?.deviceBreakdown || [
    { name: "Desktop", value: 45 },
    { name: "Mobile", value: 35 },
    { name: "Tablet", value: 20 },
  ];
  const locationData = campaign?.locationData || [
    { name: "US", clicks: 100 },
    { name: "UK", clicks: 75 },
    { name: "CA", clicks: 50 },
    { name: "AU", clicks: 25 },
  ];

  const COLORS = ["#6366F1", "#10B981", "#F59E0B", "#EF4444"];

  const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";
  const handleExport = (type) => {
    const endpoint =
      type === "emails"
        ? `${API_BASE}/campaigns/export/emails/${campaign.slug}`
        : `${API_BASE}/campaigns/export/analytics/${campaign.slug}`;
    window.open(endpoint, '_blank');
  };
  
  const handleSendBlast = async () => {
    const subject = prompt("Email subject", `News from ${campaign.title}`);
    if (!subject) return;
    const html = prompt("Email body (HTML)", `<p>Hey there—check out our latest update!</p>`);
    if (html == null) return;
  
    try {
      const { data } = await API.post(`/campaigns/${slug}/send-blast`, { subject, html });
      toast.success(`Sent to ${data.count} subscribers`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to send email blast");
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <>
    {lastEdit && (
      <div className="text-sm text-gray-600 mb-2 italic">
        Last changed by <strong>{lastEdit.user?.name}</strong>{" "}
        on {new Date(lastEdit.timestamp).toLocaleString()}.
        <button
          onClick={() => navigate(`/audit?campaignId=${campaign._id}`)}
          className="underline ml-2"
        >
          View trail
        </button>
      </div>
    )}
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="p-4 md:p-6 max-w-7xl mx-auto"
    >
      <motion.button
        whileHover={{ x: -2 }}
        onClick={() => navigate("/analytics")}
        className="mb-6 flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
      >
        <ArrowLeft size={16} className="mr-1" /> Back to Analytics
      </motion.button>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : !campaign ? (
        <p className="text-center py-10 text-gray-600">Campaign not found.</p>
      ) : (
        <motion.div variants={containerVariants} initial="hidden" animate="show">
          <motion.div 
            variants={itemVariants}
            className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
          >
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{campaign.title}</h1>
              <p className="text-gray-500 flex items-center gap-2 mt-1">
                <Calendar size={16} className="text-gray-400" />
                Created: {new Date(campaign.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-2">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="border rounded-lg px-3 py-1.5 text-sm bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="24h">Last 24h</option>
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="all">All time</option>
              </select>
              {hasFeature(user,'premium') ? (
               <>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleExport("emails")}
                className="flex items-center gap-1 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-3 py-1.5 rounded-lg text-sm shadow-sm transition-all"
              >
                <Download size={16} /> Export Emails
              </motion.button>
              {hasFeature(user, "premium") && (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={handleSendBlast}
    className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-sm shadow-sm transition-all"
  >
    Send Email Blast
  </motion.button>
)}
              {hasFeature(user,'premium') && <DownloadPressKitButton campaign={campaign} />}
              {hasFeature(user, 'premium') && campaign && (
  <motion.div variants={itemVariants}>
    <PressKitEditor campaign={campaign} />
  </motion.div>
)}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleExport("analytics")}
                className="flex items-center gap-1 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-3 py-1.5 rounded-lg text-sm shadow-sm transition-all"
              >
                <Download size={16} /> Export Analytics
              </motion.button>
              </>
) : (
   <div className="p-4 bg-yellow-50 text-yellow-800 rounded">
     Upgrade to Premium to export data.
   </div>
 )}
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="mt-8 mb-10">
          {user?.isVerifiedArtist ? (
  <FanFunnelChart slug={campaign.slug} />
) : (
  <div className="bg-white p-4 rounded-lg shadow text-gray-500 text-sm text-center">
    🔒 Fan Funnel insights are only available to verified artists.
  </div>
)}          
{user?.isVerifiedArtist ? (
  <GeoInsights slug={campaign.slug} />
) : (
  <div className="bg-white p-4 rounded-lg shadow text-gray-500 text-sm text-center">
    🔒 Geo breakdown is only available to verified artists.
  </div>
)}

{user?.isVerifiedArtist ? (
  <TopFansWidget slug={campaign.slug} />
) : (
  <div className="bg-white p-4 rounded-lg shadow text-gray-500 text-sm text-center">
    🔒 Top Fans leaderboard is only available to verified artists.
  </div>
)}
{!user?.isVerifiedArtist && (
  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded mb-4">
    <p className="text-sm text-yellow-800 font-medium">
      Want access to deeper insights?{" "}
      <button
        onClick={() => navigate("/verify-artist")}
        className="underline cursor-pointer text-blue-600 focus:outline-none"
      >
      
        Get verified
      </button>{" "}
      to unlock Fan Funnel, Geo Insights & more!
    </p>
  </div>
)}

<div className="flex items-center gap-2">
  <h3 className="text-lg font-semibold truncate">{campaign.title}</h3>
  {campaign.user?.isVerifiedArtist && (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">
      <svg className="w-3.5 h-3.5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm2.93-10.58a.75.75 0 00-1.06-1.06L9 9.293 8.13 8.42a.75.75 0 10-1.06 1.06l1.5 1.5a.75.75 0 001.06 0l3.3-3.3z" clipRule="evenodd" />
      </svg>
      Verified
    </span>
  )}
</div>


            <TopFansTable slug={slug} />
          </motion.div>

          {/* Metrics */}
          <motion.div 
            variants={containerVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8"
          >
            <MetricCard
              icon={<MousePointer size={20} className="text-blue-500" />}
              title="Total Clicks"
              value={campaign.clicks}
              change="+12%"
            />
            <MetricCard
              icon={<Mail size={20} className="text-green-500" />}
              title="Emails Collected"
              value={emailCount}
              change="+8%"
            />
            <MetricCard
              icon={<BarChart2 size={20} className="text-indigo-500" />}
              title="CTR"
              value={`${ctr}%`}
              change="+2.5%"
            />
            <MetricCard
              icon={<TrendingUp size={20} className="text-orange-500" />}
              title="Conversion Rate"
              value={`${conversionRate}%`}
              change="+1.8%"
            />
          </motion.div>

          {/* Charts */}
          <motion.div 
            variants={containerVariants}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
          >
            <motion.div 
              variants={itemVariants}
              className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-gray-800 flex items-center gap-2">
                  <Clock size={18} className="text-indigo-500" /> Activity Over Time
                </h3>
              </div>
              <div className="h-64">
              {hasFeature(user,'premium') ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Legend />
                    <Bar 
                      dataKey="clicks" 
                      fill="#6366F1" 
                      name="Clicks" 
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar 
                      dataKey="emails" 
                      fill="#10B981" 
                      name="Emails" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
   <div className="p-4 bg-yellow-50 text-yellow-800 rounded">
     Upgrade to Premium to view this chart.
   </div>
 )}
              </div>
            </motion.div>
            {hasFeature(user,'premium') ? (
             <>
            <motion.div variants={itemVariants}>
              <LinkAnalytics clickData={clickTimeline} />
            </motion.div>

            <motion.div variants={itemVariants}>
              <EmailTimelineChart slug={slug} />
            </motion.div>
            </>
 ) : (
   <div className="p-4 bg-yellow-50 text-yellow-800 rounded">
     Upgrade to Premium to view timeline analytics.
   </div>
 )}
            <motion.div 
              variants={itemVariants}
              className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-gray-800 flex items-center gap-2">
                  <Smartphone size={18} className="text-indigo-500" /> Device Breakdown
                </h3>
              </div>
              <div className="h-64">
              {hasFeature(user,'premium') ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={deviceData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {deviceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                ) : (
  <div className="p-4 bg-yellow-50 text-yellow-800 rounded">
     Premium only.
   </div>
 )}
              </div>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-gray-800 flex items-center gap-2">
                  <Smartphone size={18} className="text-indigo-500" /> Browser Breakdown
                </h3>
              </div>
              <div className="h-64">
              {hasFeature(user,'premium') ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={campaign.browserBreakdown || []}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {(campaign.browserBreakdown || []).map((entry, index) => (
                        <Cell key={`cell-browser-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
   <div className="p-4 bg-yellow-50 text-yellow-800 rounded">
     Premium only.
   </div>
 )}
              </div>
            </motion.div>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow mb-8"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-gray-800 flex items-center gap-2">
                <FiMusic size={18} className="text-indigo-500" /> Platform Breakdown
              </h3>
            </div>
            <div className="h-64">
            {hasFeature(user,'premium') ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={campaign.platformBreakdown || []}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {(campaign.platformBreakdown || []).map((entry, index) => (
                      <Cell key={`cell-platform-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
  <div className="p-4 bg-yellow-50 text-yellow-800 rounded">
     Premium only.
   </div>
 )}
            </div>
          </motion.div>

          {/* Location */}
          <motion.div 
            variants={itemVariants}
            className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow mb-8"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-gray-800 flex items-center gap-2">
                <Globe size={18} className="text-indigo-500" /> Geographic Distribution
              </h3>
            </div>
            <div className="h-64">
            {hasFeature(user,'premium') ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={locationData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar 
                    dataKey="clicks" 
                    fill="#6366F1" 
                    name="Clicks by Country" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
 <div className="p-4 bg-yellow-50 text-yellow-800 rounded">
     Premium only.
   </div>
 )}
            </div>
          </motion.div>
          {hasFeature(user,'premium') ? (
          <motion.div variants={itemVariants}>
            <GeoHeatmap geoData={campaign.topCities || []} />
          </motion.div>
        ) : (
 <div className="p-4 bg-yellow-50 text-yellow-800 rounded">
     Premium only.
   </div>
 )}

          {/* City Breakdown */}
          <motion.div 
            variants={itemVariants}
            className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow mb-8"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-gray-800 flex items-center gap-2">
                <Globe size={18} className="text-indigo-500" /> Top Cities
              </h3>
            </div>
            <div className="h-64">
            {hasFeature(user,'premium') ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={campaign.topCities || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar 
                    dataKey="clicks" 
                    fill="#10B981" 
                    name="Clicks by City" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
 <div className="p-4 bg-yellow-50 text-yellow-800 rounded">
     Premium only.
   </div>
 )}
            </div>
          </motion.div>
          {hasFeature(user,'premium') && (
  <ForecastChart slug={campaign.slug} range={14} />
)}
{hasFeature(user, 'ab_variant_builder') && (
  <ABTestBuilder campaignId={campaign._id} />
)}
{campaign.liveStreamUrl && (
  <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 mb-8">
    <h3 className="font-medium text-gray-800 mb-4">Live Stream</h3>
    <div className="aspect-w-16 aspect-h-9">
      <ReactPlayer
        url={campaign.liveStreamUrl}
        width="100%"
        height="100%"
        controls
      />
    </div>
  </div>
)}
<SegmentPanel slug={campaign.slug} />

          {/* Region Breakdown */}
          <motion.div 
            variants={itemVariants}
            className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow mb-8"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-gray-800 flex items-center gap-2">
                <Globe size={18} className="text-indigo-500" /> Top Regions
              </h3>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={campaign.topRegions || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar 
                    dataKey="clicks" 
                    fill="#F59E0B" 
                    name="Clicks by Region" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
          {hasFeature(user,'premium') ? (
          <motion.div variants={itemVariants} className="mb-8">
            <UtmStatsTable slug={campaign.slug} />
          </motion.div>
        ) : (
 <div className="p-4 bg-yellow-50 text-yellow-800 rounded">
     Premium only.
   </div>
 )}
          {/* Email List */}
          <motion.div 
            variants={itemVariants}
            className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-gray-800">Collected Emails ({emailCount})</h3>
              {emailCount > 0 && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleExport("emails")}
                  className="text-sm flex items-center text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  <Download size={16} className="mr-1" /> Export List
                </motion.button>
              )}
            </div>
            {emailCount === 0 ? (
              <p className="text-sm text-gray-500 py-4">No emails collected yet.</p>
            ) : (
              <div className="max-h-96 overflow-y-auto rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Collected</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {(campaign.emails || []).map((emailObj, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{emailObj.email}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {new Date(emailObj.collectedAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {campaign && <CampaignNotes campaignId={campaign._id} />}
          </motion.div>
        </motion.div>
      )}
    </motion.div>
    </>
  );
};

const MetricCard = ({ icon, title, value, change }) => {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all"
    >
      <div className="flex items-center justify-between">
        <div className="p-2.5 rounded-lg bg-indigo-50">{icon}</div>
        <span
          className={`text-xs px-2 py-1 rounded-full ${
            change.startsWith("+")
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {change}
        </span>
      </div>
      <div className="mt-3">
        <p className="text-xs text-gray-500 font-medium">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
      </div>
    </motion.div>
  );
};

export default CampaignDetail;
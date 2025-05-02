import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

/* 🛠 utils & hooks — two levels up from /pages/CampaignDetails */
import { hasFeature }          from "../../utils/subscription";
import useCampaignDetails      from "../../hooks/useCampaignDetails";
import useCampaignActions      from "../../hooks/useCampaignActions";

import { motion }    from "framer-motion";
import { ArrowLeft, Calendar, Lock, Verified } from "lucide-react";
import ReactPlayer   from "react-player";

/* Campaign-Detail components */
import ABTestBuilder           from "../../components/CampaignDetails/ABTestBuilder";
import FanFunnelChart          from "../../components/CampaignDetails/FanFunnelChart";
import GeoInsights             from "../../components/CampaignDetails/GeoInsights";
import SegmentPanel            from "../../components/CampaignDetails/SegmentPanel";
import TopFansTable            from "../../components/CampaignDetails/TopFansTable";
import TopFansWidget           from "../../components/CampaignDetails/TopFansWidget";
import MetricSection           from "../../components/CampaignDetails/MetricSection";
import ChartsSection           from "../../components/CampaignDetails/ChartsSection";
import GeoAndForecastSection   from "../../components/CampaignDetails/GeoAndForecastSection";
import EmailSection            from "../../components/CampaignDetails/EmailSection";
import LastEditNotice          from "../../components/CampaignDetails/LastEditNotice";
import TimeRangeSelector       from "../../components/CampaignDetails/TimeRangeSelector";
import PremiumActions          from "../../components/CampaignDetails/PremiumActions";

const CampaignDetailPage = () => {
  /* ── routing & state ─────────────────────────── */
  const { slug } = useParams();
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState("7d");

  /* custom hook: loads campaign, timeline, etc. */
  const {
    user, campaign, setCampaign, loading,
    clickTimeline, lastEdit, setLastEdit
  } = useCampaignDetails(slug, timeRange);

  /* hook for export / blast actions */
  const {
    handleExport,
    handleSendBlast,
    sendingBlast
  } = useCampaignActions(slug, campaign);

  /* derived metrics */
  const emailCount      = campaign?.emails?.length || 0;
  const ctr             = emailCount ? ((campaign.clicks / emailCount) * 100).toFixed(1) : 0;
  const conversionRate  = campaign?.clicks ? ((emailCount / campaign.clicks) * 100).toFixed(1) : 0;

  const timeSeriesData  = campaign?.timeSeries         || [];
  const deviceData      = campaign?.deviceBreakdown    || [
    { name: "Desktop", value: 45 },
    { name: "Mobile",  value: 35 },
    { name: "Tablet",  value: 20 },
  ];

  /* animation presets */
  const containerVariants = {
    hidden: { opacity: 0 },
    show:   { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVariants = { 
    hidden: { opacity: 0, y: 20 }, 
    show: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring",
        stiffness: 100,
        damping: 10
      } 
    } 
  };
  

  /* ── render ───────────────────────────────────── */
  return (
    <>
 <LastEditNotice lastEdit={lastEdit} campaignId={campaign?._id} />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="p-4 md:p-6 max-w-7xl mx-auto"
      >
        {/* back button */}
        <motion.button
          whileHover={{ x: -4 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/analytics")}
          className="mb-6 flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          <ArrowLeft size={16} className="mr-1" /> 
          <span>Back to Analytics</span>
        </motion.button>

        {/* main content */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500" />
          </div>
        ) : !campaign ? (
          <div className="text-center py-10">
            <p className="text-gray-600 text-lg mb-2">Campaign not found</p>
            <button 
              onClick={() => navigate("/analytics")}
              className="text-indigo-600 hover:underline"
            >
              Return to analytics dashboard
            </button>
          </div>
        ) : (
          <motion.div variants={containerVariants} initial="hidden" animate="show">
            {/* Header */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
            >
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{campaign.title}</h1>
                  {campaign.user?.isVerifiedArtist && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      <Verified size={14} className="text-blue-500" />
                      Verified Artist
                    </span>
                  )}
                </div>
                <p className="text-gray-500 flex items-center gap-2 mt-1">
                  <Calendar size={16} className="text-gray-400" />
                  <span>Created: {new Date(campaign.createdAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  })}</span>
                </p>
              </div>
            </motion.div>

            {/* Verification Notice */}
            {!user?.isVerifiedArtist && (
              <motion.div 
                variants={itemVariants}
                className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-400 p-4 rounded mb-6"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    <Lock size={18} className="text-blue-500" />
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-800 mb-1">Unlock Premium Insights</h4>
                    <p className="text-sm text-blue-700">
                      Get verified to access Fan Funnel, Geo Insights, Top Fans leaderboard and more.
                    </p>
                    <button
                      onClick={() => navigate("/verify-artist")}
                      className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors inline-flex items-center gap-1"
                    >
                      Verify your artist profile
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Metrics Section */}
            <motion.div variants={itemVariants} className="mb-8">
              <MetricSection
                clicks={campaign.clicks}
                emails={emailCount}
                ctr={ctr}
                conversionRate={conversionRate}
              />
            </motion.div>

            {/* Premium Features Section */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {user?.isVerifiedArtist ? (
                <FanFunnelChart slug={campaign.slug} />
              ) : (
                <PremiumFeaturePlaceholder 
                  title="Fan Funnel Insights" 
                  icon={<Lock size={18} />}
                />
              )}
              
              {user?.isVerifiedArtist ? (
                <GeoInsights slug={campaign.slug} />
              ) : (
                <PremiumFeaturePlaceholder 
                  title="Geographic Breakdown" 
                  icon={<Lock size={18} />}
                />
              )}

              {user?.isVerifiedArtist ? (
                <TopFansWidget slug={campaign.slug} />
              ) : (
                <PremiumFeaturePlaceholder 
                  title="Top Fans Leaderboard" 
                  icon={<Lock size={18} />}
                />
              )}
            </motion.div>

            {/* Charts Section */}
            <motion.div variants={itemVariants} className="mb-8">
              <ChartsSection
                timeSeriesData={timeSeriesData}
                clickTimeline={clickTimeline}
                slug={slug}
                deviceData={deviceData}
                browserData={campaign.browserBreakdown || []}
                platformData={campaign.platformBreakdown || []}
                user={user}
              />
            </motion.div>

            <div className="flex gap-3 items-center">
                <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
                <PremiumActions
                  user={user}
                  campaign={campaign}
                  handleExport={handleExport}
                  handleSendBlast={handleSendBlast}
                  sendingBlast={sendingBlast}
                />
              </div>

            {/* Geo & Forecast Section */}
            <motion.div variants={itemVariants} className="mb-8">
              <GeoAndForecastSection campaign={campaign} user={user} />
            </motion.div>

            {/* Top Fans Table */}
            <motion.div variants={itemVariants} className="mb-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-800">Top Fans</h3>
                </div>
                <TopFansTable slug={slug} />
              </div>
            </motion.div>

            {/* AB Testing */}
            {hasFeature(user, 'ab_variant_builder') && (
              <motion.div variants={itemVariants} className="mb-8">
                <ABTestBuilder campaignId={campaign._id} />
              </motion.div>
            )}

            {/* Live Stream */}
            {campaign.liveStreamUrl && (
              <motion.div variants={itemVariants} className="mb-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="px-5 py-4 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-800">Live Stream</h3>
                  </div>
                  <div className="p-4">
                    <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                      <ReactPlayer
                        url={campaign.liveStreamUrl}
                        width="100%"
                        height="100%"
                        controls
                        config={{
                          file: {
                            attributes: {
                              controlsList: 'nodownload'
                            }
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Segment Panel */}
            <motion.div variants={itemVariants} className="mb-8">
              <SegmentPanel slug={campaign.slug} />
            </motion.div>

            {/* Email Section */}
            <motion.div variants={itemVariants}>
              <EmailSection 
                campaign={campaign}
                emailCount={emailCount}
                handleExport={handleExport}
              />
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </>
  );
};

const PremiumFeaturePlaceholder = ({ title, icon }) => (
  <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 h-full flex flex-col items-center justify-center text-center">
    <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 mb-3">
      {icon}
    </div>
    <h4 className="font-medium text-gray-700 mb-1">{title}</h4>
    <p className="text-sm text-gray-500 max-w-xs">
      Available to verified artists only
    </p>
  </div>
);

export default CampaignDetailPage;
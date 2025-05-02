import React, { useEffect, useState, useContext } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../context/AuthContext";
import QRCode from "react-qr-code";
import { useParams } from "react-router-dom";
import API from "../../services/api";
import { motion } from "framer-motion";
import CountdownTimer from "../../components/CountdownTimer";
import { getGeoLocation } from "../../utils/getGeoLocation";
import { getDeviceType } from "../../utils/getDeviceType";
import ServiceLinks from "../../components/ServiceLinks";
import CampaignHeader from "../../components/PublicLink/CampaignHeader";
import PlatformButton from '../../components/PublicLink/PlatformButton';
import { FiLink, FiMusic, FiMail, FiCheckCircle, FiCopy, FiExternalLink } from "react-icons/fi";
import { getPlatformIcon, getPlatformColor, getPlatformName, getPlatformCategory } from "../../utils/platformHelpers";
import EmailCaptureForm from '../../components/PublicLink/EmailCaptureForm';
import useSmartLinks from '../../hooks/useSmartLinks';
import ShareLinks from '../../components/PublicLink/ShareSection';
import ShareSectionBio from '../../components/PublicLink/ShareSectionBio';
import useSortedLinks from '../../hooks/useSortedLinks';
import LoadingScreen from "../../components/common/LoadingScreen"; 
import usePublicCampaign from "../../hooks/usePublicCampaign";
import PageEditor from "../../components/PublicLink/PageEditor";
import PageViewer from "../../components/PublicLink/PageViewer";

const PublicLink = () => {
  const { slug } = useParams();
  const [campaign, setCampaign] = useState(null);
  const smartLinks = useSmartLinks(campaign?.serviceLinks, slug);
  const [biolink, setBiolink] = useState(null);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [geo, setGeo] = useState(null);
  const [device, setDevice] = useState("desktop");
  const sortedLinks = useSortedLinks(smartLinks, geo, device, activeTab);
  const { data: campaignData, isLoading: campaignLoading, isError } = usePublicCampaign(slug);
  const queryClient = useQueryClient();        
  const [editing, setEditing] = useState(false);

  const { user } = useContext(AuthContext);
  const isLoggedIn = !!user;
  const campaignOwnerId =
   typeof campaign?.user === 'object'
     ? campaign.user._id
     : campaign?.user;
     
  const isOwner =
   user?._id &&
   campaignOwnerId &&
   user._id.toString() === campaignOwnerId.toString();

  const handleSave = async (updates) => {
    await API.patch(`/campaigns/${slug}`, updates);
    queryClient.invalidateQueries(['publicCampaign', slug]);
    setEditing(false);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    let sessionId = localStorage.getItem("sessionId");
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      localStorage.setItem("sessionId", sessionId);
    }
  }, []);

  useEffect(() => {
    getGeoLocation(slug)
      .then(setGeo)
      .catch(() => setGeo(null));
    setDevice(getDeviceType());
  }, [slug]);
  
  useEffect(() => {
    if (campaignData) {
      setCampaign(campaignData);
      setLoading(false);
      if (campaignData.customCSS) {
        const style = document.createElement("style");
        style.innerHTML = campaignData.customCSS;
        document.head.appendChild(style);
      }
    }
  }, [campaignData]);

  useEffect(() => {
    if (!campaignData && !campaignLoading && !isError) {
      (async () => {
        try {
          const bioRes = await API.get(`/biolinks/public/${slug}`);
          setBiolink(bioRes.data);
        } catch (err) {
          console.error("Link not found");
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [campaignData, campaignLoading, isError, slug]);

  const handleClick = async (link, platform) => {
    try {
      await API.post(`/campaigns/track/${slug}`, {
        platform,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        referrer: document.referrer,
        sessionId: localStorage.getItem("sessionId"),
      });
    } catch (err) {
      console.error("Failed to track click:", err);
    }
  
    window.open(link, "_blank");
    setClickCount((prev) => prev + 1);
  };
  
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post(`/campaigns/email/${slug}`, { 
        email,
        sessionId: localStorage.getItem("sessionId"),
        metadata: {
          source: 'presave_landing',
          clicks: clickCount,
          userAgent: navigator.userAgent
        }
      });
      setEmailSubmitted(true);
      setEmail("");
      setTimeout(() => setEmailSubmitted(false), 3000);
    } catch (err) {
      console.error("Failed to submit email:", err);
    }
  };

  if (campaignLoading || loading) return <LoadingScreen message="Loading your dashboard..." />;

  if (!campaign && !biolink) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 p-6 text-center">
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="text-4xl mb-4 text-indigo-500"
        >
          <FiMusic />
        </motion.div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Link Not Found</h1>
        <p className="text-gray-600 max-w-md">
          The link you're looking for doesn't exist or may have been removed.
        </p>
        <a 
          href="/" 
          className="mt-4 inline-flex items-center px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
        >
          Return Home
        </a>
      </div>
    );
  }

  if (campaign) {
    const isReleased = campaign.status === "released";
    const releaseDate = new Date(campaign.releaseDate);
    const currentDate = new Date();
    const releaseInDays = Math.ceil((releaseDate - currentDate) / (1000 * 60 * 60 * 24));
    const releaseDateFormatted = releaseDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const getSortedLinks = () => {
      if (!campaign?.serviceLinks) return [];
    
      const entries = Object.entries(smartLinks).filter(([_, url]) => url);
    
      let priority = null;
    
      if (geo?.country === "NG") {
        priority = "spotify";
      } else {
        priority = "boomplay";
      }
    
      if (device === "ios") priority = "apple";
      if (device === "android") priority = "spotify";
    
      const sorted = [...entries].sort(([a], [b]) => {
        if (a === priority) return -1;
        if (b === priority) return 1;
        return 0;
      });
    
      return sorted.filter(([platform]) => {
        if (activeTab === "all") return true;
        return getPlatformCategory(platform) === activeTab;
      });
    };
    
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Edit Button */}
        {isOwner && (
          <div className="absolute top-6 right-6 z-50">
            <motion.button
              onClick={() => setEditing(!editing)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg transition-all ${
                editing
                  ? 'bg-indigo-700 text-white hover:bg-indigo-800'
                  : 'bg-white text-indigo-700 hover:bg-gray-50 border border-indigo-200'
              }`}
            >
              {editing ? (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Exit Edit
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  Edit Page
                </>
              )}
            </motion.button>
          </div>
        )}

        {/* Background */}
        <div className="fixed inset-0 -z-10">
          {campaign.bgType === 'solid' ? (
            <div
              className="w-full h-full"
              style={{ backgroundColor: campaign.bgColor }}
            />
          ) : campaign.bgType === 'none' ? (
            <div className="w-full h-full" />
          ) : (
            <>
              <img
                src={campaign.artwork}
                alt="Background"
                className="w-full h-full object-cover transform scale-105"
              />
              <div
                className="absolute inset-0"
                style={{
                  backgroundColor: 'rgba(0,0,0,0.2)',
                  backdropFilter: `blur(${campaign.blurOpacity ?? campaign.blurPx ?? 20}px)`,
                }}
              />
            </>
          )}
        </div>

        <div className="relative z-10 py-12 px-4 sm:px-6 lg:px-8">
          {editing ? (
            <PageEditor campaign={campaign} onSave={handleSave} />
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-md mx-auto bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden md:max-w-2xl border border-white/30"
            >
              <div className="p-8">
                <CampaignHeader
                  artwork={campaign.artwork}
                  title={campaign.title}
                  artist={campaign.artist}
                  isReleased={isReleased}
                  releaseDate={campaign.releaseDate}
                  type={campaign.type}
                />

                {/* Platform Tabs */}
                <div className="flex mb-4 border-b border-gray-200/50">
                  <button
                    className={`px-4 py-2 text-sm font-medium ${
                      activeTab === "all" 
                        ? 'text-indigo-600 border-b-2 border-indigo-600' 
                        : 'text-gray-700 hover:text-gray-900'
                    }`}
                    onClick={() => setActiveTab("all")}
                  >
                    All Platforms
                  </button>
                </div>

                <div className="space-y-3 mb-6">
                  {getSortedLinks().map(([platform, link]) => (
                    <PlatformButton
                      key={platform}
                      platform={platform}
                      url={link}
                      onClick={handleClick}
                      disabled={!link}
                    />
                  ))}
                </div>

                {campaign.type === "presave" && !isReleased && (
                  <EmailCaptureForm
                    initialClicks={clickCount}
                    onSubmit={async (email, clicks) => {
                      await API.post(`/campaigns/email/${slug}`, {
                        email,
                        sessionId: localStorage.getItem("sessionId"),
                        metadata: {
                          source: 'presave_landing',
                          clicks,
                          userAgent: navigator.userAgent
                        }
                      });
                    }}
                  />
                )}

                <div className="text-center mt-6">
                  <QRCode 
                    value={window.location.href} 
                    size={128} 
                    bgColor="transparent"
                    fgColor="currentColor"
                    className="text-gray-700 inline-block p-2 bg-white rounded"
                  />
                  <p className="text-sm mt-2 text-gray-500">Scan to open this link</p>
                </div>

                {clickCount > 0 && (
                  <motion.div
                    className="mt-4 text-center text-sm text-gray-600"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {clickCount} {clickCount === 1 ? 'click' : 'clicks'} tracked
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {/* Share Section */}
          {isLoggedIn && (
            <ShareLinks
              slug={slug}
              smartLinks={smartLinks}
              campaignType={campaign.type}
            />
          )}
        </div>
      </div>
    );
  }

  if (biolink) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {biolink.profileImage && (
          <div className="fixed inset-0 -z-10">
            <img
              src={biolink.profileImage}
              alt="Background"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30 backdrop-blur-3xl"></div>
          </div>
        )}

        <div className="relative z-10 py-12 px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-md mx-auto bg-white/90 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden md:max-w-2xl border border-white/20"
          >
            <div className="p-8">
              <div className="flex flex-col items-center mb-6">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="relative group"
                >
                  <img
                    src={biolink.profileImage}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-white/50 shadow-lg"
                  />
                  <div className="absolute inset-0 bg-black/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <FiExternalLink className="text-white text-2xl" />
                  </div>
                </motion.div>
                <h1 className="text-3xl font-bold text-gray-800 mt-4">
                  {biolink.title}
                </h1>
                {biolink.bio && (
                  <p className="text-gray-600 text-center mt-2 text-lg">{biolink.bio}</p>
                )}
              </div>

              <div className="space-y-3 mb-6">
                {Object.entries(biolink.socialLinks || {})
                  .filter(([_, link]) => link)
                  .map(([platform, link]) => (
                    <motion.a
                      key={platform}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${getPlatformColor(
                        platform
                      )} text-white px-4 py-3 rounded-lg flex items-center justify-center transition-all shadow-md hover:shadow-lg`}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {getPlatformIcon(platform)}
                      <span className="font-medium">{getPlatformName(platform)}</span>
                    </motion.a>
                  ))}

                {biolink.merchLink && (
                  <motion.a
                    href={biolink.merchLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-4 py-3 rounded-lg flex items-center justify-center transition-all shadow-md hover:shadow-lg"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FiExternalLink className="mr-2" />
                    <span className="font-medium">Visit Merch Store</span>
                  </motion.a>
                )}
              </div>

              {biolink.customLinks && biolink.customLinks.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-center font-medium text-gray-700 mb-3 text-lg">
                    More Links
                  </h3>
                  <div className="space-y-3">
                    {biolink.customLinks.map((link, index) => (
                      <motion.a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block bg-gray-100/90 hover:bg-gray-200 text-gray-800 px-4 py-3 rounded-lg transition-all text-center font-medium shadow-sm hover:shadow-md"
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {link.title}
                      </motion.a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {isLoggedIn && <ShareSectionBio slug={slug} />}
        </div>
      </div>
    );
  }

  return null;
};

export default PublicLink;
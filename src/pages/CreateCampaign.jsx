import React, { useState,useEffect  } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../services/api";
import SuccessModal from "../components/SuccessModal";
import { motion } from "framer-motion";
import { FaSpotify, FaApple, FaYoutube, FaInstagram, FaTwitter, FaTiktok, FaLink } from "react-icons/fa";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import QRCode from "react-qr-code";
import { FiCopy } from "react-icons/fi";
import AICopyGenerator from "../components/AICopyGenerator";
// Initialize Cloudinary

const CreateCampaign = () => {
  const { type } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const [step, setStep] = useState(() => {
    const savedStep = localStorage.getItem("createCampaignStep");
    return savedStep ? parseInt(savedStep, 10) : 1;
  });
  
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem("createCampaignData");
    return savedData ? JSON.parse(savedData) : {
      subdomain: "", 
      title: "",
      artistName: "",
      releaseDate: "",
      ctaMessage: "",
      artwork: "",
      spotify: "",
      apple: "",
      boomplay: "",
      audiomack: "",
      youtube: "",
      profileImage: "",
      bio: "",
      instagram: "",
      twitter: "",
      tiktok: "",
      website: "",
      merchLink: "",
    };
  });
  useEffect(() => {
    localStorage.setItem("createCampaignData", JSON.stringify(formData));
  }, [formData]);
    
  const [upc, setUpc] = useState("");
  const [fetchingLinks, setFetchingLinks] = useState(false);
  const [slug, setSlug] = useState("");
  const [slugAvailable, setSlugAvailable] = useState(null);
  const [shortUrl, setShortUrl] = useState(null);

  useEffect(() => {
    localStorage.setItem("createCampaignStep", step);
  }, [step]);

  // Handle file upload to Cloudinary
  const handleUpload = async (file, fieldName) => {
    setUploading(true);
    try {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET);
  
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: data,
        }
      );
      const result = await res.json();
      setFormData((prev) => ({ ...prev, [fieldName]: result.secure_url }));
      toast.success("Image uploaded successfully!");
    } catch (err) {
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };
  

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const validateUrl = (url) => {
    if (!url) return true;
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };
  

  const validateFields = (stepToValidate) => {
    const errors = {};
    
    if (stepToValidate === 1) {
      if (!formData.title.trim()) {
        errors.title = "Title is required";
      }
      
      if ((type === "presave" || type === "smartlink") && !formData.artwork) {
        errors.artwork = "Artwork is required";
      }
      
      if (type === "presave" && !formData.releaseDate) {
        errors.releaseDate = "Release date is required";
      }
      
      if (type === "biolink" && !formData.profileImage) {
        errors.profileImage = "Profile image is required";
      }
    }
    
    if (stepToValidate === 2) {
      if (type === "biolink") {
        ["instagram", "twitter", "tiktok", "youtube", "website", "merchLink"].forEach(key => {
          if (formData[key] && !validateUrl(formData[key])) {
            errors[key] = "Please enter a valid URL";
          }
        });
      } else {
        ["spotify", "apple", "boomplay", "audiomack", "youtube"].forEach(key => {
          if (formData[key] && !validateUrl(formData[key])) {
            errors[key] = "Please enter a valid URL";
          }
        });
      }
    }
    
    return errors;
  };
  const handleFetchLinks = async () => {
    if (!upc.trim()) return;
  
    setFetchingLinks(true);
  
    try {
      const res = await fetch(`/campaigns/spotify/links?upc=${encodeURIComponent(upc.trim())}`);
      
      if (!res.ok) {
        throw new Error("Invalid response from server");
      }
  
      const data = await res.json();
      console.log("🧾 Response from /spotify/links:", data);
  
      if (!data.title && !data.spotify && !data.apple && !data.youtube && !data.artwork && !data.releaseDate) {
        toast.error("No info found for this UPC.");
        return;
      }
  
      setFormData((prev) => ({
        ...prev,
        title: data.title || prev.title,
        artistName: data.artist || prev.artistName,
        artwork: data.artwork || prev.artwork,
        releaseDate: data.releaseDate || prev.releaseDate,
        spotify: data.spotify || prev.spotify,
        apple: data.apple || prev.apple,
        youtube: data.youtube || prev.youtube,
        boomplay: data.boomplay || prev.boomplay,
        audiomack: data.audiomack || prev.audiomack,
      }));
  
      if (data.title) {
        checkSlugAvailability(data.title);
      }
  
      toast.success("UPC info fetched!", {
  icon: (
    <motion.div
      animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
      transition={{ duration: 0.5 }}
    >
      ✓
    </motion.div>
  )
})
      
    } catch (err) {
      console.error("UPC fetch error:", err);
      toast.error("Something went wrong while fetching the UPC data.");
    } finally {
      setFetchingLinks(false);
    }
  };
  
  const handleNext = () => {
    const errors = validateFields(step);
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      Object.values(errors).forEach(error => toast.error(error));
      return;
    }
    
    setFormErrors({});
    setStep(step + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePrev = () => {
    setStep(step - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const checkSlugAvailability = async (value) => {
    const formatted = value
      .toLowerCase()
      .replace(/[*+~.()'"!:@]/g, "")
      .replace(/\s+/g, "");
  
    setSlug(formatted);
  
    if (!formatted) {
      setSlugAvailable(null);
      return;
    }
  
    try {
      const res = await fetch(`/campaigns/check-slug/${formatted}`);
      const data = await res.json();
      setSlugAvailable(data.available);
    } catch (err) {
      console.error("Slug check failed:", err);
      setSlugAvailable(null);
    }
  };
  
  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      handleUpload(file, fieldName);
    }
  };
  useEffect(() => {
    return () => {
      // Cleanup function that runs when component unmounts
      if (showSuccess) {
        localStorage.removeItem("createCampaignData");
        localStorage.removeItem("createCampaignStep");
      }
    };
  }, [showSuccess]);
  const handleSubmit = async () => {
    if (!user) {
      toast.error("You must be logged in to create a campaign.");
      navigate("/login");
      return;
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading("Creating your link...");
    
    try {
      let payload;
      if (type === "biolink") {
        payload = {
          title: formData.title,
          artistName: formData.artistName,
          profileImage: formData.profileImage,
          bio: formData.bio,
          socialLinks: {
            instagram: formData.instagram,
            twitter: formData.twitter,
            tiktok: formData.tiktok,
            youtube: formData.youtube,
            website: formData.website,
          },
          merchLink: formData.merchLink,
          userEmail: user.email,
        };
        await API.post("/biolinks", payload);
      } else {
        payload = {
          title: formData.title,
          releaseDate: formData.releaseDate,
          ctaMessage: type === "presave" ? formData.ctaMessage : "",
          artwork: formData.artwork,
          serviceLinks: {
            spotify: formData.spotify,
            apple: formData.apple,
            boomplay: formData.boomplay,
            audiomack: formData.audiomack,
            youtube: formData.youtube,
          },
          userEmail: user.email,
          type: type || "smartlink",
          subdomain: formData.subdomain?.toLowerCase().trim(),
          vanitySlug: formData.vanitySlug?.toLowerCase().trim(),
        };
        payload = {
          ...payload,
          vanitySlug: formData.vanitySlug?.trim().toLowerCase() || undefined,
        };
        payload.liveStreamUrl = formData.liveStreamUrl;
        const res = await API.post("/campaigns", payload);
        setShowSuccess(true);
        localStorage.removeItem("createCampaignData");
        localStorage.removeItem("createCampaignStep");
        const short = await API.post(`/shortlinks/${res.data._id}`, {
          target: `${window.location.origin}/${res.data.slug}`, // or your full link logic
        });
        setShortUrl(short.data.shortUrl); 
        setTimeout(() => {
          navigate(`/${res.data.slug}`);
        }, 2000);
        return;
      }
      payload.subdomain = formData.subdomain?.toLowerCase().trim();

      setShowSuccess(true);
      localStorage.removeItem("createCampaignData");
      localStorage.removeItem("createCampaignStep");
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (error) {
      console.error("Error creating campaign:", error);
      toast.error(`Error creating ${type} link: ${error.response?.data?.message || error.message}`);
    } finally {
      toast.dismiss(loadingToast);
      setIsSubmitting(false);
    }
  };

  const progress = (step / 3) * 100;
  const today = new Date().toISOString().split('T')[0];

  // Function to get platform icon
  const getPlatformIcon = (platform) => {
    switch(platform) {
      case 'spotify': return <FaSpotify className="text-green-500" />;
      case 'apple': return <FaApple className="text-black" />;
      case 'youtube': return <FaYoutube className="text-red-500" />;
      case 'instagram': return <FaInstagram className="text-pink-500" />;
      case 'twitter': return <FaTwitter className="text-blue-400" />;
      case 'tiktok': return <FaTiktok className="text-black" />;
      default: return <FaLink className="text-blue-500" />;
    }
  };


  const renderLink = (type) => {
    const defaultSlug = slug || "your-link";
    const baseSlug = defaultSlug.replace(/\s+/g, "").toLowerCase();
  
    const domain = {
      subdomain: user?.isPremium && formData.subdomain
        ? `https://${formData.subdomain}.aday.io/${baseSlug}`
        : `${window.location.origin}/${baseSlug}`, // ← fallback to origin
    };
  
    return domain.subdomain;
  };
  
  
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };
  
  return (
    <div className="p-4 md:p-6 max-w-lg mx-auto relative min-h-screen">
      <div className="w-full h-2 bg-gray-200 rounded-full mb-6 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500 ease-in-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 mb-6 transition-all duration-300 hover:shadow-lg">
      <h2 className="text-2xl mb-4 font-bold text-gray-800 dark:text-gray-100 text-center font-display">
  Create {type ? type.charAt(0).toUpperCase() + type.slice(1) : "Campaign"}
</h2>

        {step === 1 && (
          <>
   {/* Only show UPC field for presave/smartlink */}
   {(type === "presave" || type === "smartlink") && (
      <div className="mb-6 overflow-hidden rounded-lg">
        <motion.div
          initial={false}
          animate={{
            backgroundPosition: fetchingLinks ? ['0% 0%', '100% 0%'] : '0% 0%',
            backgroundSize: fetchingLinks ? '200% 100%' : '100% 100%'
          }}
          transition={{
            duration: 2,
            repeat: fetchingLinks ? Infinity : 0,
            ease: "linear"
          }}
          className="p-4 border border-blue-100 bg-gradient-to-r from-blue-50 to-blue-100"
        >
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 font-sans">
            UPC (Optional - Auto fetch links)
          </label>
          <button 
            type="button" 
            className="text-blue-500 hover:text-blue-700"
            onClick={() => toast('UPC is a unique product code for your release')}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
            </svg>
          </button>
          <div className="flex gap-2">
            <input
              type="text"
              name="upc"
              placeholder="Enter UPC"
              value={upc}
              onChange={(e) => setUpc(e.target.value)}
              className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all border-gray-300 bg-white"
            />
            <motion.button
              type="button"
              onClick={handleFetchLinks}
              disabled={fetchingLinks}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:opacity-70 flex items-center justify-center min-w-[90px]"
            >
              {fetchingLinks ? (
                <>
                  <motion.span
                    animate={{ opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="flex items-center"
                  >
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Fetching
                  </motion.span>
                </>
              ) : (
                'Fetch'
              )}
            </motion.button>
          </div>
          {fetchingLinks && (
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 2 }}
              className="h-1 bg-blue-300 mt-2 rounded-full overflow-hidden"
            >
              <motion.div
                className="h-full bg-blue-500"
                animate={{
                  backgroundPosition: ['0% 0%', '100% 0%']
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            </motion.div>
          )}
        </motion.div>
      </div>
    )}
            <h3 className="text-lg mb-4 font-semibold text-gray-700 border-b pb-2">Basic Info</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title*</label>
                <input
                  type="text"
                  name="title"
                  placeholder="Enter title"
                  value={formData.title}
                  onChange={(e) => {
                    handleInputChange(e);
                    checkSlugAvailability(e.target.value);
                  }}
                  required
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                    formErrors.title ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {formErrors.title && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.title}</p>
                )}
              </div>
              {slug && (
                <div className="mt-2 text-sm">
                  <span className="text-gray-500">Your link will be:</span>{" "}
                  <span className={`font-mono ${slugAvailable === false ? "text-red-600" : "text-green-600"}`}>
                    {window.location.origin}/{slug}
                  </span>
                  {slugAvailable === false && (
                    <p className="text-xs text-red-600">This slug is taken, try another title.</p>
                  )}
                </div>
              )}
              {formData.artistName && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Artist Name</label>
                  <input
                    type="text"
                    value={formData.artistName}
                    readOnly
                    className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-700 cursor-not-allowed"
                  />
                </div>
              )}
              
              {(type === "presave" || type === "smartlink") && (
                <>
                  {type === "presave" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Release Date*</label>
                      <input
                        type="date"
                        name="releaseDate"
                        value={formData.releaseDate}
                        onChange={handleInputChange}
                        min={today}
                        required
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                          formErrors.releaseDate ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                      {formErrors.releaseDate && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.releaseDate}</p>
                      )}
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Artwork* {uploading && <span className="text-blue-500">(Uploading...)</span>}
                    </label>
                    {formData.artwork ? (
                      <div className="relative group">
                        <img 
                          src={formData.artwork} 
                          alt="Artwork" 
                          className="w-full h-48 object-contain rounded-lg border"
                        />
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, artwork: "" }))}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                            </svg>
                            <p className="mb-2 text-sm text-gray-500">Click to upload or drag and drop</p>
                            <p className="text-xs text-gray-500">PNG, JPG, JPEG (Max 5MB)</p>
                          </div>
                          <input 
                            id="artwork-upload" 
                            type="file" 
                            className="hidden" 
                            accept="image/*"
                            onChange={(e) => handleFileChange(e, 'artwork')}
                          />
                        </label>
                      </div>
                    )}
                    {formErrors.artwork && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.artwork}</p>
                    )}
                  </div>
                  {type === "presave" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Custom CTA Message</label>
                      <textarea
                        name="ctaMessage"
                        placeholder="Enter your call-to-action message"
                        value={formData.ctaMessage}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        rows="3"
                      ></textarea>
                    </div>
                  )}
                  {type === "presave" && (
  <AICopyGenerator 
    label="Need help with your call-to-action?"
    onGenerated={(text) => setFormData((prev) => ({ ...prev, ctaMessage: text }))}
  />
)}

                </>
              )}
              
              {type === "biolink" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Profile Image* {uploading && <span className="text-blue-500">(Uploading...)</span>}
                    </label>
                    {formData.profileImage ? (
                      <div className="relative group">
                        <img 
                          src={formData.profileImage} 
                          alt="Profile" 
                          className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg mx-auto"
                        />
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, profileImage: "" }))}
                          className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-gray-300 border-dashed rounded-full cursor-pointer bg-gray-50 hover:bg-gray-100 mx-auto">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                            </svg>
                          </div>
                          <input 
                            id="profile-upload" 
                            type="file" 
                            className="hidden" 
                            accept="image/*"
                            onChange={(e) => handleFileChange(e, 'profileImage')}
                          />
                        </label>
                      </div>
                    )}
                    {formErrors.profileImage && (
                      <p className="mt-1 text-sm text-red-600 text-center">{formErrors.profileImage}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Short Bio</label>
                    <textarea
                      name="bio"
                      placeholder="Tell people about yourself"
                      value={formData.bio}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      rows="3"
                    ></textarea>
                  </div>
                </>
              )}
            </div>
            {user?.isPremium && (
  <div className="mt-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">Custom Subdomain</label>
    <input
      type="text"
      name="subdomain"
      placeholder="e.g. blazerq"
      value={formData.subdomain}
      onChange={handleInputChange}
      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    />
    <p className="text-sm text-gray-500 mt-1">
      Your link will be:{" "}
      <strong>
        {formData.subdomain
          ? `https://${formData.subdomain}.aday.io/${slug || "your-link"}`
          : `https://aday.io/${slug || "your-link"}`}
      </strong>
    </p>
  </div>
)}
{user?.isPremium && (
  <div className="mt-6">
    <label className="block text-sm font-medium text-gray-700 mb-1">Custom Short Link (Vanity Slug)</label>
    <input
      type="text"
      name="vanitySlug"
      placeholder="e.g. blazerq"
      value={formData.vanitySlug || ""}
      onChange={async (e) => {
        const value = e.target.value.toLowerCase().trim();
        setFormData((prev) => ({ ...prev, vanitySlug: value }));

        if (!value) return;

        try {
          const res = await fetch(`/campaigns/check-vanity/${value}`);
          const data = await res.json();

          if (!data.available) {
            toast.error(
              data.reason === "reserved"
                ? "This word is reserved"
                : "Vanity slug is already taken"
            );
          } else {
            toast.success("Vanity slug is available!");
          }
        } catch (err) {
          console.error("Vanity check failed:", err);
        }
      }}
      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    />
    <p className="text-sm text-gray-500 mt-1">
      Your pro shortlink will be:{" "}
      <strong>
        https://aday.to/v/{formData.vanitySlug || "your-slug"}
      </strong>
    </p>
  </div>
)}





            <button
              onClick={handleNext}
              disabled={uploading}
              className={`mt-6 w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-md ${
                uploading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Continue
            </button>
          </>
        )}

        {step === 2 && (
          <>
            {type === "biolink" ? (
              <>
                <h3 className="text-lg mb-4 font-semibold text-gray-700 border-b pb-2">Social & Merch Links</h3>
                <div className="space-y-4">
                  {["instagram", "twitter", "tiktok", "youtube", "website", "merchLink"].map((key) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {key.charAt(0).toUpperCase() + key.slice(1)} Link
                      </label>
                      <input
                        type="text"
                        name={key}
                        placeholder={`https://${key}.com/yourusername`}
                        value={formData[key]}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                          formErrors[key] ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                      {formErrors[key] && (
                        <p className="mt-1 text-sm text-red-600">{formErrors[key]}</p>
                      )}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <h3 className="text-lg mb-4 font-semibold text-gray-700 border-b pb-2">Add Service Links</h3>
                <div className="space-y-4">
                  {["spotify", "apple", "boomplay", "audiomack", "youtube"].map((platform) => (
                    <div key={platform}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {platform.charAt(0).toUpperCase() + platform.slice(1)} Link
                      </label>
                      <input
                        type="text"
                        name={platform}
                        placeholder={`https://${platform}.com/yourmusic`}
                        value={formData[platform]}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                          formErrors[platform] ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                      <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Live Stream URL (YouTube/Twitch embed)
    </label>
    <input
      type="text"
      name="liveStreamUrl"
      placeholder="https://www.youtube.com/watch?v=…"
      value={formData.liveStreamUrl || ""}
      onChange={handleInputChange}
      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
    />
  </div>
                      {formErrors[platform] && (
                        <p className="mt-1 text-sm text-red-600">{formErrors[platform]}</p>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}

            <div className="flex justify-between mt-6 space-x-4">
              <button
                onClick={handlePrev}
                className="w-1/2 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition-all duration-300"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                className="w-1/2 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-md"
              >
                Continue
              </button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={cardVariants}
              className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl shadow-lg mb-6 border border-gray-200"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="bg-blue-100 text-blue-600 p-2 rounded-full mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                  </svg>
                </span>
                Campaign Summary
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-sm font-medium text-gray-500">Type</p>
                  <p className="font-semibold capitalize">{type}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-sm font-medium text-gray-500">Title</p>
                  <p className="font-semibold">{formData.title}</p>
                </div>
              </div>

              {(type === "presave" || type === "smartlink") ? (
                <>
                  {formData.releaseDate && (
                    <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
                      <p className="text-sm font-medium text-gray-500">Release Date</p>
                      <p className="font-semibold">{new Date(formData.releaseDate).toLocaleDateString()}</p>
                    </div>
                  )}

                  {formData.artwork && (
                    <div className="mb-6">
                      <p className="text-sm font-medium text-gray-500 mb-2">Artwork Preview</p>
                      <div className="relative group">
                        <img 
                          src={formData.artwork} 
                          alt="Artwork" 
                          className="rounded-xl w-full h-auto max-h-60 object-contain border-2 border-white shadow-lg transform group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => e.target.src = "https://via.placeholder.com/300"}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                          <span className="text-white text-sm">Click to enlarge</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                    <span className="bg-blue-100 text-blue-600 p-1 rounded-full mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
                      </svg>
                    </span>
                    Music Links
                  </h4>

                  <DragDropContext onDragEnd={() => {}}>
                    <Droppable droppableId="links">
                      {(provided) => (
                        <div 
                          {...provided.droppableProps} 
                          ref={provided.innerRef}
                          className="space-y-2"
                        >
                          {["spotify", "apple", "boomplay", "audiomack", "youtube"].map((platform, index) => (
                            formData[platform] && (
                              <Draggable key={platform} draggableId={platform} index={index}>
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className="bg-white p-3 rounded-lg shadow-xs border border-gray-100 hover:shadow-md transition-shadow flex items-center"
                                  >
                                    <div className="mr-3 text-xl">
                                      {getPlatformIcon(platform)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium text-gray-700 truncate">
                                        <a 
                                          href={formData[platform]} 
                                          target="_blank" 
                                          rel="noopener noreferrer"
                                          className="hover:text-blue-600 hover:underline"
                                        >
                                          {formData[platform]}
                                        </a>
                                      </p>
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            )
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                </>
              ) : (
                <>
                  {formData.profileImage && (
                    <div className="mb-6 text-center">
                      <p className="text-sm font-medium text-gray-500 mb-2">Profile Image</p>
                      <div className="inline-block relative group">
                        <img 
                          src={formData.profileImage} 
                          alt="Profile" 
                          className="rounded-full w-24 h-24 object-cover border-4 border-white shadow-lg transform group-hover:scale-110 transition-transform duration-300"
                          onError={(e) => e.target.src = "https://via.placeholder.com/150"}
                        />
                        <div className="absolute inset-0 bg-black/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <span className="text-white text-xs">Change</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {formData.bio && (
                    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                      <p className="text-sm font-medium text-gray-500 mb-2">Bio</p>
                      <p className="text-gray-700 whitespace-pre-line">{formData.bio}</p>
                    </div>
                  )}

                  <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                    <span className="bg-blue-100 text-blue-600 p-1 rounded-full mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                        <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                      </svg>
                    </span>
                    Social Links
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {["instagram", "twitter", "tiktok", "youtube", "website", "merchLink"].map((platform) => (
                      formData[platform] && (
                        <motion.div 
                          key={platform}
                          whileHover={{ y: -2 }}
                          className="bg-white p-3 rounded-lg shadow-xs border border-gray-100 hover:shadow-md transition-shadow flex items-center"
                        >
                          <div className="mr-3 text-xl">
                            {getPlatformIcon(platform)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-700 truncate">
                              <a 
                                href={formData[platform]} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="hover:text-blue-600 hover:underline"
                              >
                                {platform === 'website' ? 'Website' : 
                                 platform === 'merchLink' ? 'Merch Store' : 
                                 platform.charAt(0).toUpperCase() + platform.slice(1)}
                              </a>
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {formData[platform].replace(/(^\w+:|^)\/\//, '')}
                            </p>
                          </div>
                        </motion.div>
                      )
                    ))}
                  </div>
                </>
              )}
            </motion.div>

            <div className="flex justify-between space-x-4">
              <button
                onClick={handlePrev}
                className="w-1/2 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition-all duration-300"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`w-1/2 bg-gradient-to-r from-green-500 to-teal-600 text-white py-3 rounded-lg font-medium hover:from-green-600 hover:to-teal-700 transition-all duration-300 shadow-md ${
                  isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  "Submit"
                )}
              </button>
            </div>
          </>
        )}
        {step === 3 && (
  <div className="bg-white p-4 rounded-xl shadow-md mb-6">
    <h4 className="text-lg font-semibold mb-4">Shareable Link</h4>

    {user?.isPremium && formData.subdomain && (
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-mono break-all">{renderLink("subdomain")}</span>
        <button
          onClick={() => handleCopy(renderLink("subdomain"))}
          className="ml-3 text-blue-600 hover:text-blue-800"
        >
          <FiCopy />
        </button>
      </div>
    )}

    <div className="flex items-center justify-between mb-3">
      <span className="text-sm font-mono break-all">{renderLink("short")}</span>
      <button
        onClick={() => handleCopy(renderLink("short"))}
        className="ml-3 text-blue-600 hover:text-blue-800"
      >
        <FiCopy />
      </button>
    </div>

    <div className="mt-6 text-center">
    <h4 className="text-md font-semibold mb-2">Main Link QR</h4>
<QRCode value={renderLink("subdomain")} size={128} />

{shortUrl && (
  <>
    <h4 className="text-md font-semibold mt-4 mb-2">Short Link QR</h4>
    <QRCode value={shortUrl} size={128} />
    <p className="text-sm mt-1 text-gray-500">Scan to open short version</p>
  </>
)}

      <p className="text-sm mt-2 text-gray-500">Scan to open your main link</p>
    </div>
  </div>
)}


             </div>

      <SuccessModal
        show={showSuccess}
        message={`Your ${type} link was created successfully!`}
        onClose={() => setShowSuccess(false)}
      />
    </div>
  );
};

export default CreateCampaignOld;
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";

import API from "../../services/api";
import SuccessModal from "../../components/common/SuccessModal";
import Step1BasicInfo from "../../components/CreateCampaign/Step1BasicInfo";
import Step2ServiceLinks from "../../components/CreateCampaign/Step2ServiceLinks";
import Step3Summary from "../../components/CreateCampaign/Step3Summary";

import useSlugAvailability from "../../hooks/useSlugAvailability";
import useUPCFetch from "../../hooks/useUPCFetch";
import useUploadHandler from "../../hooks/useUploadHandler";

import { validateFields } from "../../utils/validators";
import { getPlatformIcon } from "../../utils/icons";
import { renderCampaignLink } from "../../utils/links";

const CreateCampaignPage = () => {
  const { type } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [step, setStep] = useState(() => Number(localStorage.getItem("createCampaignStep")) || 1);
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem("createCampaignData");
    return saved ? JSON.parse(saved) : defaultFormData();
  });
  const [formErrors, setFormErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [shortUrl, setShortUrl] = useState(null);

  const { slug, slugAvailable, checkSlugAvailability } = useSlugAvailability();
  const { upc, setUpc, fetchingLinks, handleFetchLinks, error, setError } = useUPCFetch(setFormData, checkSlugAvailability);
  const { uploading, handleUpload } = useUploadHandler(setFormData);

  const today = new Date().toISOString().split('T')[0];
  const progress = (step / 3) * 100;

  useEffect(() => {
    localStorage.setItem("createCampaignData", JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    localStorage.setItem("createCampaignStep", step);
  }, [step]);

  useEffect(() => {
    return () => {
      if (showSuccess) {
        localStorage.removeItem("createCampaignData");
        localStorage.removeItem("createCampaignStep");
      }
    };
  }, [showSuccess]);

  // 🚀 Campaign Creation Mutation
  const createCampaignMutation = useMutation({
    mutationFn: async (payload) => {
      if (type === "biolink") {
        return API.post("/biolinks", payload);
      } else {
        return API.post("/campaigns", payload);
      }
    },
    onSuccess: async (res) => {
      if (type === "biolink") {
        handleSuccessRedirect(type);
      } else {
        const campaign = res.data;
        await createShortlink(campaign._id, campaign.slug);
        handleSuccessRedirect(type, campaign.slug);
      }
    },
    onError: (error) => {
      console.error("Create campaign error:", error);
      toast.error(error.response?.data?.message || error.message);
    }
  });

  // 🚀 Shortlink Creation Mutation
  const createShortlinkMutation = useMutation({
    mutationFn: (data) => API.post(`/shortlinks/${data.id}`, { target: data.target }),
    onSuccess: (data) => {
      setShortUrl(data.data.shortUrl);
    },
    onError: (error) => {
      console.error("Create shortlink error:", error);
      toast.error(error.response?.data?.message || error.message);
    }
  });

  const handleSubmit = () => {
    if (!user) {
      toast.error("You must be logged in to create a campaign.");
      navigate("/login");
      return;
    }

    const payload = buildPayload(type, formData, user);
    createCampaignMutation.mutate(payload);
  };

  const createShortlink = async (id, slug) => {
    await createShortlinkMutation.mutateAsync({
      id,
      target: `${window.location.origin}/${slug}`,
    });
  };

  const handleSuccessRedirect = (type, slug) => {
    setShowSuccess(true);
    localStorage.removeItem("createCampaignData");
    localStorage.removeItem("createCampaignStep");
    setTimeout(() => {
      if (type === "biolink") {
        navigate("/dashboard");
      } else {
        navigate(`/${slug}`);
      }
    }, 2000);
  };

  const handleNext = () => {
    const errors = validateFields(formData, type, step);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      Object.values(errors).forEach(e => toast.error(e));
      return;
    }
    setFormErrors({});
    setStep(prev => prev + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePrev = () => {
    setStep(prev => prev - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) handleUpload(file, fieldName);
  };

  const renderLink = () => renderCampaignLink(user, formData.subdomain, slug);

  return (
    <div className="p-4 md:p-6 max-w-lg mx-auto relative min-h-screen">
      <ProgressBar progress={progress} />
      <Card>
        <Header type={type} />
        {step === 1 && (
          <Step1BasicInfo {...step1Props()} />
        )}
        {step === 2 && (
          <Step2ServiceLinks {...step2Props()} />
        )}
        {step === 3 && (
          <Step3Summary {...step3Props()} />
        )}
      </Card>
      <SuccessModal
        show={showSuccess}
        message={`Your ${type} link was created successfully!`}
        onClose={() => setShowSuccess(false)}
      />
    </div>
  );

  function step1Props() {
    return {
      type,
      formData,
      handleInputChange,
      handleFileChange,
      formErrors,
      checkSlugAvailability,
      slug,
      slugAvailable,
      uploading,
      today,
      setFormData,
      upc,
      setUpc,
      handleFetchLinks,
      fetchingLinks,
      handleNext,
      user,
      error,
      setError
    };
  }

  function step2Props() {
    return {
      type,
      formData,
      handleInputChange,
      handleFileChange,
      formErrors,
      uploading,
      handleNext,
      handlePrev
    };
  }

  function step3Props() {
    return {
      type,
      formData,
      getPlatformIcon,
      handlePrev,
      handleSubmit,
      isSubmitting: createCampaignMutation.isPending,
      user,
      shortUrl,
      renderLink,
      handleCopy: (text) => {
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard!");
      }
    };
  }
};

// UI Helpers
const ProgressBar = ({ progress }) => (
  <div className="w-full h-2 bg-gray-200 rounded-full mb-6 overflow-hidden">
    <div
      className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500 ease-in-out"
      style={{ width: `${progress}%` }}
    ></div>
  </div>
);

const Card = ({ children }) => (
  <div className="bg-white rounded-xl shadow-md p-6 mb-6 transition-all duration-300 hover:shadow-lg">
    {children}
  </div>
);

const Header = ({ type }) => (
  <h2 className="text-2xl mb-4 font-bold text-gray-800 dark:text-gray-100 text-center font-display">
    Create {type ? capitalize(type) : "Campaign"}
  </h2>
);

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const defaultFormData = () => ({
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
  liveStreamUrl: "",
});

const buildPayload = (type, formData, user) => {
  if (type === "biolink") {
    return {
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
  } else {
    return {
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
      vanitySlug: formData.vanitySlug?.toLowerCase().trim() || undefined,
      liveStreamUrl: formData.liveStreamUrl,
    };
  }
};

export default CreateCampaignPage;

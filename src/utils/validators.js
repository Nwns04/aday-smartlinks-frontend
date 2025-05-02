// utils/validators.js

  export const validateUrl = (url) => {
    if (!url) return true;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };
  
  export const validateFields = (formData, type, step) => {
    const errors = {};
  
    if (step === 1) {
      if (!formData.title.trim()) errors.title = "Title is required";
      if ((type === "presave" || type === "smartlink") && !formData.artwork) errors.artwork = "Artwork is required";
      if (type === "presave" && !formData.releaseDate) errors.releaseDate = "Release date is required";
      if (type === "biolink" && !formData.profileImage) errors.profileImage = "Profile image is required";
    }
  
    if (step === 2) {
      const keys = type === "biolink"
        ? ["instagram", "twitter", "tiktok", "youtube", "website", "merchLink"]
        : ["spotify", "apple", "boomplay", "audiomack", "youtube"];
  
      keys.forEach((key) => {
        if (formData[key] && !validateUrl(formData[key])) {
          errors[key] = "Please enter a valid URL";
        }
      });
    }
  
    return errors;
  };
  
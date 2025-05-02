export const renderCampaignLink = (user, subdomain, slug) => {
    const defaultSlug = slug || "your-link";
    const baseSlug = defaultSlug.replace(/\s+/g, "").toLowerCase();
  
    return user?.isPremium && subdomain
      ? `https://${subdomain}.aday.io/${baseSlug}`
      : `${window.location.origin}/${baseSlug}`;
  };
  
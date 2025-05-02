import React from "react";

const Step2ServiceLinks = ({
  type,
  formData,
  formErrors,
  handleInputChange,
  handleNext,     
  handlePrev 
}) => {
  const renderInput = (platform) => (
    <div key={platform}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {platform.charAt(0).toUpperCase() + platform.slice(1)} Link
      </label>
      <input
        type="text"
        name={platform}
        placeholder={`https://${platform}.com/yourprofile`}
        value={formData[platform]}
        onChange={handleInputChange}
        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
          formErrors[platform] ? "border-red-500" : "border-gray-300"
        }`}
      />
      {formErrors[platform] && (
        <p className="mt-1 text-sm text-red-600">{formErrors[platform]}</p>
      )}
    </div>
  );

  return (
    <>
      {type === "biolink" ? (
        <>
          <h3 className="text-lg mb-4 font-semibold text-gray-700 border-b pb-2">
            Social & Merch Links
          </h3>
          <div className="space-y-4">
            {["instagram", "twitter", "tiktok", "youtube", "website", "merchLink"].map(renderInput)}
          </div>
        </>
      ) : (
        <>
          <h3 className="text-lg mb-4 font-semibold text-gray-700 border-b pb-2">
            Add Service Links
          </h3>
          <div className="space-y-4">
            {["spotify", "apple", "boomplay", "audiomack", "youtube"].map(renderInput)}

            <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Live Stream URL (YouTube/Twitch embed)
  </label>
  <input
    type="text"
    name="liveStreamUrl"
    placeholder="https://www.youtube.com/watch?v=..."
    value={formData.liveStreamUrl || ""}
    onChange={handleInputChange}
    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
      formErrors.liveStreamUrl ? "border-red-500" : "border-gray-300"
    }`}
  />
  {formErrors.liveStreamUrl && (
    <p className="mt-1 text-sm text-red-600">{formErrors.liveStreamUrl}</p>
  )}
</div>

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
  );
};

export default Step2ServiceLinks;

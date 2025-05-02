import React, { useState } from "react";
import { motion } from "framer-motion";
import AICopyGenerator from "../AICopyGenerator";
import useSlugAvailability from '../../hooks/useSlugAvailability';
import Spinner from "../common/Spinner"; // if you have a Spinner component

const Step1BasicInfo = ({
  type,
  formData,
  setFormData,
  formErrors,
  setFormErrors,
  handleInputChange,
  handleFileChange,
  uploading,
  upc,
  setUpc,
  fetchingLinks,
  handleFetchLinks,
  today,
  handleNext,
  error,          
  setError,
}) => {
  const [aiGenerating, setAiGenerating] = useState(false);
  const { slug, slugAvailable, slugLoading, setSlug } = useSlugAvailability();
  const [manualEntry, setManualEntry] = useState(false);
  
  return (
    <>
      {(type === "presave" || type === "smartlink") && (
        <div className="mb-6 overflow-hidden rounded-lg">
          <motion.div
            initial={false}
            animate={{
              backgroundPosition: fetchingLinks ? ["0% 0%", "100% 0%"] : "0% 0%",
              backgroundSize: fetchingLinks ? "200% 100%" : "100% 100%",
            }}
            transition={{
              duration: 2,
              repeat: fetchingLinks ? Infinity : 0,
              ease: "linear",
            }}
            className="p-4 border border-blue-100 bg-gradient-to-r from-blue-50 to-blue-100"
          >
            <label className="block text-sm font-medium text-gray-700 mb-1">
              UPC (Optional - Auto fetch links)
            </label>
            <div className="flex gap-2">
  <input
    type="text"
    name="upc"
    placeholder="Enter UPC"
    value={upc}
    onChange={(e) => {
      setUpc(e.target.value);
      setError(null);
      setManualEntry(false);
    }}
    className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all border-gray-300 bg-white"
  />
  <motion.button
    type="button"
    onClick={handleFetchLinks}
    disabled={fetchingLinks}
    whileTap={{ scale: 0.95 }}
    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:opacity-70"
  >
    {fetchingLinks ? "Fetching..." : "Fetch"}
  </motion.button>
</div>

{error && (
  <div className="mt-3 text-sm text-red-600 bg-red-100 p-3 rounded">
    <p>{error}</p>
    <label className="inline-flex items-center mt-2">
      <input
        type="checkbox"
        checked={manualEntry}
        onChange={e => setManualEntry(e.target.checked)}
        className="mr-2"
      />
      Enter links manually
    </label>
  </div>
)}

          </motion.div>
        </div>
      )}

      <h3 className="text-lg mb-4 font-semibold text-gray-700 border-b pb-2">Basic Info</h3>

      <div className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title*</label>
          <input
            type="text"
            name="title"
            placeholder="Enter title"
            value={formData.title}
            onChange={(e) => {
              handleInputChange(e);
              setSlug(e.target.value.trim().toLowerCase());
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

        {/* Slug Preview */}
        {slug && (
          <div className="mt-2 text-sm flex items-center space-x-2">
            {slugLoading && <Spinner size="xs" />}
            <span
              className={
                slugAvailable === false
                  ? "text-red-600"
                  : slugAvailable === true
                  ? "text-green-600"
                  : "text-gray-500"
              }
            >
              {window.location.origin}/{slug}
            </span>
            {slugAvailable === false && (
              <p className="text-xs text-red-600">
                This slug is taken, try another title.
              </p>
            )}
          </div>
        )}

        {/* Artist Name */}
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

        {/* Release Date */}
        {type === "presave" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Release Date*</label>
            <input
              type="date"
              name="releaseDate"
              value={formData.releaseDate}
              onChange={handleInputChange}
              min={today}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                formErrors.releaseDate ? "border-red-500" : "border-gray-300"
              }`}
            />
            {formErrors.releaseDate && (
              <p className="mt-1 text-sm text-red-600">{formErrors.releaseDate}</p>
            )}
          </div>
        )}

        {/* Artwork Upload */}
        {(type === "presave" || type === "smartlink") && (
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
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, artwork: "" }))
                  }
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            ) : (
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "artwork")}
                className="w-full"
              />
            )}
            {formErrors.artwork && (
              <p className="mt-1 text-sm text-red-600">{formErrors.artwork}</p>
            )}
          </div>
        )}

        {/* CTA Message & AI Generator */}
        {type === "presave" && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                CTA Message
                {aiGenerating && (
                  <span className="animate-pulse text-blue-500 text-xs font-normal">(Generating...)</span>
                )}
              </label>
              <textarea
                name="ctaMessage"
                value={formData.ctaMessage}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                rows="3"
              />
            </div>
            <AICopyGenerator
              label="Need help with your call-to-action?"
              setLoading={setAiGenerating}
              onGenerated={(text) =>
                setFormData((prev) => ({ ...prev, ctaMessage: text }))
              }
            />
           {handleNext && (
  <button
    onClick={handleNext}
    disabled={
      (!slugAvailable && !manualEntry) ||
      slugLoading ||
      uploading
    }
    className={`mt-6 w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-md ${
      (!slugAvailable && !manualEntry) || slugLoading || uploading
        ? "opacity-50 cursor-not-allowed"
        : ""
    }`}
  >
    {slugLoading ? "Checking…" : "Continue"}
  </button>
)}

          </>
        )}
      </div>
    </>
  );
};

export default Step1BasicInfo;

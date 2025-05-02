import React from "react";
import { motion } from "framer-motion";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import QRCode from "react-qr-code";
import { FiCopy } from "react-icons/fi";

const fadeIn = {
  hidden: { opacity: 0, y: 10 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4, ease: "easeOut" },
  }),
};

const Step3Summary = ({
  type,
  formData,
  getPlatformIcon,
  handlePrev,
  handleSubmit,
  isSubmitting,
  user,
  shortUrl,
  renderLink,
  handleCopy,
}) => {
  return (
    <>
      <motion.div
        initial="hidden"
        animate="visible"
        className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl shadow-lg mb-6 border border-gray-200"
      >
        <h3 className="text-xl font-bold text-gray-800 mb-4">Campaign Summary</h3>

        <motion.div custom={1} variants={fadeIn} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-sm font-medium text-gray-500">Type</p>
            <p className="font-semibold capitalize">{type}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-sm font-medium text-gray-500">Title</p>
            <p className="font-semibold">{formData.title}</p>
          </div>
        </motion.div>

        {(type === "presave" || type === "smartlink") ? (
          <>
            {formData.releaseDate && (
              <motion.div custom={2} variants={fadeIn} className="bg-white p-4 rounded-lg shadow-sm mb-4">
                <p className="text-sm font-medium text-gray-500">Release Date</p>
                <p className="font-semibold">
                  {new Date(formData.releaseDate).toLocaleDateString()}
                </p>
              </motion.div>
            )}

            {formData.artwork && (
              <motion.div custom={3} variants={fadeIn} className="mb-6">
                <p className="text-sm font-medium text-gray-500 mb-2">Artwork Preview</p>
                <img
                  src={formData.artwork}
                  alt="Artwork"
                  className="rounded-xl w-full h-auto max-h-60 object-contain border-2 border-white shadow-lg"
                />
              </motion.div>
            )}

            {formData.ctaMessage && (
              <motion.div
                initial={{ opacity: 0, y: formData.generatedByAI ? 20 : 0 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  ease: "easeOut",
                  delay: formData.generatedByAI ? 0.4 : 0,
                }}
                className="bg-white p-4 rounded-lg shadow-sm mb-4"
              >
                <p className="text-sm font-medium text-gray-500 mb-2">CTA Message</p>
                <p className="text-gray-700">{formData.ctaMessage}</p>
              </motion.div>
            )}

            <motion.div custom={4} variants={fadeIn}>
              <h4 className="font-medium text-gray-700 mb-3">Music Links</h4>
              <DragDropContext onDragEnd={() => {}}>
                <Droppable droppableId="links">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                      {["spotify", "apple", "boomplay", "audiomack", "youtube"].map(
                        (platform, index) =>
                          formData[platform] && (
                            <Draggable key={platform} draggableId={platform} index={index}>
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="bg-white p-3 rounded-lg shadow border flex items-center"
                                >
                                  <div className="mr-3 text-xl">{getPlatformIcon(platform)}</div>
                                  <div className="flex-1 min-w-0">
                                    <a
                                      href={formData[platform]}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-sm font-medium text-gray-700 hover:text-blue-600 hover:underline truncate block"
                                    >
                                      {formData[platform]}
                                    </a>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          )
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </motion.div>
          </>
        ) : (
          <>
            {formData.profileImage && (
              <motion.div custom={1} variants={fadeIn} className="mb-6 text-center">
                <p className="text-sm font-medium text-gray-500 mb-2">Profile Image</p>
                <img
                  src={formData.profileImage}
                  alt="Profile"
                  className="rounded-full w-24 h-24 object-cover mx-auto border-4 border-white shadow"
                />
              </motion.div>
            )}

            {formData.bio && (
              <motion.div custom={2} variants={fadeIn} className="bg-white p-4 rounded-lg shadow-sm mb-6">
                <p className="text-sm font-medium text-gray-500 mb-2">Bio</p>
                <p className="text-gray-700 whitespace-pre-line">{formData.bio}</p>
              </motion.div>
            )}

            <motion.div custom={3} variants={fadeIn}>
              <h4 className="font-medium text-gray-700 mb-3">Social Links</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {["instagram", "twitter", "tiktok", "youtube", "website", "merchLink"].map(
                  (platform) =>
                    formData[platform] && (
                      <div key={platform} className="bg-white p-3 rounded-lg shadow flex items-center">
                        <div className="mr-3 text-xl">{getPlatformIcon(platform)}</div>
                        <div className="flex-1 min-w-0">
                          <a
                            href={formData[platform]}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium text-gray-700 hover:text-blue-600 hover:underline truncate block"
                          >
                            {formData[platform].replace(/(^\w+:|^)\/\//, "")}
                          </a>
                        </div>
                      </div>
                    )
                )}
              </div>
            </motion.div>
          </>
        )}
      </motion.div>

      {/* Footer Actions + Share Link */}
      <div className="bg-white p-4 rounded-xl shadow-md mb-6">
        <h4 className="text-lg font-semibold mb-4">Shareable Link</h4>
        {user?.isPremium && formData.subdomain && (
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-mono break-all">{renderLink("subdomain")}</span>
            <button onClick={() => handleCopy(renderLink("subdomain"))} className="text-blue-600 hover:text-blue-800">
              <FiCopy />
            </button>
          </div>
        )}
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-mono break-all">{renderLink("short")}</span>
          <button onClick={() => handleCopy(renderLink("short"))} className="text-blue-600 hover:text-blue-800">
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

      <div className="flex justify-between space-x-4">
        <button
          onClick={handlePrev}
          className="w-1/2 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition-all"
        >
          Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`w-1/2 bg-gradient-to-r from-green-500 to-teal-600 text-white py-3 rounded-lg font-medium hover:from-green-600 hover:to-teal-700 transition-all shadow ${
            isSubmitting ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting ? "Processing..." : "Submit"}
        </button>
      </div>
    </>
  );
};

export default Step3Summary;

import React from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const linkTypes = [
  {
    name: "Pre-Save Link",
    description: "Collect pre-saves for your upcoming release.",
    path: "/create/presave",
  },
  {
    name: "Smart Link",
    description: "One link for all streaming platforms.",
    path: "/create/smartlink",
  },
  {
    name: "Bio Link",
    description: "Create a personal bio link for your profile.",
    path: "/create/biolink",
  },
];

const LinkTypeSelector = ({ onClose }) => {
  const navigate = useNavigate();

  const handleSelect = (path) => {
    localStorage.removeItem("createCampaignData");
    localStorage.removeItem("createCampaignStep");
    onClose();
    setTimeout(() => navigate(path), 300);
  };
  
  

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md relative"
        >
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl"
          >
            &times;
          </button>
          <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">Select Link Type</h2>
          <div className="space-y-4">
            {linkTypes.map((type) => (
              <div
                key={type.name}
                className="p-4 border rounded-xl hover:bg-gray-100 cursor-pointer transition"
                onClick={() => handleSelect(type.path)}
              >
                <h3 className="text-lg font-semibold text-gray-700">{type.name}</h3>
                <p className="text-gray-500 text-sm">{type.description}</p>
              </div>
            ))}
          </div>
          <button
            onClick={onClose}
            className="mt-6 w-full bg-gray-700 text-white py-2 rounded-lg hover:bg-gray-800"
          >
            Cancel
          </button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default LinkTypeSelector;

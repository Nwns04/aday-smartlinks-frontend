import React from "react";
import { Dialog } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";

const CelebrationModal = ({ show, onClose, message }) => {
  return (
    <AnimatePresence>
      {show && (
        <Dialog open={show} onClose={onClose} className="fixed inset-0 z-50">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center"
          >
            <div className="bg-white p-6 rounded shadow text-center max-w-sm mx-auto">
              <h3 className="text-lg font-bold mb-2">🎉 Congratulations!</h3>
              <p>{message}</p>
              <button
                onClick={onClose}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </motion.div>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default CelebrationModal;

// src/components/PublicLink/EmailCaptureForm.jsx
import React, { useState } from 'react';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiCheckCircle } from 'react-icons/fi';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';

const EmailCaptureForm = ({ onSubmit, initialClicks = 0 }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
 const [clickCount, setClickCount] = useState(initialClicks);

 // Keep clickCount in sync if parent prop changes
 useEffect(() => {
   setClickCount(initialClicks);
 }, [initialClicks]);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    try {
     await onSubmit(email, clickCount);
      setSubmitted(true);
      setEmail('');
      toast.success("You'll be notified on release!");
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
      toast.error('Failed to submit email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-gray-50/80 backdrop-blur-sm p-4 rounded-lg border border-gray-200/50"
    >
      {submitted ? (
        <div className="flex items-center text-green-700">
          <FiCheckCircle className="mr-2" /> Thank you! We’ll let you know.
        </div>
      ) : (
        <>
          <h3 className="text-center font-medium text-gray-700 mb-3 flex items-center justify-center">
            <FiMail className="mr-2" />
            Get notified on release
          </h3>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white/90"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              disabled={loading}
            />
            <motion.button
              type="submit"
              className={`w-full px-4 py-3 rounded-lg text-white ${
                loading ? 'bg-indigo-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
              } transition-all shadow-md`}
              whileHover={loading ? {} : { y: -2 }}
              whileTap={loading ? {} : { scale: 0.98 }}
              disabled={loading}
            >
              {loading ? 'Sending…' : 'Notify Me'}
            </motion.button>
          </form>
        </>
      )}
    </motion.div>
  );
};

EmailCaptureForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  initialClicks: PropTypes.number,
};

export default EmailCaptureForm;

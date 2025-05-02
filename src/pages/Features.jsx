import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { animate, stagger } from 'animejs';
import { 
  FaLink, FaChartLine, FaCalendarAlt, FaUsers, 
  FaMobileAlt, FaGlobe, FaLock, FaMusic
} from "react-icons/fa";

const Features = () => {
  const featuresRef = useRef(null);
  const statsRef = useRef(null);

  useEffect(() => {
    // Features animation
    animate(
      featuresRef.current.querySelectorAll('.feature-card'),
      {
        opacity: [0, 1],
        translateY: [30, 0],
        duration: 800,
        delay: stagger(100),
        easing: 'easeOutExpo'
      }
    );

    // Stats counter animation
    animate(
      statsRef.current.querySelectorAll('[id$="-count"]'),
      {
        innerHTML: [0, (el) => {
          if (el.id === 'artists-count') return 5000;
          if (el.id === 'links-count') return 12000;
          if (el.id === 'clicks-count') return 3500000;
          if (el.id === 'countries-count') return 42;
          return 0;
        }],
        round: 1,
        duration: (el) => {
     if (el.id === 'clicks-count') return 800;   // ⏩ For 3M, animate faster
     return 1200;  // ⏩ For others, normal speed
   },
       easing: 'easeOutQuad'
      }
    );
  }, []);

  const features = [
    {
      icon: <FaLink className="text-blue-500 text-3xl" />,
      title: "Smart Links",
      description: "One link that automatically directs fans to their preferred streaming platform.",
      color: "bg-blue-100"
    },
    {
      icon: <FaChartLine className="text-purple-500 text-3xl" />,
      title: "Advanced Analytics",
      description: "Track clicks, conversions, and fan locations in real-time.",
      color: "bg-purple-100"
    },
    {
      icon: <FaCalendarAlt className="text-green-500 text-3xl" />,
      title: "Pre-Save Campaigns",
      description: "Boost your release day streams with pre-save links across all platforms.",
      color: "bg-green-100"
    },
    {
      icon: <FaUsers className="text-orange-500 text-3xl" />,
      title: "Audience Insights",
      description: "Understand your fans with detailed demographic data.",
      color: "bg-orange-100"
    },
    {
      icon: <FaMobileAlt className="text-red-500 text-3xl" />,
      title: "Mobile Optimized",
      description: "Links that work perfectly on any device.",
      color: "bg-red-100"
    },
    {
      icon: <FaGlobe className="text-indigo-500 text-3xl" />,
      title: "Global Distribution",
      description: "Reach fans in every country with localized links.",
      color: "bg-indigo-100"
    },
    {
      icon: <FaLock className="text-yellow-500 text-3xl" />,
      title: "Secure Platform",
      description: "Enterprise-grade security protecting your data.",
      color: "bg-yellow-100"
    },
    {
      icon: <FaMusic className="text-pink-500 text-3xl" />,
      title: "Artist Focused",
      description: "Tools designed specifically for African musicians.",
      color: "bg-pink-100"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-16 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Powerful Features
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Everything you need to maximize your music's reach across Africa and beyond
          </p>
        </motion.div>

        {/* Stats Section */}
        <div ref={statsRef} className="py-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl shadow-lg mb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
              <div className="p-4">
                <div className="text-4xl font-bold mb-2" id="artists-count">0</div>
                <div className="text-sm uppercase tracking-wider">Artists</div>
              </div>
              <div className="p-4">
                <div className="text-4xl font-bold mb-2" id="links-count">0</div>
                <div className="text-sm uppercase tracking-wider">Links Created</div>
              </div>
              <div className="p-4">
                <div className="text-4xl font-bold mb-2" id="clicks-count">0</div>
                <div className="text-sm uppercase tracking-wider">Total Clicks</div>
              </div>
              <div className="p-4">
                <div className="text-4xl font-bold mb-2" id="countries-count">0</div>
                <div className="text-sm uppercase tracking-wider">Countries</div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div ref={featuresRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="feature-card bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all"
              whileHover={{ y: -5 }}
            >
              <div className={`${feature.color} w-16 h-16 rounded-full flex items-center justify-center mb-6`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-center text-white"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to grow your audience?</h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8">
            Join thousands of African artists using our platform to maximize their reach.
          </p>
          <motion.a
            href="/signup"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get Started Today
          </motion.a>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Features;
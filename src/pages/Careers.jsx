import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { animate, stagger } from "animejs";
import {
  FaCode,
  FaBullhorn,
  FaHeadset,
  FaMapMarkerAlt,
  FaArrowRight,
} from "react-icons/fa";

const Careers = () => {
  const openings = [
    {
      title: "Full-Stack Developer",
      location: "Remote",
      icon: <FaCode className="text-blue-500 dark:text-blue-300" />,
      description:
        "Build the future of music distribution with cutting-edge web technologies.",
    },
    {
      title: "Marketing Manager",
      location: "Lagos, Nigeria",
      icon: <FaBullhorn className="text-purple-500 dark:text-purple-300" />,
      description:
        "Lead our marketing efforts to reach African artists across the continent.",
    },
    {
      title: "Customer Success Lead",
      location: "Remote",
      icon: <FaHeadset className="text-green-500 dark:text-green-300" />,
      description:
        "Ensure our artists get the most value from our platform through exceptional support.",
    },
  ];

  const perks = [
    "Competitive salary & equity",
    "Flexible remote work",
    "Health benefits",
    "Professional development budget",
    "Music industry networking",
    "Creative work environment",
  ];

  const careersRef = useRef(null);

  useEffect(() => {
    animate(
      careersRef.current.querySelectorAll(".job-card, .perk-item"),
      {
        opacity: [0, 1],
        translateY: [30, 0],
        duration: 800,
        delay: stagger(100),
        easing: "easeOutExpo",
      }
    );
  }, []);

  return (
    <motion.div
      ref={careersRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="
        min-h-screen
        bg-gradient-to-b from-gray-50 to-gray-100
        dark:from-gray-900 dark:to-gray-800
        py-16 px-4 sm:px-6 lg:px-8
        dark:text-gray-200
      "
    >
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Join Our Team
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            We're building the future of music distribution in Africa and looking
            for passionate, talented people to join us on this journey.
          </p>
        </motion.div>

        {/* Perks Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8 text-center">
            Why Work With Us
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {perks.map((perk, i) => (
              <motion.div
                key={i}
                className="
                  perk-item
                  bg-white dark:bg-gray-800
                  p-6 rounded-xl
                  shadow-md dark:shadow-gray-700/50
                  hover:shadow-lg dark:hover:shadow-gray-600/40
                  transition-shadow
                "
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-4">
                    <FaArrowRight className="text-blue-600 dark:text-blue-300" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                    {perk}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Open Positions */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8 text-center">
            Current Openings
          </h2>
          <div className="space-y-6">
            {openings.map((job, i) => (
              <motion.div
                key={i}
                className="
                  job-card
                  bg-white dark:bg-gray-800
                  p-8 rounded-xl
                  shadow-md dark:shadow-gray-700/50
                  hover:shadow-lg dark:hover:shadow-gray-600/40
                  transition-shadow
                "
                whileHover={{ y: -5 }}
              >
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mr-6 text-2xl">
                    {job.icon}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                      {job.title}
                    </h2>
                    <div className="flex items-center text-gray-600 dark:text-gray-400 mt-2">
                      <FaMapMarkerAlt className="mr-2" />
                      <span>{job.location}</span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 mt-4">
                      {job.description}
                    </p>
                    <motion.a
                      href="/apply"
                      className="
                        mt-6 inline-flex items-center
                        text-blue-600 dark:text-blue-300
                        font-medium group
                      "
                      whileHover={{ x: 5 }}
                    >
                      Apply Now
                      <FaArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
                    </motion.a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="
            bg-gradient-to-r from-blue-600 to-purple-600
            rounded-2xl p-8 md:p-12 text-center text-white
          "
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Don't See Your Dream Role?
          </h2>
          <p className="text-xl mb-6 max-w-2xl mx-auto">
            We're always interested in meeting talented people. Send us your
            resume!
          </p>
          <motion.a
            href="/contact"
            className="inline-block bg-white text-blue-600 dark:text-blue-800 px-8 py-3 rounded-lg text-lg font-semibold shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Contact Us
          </motion.a>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Careers;

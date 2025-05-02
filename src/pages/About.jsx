import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { animate, stagger } from "animejs";
import { FaMusic, FaUsers, FaGlobeAfrica, FaChartLine } from "react-icons/fa";
import TeamMemberCard from "../components/TeamMemberCard";

const About = () => {
  const missionRef = useRef(null);
  const teamRef = useRef(null);
  const statsRef = useRef(null);

  useEffect(() => {
    // Mission section animation
    animate(missionRef.current.querySelectorAll(".mission-item"), {
      opacity: [0, 1],
      translateY: [30, 0],
      duration: 800,
      delay: stagger(100),
      easing: "easeOutExpo",
    });

    // Team section animation
    animate(teamRef.current.querySelectorAll(".team-member"), {
      scale: [0.9, 1],
      opacity: [0, 1],
      duration: 600,
      delay: stagger(100),
      easing: "spring(1, 80, 10, 0)",
    });

    // Stats counter animation
    animate(statsRef.current.querySelectorAll("[id$='-count']"), {
      innerHTML: [
        0,
        (el) => {
          if (el.id === "artists-count") return 5000;
          if (el.id === "fans-count") return 12000;
          if (el.id === "countries-count") return 42;
          if (el.id === "clicks-count") return 3500000;
          return 0;
        },
      ],
      round: 1,
      duration: 2000,
      easing: "easeOutExpo",
    });
  }, []);

  return (
    <motion.div
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
            About Aday Smartlinks
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            Africa's premier pre-save & smart link platform, built to help
            artists maximize their reach and connect with fans across every
            platform.
          </p>
        </motion.div>

        {/* Stats Section */}
        <div
          ref={statsRef}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20"
        >
          {[{
              icon: <FaMusic />,
              iconColor: "text-blue-600",
              id: "artists-count",
              label: "Artists"
            },
            {
              icon: <FaUsers />,
              iconColor: "text-purple-600",
              id: "fans-count",
              label: "Fans Reached"
            },
            {
              icon: <FaGlobeAfrica />,
              iconColor: "text-green-600",
              id: "countries-count",
              label: "Countries"
            },
            {
              icon: <FaChartLine />,
              iconColor: "text-orange-600",
              id: "clicks-count",
              label: "Monthly Clicks"
            }
          ].map(({ icon, iconColor, id, label }) => (
            <motion.div
              key={id}
              whileHover={{ scale: 1.05 }}
              className="
                bg-white dark:bg-gray-800
                p-6 rounded-xl shadow-md text-center
              "
            >
              <div className={`${iconColor} text-3xl mb-2 flex justify-center`}>
                {icon}
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-gray-100" id={id}>
                0
              </div>
              <div className="text-gray-600 dark:text-gray-400">{label}</div>
            </motion.div>
          ))}
        </div>

        {/* Mission Section */}
        <div ref={missionRef} className="mb-20">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8 text-center"
          >
            Our Mission
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: "Empower African Artists",
                text: `We're building tools specifically designed for the unique challenges and opportunities facing African musicians in the digital age.`
              },
              {
                title: "Simplify Music Distribution",
                text: `One link to rule them all – connect fans to your music no matter which platform they prefer.`
              },
              {
                title: "Data-Driven Insights",
                text: `Understand your audience with real-time analytics that help you make smarter decisions.`
              },
              {
                title: "Grow Your Fanbase",
                text: `Tools designed to help you convert listeners into loyal fans who engage with your music.`
              }
            ].map(({ title, text }, idx) => (
              <motion.div
                key={idx}
                className="
                  mission-item bg-white dark:bg-gray-800
                  p-8 rounded-xl shadow-md hover:shadow-lg
                  transition-shadow
                "
                whileHover={{ y: -5 }}
              >
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">
                  {title}
                </h3>
                <p className="text-gray-700 dark:text-gray-300">{text}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div ref={teamRef} className="mb-16">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8 text-center"
          >
            The Team
          </motion.h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <TeamMemberCard
              name="Moody"
              role="Founder & CEO"
              bio="Visionary leader with 10+ years in music tech"
              className="team-member"
            />
            <TeamMemberCard
              name="Dremo"
              role="Creative Director"
              bio="Artist turned creative force behind our brand"
              className="team-member"
            />
            <TeamMemberCard
              name="Chingie"
              role="Artist Relations"
              bio="Connecting with artists across the continent"
              className="team-member"
            />
            <TeamMemberCard
              name="Kammy7"
              role="Head of Visuals"
              bio="Bringing our platform to life through design"
              className="team-member"
            />
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
            Ready to grow your audience?
          </h2>
          <p className="text-xl mb-6 max-w-2xl mx-auto">
            Join thousands of African artists using our platform to maximize
            their reach.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold shadow-lg"
          >
            Get Started Today
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default About;

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { animate, stagger } from "animejs";
import toast from "react-hot-toast";
import {
  FaPaperPlane,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaLinkedin,
  FaTwitter,
} from "react-icons/fa";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const contactRef = useRef(null);

  useEffect(() => {
    animate(
      contactRef.current.querySelectorAll(".contact-item, form > *"),
      {
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 800,
        delay: stagger(100),
        easing: "easeOutExpo",
      }
    );
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    toast.loading("Sending your message...", { id: "contact" });

    try {
      const resp = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || "Submission failed");

      toast.success("Message sent! We'll be in touch.", { id: "contact" });
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Unexpected error", { id: "contact" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      ref={contactRef}
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
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Get In Touch
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            Have questions or want to learn more? We'd love to hear from you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            {[
              {
                icon: <FaMapMarkerAlt />,
                title: "Our Location",
                content: (
                  <>
                    <p className="text-gray-700 dark:text-gray-300">
                      Lagos, Nigeria
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                      Remote team across Africa
                    </p>
                  </>
                ),
                bg: "bg-blue-100 dark:bg-blue-900",
                iconColor: "text-blue-600 dark:text-blue-300",
              },
              {
                icon: <FaEnvelope />,
                title: "Email Us",
                content: (
                  <a
                    href="mailto:hello@adaysmartlinks.com"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    hello@adaysmartlinks.com
                  </a>
                ),
                bg: "bg-purple-100 dark:bg-purple-900",
                iconColor: "text-purple-600 dark:text-purple-300",
              },
              {
                icon: <FaPhone />,
                title: "Call Us",
                content: (
                  <a
                    href="tel:+234123456789"
                    className="text-green-600 dark:text-green-300 hover:underline"
                  >
                    +234 123 456 789
                  </a>
                ),
                bg: "bg-green-100 dark:bg-green-900",
                iconColor: "text-green-600 dark:text-green-300",
              },
            ].map(({ icon, title, content, bg, iconColor }, idx) => (
              <motion.div
                key={idx}
                className={`
                  contact-item bg-white dark:bg-gray-800
                  p-8 rounded-xl
                  shadow-md dark:shadow-gray-700/50
                  hover:shadow-lg dark:hover:shadow-gray-600/40
                  transition-shadow
                `}
                whileHover={{ y: -5 }}
              >
                <div className="flex items-start mb-4">
                  <div className={`${bg} p-3 rounded-full mr-4`}>
                    {React.cloneElement(icon, {
                      className: `${iconColor} text-xl`,
                    })}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
                      {title}
                    </h3>
                    {content}
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Social */}
            <div className="flex space-x-4 mt-6">
              {[
                {
                  href: "https://linkedin.com/company/adaysmartlinks",
                  icon: <FaLinkedin />,
                  bg: "bg-blue-100 dark:bg-blue-900",
                  color: "text-blue-600 dark:text-blue-300",
                },
                {
                  href: "https://twitter.com/adaysmartlinks",
                  icon: <FaTwitter />,
                  bg: "bg-blue-100 dark:bg-blue-900",
                  color: "text-blue-400 dark:text-blue-200",
                },
              ].map(({ href, icon, bg, color }, i) => (
                <motion.a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`
                    ${bg} p-3 rounded-full
                    transition-colors
                    hover:bg-opacity-80
                  `}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {React.cloneElement(icon, { className: `${color} text-xl` })}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Form */}
          <motion.div
            className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md dark:shadow-gray-700/50 transition-shadow hover:shadow-lg dark:hover:shadow-gray-600/40"
            whileHover={{ scale: 1.01 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              Send Us a Message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                  Your Name
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="
                    w-full border border-gray-300 dark:border-gray-600
                    bg-white dark:bg-gray-700
                    rounded-lg px-4 py-3
                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                    outline-none transition
                  "
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="
                    w-full border border-gray-300 dark:border-gray-600
                    bg-white dark:bg-gray-700
                    rounded-lg px-4 py-3
                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                    outline-none transition
                  "
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                  Your Message
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows="6"
                  required
                  className="
                    w-full border border-gray-300 dark:border-gray-600
                    bg-white dark:bg-gray-700
                    rounded-lg px-4 py-3
                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                    outline-none transition
                  "
                />
              </div>
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="
                  w-full
                  bg-gradient-to-r from-blue-600 to-purple-600
                  hover:from-blue-700 hover:to-purple-700
                  text-white py-3 rounded-lg font-medium
                  flex items-center justify-center space-x-2
                  transition-all
                "
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSubmitting ? (
                  "Sending..."
                ) : (
                  <>
                    <span>Send Message</span>
                    <FaPaperPlane />
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Contact;

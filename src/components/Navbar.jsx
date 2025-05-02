import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Dialog } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";
import Login from "../pages/Login/LoginPage";
import toast from "react-hot-toast";
import NotificationBell from "./NotificationBell";
import { FaBars, FaTimes, FaSun, FaMoon, FaUserCog, FaSignOutAlt, FaPlus, FaHome, FaChartLine } from "react-icons/fa";
import LinkTypeSelector from "./LinkTypeSelector";
import WorkspaceContext from '../context/WorkspaceContext';

const Navbar = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { workspaces, current, setCurrent } = useContext(WorkspaceContext);

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLinkSelector, setShowLinkSelector] = useState(false);
  const [isHoveringCreate, setIsHoveringCreate] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };
  

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("login") === "true") {
      setIsModalOpen(true);
      // clear the query param without reloading
      window.history.replaceState({}, "", location.pathname);
    }
  }, [location]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const confirmLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setShowLogoutConfirm(false);
    setIsModalOpen(false); // ✅ Close login modal manually
    sessionStorage.removeItem("forceLogin"); // ✅ Clear any login forcing triggers
    toast.success("Logged out successfully!");
    navigate("/");
  };
  
  

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".dropdown")) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    if (user) {
      setIsModalOpen(false);
    }
  }, [user]);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <>
      <nav className="sticky top-0 z-40 flex justify-between items-center p-4 bg-white dark:bg-gray-800 text-gray-800 dark:text-white shadow-sm dark:shadow-gray-700/50">
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
            Aday Smartlinks
          </h1>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-4 items-center">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <FaSun className="text-yellow-300" /> : <FaMoon />}
          </button>

          {/* Only show Home link when user is not signed in */}
          {!user && (
            <Link 
              to="/" 
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1"
            >
              <FaHome /> Home
            </Link>
            
          )}

          {user ? (
            <>
              <Link 
                to="/dashboard" 
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1"
              >
                <FaHome /> Dashboard
              </Link>
              <Link 
                to="/analytics" 
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1"
              >
                <FaChartLine /> Analytics
              </Link>
              
              <div className="relative">
                <button
                  onClick={() => setShowLinkSelector(true)}
                  onMouseEnter={() => setIsHoveringCreate(true)}
                  onMouseLeave={() => setIsHoveringCreate(false)}
                  className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md transition-colors"
                >
                  <FaPlus />
                  <span>Create</span>
                </button>
                {isHoveringCreate && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full mt-1 left-0 bg-white dark:bg-gray-700 shadow-lg rounded-md px-3 py-1 text-sm whitespace-nowrap"
                  >
                    Create new link
                  </motion.div>
                )}
              </div>

              {workspaces.length > 0 && (
                <select
                  className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white text-sm rounded px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300 dark:border-gray-600"
                  value={current?._id || ""}
                  onChange={(e) => {
                    const selected = workspaces.find((w) => w._id === e.target.value);
                    setCurrent(selected);
                  }}
                >
                  {workspaces.map((ws) => (
                    <option key={ws._id} value={ws._id}>
                      {ws.name}
                    </option>
                  ))}
                </select>
              )}

              <NotificationBell />

              <div className="relative dropdown">
                <button
                  className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <img
                    src={user.profileImage}
                    alt="Profile"
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span className="hidden lg:inline">{user.name.split(" ")[0]}</span>
                </button>
                <AnimatePresence>
                  {showDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-md shadow-lg z-50 overflow-hidden border border-gray-200 dark:border-gray-600"
                    >
                      <button
                        onClick={() => {
                          navigate("/settings");
                          setShowDropdown(false);
                        }}
                        className="flex items-center w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                      >
                        <FaUserCog className="mr-2" />
                        Settings
                      </button>
                      <button
                        onClick={handleLogoutClick}
                        className="flex items-center w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-red-500"
                      >
                        <FaSignOutAlt className="mr-2" />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsModalOpen(true)}
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 text-white px-4 py-1.5 rounded-md transition-all shadow-md hover:shadow-lg"
              >
                Get Started
              </button>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <FaTimes size={20} className="text-red-500" />
          ) : (
            <FaBars size={20} />
          )}
        </button>
      </nav>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 left-0 right-0 z-30 bg-white dark:bg-gray-800 shadow-lg md:hidden overflow-hidden"
          >
            <div className="flex flex-col p-4 space-y-3">
              <div className="flex justify-between items-center pb-2 mb-2">
                <span className="font-medium">Menu</span>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  {darkMode ? <FaSun className="text-yellow-300" /> : <FaMoon />}
                </button>
              </div>

              {!user && (
                <Link
                  to="/"
                  className="flex items-center gap-3 py-2 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FaHome /> Home
                </Link>
              )}

              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-3 py-2 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <FaHome /> Dashboard
                  </Link>
                  <Link
                    to="/analytics"
                    className="flex items-center gap-3 py-2 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <FaChartLine /> Analytics
                  </Link>
                  <button
                    onClick={() => {
                      setShowLinkSelector(true);
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 py-2 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
                  >
                    <FaPlus /> Create Link
                  </button>

                  {workspaces.length > 0 && (
                    <select
                      className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white text-sm rounded px-3 py-2 mt-1 focus:outline-none border border-gray-300 dark:border-gray-600"
                      value={current?._id || ""}
                      onChange={(e) => {
                        const selected = workspaces.find((w) => w._id === e.target.value);
                        setCurrent(selected);
                      }}
                    >
                      {workspaces.map((ws) => (
                        <option key={ws._id} value={ws._id}>
                          {ws.name}
                        </option>
                      ))}
                    </select>
                  )}

                  <div className="pt-3 mt-2 border-t border-gray-200 dark:border-gray-700">
                    <Link
                      to="/settings"
                      className="flex items-center gap-3 py-2 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <FaUserCog /> Settings
                    </Link>
                    <button
                      onClick={() => {
                        handleLogoutClick();
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-3 w-full py-2 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left text-red-500"
                    >
                      <FaSignOutAlt /> Logout
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setIsModalOpen(true);
                      sessionStorage.setItem("forceLogin", "true"); 
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 py-2 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      setIsModalOpen(true);
                      sessionStorage.setItem("forceLogin", "true"); 
                      setMobileMenuOpen(false);
                    }}
                    className="bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 text-white py-2 px-3 rounded-md transition-all text-left flex items-center gap-3 mt-2"
                  >
                    Get Started
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Login Modal */}
     {/* Login Modal */}
{/* Login Modal */}
<AnimatePresence>
  {isModalOpen && (
    <Dialog
      open={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      className="fixed inset-0 z-50 flex items-center justify-center"
      static
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setIsModalOpen(false)}
      />

      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.98 }}
        transition={{ type: "spring", bounce: 0.2, duration: 0.3 }}
        className="dark:bg-gray-800 rounded-lg z-50 w-full max-w-md mx-4 overflow-hidden"
      >
        <div className="p-6">
          <Login onSuccess={() => setIsModalOpen(false)} />
        </div>
      </motion.div>
    </Dialog>
  )}
</AnimatePresence>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <Dialog
            open={showLogoutConfirm}
            onClose={() => setShowLogoutConfirm(false)}
            className="fixed inset-0 z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ type: "spring", bounce: 0.2, duration: 0.2 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg z-50 w-full max-w-sm mx-4 text-center shadow-xl"
            >
              <Dialog.Title className="text-xl font-semibold mb-4 dark:text-white">
                Confirm Logout
              </Dialog.Title>
              <p className="mb-6 dark:text-gray-300">
                Are you sure you want to log out?
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmLogout}
                  className="px-4 py-2 rounded-md bg-red-500 hover:bg-red-600 text-white transition-colors"
                >
                  Logout
                </button>
              </div>
            </motion.div>
          </Dialog>
        )}
      </AnimatePresence>

      {/* Link Type Selector Modal */}
      {showLinkSelector && (
        <LinkTypeSelector onClose={() => setShowLinkSelector(false)} />
      )}
    </>
  );
};

export default Navbar;
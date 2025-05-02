import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Footer = () => {
  const { user } = useContext(AuthContext);

  // 👇 Show the big, marketing footer on all public (unauthenticated) pages
  if (!user) {
    return (
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-white text-lg font-bold mb-4">Aday Smartlinks</h3>
              <p className="mb-4">
                Africa's premier smart link platform for music artists.
              </p>
              <div className="flex space-x-4">
                {/* Optional social icons */}
              </div>
            </div>
            <div>
              <h4 className="text-white text-lg font-bold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><Link to="/features" className="hover:text-white">Features</Link></li>
                <li><Link to="/price"  className="hover:text-white">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white text-lg font-bold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><Link to="/about"   className="hover:text-white">About</Link></li>
                <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
                {/* <li><Link to="/careers" className="hover:text-white">Careers</Link></li> */}
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-sm text-center">
            © {new Date().getFullYear()} Aday Smartlinks. All rights reserved.
          </div>
        </div>
      </footer>
    );
  }

  // 👇 Otherwise (authenticated), show the simple utility footer
  return (
    <footer className="bg-white border-t border-gray-200 shadow-sm dark:bg-gray-900 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-600 dark:text-gray-400">
        <p>&copy; {new Date().getFullYear()} ADAY - All Rights Reserved.</p>
        <div className="flex space-x-4 mt-2 md:mt-0">
          <Link to="/settings" className="hover:text-purple-600">Settings</Link>
          <a href="https://adaymusic.com" target="_blank" rel="noopener noreferrer" className="hover:text-purple-600">
            Website
          </a>
          <a href="mailto:support@adaymusic.com" className="hover:text-purple-600">Support</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

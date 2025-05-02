import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import GoogleAuthButton from "../../components/Login/GoogleAuthButton";
import { motion } from "framer-motion";

const LoginPage = ({ onSuccess }) => {
  const { setUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  return (
    <div className="w-full">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full bg-white dark:bg-gray-800 rounded-lg"
      >
        <div className="p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Welcome to Aday Smartlinks</h2>
            <p className="text-gray-500 dark:text-gray-300 mt-2">Sign in to access your dashboard</p>
          </div>
          
          <div className="flex flex-col space-y-4">
            <GoogleAuthButton 
              setUser={setUser} 
              setLoading={setLoading} 
              onSuccess={onSuccess} // Pass the success handler to close modal
            />
          </div>
        </div>
        
        {loading && (
          <div className="bg-gray-50 dark:bg-gray-700 p-4 text-center rounded-b-lg">
            <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing in...
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default LoginPage;
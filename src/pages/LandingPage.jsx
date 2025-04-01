import React from "react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-6">Africa’s Smart Link Platform</h1>
      <p className="text-lg mb-8">Pre-save & Smart link generator for artists</p>
      <Link
        to="/login"
        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
      >
        Get Started
      </Link>
    </div>
  );
};

export default LandingPage;

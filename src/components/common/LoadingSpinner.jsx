import React from "react";

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
      <p className="mt-4 text-blue-600 animate-pulse font-medium text-sm">Loading, please wait...</p>
    </div>
  );
};

export default LoadingSpinner;

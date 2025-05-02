import React from "react";

const WidgetToggles = ({ toggles, setToggles }) => {
  const handleToggle = (key) => {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="flex flex-wrap gap-3 mt-4">
      {Object.keys(toggles).map((key) => (
        <button
          key={key}
          onClick={() => handleToggle(key)}
          className={`px-3 py-1 rounded text-sm ${
            toggles[key]
              ? "bg-blue-600 text-white"
              : "bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
          }`}
        >
          {key}
        </button>
      ))}
    </div>
  );
};

export default WidgetToggles;

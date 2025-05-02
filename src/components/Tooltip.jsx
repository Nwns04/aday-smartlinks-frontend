import React, { useState, useEffect } from "react";

const Tooltip = ({ text, children }) => {
  const [visible, setVisible] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState(null);

  const handleMouseEnter = () => {
    const timeout = setTimeout(() => {
      setVisible(true);
    }, 300); // 300ms delay
    setHoverTimeout(timeout);
  };

  const handleMouseLeave = () => {
    clearTimeout(hoverTimeout);
    setVisible(false);
  };

  return (
    <div
      className="relative inline-block group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {visible && (
        <span className="absolute z-10 bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-2 py-1 text-xs bg-black text-white rounded shadow transition-opacity duration-200">
          {text}
        </span>
      )}
    </div>
  );
};

export default Tooltip;

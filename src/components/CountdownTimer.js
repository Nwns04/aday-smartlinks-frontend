import React from 'react';
import Countdown from 'react-countdown';
import { FiClock } from 'react-icons/fi';

const CountdownTimer = ({ endTime, onComplete }) => {
  // Return null if no valid endTime is provided
  if (!endTime || isNaN(new Date(endTime))) {
    return null;
  }

  // Format single digits with leading zero
  const formatNumber = (num) => num.toString().padStart(2, '0');

  // Custom renderer with flip animation effect
  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      return (
        <div className="flex items-center justify-center py-2 px-4 bg-green-100 text-green-800 rounded-lg">
          <FiClock className="mr-2" />
          <span>Available now!</span>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center">
        <div className="flex justify-center gap-1 sm:gap-2">
          {/* Days */}
          {days > 0 && (
            <div className="flex flex-col items-center">
              <div className="text-2xl sm:text-3xl font-bold bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-lg animate-flip">
                {formatNumber(days)}
              </div>
              {/* <div className="text-xs mt-1 text-gray-500 dark:text-gray-400">DAYS</div> */}
            </div>
          )}

          {/* Hours */}
          <div className="flex flex-col items-center">
            <div className="text-2xl sm:text-3xl font-bold bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-lg animate-flip">
              {formatNumber(hours)}
            </div>
            {/* <div className="text-xs mt-1 text-gray-500 dark:text-gray-400">HOURS</div> */}
          </div>

          {/* Minutes */}
          <div className="flex flex-col items-center">
            <div className="text-2xl sm:text-3xl font-bold bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-lg animate-flip">
              {formatNumber(minutes)}
            </div>
            {/* <div className="text-xs mt-1 text-gray-500 dark:text-gray-400">MINUTES</div> */}
          </div>

          {/* Seconds */}
          <div className="flex flex-col items-center">
            <div className="text-2xl sm:text-3xl font-bold bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-lg animate-flip">
              {formatNumber(seconds)}
            </div>
            {/* <div className="text-xs mt-1 text-gray-500 dark:text-gray-400">SECONDS</div> */}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full">
      <Countdown
        date={endTime}
        renderer={renderer}
        onComplete={onComplete}
        zeroPadTime={2}
      />
    </div>
  );
};

export default CountdownTimer;
import React, { useState } from "react";
import { Target, Trophy, Zap } from "lucide-react";

const GoalTracker = ({ totalClicks }) => {
  const [goal, setGoal] = useState(500);
  const progress = Math.min((totalClicks / goal) * 100, 100);
  const progressText = `${totalClicks} of ${goal} clicks`;
  const percentage = Math.round(progress);

  const handleGoalChange = (e) => {
    const value = Math.max(1, parseInt(e.target.value) || 1);
    setGoal(value);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-800">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
          <Trophy className="h-5 w-5 text-yellow-500 mr-2" />
          Campaign Goal Tracker
        </h3>
      </div>
      
      <div className="px-5 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Target className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="number"
              value={goal}
              onChange={handleGoalChange}
              min="1"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="Set goal"
            />
          </div>
          <span className="ml-3 text-sm text-gray-500 dark:text-gray-400">
            clicks target
          </span>
        </div>

        <div className="mb-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {progressText}
            </span>
            <span className={`text-sm font-semibold ${
              progress >= 100 ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'
            }`}>
              {percentage}%
            </span>
          </div>
          
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div
              className={`h-2.5 rounded-full ${
                progress >= 100 
                  ? 'bg-gradient-to-r from-green-400 to-green-600' 
                  : 'bg-gradient-to-r from-blue-400 to-blue-600'
              }`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {progress >= 100 ? (
          <div className="mt-3 p-2 bg-green-50 dark:bg-green-900/30 rounded-md flex items-center">
            <Zap className="h-4 w-4 text-green-500 dark:text-green-400 mr-2" />
            <span className="text-sm text-green-700 dark:text-green-300">
              Goal achieved! 🎉
            </span>
          </div>
        ) : (
          <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
            {goal - totalClicks} more clicks needed to reach your goal
          </div>
        )}
      </div>
    </div>
  );
};

export default GoalTracker;
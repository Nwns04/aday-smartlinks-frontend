import React, { useState, useEffect } from "react";
import { Mail, Target, Users, Zap } from "lucide-react";
import API from "../services/api";

const EmailProgress = ({ totalEmails, user }) => {
  const [goal, setGoal] = useState(100);
  const [newGoal, setNewGoal] = useState("");
  const [saving, setSaving] = useState(false);

  const progress = Math.min((totalEmails / goal) * 100, 100);
  const percentage = Math.round(progress);
  const remaining = goal - totalEmails;

  useEffect(() => {
    if (user?.emailGoal) {
      setGoal(user.emailGoal);
    }
  }, [user]);

  const handleGoalChange = (e) => {
    const value = Math.max(1, parseInt(e.target.value) || 1);
    setGoal(value);
  };

  const handleNewGoalSave = async () => {
    if (!newGoal) return;
    try {
      setSaving(true);
      await API.post(`/auth/email-goal/${user.email}`, { goal: newGoal });
      setGoal(newGoal);
      setNewGoal("");
    } catch (error) {
      console.error("Error saving new goal:", error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-gray-700 dark:to-gray-800">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
            <Mail className="h-5 w-5 text-purple-500 mr-2" />
            Email Collection Tracker
          </h3>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
            <Users className="h-3 w-3 mr-1" /> Leads
          </span>
        </div>
      </div>

      <div className="px-5 py-4">
        {/* Goal Input */}
        {progress < 100 ? (
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
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="Set email goal"
              />
            </div>
          </div>
        ) : (
          <div className="mt-3 flex items-center space-x-2">
            <input
              type="number"
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              placeholder="Set new goal"
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
            <button
              onClick={handleNewGoalSave}
              disabled={saving}
              className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-md"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        )}

        {/* Progress */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {totalEmails} of {goal} emails collected
            </span>
            <span className={`text-sm font-semibold ${
              progress >= 100 ? 'text-green-600 dark:text-green-400' : 'text-purple-600 dark:text-purple-400'
            }`}>
              {percentage}%
            </span>
          </div>

          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div
              className={`h-2.5 rounded-full ${
                progress >= 100 
                  ? 'bg-gradient-to-r from-green-400 to-green-600' 
                  : 'bg-gradient-to-r from-purple-400 to-purple-600'
              }`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Status */}
        {progress >= 100 ? (
          <div className="mt-3 p-2 bg-green-50 dark:bg-green-900/30 rounded-md flex items-center">
            <Zap className="h-4 w-4 text-green-500 dark:text-green-400 mr-2" />
            <span className="text-sm text-green-700 dark:text-green-300">
              Goal achieved! Set a new one 🎯
            </span>
          </div>
        ) : (
          <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
            {remaining > 0 ? `${remaining} more needed` : "Goal reached!"}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailProgress;

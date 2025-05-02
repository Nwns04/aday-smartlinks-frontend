import React from "react";

const TaskSuggestions = ({ tasks }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow mb-4">
      <h3 className="text-lg mb-2">Suggested Tasks</h3>
      <ul className="space-y-2">
        {tasks.map((task, index) => (
          <li
            key={index}
            className={`text-sm ${
              task.completed
                ? "text-green-500 line-through"
                : "text-gray-700 dark:text-gray-300"
            }`}
          >
            ✅ {task.text}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskSuggestions;

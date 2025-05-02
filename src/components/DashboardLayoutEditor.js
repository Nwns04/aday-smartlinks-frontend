import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import API from "../services/api";

const defaultLayout = [
  { id: "performance", title: "Performance Overview" },
  { id: "campaigns", title: "Your Campaigns" },
  { id: "quickActions", title: "Quick Actions" },
];

const DashboardLayoutEditor = ({ user, setUser }) => {
  const [layout, setLayout] = useState(user.dashboardLayout.layout || defaultLayout);

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const newLayout = Array.from(layout);
    const [movedItem] = newLayout.splice(result.source.index, 1);
    newLayout.splice(result.destination.index, 0, movedItem);
    setLayout(newLayout);
  };

  const saveLayout = async () => {
    try {
      const updatedUser = { ...user, dashboardLayout: { layout } };
      // Save updated layout to the backend if needed, e.g., via API.put or PATCH
      // For example: await API.put(`/user/layout/${user._id}`, { layout });
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      alert("Dashboard layout saved!");
    } catch (error) {
      alert("Failed to save layout");
    }
  };

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="font-bold mb-2">Customize Your Dashboard</h3>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="layout">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {layout.map((section, index) => (
                <Draggable key={section.id} draggableId={section.id} index={index}>
                  {(provided) => (
                    <div
                      className="p-3 border mb-2 rounded bg-gray-50"
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      {section.title}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <button
        onClick={saveLayout}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Save Layout
      </button>
    </div>
  );
};

export default DashboardLayoutEditor;

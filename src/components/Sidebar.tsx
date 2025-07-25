import { useState } from "react";

interface SidebarProps {
  collapsed: boolean;
  activePage: "overview" | "tasks" | "manpower" | "reports";
  onPageChange: (page: "overview" | "tasks" | "manpower" | "reports") => void;
  onToggleCollapse: () => void;
}

export default function Sidebar({ collapsed, activePage, onPageChange, onToggleCollapse }: SidebarProps) {
  const menuItems = [
    { id: "overview", label: "Project Overview", icon: "📊" },
    { id: "tasks", label: "Tasks", icon: "📋" },
    { id: "manpower", label: "Manpower", icon: "👥" },
    { id: "reports", label: "Reports", icon: "📈" },
  ];

  return (
    <div className={`bg-white shadow-lg transition-all duration-300 ${
      collapsed ? "w-16" : "w-64"
    }`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
          )}
          <button
            onClick={onToggleCollapse}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? "→" : "←"}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-4">
        {menuItems.map((item) => (
          <div
            key={item.id}
            onClick={() => onPageChange(item.id as "overview" | "tasks" | "manpower" | "reports")}
            className={`px-4 py-3 cursor-pointer transition-colors ${
              activePage === item.id
                ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                : "text-gray-700 hover:bg-gray-50"
            }`}
            title={collapsed ? item.label : undefined}
          >
            <div className="flex items-center">
              <span className="text-lg mr-3">{item.icon}</span>
              {!collapsed && (
                <span className="font-medium">{item.label}</span>
              )}
            </div>
          </div>
        ))}
      </nav>
    </div>
  );
} 
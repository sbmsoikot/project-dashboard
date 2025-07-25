import { useState } from "react";

interface TopbarProps {
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  username?: string | null;
  role?: string;
  onLogout: () => void;
}

export default function Topbar({ 
  sidebarCollapsed, 
  onToggleSidebar, 
  username, 
  role, 
  onLogout 
}: TopbarProps) {
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  return (
    <div className="bg-white shadow-sm border-b px-6 py-4">
      <div className="flex justify-between items-center">
        {/* Left side - Page title only */}
        <div className="flex items-center">
          <h2 className="text-lg font-semibold text-gray-800">Project Dashboard</h2>
        </div>

        {/* Right side - User profile dropdown and last updated */}
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600">
            Last updated: {new Date().toLocaleDateString()}
          </div>
          
          {username && (
            <div className="relative">
              {/* User dropdown trigger */}
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {/* Username */}
                <span className="text-sm text-gray-700 font-medium">
                  {username}
                </span>
                
                {/* Dropdown arrow */}
                <svg 
                  className={`w-4 h-4 text-gray-500 transition-transform ${
                    showUserDropdown ? 'rotate-180' : ''
                  }`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown menu */}
              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                  <div className="py-1">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                      <div className="font-medium">{username}</div>
                      <div className="text-xs text-gray-500">{role === "admin" ? "Administrator" : "Guest User"}</div>
                    </div>
                    <button
                      onClick={() => {
                        onLogout();
                        setShowUserDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {showUserDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowUserDropdown(false)}
        />
      )}
    </div>
  );
} 
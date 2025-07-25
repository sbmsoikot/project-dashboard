import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

interface DashboardLayoutProps {
  children: React.ReactNode;
  activePage: "overview" | "tasks" | "manpower" | "reports";
  onPageChange: (page: "overview" | "tasks" | "manpower" | "reports") => void;
  username?: string | null;
  role?: string;
  onLogout: () => void;
}

export default function DashboardLayout({ 
  children, 
  activePage, 
  onPageChange, 
  username, 
  role, 
  onLogout 
}: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar 
        collapsed={sidebarCollapsed} 
        activePage={activePage}
        onPageChange={onPageChange}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar 
          sidebarCollapsed={sidebarCollapsed}
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          username={username}
          role={role}
          onLogout={onLogout}
        />
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
} 
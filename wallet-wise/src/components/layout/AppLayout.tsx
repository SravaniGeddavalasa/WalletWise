import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";
import { useAuth } from "../../context/AuthContext";

export const AppLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isMockMode } = useAuth();

  return (
    <div className="flex min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Left Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 md:pl-64">
        <TopNavbar
          onMenuOpen={() => setIsSidebarOpen(true)}
          isMockMode={isMockMode}
        />
        
        <main className="flex-1 overflow-y-auto bg-muted/10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;

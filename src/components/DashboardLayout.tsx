import { useState } from "react";
import { Outlet } from "react-router-dom";
import { DashboardHeader } from "./dashboard-header";
import { DashboardSidebar } from "./dashboard-sidebar";

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 overflow-hidden">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar - responsive: drawer on mobile, static on desktop */}
      <div
        className={`
          fixed lg:relative z-50 h-full transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <DashboardSidebar onNavClick={closeSidebar} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative w-full">
        {/* Header */}
        <DashboardHeader onMenuClick={toggleSidebar} />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto relative">
          <div className="p-4 md:p-6 w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

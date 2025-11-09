"use client";

import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";
import { useUserProfile } from "../lib/queries";
import {
  LayoutDashboard,
  Users,
  Settings,
  BarChart3,
  FileText,
  Shield,
  ChevronLeft,
  ChevronRight,
  Zap,
  UserCheck,
  CreditCard,
  TrendingDown,
  ChevronDown,
  LogOut,
  Boxes,
  Trophy,
  Calendar,
  UserPlus,
  Wallet,
  Plus,
  List,
  Gift,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "User", href: "/dashboard/users", icon: Users },
  { name: "Affiliator", href: "/dashboard/affiliator", icon: UserCheck },
  {
    name: "Referral System",
    href: "/dashboard/referral",
    icon: UserPlus,
    children: [
      { name: "My Referrals", href: "/dashboard/referral" },
      { name: "Settings", href: "/dashboard/referral/settings" },
    ],
  },
  {
    name: "Deposit",
    href: "/dashboard/deposit",
    icon: Wallet,
    children: [
      { name: "Deposit Method Management", href: "/dashboard/deposit" },
      { name: "Promotion Management", href: "/dashboard/promotions" },
      { name: "All Deposit Requests", href: "/dashboard/deposit/requests" },
    ],
  },
  { name: "Top Winners", href: "/dashboard/top-winners", icon: Trophy },
  {
    name: "Upcoming Matches",
    href: "/dashboard/upcoming-matches",
    icon: Calendar,
  },
  { name: "Transactions", href: "/dashboard/transactions", icon: TrendingDown },
  { name: "Pages", href: "/dashboard/pages", icon: Boxes },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
  { name: "Slider Management", href: "/dashboard/slider", icon: FileText },
  { name: "Logout", href: "/logout", icon: LogOut },
];

export function DashboardSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const location = useLocation();
  const { data: userProfile } = useUserProfile();

  const toggleMenu = (name: string) => {
    setExpandedMenu(expandedMenu === name ? null : name);
  };

  return (
    <div
      className={cn(
        "relative flex flex-col h-full bg-gray-900 transition-all duration-300 ease-in-out",
        collapsed ? "w-20" : "w-72"
      )}
    >
      {/* Decorative overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

      <div className="relative z-10 flex flex-col h-full">
        {/* Logo Section */}
        <div className="flex items-center justify-between p-3 border-b border-white/10">
          {!collapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center ring-2 ring-white/10">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-white text-lg">Admin</span>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="text-white/80 hover:text-white hover:bg-white/10 transition-colors h-8 w-8 p-0"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            const isExpanded = expandedMenu === item.name;

            return (
              <div key={item.name}>
                <Link to={item.href}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start transition-all duration-200 h-10",
                      collapsed ? "px-2" : "px-3",
                      isActive
                        ? "bg-white/20 text-white shadow-lg shadow-black/10 backdrop-blur-sm"
                        : "text-white/70 hover:text-white hover:bg-white/10"
                    )}
                    onClick={(e) => {
                      if (item.children) {
                        e.preventDefault();
                        toggleMenu(item.name);
                      }
                    }}
                  >
                    <Icon className={cn("h-5 w-5", collapsed ? "" : "mr-4")} />
                    {!collapsed && (
                      <>
                        <span className="font-medium">{item.name}</span>
                        {item.children && (
                          <ChevronDown
                            className={cn(
                              "ml-auto h-4 w-4 transition-transform",
                              isExpanded ? "rotate-180" : ""
                            )}
                          />
                        )}
                      </>
                    )}
                    {isActive && !collapsed && !item.children && (
                      <div className="ml-auto w-2 h-2 bg-white rounded-full" />
                    )}
                  </Button>
                </Link>

                {!collapsed && item.children && isExpanded && (
                  <div className="ml-6 mt-1 space-y-1">
                    {item.children.map((child) => {
                      const isChildActive = location.pathname === child.href;
                      return (
                        <Link key={child.name} to={child.href}>
                          <Button
                            variant="ghost"
                            className={cn(
                              "w-full justify-start transition-all duration-200 h-8 text-sm px-2",
                              isChildActive
                                ? "bg-white/20 text-white shadow-lg shadow-black/10 backdrop-blur-sm"
                                : "text-white/70 hover:text-white hover:bg-white/10"
                            )}
                          >
                            <span>{child.name}</span>
                            {isChildActive && (
                              <div className="ml-auto w-2 h-2 bg-white rounded-full" />
                            )}
                          </Button>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* User Profile Section */}
        <div className="p-2 border-t border-white/10">
          {!collapsed ? (
            <div className="flex items-center space-x-2 p-2 rounded-xl bg-white/10 backdrop-blur-sm">
              <div className="w-10 h-10 bg-gradient-to-br from-white/20 to-white/10 rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm truncate">
                  {userProfile?.user?.username || "Admin User"}
                </p>
                <p className="text-white/60 text-xs truncate">
                  {userProfile?.user?.email || "admin@example.com"}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-10 h-10 bg-gradient-to-br from-white/20 to-white/10 rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-2 border-t border-white/10">
          <div
            className={cn(
              "text-xs text-white/50 font-medium",
              collapsed ? "text-center" : ""
            )}
          >
            {collapsed ? "v2.0" : "AdminHub v2.0 - Premium"}
          </div>
        </div>
      </div>
    </div>
  );
}

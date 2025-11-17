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
  FileText,
  Shield,
  ChevronLeft,
  ChevronRight,
  Zap,
  CreditCard,
  TrendingDown,
  ChevronDown,
  Trophy,
  Calendar,
  UserPlus,
  Wallet,
  MessageSquare,
} from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["admin", "user"],
  },
  { name: "Users", href: "/dashboard/users", icon: Users, roles: ["admin"] },
  {
    name: "Referral System",
    href: "/dashboard/referral",
    icon: UserPlus,
    roles: ["admin"],
    children: [
      { name: "My Referrals", href: "/dashboard/referral" },
      { name: "Settings", href: "/dashboard/referral/settings" },
    ],
  },
  {
    name: "Deposit",
    href: "/dashboard/deposit",
    icon: Wallet,
    roles: ["admin"],
    children: [
      { name: "Deposit Methods", href: "/dashboard/deposit" },
      { name: "Promotions", href: "/dashboard/promotions" },
      { name: "Deposit Requests", href: "/dashboard/deposit/requests" },
    ],
  },
  {
    name: "Withdraw",
    href: "/dashboard/withdraw",
    icon: TrendingDown,
    roles: ["admin"],
    children: [{ name: "Withdraw Methods", href: "/dashboard/withdraw" }],
  },
  {
    name: "Top Winners",
    href: "/dashboard/top-winners",
    icon: Trophy,
    roles: ["admin"],
  },
  {
    name: "Upcoming Matches",
    href: "/dashboard/upcoming-matches",
    icon: Calendar,
    roles: ["admin"],
  },
  {
    name: "Transactions",
    href: "/dashboard/transactions",
    icon: CreditCard,
    roles: ["admin", "user"],
  },
  {
    name: "Contact Us",
    href: "/dashboard/contact",
    icon: MessageSquare,
    roles: ["admin", "user"],
  },
  {
    name: "Slider",
    href: "/dashboard/slider",
    icon: FileText,
    roles: ["admin"],
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    roles: ["admin", "user"],
  },
];

export function DashboardSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const location = useLocation();
  const { data: userProfile } = useUserProfile();

  const toggleMenu = (name: string) => {
    setExpandedMenu(expandedMenu === name ? null : name);
  };

  // Get user role
  const userRole = userProfile?.user?.role || "user";

  // Filter navigation based on user role
  const filteredNavigation = navigation.filter((item) =>
    item.roles?.includes(userRole)
  );

  return (
    <div
      className={cn(
        "relative flex flex-col h-full bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 dark:from-slate-950 dark:via-purple-950 dark:to-slate-950 border-r border-purple-500/20 transition-all duration-300 ease-in-out shadow-2xl",
        collapsed ? "w-20" : "w-72"
      )}
    >
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-blue-600/10 to-indigo-600/10 pointer-events-none animate-pulse" />

      {/* Decorative circles */}
      <div className="absolute top-20 -left-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 -right-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="relative z-10 flex flex-col h-full">
        {/* Logo Section */}
        <div className="flex items-center justify-between p-4 border-b border-purple-500/20 bg-gradient-to-r from-purple-600/10 to-blue-600/10 backdrop-blur-sm">
          {!collapsed && (
            <div className="flex items-center space-x-3 animate-fade-in">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center ring-2 ring-purple-400/50 shadow-lg shadow-purple-500/50 animate-pulse">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-white text-xl bg-gradient-to-r from-purple-200 to-blue-200 bg-clip-text text-transparent">
                  BetHub
                </span>
                <span className="text-xs text-purple-300">Admin Panel</span>
              </div>
            </div>
          )}
          {collapsed && (
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center ring-2 ring-purple-400/50 shadow-lg shadow-purple-500/50 mx-auto">
              <Zap className="w-7 h-7 text-white" />
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="text-purple-300 hover:text-white hover:bg-purple-500/20 transition-all duration-300 h-9 w-9 p-0 rounded-xl"
          >
            {collapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-500/50 scrollbar-track-transparent">
          {filteredNavigation.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            const isExpanded = expandedMenu === item.name;

            return (
              <div
                key={item.name}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <Link to={item.href}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start transition-all duration-300 h-11 rounded-xl group relative overflow-hidden",
                      collapsed ? "px-2" : "px-4",
                      isActive
                        ? "bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white shadow-lg shadow-purple-500/50 hover:shadow-purple-500/70 scale-105"
                        : "text-purple-200 hover:text-white hover:bg-purple-500/20 hover:scale-105"
                    )}
                    onClick={(e) => {
                      if (item.children) {
                        e.preventDefault();
                        toggleMenu(item.name);
                      }
                    }}
                  >
                    {/* Hover effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-blue-600/0 to-indigo-600/0 group-hover:from-purple-600/20 group-hover:via-blue-600/20 group-hover:to-indigo-600/20 transition-all duration-300" />

                    <Icon
                      className={cn(
                        "h-5 w-5 relative z-10 transition-transform duration-300 group-hover:scale-110",
                        collapsed ? "" : "mr-3",
                        isActive ? "animate-pulse" : ""
                      )}
                    />
                    {!collapsed && (
                      <>
                        <span className="font-semibold relative z-10">
                          {item.name}
                        </span>
                        {item.children && (
                          <ChevronDown
                            className={cn(
                              "ml-auto h-4 w-4 transition-all duration-300 relative z-10",
                              isExpanded ? "rotate-180" : ""
                            )}
                          />
                        )}
                      </>
                    )}
                    {isActive && !collapsed && !item.children && (
                      <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse relative z-10" />
                    )}
                  </Button>
                </Link>

                {!collapsed && item.children && isExpanded && (
                  <div className="ml-8 mt-2 space-y-1 animate-slide-down">
                    {item.children.map((child) => {
                      const isChildActive = location.pathname === child.href;
                      return (
                        <Link key={child.name} to={child.href}>
                          <Button
                            variant="ghost"
                            className={cn(
                              "w-full justify-start transition-all duration-300 h-9 text-sm px-3 rounded-lg group",
                              isChildActive
                                ? "bg-gradient-to-r from-purple-500/30 to-blue-500/30 text-white shadow-md"
                                : "text-purple-300 hover:text-white hover:bg-purple-500/10"
                            )}
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mr-2 group-hover:scale-150 transition-transform" />
                            <span>{child.name}</span>
                            {isChildActive && (
                              <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
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
        <div className="p-3 border-t border-purple-500/20 bg-gradient-to-r from-purple-600/10 to-blue-600/10 backdrop-blur-sm">
          {!collapsed ? (
            <div className="flex items-center space-x-3 p-3 rounded-xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-sm border border-purple-400/30 hover:border-purple-400/50 transition-all duration-300 group cursor-pointer">
              <div className="w-11 h-11 bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-500 rounded-full flex items-center justify-center ring-2 ring-purple-400/50 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm truncate">
                  {userProfile?.user?.username || "Admin User"}
                </p>
                <p className="text-purple-300 text-xs truncate">
                  {userProfile?.user?.email || "admin@example.com"}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-11 h-11 bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-500 rounded-full flex items-center justify-center ring-2 ring-purple-400/50 shadow-lg hover:scale-110 transition-transform duration-300 cursor-pointer">
                <Shield className="w-6 h-6 text-white" />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-purple-500/20">
          <div
            className={cn(
              "text-xs text-purple-400 font-semibold",
              collapsed ? "text-center" : "text-center"
            )}
          >
            {collapsed ? "v2.0" : "BetHub v2.0 - Premium Edition"}
          </div>
        </div>
      </div>
    </div>
  );
}

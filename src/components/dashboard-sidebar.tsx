"use client";

import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";
import { useUserProfile } from "../lib/queries";
import { AuthService } from "../lib/auth";
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
  Gamepad2,
  Share2,
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
      { name: "Deposit Bonuses", href: "/dashboard/deposit-bonuses" },
      { name: "Promotions", href: "/dashboard/promotions" },
      { name: "Deposit Requests", href: "/dashboard/deposit/requests" },
    ],
  },
  {
    name: "Withdraw",
    href: "/dashboard/withdraw",
    icon: TrendingDown,
    roles: ["admin"],
    children: [
      { name: "Withdraw Methods", href: "/dashboard/withdraw" },
      {
        name: "Withdraw Requests",
        href: "/dashboard/transactions?tab=withdraw",
      },
    ],
  },
  {
    name: "Affiliate System",
    href: "/dashboard/affiliates",
    icon: Share2,
    roles: ["admin"],
    children: [
      { name: "Partner List", href: "/dashboard/affiliates" },
      { name: "Manage Commission", href: "/dashboard/affiliate/commission" },
      { name: "Payout Requests", href: "/dashboard/affiliate/payout-requests" },
      {
        name: "Settlement Audit",
        href: "/dashboard/affiliate/distribution-history",
      },
      {
        name: "Withdraw Channels",
        href: "/dashboard/affiliate/payment-methods",
      },
      { name: "Theme Settings", href: "/dashboard/affiliate/theme-config" },
      { name: "Content Management", href: "/dashboard/affiliate/content" },
    ],
  },
  {
    name: "Top Winners",
    href: "/dashboard/top-winners",
    icon: Trophy,
    roles: ["admin", "user"],
  },
  {
    name: "Upcoming Matches",
    href: "/dashboard/upcoming-matches",
    icon: Calendar,
    roles: ["admin", "user"],
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
    name: "Games Management",
    href: "/dashboard/games",
    icon: Gamepad2,
    roles: ["admin"],
    children: [
      { name: "Oracle Games", href: "/dashboard/oracle-games" },
      { name: "Popular Games", href: "/dashboard/popular-games" },
      { name: "Game Categories", href: "/dashboard/games?tab=categories" },
      { name: "Create Game", href: "/dashboard/games?tab=create" },
      { name: "Bulk Deploy", href: "/dashboard/games?tab=bulk" },
      { name: "Games Library", href: "/dashboard/games?tab=manage" },
      { name: "Game Providers", href: "/dashboard/games?tab=providers" },
    ],
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
    children: [
      {
        name: "Platform Settings",
        href: "/dashboard/settings?tab=organization",
      },
      { name: "UI Customization", href: "/dashboard/settings?tab=ui" },
      { name: "APK Management", href: "/dashboard/settings?tab=apk" },
      { name: "VIP Settings", href: "/dashboard/settings?tab=vip" },
    ],
  },
];

export function DashboardSidebar({ onNavClick }: { onNavClick?: () => void }) {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const location = useLocation();
  const { data: userProfile } = useUserProfile();

  const toggleMenu = (name: string) => {
    setExpandedMenu(expandedMenu === name ? null : name);
  };

  // Auto-expand the active parent menu on load or location change
  useEffect(() => {
    const currentPath = location.pathname + location.search;
    const activeParent = navigation.find((item) =>
      item.children?.some((child) =>
        child.href.includes("?")
          ? currentPath === child.href
          : location.pathname === child.href,
      ),
    );
    if (activeParent) {
      setExpandedMenu(activeParent.name);
    }
  }, [location.pathname, location.search]);

  // Get user role - check multiple possible locations
  const userRole =
    userProfile?.user?.role ||
    localStorage.getItem("userRole") ||
    (AuthService.isAuthenticated() ? "admin" : "user");

  // Filter navigation based on user role
  const filteredNavigation = navigation.filter((item) =>
    item.roles?.includes(userRole),
  );

  return (
    <div
      className={cn(
        "relative flex flex-col h-full bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 border-r border-gray-700/50 transition-all duration-300 ease-in-out shadow-2xl",
        collapsed ? "w-20" : "w-72",
      )}
    >
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-800/10 via-gray-700/10 to-black/10 pointer-events-none animate-pulse" />

      {/* Decorative circles */}
      <div className="absolute top-20 -left-10 w-40 h-40 bg-yellow-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 -right-10 w-40 h-40 bg-yellow-500/10 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="relative z-10 flex flex-col h-full">
        {/* Logo Section */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700/50 bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm">
          {!collapsed && (
            <div className="flex items-center space-x-3 animate-fade-in">
              <div className="w-12 h-12 bg-yellow-400 rounded-2xl flex items-center justify-center ring-2 ring-yellow-300/50 shadow-lg shadow-yellow-400/30 animate-pulse">
                <span className="font-bold text-gray-900 text-lg">A</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-white text-xl">ADMIN</span>
                <span className="text-xs text-gray-400">
                  Modern Admin Panel
                </span>
              </div>
            </div>
          )}
          {collapsed && (
            <div className="w-12 h-12 bg-yellow-400 rounded-2xl flex items-center justify-center ring-2 ring-yellow-300/50 shadow-lg shadow-yellow-400/30 mx-auto">
              <span className="font-bold text-gray-900 text-lg">A</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="text-gray-400 hover:text-yellow-400 hover:bg-gray-700/50 transition-all duration-300 h-9 w-9 p-0 rounded-xl"
          >
            {collapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-yellow-500/50 scrollbar-track-transparent">
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
                <Link to={item.href} onClick={onNavClick}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start transition-all duration-300 h-11 rounded-xl group relative overflow-hidden",
                      collapsed ? "px-2" : "px-4",
                      isActive
                        ? "bg-yellow-400 text-gray-900 shadow-lg shadow-yellow-400/30 hover:shadow-yellow-400/40 scale-105"
                        : "text-gray-300 hover:text-yellow-400 hover:bg-gray-700/50 hover:scale-105",
                    )}
                    onClick={(e) => {
                      if (item.children) {
                        e.preventDefault();
                        toggleMenu(item.name);
                      } else if (onNavClick) {
                        onNavClick();
                      }
                    }}
                  >
                    {/* Hover effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/0 via-yellow-500/0 to-yellow-500/0 group-hover:from-yellow-500/10 group-hover:via-yellow-500/10 group-hover:to-yellow-500/10 transition-all duration-300" />

                    <Icon
                      className={cn(
                        "h-5 w-5 relative z-10 transition-transform duration-300 group-hover:scale-110",
                        collapsed ? "" : "mr-3",
                        isActive ? "animate-pulse" : "",
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
                              isExpanded ? "rotate-180" : "",
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
                      const isChildActive = child.href.includes("?")
                        ? location.pathname + location.search === child.href
                        : location.pathname === child.href;
                      return (
                        <Link key={child.name} to={child.href} onClick={onNavClick}>
                          <Button
                            variant="ghost"
                            className={cn(
                              "w-full justify-start transition-all duration-300 h-9 text-sm px-3 rounded-lg group",
                              isChildActive
                                ? "bg-yellow-400/20 text-yellow-400 shadow-md"
                                : "text-gray-400 hover:text-yellow-400 hover:bg-gray-700/30",
                            )}
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 mr-2 group-hover:scale-150 transition-transform" />
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
        <div className="p-3 border-t border-gray-700/50 bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm">
          {!collapsed ? (
            <div className="flex items-center space-x-3 p-3 rounded-xl bg-gradient-to-r from-gray-700/30 to-gray-800/30 backdrop-blur-sm border border-gray-600/30 hover:border-yellow-400/30 transition-all duration-300 group cursor-pointer">
              <div className="w-11 h-11 bg-yellow-400 rounded-full flex items-center justify-center ring-2 ring-yellow-300/50 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-6 h-6 text-gray-900" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm truncate">
                  {userProfile?.user?.username || "Admin User"}
                </p>
                <p className="text-gray-400 text-xs truncate">
                  {userProfile?.user?.email || "admin@example.com"}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-11 h-11 bg-yellow-400 rounded-full flex items-center justify-center ring-2 ring-yellow-300/50 shadow-lg hover:scale-110 transition-transform duration-300 cursor-pointer">
                <Shield className="w-6 h-6 text-gray-900" />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-gray-700/50">
          <div
            className={cn(
              "text-xs text-gray-500 font-semibold",
              collapsed ? "text-center" : "text-center",
            )}
          >
            {collapsed ? "v2.0" : "Admin Panel v2.0"}
          </div>
        </div>
      </div>
    </div>
  );
}

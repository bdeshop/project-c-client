import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Bell, Settings, LogOut, User, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AuthService } from "../lib/auth";
import { useUserProfile } from "../lib/queries";

export function DashboardHeader({ onMenuClick }: { onMenuClick?: () => void }) {
  const navigate = useNavigate();
  const { data: userProfile, isLoading } = useUserProfile();

  const handleSignOut = () => {
    // Use AuthService to logout
    AuthService.logout();

    // Navigate to login page
    navigate("/login");
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!userProfile?.user) return "AD";
    const name = userProfile.user.name || userProfile.user.username;
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };
  return (
    <header className="relative bg-gradient-to-r from-gray-800/80 via-gray-700/80 to-gray-900/80 backdrop-blur-sm border-b border-gray-700/50 px-6 py-3 shadow-lg">
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/5 via-gray-600/5 to-gray-600/5 animate-pulse pointer-events-none" />

      <div className="relative z-10 flex items-center justify-between">
        {/* Left side with hamburger and title */}
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="h-10 w-10 rounded-lg hover:bg-gray-700/50 transition-all duration-300 text-gray-400 hover:text-yellow-400 hover:scale-110"
          >
            <Menu className="h-4 w-4" />
          </Button>

          <div className="animate-fade-in">
            <h1 className="text-lg font-bold text-white">Dashboard</h1>
            <p className="text-xs text-gray-400">Admin Control Panel</p>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-2">
          {/* Notifications */}
          <Button
            variant="ghost"
            size="sm"
            className="relative h-10 w-10 rounded-lg hover:bg-gray-700/50 transition-all duration-300 text-gray-400 hover:text-yellow-400 hover:scale-110 group"
          >
            <Bell className="h-4 w-4 group-hover:animate-bounce" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-yellow-400 rounded-full animate-pulse shadow-lg shadow-yellow-400/50 flex items-center justify-center">
              <span className="text-[8px] font-bold text-gray-900">3</span>
            </span>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-lg p-0 hover:bg-gray-700/50 transition-all duration-300 hover:scale-110 group"
              >
                <Avatar className="h-9 w-9 ring-2 ring-yellow-400/50 group-hover:ring-yellow-400 transition-all duration-300 shadow-lg shadow-yellow-400/20">
                  <AvatarImage
                    src={userProfile?.user?.profileImage || "/admin-avatar.png"}
                    alt={userProfile?.user?.name || "User"}
                  />
                  <AvatarFallback className="bg-yellow-400 text-gray-900 font-semibold text-xs">
                    {isLoading ? "..." : getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900 animate-pulse" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-64 bg-gradient-to-br from-gray-900 via-gray-800 to-black border border-gray-700/50 shadow-2xl shadow-gray-900/50"
              align="end"
              forceMount
            >
              <DropdownMenuLabel className="font-normal p-3 bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm">
                <div className="flex flex-col space-y-2">
                  <p className="text-sm font-bold leading-none text-white">
                    {isLoading
                      ? "Loading..."
                      : userProfile?.user?.name ||
                        userProfile?.user?.username ||
                        "User"}
                  </p>
                  <p className="text-xs leading-none text-gray-400">
                    {isLoading
                      ? "Loading..."
                      : userProfile?.user?.email || "No email"}
                  </p>
                  {!isLoading && userProfile?.user && (
                    <>
                      <div className="flex items-center gap-2 mt-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            userProfile.user.status === "active"
                              ? "bg-green-500 animate-pulse"
                              : "bg-red-500"
                          }`}
                        ></div>
                        <span
                          className={`text-xs font-semibold ${
                            userProfile.user.status === "active"
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                        >
                          {userProfile.user.status === "active"
                            ? "Online"
                            : "Offline"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-700/30">
                        <span className="text-xs text-gray-400">Balance:</span>
                        <span className="text-xs font-bold text-yellow-400">
                          {userProfile.user.currency}{" "}
                          {userProfile.user.balance?.toFixed(2) || "0.00"}
                        </span>
                      </div>
                      {userProfile.user.player_id && (
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-400">
                            Player ID:
                          </span>
                          <span className="text-xs font-mono text-white">
                            {userProfile.user.player_id}
                          </span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gray-700/30" />
              <DropdownMenuItem
                className="cursor-pointer hover:bg-gray-700/50 transition-all duration-300 text-gray-300 hover:text-yellow-400 m-1 rounded-lg text-sm"
                onClick={() => navigate("/dashboard/profile")}
              >
                <User className="mr-2 h-4 w-4" />
                <span>Profile Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer hover:bg-gray-700/50 transition-all duration-300 text-gray-300 hover:text-yellow-400 m-1 rounded-lg text-sm">
                <Settings className="mr-2 h-4 w-4" />
                <span>Preferences</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-700/30" />
              <DropdownMenuItem
                className="cursor-pointer hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all duration-300 m-1 rounded-lg text-sm"
                onClick={handleSignOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

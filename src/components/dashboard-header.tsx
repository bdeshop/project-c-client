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

export function DashboardHeader() {
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
    <header className="relative bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 dark:from-slate-950 dark:via-purple-950 dark:to-slate-950 border-b border-purple-500/20 px-8 py-4 shadow-lg">
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 via-blue-600/5 to-indigo-600/5 animate-pulse pointer-events-none" />

      <div className="relative z-10 flex items-center justify-between">
        {/* Left side with hamburger and title */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            className="h-12 w-12 rounded-xl hover:bg-purple-500/20 transition-all duration-300 text-purple-300 hover:text-white hover:scale-110"
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="animate-fade-in">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-200 via-blue-200 to-indigo-200 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-sm text-purple-300">
              Welcome to Khela88 Admin Panel
            </p>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-3">
          {/* Notifications */}
          <Button
            variant="ghost"
            size="sm"
            className="relative h-12 w-12 rounded-xl hover:bg-purple-500/20 transition-all duration-300 text-purple-300 hover:text-white hover:scale-110 group"
          >
            <Bell className="h-5 w-5 group-hover:animate-bounce" />
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 rounded-full animate-pulse shadow-lg shadow-purple-500/50 flex items-center justify-center">
              <span className="text-[10px] font-bold text-white">3</span>
            </span>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-12 w-12 rounded-xl p-0 hover:bg-purple-500/20 transition-all duration-300 hover:scale-110 group"
              >
                <Avatar className="h-11 w-11 ring-2 ring-purple-400/50 group-hover:ring-purple-400 transition-all duration-300 shadow-lg shadow-purple-500/30">
                  <AvatarImage
                    src={userProfile?.user?.profileImage || "/admin-avatar.png"}
                    alt={userProfile?.user?.name || "User"}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-500 text-white font-semibold">
                    {isLoading ? "..." : getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-900 animate-pulse" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-72 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 border border-purple-500/30 shadow-2xl shadow-purple-500/20"
              align="end"
              forceMount
            >
              <DropdownMenuLabel className="font-normal p-4 bg-gradient-to-r from-purple-600/10 to-blue-600/10 backdrop-blur-sm">
                <div className="flex flex-col space-y-2">
                  <p className="text-base font-bold leading-none text-white">
                    {isLoading
                      ? "Loading..."
                      : userProfile?.user?.name ||
                        userProfile?.user?.username ||
                        "User"}
                  </p>
                  <p className="text-sm leading-none text-purple-300">
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
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-purple-500/30">
                        <span className="text-xs text-purple-400">
                          Balance:
                        </span>
                        <span className="text-sm font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                          {userProfile.user.currency}{" "}
                          {userProfile.user.balance?.toFixed(2) || "0.00"}
                        </span>
                      </div>
                      {userProfile.user.player_id && (
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-purple-400">
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
              <DropdownMenuSeparator className="bg-purple-500/30" />
              <DropdownMenuItem
                className="cursor-pointer hover:bg-purple-500/20 transition-all duration-300 text-purple-200 hover:text-white m-1 rounded-lg"
                onClick={() => navigate("/dashboard/profile")}
              >
                <User className="mr-3 h-4 w-4" />
                <span>Profile Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer hover:bg-purple-500/20 transition-all duration-300 text-purple-200 hover:text-white m-1 rounded-lg">
                <Settings className="mr-3 h-4 w-4" />
                <span>Preferences</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-purple-500/30" />
              <DropdownMenuItem
                className="cursor-pointer hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all duration-300 m-1 rounded-lg"
                onClick={handleSignOut}
              >
                <LogOut className="mr-3 h-4 w-4" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

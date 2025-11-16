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
import { ThemeToggle } from "./theme-toggle";
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
    <header className="bg-card border-b border-border px-8 py-4">
      <div className="flex items-center justify-between">
        {/* Left side with hamburger and title */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            className="h-12 w-12 rounded-xl hover:bg-accent transition-colors"
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div>
            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Welcome to Mothers Admin Panel
            </p>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-3">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Notifications */}
          <Button
            variant="ghost"
            size="sm"
            className="relative h-12 w-12 rounded-xl hover:bg-accent transition-colors"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-gradient-to-r from-primary to-secondary rounded-full animate-pulse"></span>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-12 w-12 rounded-xl p-0 hover:bg-accent transition-colors"
              >
                <Avatar className="h-10 w-10 ring-2 ring-border">
                  <AvatarImage
                    src={userProfile?.user?.profileImage || "/admin-avatar.png"}
                    alt={userProfile?.user?.name || "User"}
                  />
                  <AvatarFallback className="gradient-primary text-white font-semibold">
                    {isLoading ? "..." : getUserInitials()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-64 glass-effect"
              align="end"
              forceMount
            >
              <DropdownMenuLabel className="font-normal p-4">
                <div className="flex flex-col space-y-2">
                  <p className="text-base font-semibold leading-none">
                    {isLoading
                      ? "Loading..."
                      : userProfile?.user?.name ||
                        userProfile?.user?.username ||
                        "User"}
                  </p>
                  <p className="text-sm leading-none text-muted-foreground">
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
                              ? "bg-success"
                              : "bg-destructive"
                          }`}
                        ></div>
                        <span
                          className={`text-xs font-medium ${
                            userProfile.user.status === "active"
                              ? "text-success"
                              : "text-destructive"
                          }`}
                        >
                          {userProfile.user.status === "active"
                            ? "Online"
                            : "Offline"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50">
                        <span className="text-xs text-muted-foreground">
                          Balance:
                        </span>
                        <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                          {userProfile.user.currency}{" "}
                          {userProfile.user.balance?.toFixed(2) || "0.00"}
                        </span>
                      </div>
                      {userProfile.user.player_id && (
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            Player ID:
                          </span>
                          <span className="text-xs font-mono text-foreground">
                            {userProfile.user.player_id}
                          </span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border/50" />
              <DropdownMenuItem
                className="cursor-pointer hover:bg-primary/10 transition-colors"
                onClick={() => navigate("/dashboard/profile")}
              >
                <User className="mr-3 h-4 w-4" />
                <span>Profile Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer hover:bg-primary/10 transition-colors">
                <Settings className="mr-3 h-4 w-4" />
                <span>Preferences</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border/50" />
              <DropdownMenuItem
                className="cursor-pointer hover:bg-destructive/10 text-destructive transition-colors"
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

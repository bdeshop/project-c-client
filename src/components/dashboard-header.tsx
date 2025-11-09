import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Bell, Search, Settings, LogOut, User, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AuthService } from "../lib/auth";
import { ThemeToggle } from "./theme-toggle";

export function DashboardHeader() {
  const navigate = useNavigate();

  const handleSignOut = () => {
    // Use AuthService to logout
    AuthService.logout();

    // Navigate to login page
    navigate("/login");
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
                  <AvatarImage src="/admin-avatar.png" alt="Admin" />
                  <AvatarFallback className="gradient-primary text-white font-semibold">
                    AD
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-64 glass-effect"
              align="end"
              forceMount
            >
              // ... existing code ...
              <DropdownMenuLabel className="font-normal p-4">
                <div className="flex flex-col space-y-2">
                  <p className="text-base font-semibold leading-none">
                    Admin User
                  </p>
                  <p className="text-sm leading-none text-muted-foreground">
                    admin@example.com
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                    <span className="text-xs text-success font-medium">
                      Online
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border/50" />
              <DropdownMenuItem className="cursor-pointer hover:bg-primary/10 transition-colors">
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

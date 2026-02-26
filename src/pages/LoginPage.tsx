"use client";

import type React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Shield, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import {
  AuthService,
  type LoginRequest,
  type ApiError,
  type DashboardSignupRequest,
} from "../lib/auth";

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "user">("user");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const credentials: LoginRequest = {
      email,
      password,
    };
    try {
      const response = await AuthService.dashboardLogin(credentials);

      if (response.success) {
        navigate("/dashboard");
      } else {
        setError(response.message || "Login failed. Please try again.");
      }
    } catch (error) {
      const apiError = error as ApiError;
      setError(
        apiError.message || "An unexpected error occurred. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await AuthService.dashboardSignup({
        email,
        password,
        role,
      });

      if (response.success) {
        navigate("/dashboard");
      } else {
        setError(response.message || "Signup failed. Please try again.");
      }
    } catch (error) {
      const apiError = error as ApiError;
      setError(
        apiError.message || "An unexpected error occurred. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleMode = () => {
    setIsSignup(!isSignup);
    setError(null);
    setEmail("");
    setPassword("");
    setRole("user");
  };

  return (
    <div className="min-h-screen gradient-bg flex">
      {/* Left Side - Custom Animation */}
      <div className="w-1/2 flex items-center justify-center relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 gradient-primary opacity-90"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-32 right-32 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-secondary/20 rounded-full blur-2xl animate-pulse delay-500"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center space-y-12 p-16 text-center">
          {/* Custom Animated Dashboard Icon */}
          <div className="relative">
            <div className="w-80 h-80 relative">
              {/* Outer rotating ring */}
              <div
                className="absolute inset-0 border-4 border-white/20 rounded-full animate-spin"
                style={{ animationDuration: "20s" }}
              ></div>
              <div
                className="absolute inset-4 border-4 border-white/30 rounded-full animate-spin"
                style={{
                  animationDuration: "15s",
                  animationDirection: "reverse",
                }}
              ></div>
              <div
                className="absolute inset-8 border-4 border-white/40 rounded-full animate-spin"
                style={{ animationDuration: "10s" }}
              ></div>

              {/* Center content */}
              <div className="absolute inset-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto">
                    <Shield className="w-10 h-10 text-white" />
                  </div>
                  <div className="space-y-2">
                    <div className="text-white font-bold text-lg">ADMIN</div>
                    <div className="text-white/80 text-sm">DASHBOARD</div>
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <div
                className="absolute top-8 right-8 w-4 h-4 bg-white/60 rounded-full animate-bounce"
                style={{ animationDelay: "0s" }}
              ></div>
              <div
                className="absolute bottom-12 left-12 w-3 h-3 bg-white/60 rounded-full animate-bounce"
                style={{ animationDelay: "1s" }}
              ></div>
              <div
                className="absolute top-1/2 right-4 w-2 h-2 bg-white/60 rounded-full animate-bounce"
                style={{ animationDelay: "2s" }}
              ></div>
              <div
                className="absolute bottom-8 right-16 w-3 h-3 bg-white/60 rounded-full animate-bounce"
                style={{ animationDelay: "0.5s" }}
              ></div>
            </div>
          </div>
          <div className="text-white space-y-6">
            <h2 className="text-5xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
              Welcome Back
            </h2>
            <p className="text-xl opacity-90 max-w-lg leading-relaxed">
              Access your modern dashboard with enterprise-grade security and
              beautiful analytics
            </p>
            <div className="flex items-center justify-center space-x-8 pt-8">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-white/80 rounded-full animate-pulse"></div>
                <span className="text-white/80">Secure</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-white/80 rounded-full animate-pulse delay-300"></div>
                <span className="text-white/80">Modern</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-white/80 rounded-full animate-pulse delay-700"></div>
                <span className="text-white/80">Beautiful</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login/Signup Form */}
      <div className="w-1/2 flex items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 gradient-primary rounded-3xl shadow-2xl shadow-primary/25">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <div className="space-y-3">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Admin Portal
              </h1>
              <p className="text-muted-foreground text-lg">
                {isSignup
                  ? "Create a new account"
                  : "Sign in to your dashboard"}
              </p>
            </div>
          </div>

          {/* Login/Signup Form */}
          <Card className="glass-effect border-0 shadow-2xl shadow-primary/5">
            <CardHeader className="space-y-2 pb-6">
              <CardTitle className="text-2xl text-center font-semibold text-foreground">
                {isSignup ? "Create Account" : "Welcome Back"}
              </CardTitle>
              <CardDescription className="text-center text-base text-muted-foreground">
                {isSignup
                  ? "Register a new dashboard account"
                  : "Enter your credentials to access your account"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form
                onSubmit={isSignup ? handleSignup : handleLogin}
                className="space-y-6"
              >
                {/* Error Alert */}
                {error && (
                  <div className="bg-destructive/10 border-l-4 border-destructive text-destructive px-4 py-4 rounded-lg flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">
                        {isSignup ? "Signup Error" : "Authentication Error"}
                      </p>
                      <p className="text-sm opacity-90">{error}</p>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <Label
                    htmlFor="email"
                    className="text-base font-medium text-foreground"
                  >
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-14 bg-background/60 border-2 border-border hover:border-primary/50 focus:border-primary transition-all duration-200 text-base"
                    disabled={isLoading}
                    required
                  />
                </div>

                <div className="space-y-3">
                  <Label
                    htmlFor="password"
                    className="text-base font-medium text-foreground"
                  >
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-14 bg-background/60 border-2 border-border hover:border-primary/50 focus:border-primary transition-all duration-200 text-base pr-14"
                      disabled={isLoading}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1 h-12 w-12 hover:bg-primary/10 transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <Eye className="h-5 w-5 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>

                {isSignup && (
                  <div className="space-y-3">
                    <Label
                      htmlFor="role"
                      className="text-base font-medium text-foreground"
                    >
                      User Role
                    </Label>
                    <Select
                      value={role}
                      onValueChange={(value: any) => setRole(value)}
                    >
                      <SelectTrigger className="h-14 bg-background/60 border-2 border-border hover:border-primary/50 focus:border-primary transition-all duration-200 text-base">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border-2 border-border">
                        <SelectItem value="admin" className="text-foreground">
                          Admin
                        </SelectItem>
                        <SelectItem value="user" className="text-foreground">
                          User
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {!isSignup && (
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="remember"
                        className="h-4 w-4 rounded border-2 border-border text-primary focus:ring-primary/20 focus:ring-2"
                      />
                      <Label
                        htmlFor="remember"
                        className="text-sm text-muted-foreground font-medium cursor-pointer"
                      >
                        Remember me
                      </Label>
                    </div>
                    <Button
                      variant="link"
                      className="text-sm p-0 h-auto text-primary hover:text-primary/80 font-medium"
                    >
                      Forgot password?
                    </Button>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-14 gradient-primary hover:shadow-lg hover:shadow-primary/25 text-white font-semibold text-base transition-all duration-200 hover:-translate-y-0.5"
                  disabled={isLoading || !email || !password}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                      {isSignup ? "Creating Account..." : "Signing In..."}
                    </>
                  ) : (
                    <>
                      <Shield className="mr-3 h-5 w-5" />
                      {isSignup ? "Create Account" : "Sign In to Dashboard"}
                    </>
                  )}
                </Button>
              </form>

              {/* Toggle Mode */}
              <div className="text-center pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  {isSignup
                    ? "Already have an account?"
                    : "Don't have an account?"}{" "}
                  <Button
                    variant="link"
                    className="p-0 h-auto text-primary hover:text-primary/80 font-semibold"
                    onClick={handleToggleMode}
                  >
                    {isSignup ? "Sign In" : "Sign Up"}
                  </Button>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span>Secure</span>
              </div>
              <Button
                variant="link"
                className="p-0 h-auto text-sm text-primary hover:text-primary/80 font-medium"
              >
                Privacy
              </Button>
              <Button
                variant="link"
                className="p-0 h-auto text-sm text-primary hover:text-primary/80 font-medium"
              >
                Support
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

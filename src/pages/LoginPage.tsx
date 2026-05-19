"use client";

import type React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Loader2, AlertCircle, User } from "lucide-react";
import { AuthService, type LoginRequest, type ApiError } from "../lib/auth";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gray-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gray-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-sm">
        <div className="bg-gray-900/80 backdrop-blur-xl rounded-3xl border border-gray-700/50 shadow-2xl p-8 space-y-8">
          {/* Header with Icon */}
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg shadow-yellow-400/30 animate-pulse">
              <User className="w-8 h-8 text-gray-900 font-bold" />
            </div>
            <h1 className="text-2xl font-bold text-white text-center">
              Admin Login
            </h1>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg flex items-start gap-3 text-sm">
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Email
              </Label>
              <Input
                type="email"
                placeholder="admin@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 bg-gray-100 border-0 text-gray-900 placeholder:text-gray-500 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:ring-offset-0 transition-all"
                disabled={isLoading}
                required
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Password
              </Label>
              <Input
                type="password"
                placeholder="••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 bg-gray-100 border-0 text-gray-900 placeholder:text-gray-500 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:ring-offset-0 transition-all"
                disabled={isLoading}
                required
              />
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              className="w-full h-11 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold text-sm uppercase tracking-wider rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-yellow-400/30 disabled:opacity-50"
              disabled={isLoading || !email || !password}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                <>
                  <User className="mr-2 h-4 w-4" />
                  Login
                </>
              )}
            </Button>
          </form>
        </div>

        {/* Footer Text */}
        <div className="text-center mt-6 text-gray-400 text-xs">
          <p>© 2024 Admin Dashboard. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}

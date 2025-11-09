import { apiClient } from "./api";
import { AxiosError } from "axios";

// TypeScript interfaces for login
export interface LoginRequest {
  email: string;
  password: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  balance: number;
  isVerified: boolean;
  lastLogin: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface ApiError {
  success: false;
  message: string;
  errors?: string[];
}

// Authentication service
export class AuthService {
  // Login function
  static async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<LoginResponse>(
        "/users/login",
        credentials
      );

      // Store token and user data in localStorage if login is successful
      if (response.data.success && response.data.data.token) {
        localStorage.setItem("authToken", response.data.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.data.user));
      }

      return response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ApiError>;
      // Handle different error scenarios
      if (axiosError.response?.data) {
        throw axiosError.response.data as ApiError;
      } else if (axiosError.request) {
        throw {
          success: false,
          message: "Network error. Please check your connection and try again.",
        } as ApiError;
      } else {
        throw {
          success: false,
          message: "An unexpected error occurred. Please try again.",
        } as ApiError;
      }
    }
  }

  // Logout function
  static logout(): void {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    const token = localStorage.getItem("authToken");
    return !!token;
  }

  // Get current user from localStorage
  static getCurrentUser(): User | null {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        return JSON.parse(userStr) as User;
      } catch {
        return null;
      }
    }
    return null;
  }

  // Get auth token
  static getToken(): string | null {
    return localStorage.getItem("authToken");
  }
}

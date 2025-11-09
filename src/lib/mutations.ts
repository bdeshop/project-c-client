import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "./api";
import {
  queryKeys,
  ApiResponse,
  User,
  Report,
  Settings,
  Slider,
  TopWinner,
  UpcomingMatch,
  BannerText,
  BannerTextResponse,
  PromoSection,
  PromoSectionResponse,
  ReferralSettings,
} from "./queries";
import { AxiosResponse, AxiosError } from "axios";

// Types for mutations
export interface CreateUserData {
  name: string;
  email: string;
  role: string;
  status: string;
}

export interface CreateSliderData {
  title: string;
  status: "active" | "inactive";
  image: File;
}

export interface UpdateSliderData {
  id: string;
  title?: string;
  status?: "active" | "inactive";
  image?: File;
}

// Top Winner interfaces
export interface CreateTopWinnerData {
  gameName: string;
  gameCategory: string;
  username: string;
  winAmount: number;
  currency?: string;
  gameImage?: string;
  multiplier?: number;
  isLive?: boolean;
}

export interface UpdateTopWinnerData {
  id: string;
  gameName?: string;
  gameCategory?: string;
  username?: string;
  winAmount?: number;
  currency?: string;
  gameImage?: string;
  multiplier?: number;
  isLive?: boolean;
}

// Upcoming Match interfaces
export interface TeamData {
  name: string;
  flagImage?: string;
  odds: number;
}

export interface CreateUpcomingMatchData {
  matchType: string;
  matchDate: string;
  teamA: TeamData;
  teamB: TeamData;
  isLive?: boolean;
  category: string;
}

export interface UpdateUpcomingMatchData {
  id: string;
  matchType?: string;
  matchDate?: string;
  teamA?: TeamData;
  teamB?: TeamData;
  isLive?: boolean;
  category?: string;
}

export interface SignupUserData {
  name?: string;
  email: string;
  password: string;
  country?: string;
  currency?: string;
  phoneNumber?: string;
  player_id: string;
  promoCode?: string;
  bonusSelection?: string;
  birthday?: string;
}

export interface UpdateUserData {
  id: string;
  name?: string;
  username?: string;
  email?: string;
  role?: string;
  status?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface GenerateReportData {
  type: "financial" | "user" | "security" | "performance";
  dateRange: {
    from: string;
    to: string;
  };
  filters?: Record<string, string | number | boolean>;
}

export interface UpdateSettingsData {
  general?: {
    siteName?: string;
    siteUrl?: string;
    timezone?: string;
    currency?: string;
  };
  security?: {
    sessionTimeout?: number;
    maxLoginAttempts?: number;
    requireTwoFactor?: boolean;
    passwordMinLength?: number;
  };
  notifications?: {
    emailEnabled?: boolean;
    smsEnabled?: boolean;
    pushEnabled?: boolean;
  };
}

// Settings update interfaces based on API documentation
export type UpdateAllSettingsData = Partial<Settings>;

export interface UpdateThemeData {
  themeColor?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
}

export interface UpdateOrganizationData {
  organizationName?: string;
  organizationImage?: string;
  logoUrl?: string;
  faviconUrl?: string;
  supportEmail?: string;
  supportPhone?: string;
  address?: string;
  websiteUrl?: string;
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
}

// UI Customization update interface
export interface UpdateUICustomizationData {
  headerLogoUrl?: string;
  headerColor?: string;
  headerLoginSignupButtonBgColor?: string;
  headerLoginSignupButtonTextColor?: string;
  webMenuBgColor?: string;
  webMenuTextColor?: string;
  webMenuFontSize?: string;
  webMenuHoverColor?: string;
  mobileMenuLoginSignupButtonBgColor?: string;
  mobileMenuLoginSignupButtonTextColor?: string;
  mobileMenuFontSize?: string;
  footerText?: string;
  footerSocialLinks?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  navigationItems?: Array<{
    id: string;
    label: string;
    url: string;
    order: number;
    submenu?: Array<{
      id: string;
      name: string;
      path: string;
      icon?: string;
    }>;
  }>;
}

// Banner Text update interface
export interface UpdateBannerTextData {
  englishText: string;
  banglaText: string;
}

// Promo Section update interface
export interface UpdatePromoSectionData {
  banner: {
    title: string;
    subtitle?: string;
    ctaText: string;
    ctaLink: string;
    image: string;
  };
  video: {
    title: string;
    youtubeUrl: string;
    thumbnail?: string;
  };
  extraBanner: {
    image?: string;
    link?: string;
  };
  isActive: boolean;
}

// Authentication Mutations
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      loginData: LoginData
    ): Promise<AxiosResponse<ApiResponse<LoginResponse>>> =>
      apiClient.post<ApiResponse<LoginResponse>>("/users/login", loginData),
    onSuccess: (response) => {
      const { token, user } = response.data.data;
      // Store token and user data
      localStorage.setItem("authToken", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Invalidate and refetch user-related queries
      queryClient.invalidateQueries({ queryKey: queryKeys.users });
    },
    onError: (error) => {
      console.error("Login failed:", error);
      // Handle login error (show toast, etc.)
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (): Promise<AxiosResponse<ApiResponse<void>>> =>
      apiClient.post<ApiResponse<void>>("/users/logout"),
    onSuccess: () => {
      // Clear local storage
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");

      // Clear all queries
      queryClient.clear();

      // Redirect to login
      window.location.href = "/login";
    },
    onError: (error) => {
      console.error("Logout failed:", error);
      // Force logout even if API call fails
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      queryClient.clear();
      window.location.href = "/login";
    },
  });
};

// User Management Mutations
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      userData: CreateUserData
    ): Promise<AxiosResponse<ApiResponse<User>>> =>
      apiClient.post<ApiResponse<User>>("/users", userData),
    onSuccess: () => {
      // Invalidate users queries to refetch the list
      queryClient.invalidateQueries({ queryKey: queryKeys.users });
    },
    onError: (error) => {
      console.error("Create user failed:", error);
    },
  });
};

export const useSignupUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      userData: SignupUserData
    ): Promise<AxiosResponse<ApiResponse<User>>> =>
      apiClient.post<ApiResponse<User>>("/users/signup", userData),
    onSuccess: () => {
      // Invalidate users queries to refetch the list
      queryClient.invalidateQueries({ queryKey: queryKeys.users });
    },
    onError: (error) => {
      console.error("Signup user failed:", error);
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      userData: UpdateUserData
    ): Promise<AxiosResponse<ApiResponse<User>>> =>
      apiClient.put<ApiResponse<User>>(`/users/${userData.id}`, userData),
    onSuccess: (response, variables) => {
      // Invalidate users queries
      queryClient.invalidateQueries({ queryKey: queryKeys.users });
      // Update specific user query
      queryClient.setQueryData(queryKeys.user(variables.id), response);
    },
    onError: (error) => {
      console.error("Update user failed:", error);
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string): Promise<AxiosResponse<ApiResponse<void>>> =>
      apiClient.delete<ApiResponse<void>>(`/users/${userId}`),
    onSuccess: (_, userId) => {
      // Invalidate users queries
      queryClient.invalidateQueries({ queryKey: queryKeys.users });
      // Remove specific user query
      queryClient.removeQueries({ queryKey: queryKeys.user(userId) });
    },
    onError: (error) => {
      console.error("Delete user failed:", error);
    },
  });
};

// Report Mutations
export const useGenerateReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      reportData: GenerateReportData
    ): Promise<AxiosResponse<ApiResponse<Report>>> =>
      apiClient.post<ApiResponse<Report>>("/reports/generate", reportData),
    onSuccess: () => {
      // Invalidate reports queries to show the new report
      queryClient.invalidateQueries({ queryKey: queryKeys.reports });
    },
    onError: (error) => {
      console.error("Generate report failed:", error);
    },
  });
};

export const useDeleteReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reportId: string): Promise<AxiosResponse<ApiResponse<void>>> =>
      apiClient.delete<ApiResponse<void>>(`/reports/${reportId}`),
    onSuccess: (_, reportId) => {
      // Invalidate reports queries
      queryClient.invalidateQueries({ queryKey: queryKeys.reports });
      // Remove specific report query
      queryClient.removeQueries({ queryKey: queryKeys.report(reportId) });
    },
    onError: (error) => {
      console.error("Delete report failed:", error);
    },
  });
};

// Settings Mutations
export const useUpdateSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      settingsData: UpdateSettingsData
    ): Promise<AxiosResponse<ApiResponse<Settings>>> =>
      apiClient.put<ApiResponse<Settings>>("/settings", settingsData),
    onSuccess: (response) => {
      // Update settings query with new data
      queryClient.setQueryData(queryKeys.settings, response);
    },
    onError: (error) => {
      console.error("Update settings failed:", error);
    },
  });
};

// Updated Settings Mutations based on API documentation
export const useUpdateAllSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      settingsData: UpdateAllSettingsData
    ): Promise<AxiosResponse<ApiResponse<Settings>>> =>
      apiClient.put<ApiResponse<Settings>>("/settings", settingsData),
    onSuccess: (response) => {
      // Update settings query with new data
      queryClient.setQueryData(queryKeys.settings, response);
    },
    onError: (error) => {
      console.error("Update all settings failed:", error);
    },
  });
};

export const useUpdateThemeSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      themeData: UpdateThemeData
    ): Promise<AxiosResponse<ApiResponse<Settings>>> =>
      apiClient.patch<ApiResponse<Settings>>("/settings/theme", themeData),
    onSuccess: (response) => {
      // Update settings query with new data
      queryClient.setQueryData(queryKeys.settings, response);
    },
    onError: (error) => {
      console.error("Update theme settings failed:", error);
    },
  });
};

export const useUpdateOrganizationSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      orgData: UpdateOrganizationData
    ): Promise<AxiosResponse<ApiResponse<Settings>>> =>
      apiClient.patch<ApiResponse<Settings>>("/settings/organization", orgData),
    onSuccess: (response) => {
      // Update settings query with new data
      queryClient.setQueryData(queryKeys.settings, response);
    },
    onError: (error) => {
      console.error("Update organization settings failed:", error);
    },
  });
};

// UI Customization Mutation
export const useUpdateUICustomization = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      uiData: UpdateUICustomizationData
    ): Promise<AxiosResponse<ApiResponse<Settings>>> =>
      apiClient.patch<ApiResponse<Settings>>("/settings/ui", uiData),
    onSuccess: (response) => {
      // Update settings query with new data
      queryClient.setQueryData(queryKeys.settings, response);
    },
    onError: (error) => {
      console.error("Update UI customization failed:", error);
    },
  });
};

export const useResetSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (): Promise<AxiosResponse<ApiResponse<Settings>>> =>
      apiClient.post<ApiResponse<Settings>>("/settings/reset"),
    onSuccess: (response) => {
      // Update settings query with new data
      queryClient.setQueryData(queryKeys.settings, response);
    },
    onError: (error) => {
      console.error("Reset settings failed:", error);
    },
  });
};

// Banner Text Mutation
export const useUpdateBannerText = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      bannerTextData: UpdateBannerTextData
    ): Promise<AxiosResponse<ApiResponse<BannerTextResponse>>> =>
      apiClient.put<ApiResponse<BannerTextResponse>>(
        "/banner-text",
        bannerTextData
      ),
    onSuccess: (response) => {
      // Update banner text query with new data
      queryClient.setQueryData(queryKeys.bannerText, response);
    },
    onError: (error) => {
      console.error("Update banner text failed:", error);
    },
  });
};

// Promo Section Mutations
export const useUpdatePromoSection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      promoSectionData: UpdatePromoSectionData
    ): Promise<AxiosResponse<ApiResponse<PromoSectionResponse>>> =>
      apiClient.put<ApiResponse<PromoSectionResponse>>(
        "/promo-section",
        promoSectionData
      ),
    onSuccess: (response) => {
      // Update promo section query with new data
      queryClient.setQueryData(queryKeys.promoSection, response);
    },
    onError: (error) => {
      console.error("Update promo section failed:", error);
    },
  });
};

export const useTogglePromoSection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (): Promise<AxiosResponse<ApiResponse<PromoSectionResponse>>> =>
      apiClient.patch<ApiResponse<PromoSectionResponse>>(
        "/promo-section/toggle"
      ),
    onSuccess: (response) => {
      // Log the response to understand its structure
      console.log("Toggle response:", response);

      // Extract the promoSection object from the response
      // The query uses a select function that extracts promoSection from response.data.data.promoSection
      // So we need to provide the same extracted object to the cache
      if (
        response &&
        response.data &&
        response.data.data &&
        response.data.data.promoSection
      ) {
        queryClient.setQueryData(
          queryKeys.promoSection,
          response.data.data.promoSection
        );
      } else {
        // If structure is different, invalidate the query to refetch the data
        queryClient.invalidateQueries({ queryKey: queryKeys.promoSection });
      }
    },
    onError: (error: unknown) => {
      console.error("Toggle promo section failed:", error);
      const axiosError = error as AxiosError<ApiResponse<unknown>>;
      const errorMessage =
        axiosError.response?.data?.message ||
        "Failed to toggle promo section status";
      throw new Error(errorMessage);
    },
  });
};

// Security Mutations
export const useClearSecurityLogs = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (filters?: {
      before?: string;
      type?: string;
    }): Promise<AxiosResponse<ApiResponse<void>>> =>
      apiClient.delete<ApiResponse<void>>("/security/logs", { data: filters }),
    onSuccess: () => {
      // Invalidate security logs queries
      queryClient.invalidateQueries({ queryKey: queryKeys.security });
    },
    onError: (error) => {
      console.error("Clear security logs failed:", error);
    },
  });
};

// Utility function to invalidate specific queries after mutations
export const useInvalidateQueries = () => {
  const queryClient = useQueryClient();

  return {
    invalidateDashboard: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboardStats });
      queryClient.invalidateQueries({ queryKey: queryKeys.recentActivity });
    },
    invalidateUsers: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users });
    },
    invalidateAnalytics: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.analytics });
    },
    invalidateReports: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reports });
    },
    invalidateSecurity: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.security });
    },
    invalidateSettings: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.settings });
    },
    invalidateBannerText: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bannerText });
    },
    invalidatePromoSection: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.promoSection });
    },
    invalidateAll: () => {
      queryClient.invalidateQueries();
    },
  };
};

// Optimistic updates helper
export const useOptimisticUserUpdate = () => {
  const queryClient = useQueryClient();

  return (userId: string, updates: Partial<User>) => {
    queryClient.setQueryData(
      queryKeys.user(userId),
      (oldData: User | undefined) => {
        if (!oldData) return oldData;
        return { ...oldData, ...updates };
      }
    );

    // Also update the user in the users list
    queryClient.setQueryData(
      queryKeys.users,
      (
        oldData:
          | { users: User[]; total: number; page: number; totalPages: number }
          | undefined
      ) => {
        if (!oldData?.users) return oldData;
        return {
          ...oldData,
          users: oldData.users.map((user: User) =>
            user.id === userId ? { ...user, ...updates } : user
          ),
        };
      }
    );
  };
};

// Optimistic banner text update helper
export const useOptimisticBannerTextUpdate = () => {
  const queryClient = useQueryClient();

  return (updates: Partial<BannerText>) => {
    queryClient.setQueryData(
      queryKeys.bannerText,
      (oldData: BannerText | undefined) => {
        if (!oldData) return oldData;
        return { ...oldData, ...updates };
      }
    );
  };
};

// Optimistic promo section update helper
export const useOptimisticPromoSectionUpdate = () => {
  const queryClient = useQueryClient();

  return (updates: Partial<PromoSection>) => {
    queryClient.setQueryData(
      queryKeys.promoSection,
      (oldData: PromoSection | undefined) => {
        if (!oldData) return oldData;
        return { ...oldData, ...updates };
      }
    );
  };
};

// Slider Management Mutations
export const useCreateSlider = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      sliderData: CreateSliderData
    ): Promise<AxiosResponse<ApiResponse<Slider>>> => {
      const formData = new FormData();
      formData.append("title", sliderData.title);
      formData.append("status", sliderData.status);
      formData.append("image", sliderData.image);

      return apiClient.post<ApiResponse<Slider>>("/sliders", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    onSuccess: () => {
      // Invalidate sliders queries to refetch the list
      queryClient.invalidateQueries({ queryKey: queryKeys.sliders });
    },
    onError: (error) => {
      console.error("Create slider failed:", error);
    },
  });
};

export const useUpdateSlider = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      sliderData: UpdateSliderData
    ): Promise<AxiosResponse<ApiResponse<Slider>>> => {
      const formData = new FormData();
      if (sliderData.title) formData.append("title", sliderData.title);
      if (sliderData.status) formData.append("status", sliderData.status);
      if (sliderData.image) formData.append("image", sliderData.image);

      return apiClient.put<ApiResponse<Slider>>(
        `/sliders/${sliderData.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    },
    onSuccess: (response, variables) => {
      // Invalidate sliders queries
      queryClient.invalidateQueries({ queryKey: queryKeys.sliders });
      // Update specific slider query
      queryClient.setQueryData(queryKeys.slider(variables.id), response);
    },
    onError: (error) => {
      console.error("Update slider failed:", error);
    },
  });
};

export const useDeleteSlider = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sliderId: string): Promise<AxiosResponse<ApiResponse<void>>> =>
      apiClient.delete<ApiResponse<void>>(`/sliders/${sliderId}`),
    onSuccess: (_, sliderId) => {
      // Invalidate sliders queries
      queryClient.invalidateQueries({ queryKey: queryKeys.sliders });
      // Remove specific slider query
      queryClient.removeQueries({ queryKey: queryKeys.slider(sliderId) });
    },
    onError: (error) => {
      console.error("Delete slider failed:", error);
    },
  });
};

// Top Winner Mutations
export const useCreateTopWinner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      topWinnerData: CreateTopWinnerData
    ): Promise<AxiosResponse<ApiResponse<TopWinner>>> =>
      apiClient.post<ApiResponse<TopWinner>>("/top-winners", topWinnerData),
    onSuccess: () => {
      // Invalidate top winners queries to refetch the list
      queryClient.invalidateQueries({ queryKey: queryKeys.topWinners });
    },
    onError: (error) => {
      console.error("Create top winner failed:", error);
    },
  });
};

export const useUpdateTopWinner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      topWinnerData: UpdateTopWinnerData
    ): Promise<AxiosResponse<ApiResponse<TopWinner>>> =>
      apiClient.put<ApiResponse<TopWinner>>(
        `/top-winners/${topWinnerData.id}`,
        topWinnerData
      ),
    onSuccess: (response, variables) => {
      // Invalidate top winners queries
      queryClient.invalidateQueries({ queryKey: queryKeys.topWinners });
      // Update specific top winner query
      queryClient.setQueryData(queryKeys.topWinner(variables.id), response);
    },
    onError: (error) => {
      console.error("Update top winner failed:", error);
    },
  });
};

export const useDeleteTopWinner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      topWinnerId: string
    ): Promise<AxiosResponse<ApiResponse<void>>> =>
      apiClient.delete<ApiResponse<void>>(`/top-winners/${topWinnerId}`),
    onSuccess: (_, topWinnerId) => {
      // Invalidate top winners queries
      queryClient.invalidateQueries({ queryKey: queryKeys.topWinners });
      // Remove specific top winner query
      queryClient.removeQueries({ queryKey: queryKeys.topWinner(topWinnerId) });
    },
    onError: (error) => {
      console.error("Delete top winner failed:", error);
    },
  });
};

// Upcoming Match Mutations
export const useCreateUpcomingMatch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      upcomingMatchData: CreateUpcomingMatchData
    ): Promise<AxiosResponse<ApiResponse<UpcomingMatch>>> =>
      apiClient.post<ApiResponse<UpcomingMatch>>(
        "/upcoming-matches",
        upcomingMatchData
      ),
    onSuccess: () => {
      // Invalidate upcoming matches queries to refetch the list
      queryClient.invalidateQueries({ queryKey: queryKeys.upcomingMatches });
    },
    onError: (error) => {
      console.error("Create upcoming match failed:", error);
    },
  });
};

export const useUpdateUpcomingMatch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      upcomingMatchData: UpdateUpcomingMatchData
    ): Promise<AxiosResponse<ApiResponse<UpcomingMatch>>> =>
      apiClient.put<ApiResponse<UpcomingMatch>>(
        `/upcoming-matches/${upcomingMatchData.id}`,
        upcomingMatchData
      ),
    onSuccess: (response, variables) => {
      // Invalidate upcoming matches queries
      queryClient.invalidateQueries({ queryKey: queryKeys.upcomingMatches });
      // Update specific upcoming match query
      queryClient.setQueryData(queryKeys.upcomingMatch(variables.id), response);
    },
    onError: (error) => {
      console.error("Update upcoming match failed:", error);
    },
  });
};

export const useDeleteUpcomingMatch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      upcomingMatchId: string
    ): Promise<AxiosResponse<ApiResponse<void>>> =>
      apiClient.delete<ApiResponse<void>>(
        `/upcoming-matches/${upcomingMatchId}`
      ),
    onSuccess: (_, upcomingMatchId) => {
      // Invalidate upcoming matches queries
      queryClient.invalidateQueries({ queryKey: queryKeys.upcomingMatches });
      // Remove specific upcoming match query
      queryClient.removeQueries({
        queryKey: queryKeys.upcomingMatch(upcomingMatchId),
      });
    },
    onError: (error) => {
      console.error("Delete upcoming match failed:", error);
    },
  });
};

// Referral System Mutations
export const useUpdateReferralTransactionStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      transactionId,
      status,
    }: {
      transactionId: string;
      status: "approved" | "rejected" | "paid";
    }): Promise<AxiosResponse<ApiResponse<unknown>>> => {
      return apiClient.put(`/referral/transactions/${transactionId}`, {
        status,
      });
    },
    onSuccess: () => {
      // Invalidate and refetch referral transactions
      queryClient.invalidateQueries({
        queryKey: queryKeys.referralTransactions,
      });
      // Also invalidate analytics to update the overview
      queryClient.invalidateQueries({
        queryKey: queryKeys.referralAnalytics,
      });
    },
    onError: (error) => {
      console.error("Update referral transaction status failed:", error);
    },
  });
};

export const useUpdateReferralSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      settings: ReferralSettings
    ): Promise<AxiosResponse<ApiResponse<ReferralSettings>>> => {
      // Extract only the fields that should be sent to the API
      const {
        signupBonus,
        referralCommission,
        maxCommissionLimit,
        minWithdrawAmount,
      } = settings;
      return apiClient.put("/referral/settings", {
        signupBonus,
        referralCommission,
        maxCommissionLimit,
        minWithdrawAmount,
      });
    },
    onSuccess: () => {
      // Invalidate and refetch referral settings
      queryClient.invalidateQueries({
        queryKey: queryKeys.referralSettings,
      });
    },
    onError: (error) => {
      console.error("Update referral settings failed:", error);
    },
  });
};

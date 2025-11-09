import {
  useQuery,
  useInfiniteQuery,
  useMutation,
  UseQueryOptions,
  UseInfiniteQueryOptions,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";
import { apiClient } from "./api";
import { AxiosResponse } from "axios";

// Types for API responses
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
}

export interface Slider {
  _id: string;
  title: string;
  status: "active" | "inactive";
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  user: {
    id: string;
    username: string;
    email: string;
    balance: number;
    isVerified: boolean;
    lastLogin: string;
    registrationDate: string;
  };
}

export interface User {
  id: string;
  _id: string;
  username: string;
  email: string;
  password?: string;
  balance: number;
  isActive: boolean;
  isVerified: boolean;
  role: string;
  lastLogin: string;
  registrationDate: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  // Extended fields for betting platform
  name?: string;
  country?: string;
  currency?: string;
  phoneNumber?: string;
  player_id?: string;
  promoCode?: string;
  bonusSelection?: string;
  birthday?: string;
}

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalBets: number;
  totalRevenue: number;
  todayRevenue: number;
  weeklyGrowth: number;
  monthlyGrowth: number;
}

export interface Activity {
  id: string;
  type: "login" | "bet" | "withdrawal" | "deposit";
  user: string;
  description: string;
  timestamp: string;
  amount?: number;
}

export interface AnalyticsData {
  chartData: Array<{
    date: string;
    revenue: number;
    users: number;
    bets: number;
  }>;
  topPerformers: Array<{
    name: string;
    value: number;
    change: number;
  }>;
}

export interface Report {
  id: string;
  title: string;
  type: "financial" | "user" | "security" | "performance";
  generatedAt: string;
  status: "completed" | "processing" | "failed";
  downloadUrl?: string;
}

export interface SecurityLog {
  id: string;
  type:
    | "login_attempt"
    | "suspicious_activity"
    | "failed_login"
    | "access_denied";
  user: string;
  ipAddress: string;
  timestamp: string;
  severity: "low" | "medium" | "high" | "critical";
  description: string;
}

// Top Winner interface
export interface TopWinner {
  _id: string;
  gameName: string;
  gameCategory: string;
  username: string;
  winAmount: number;
  currency: string;
  winTime: string;
  gameImage?: string;
  multiplier?: number;
  isLive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Upcoming Match interface
export interface Team {
  name: string;
  flagImage?: string;
  odds: number;
}

export interface UpcomingMatch {
  _id: string;
  matchType: string;
  matchDate: string;
  teamA: Team;
  teamB: Team;
  isLive: boolean;
  category: string;
  createdAt: string;
  updatedAt: string;
}

// Settings interface based on actual API response
export interface Settings {
  organizationName: string;
  organizationImage: string;
  themeColor: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  logoUrl?: string;
  faviconUrl?: string;
  supportEmail: string;
  supportPhone?: string;
  address?: string;
  websiteUrl?: string;
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  maintenanceMode: boolean;
  registrationEnabled: boolean;
  emailVerificationRequired?: boolean;
  twoFactorEnabled?: boolean;
  maxLoginAttempts?: number;
  sessionTimeout?: number;
  createdAt?: string;
  updatedAt?: string;
  // UI Customization Settings
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

// Banner Text interface
export interface BannerText {
  englishText: string;
  banglaText: string;
  createdAt: string;
  updatedAt: string;
}

// Promo Section interfaces
export interface PromoBanner {
  title: string;
  subtitle?: string;
  ctaText: string;
  ctaLink: string;
  image: string;
}

export interface PromoVideo {
  title: string;
  youtubeUrl: string;
  thumbnail?: string;
}

export interface PromoExtraBanner {
  image?: string;
  link?: string;
}

export interface PromoSection {
  banner: PromoBanner;
  video: PromoVideo;
  extraBanner: PromoExtraBanner;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Settings response interface
export interface SettingsResponse {
  settings: Settings;
}

// Banner Text response interface
export interface BannerTextResponse {
  bannerText: BannerText;
}

// Promo Section response interface
export interface PromoSectionResponse {
  promoSection: PromoSection;
}

export interface UserFilters {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: string;
}

export interface SecurityLogFilters {
  page?: number;
  limit?: number;
  type?: string;
  severity?: string;
  dateFrom?: string;
  dateTo?: string;
}

// Top Winner Filters
export interface TopWinnerFilters {
  limit?: number;
  category?: string;
  isLive?: boolean;
}

// Upcoming Match Filters
export interface UpcomingMatchFilters {
  limit?: number;
  category?: string;
  isLive?: boolean;
}

// Query Keys
export const queryKeys = {
  // Dashboard
  dashboardStats: ["dashboard", "stats"] as const,
  recentActivity: ["dashboard", "activity"] as const,

  // Users
  users: ["users"] as const,
  usersList: (filters?: UserFilters) => ["users", "list", filters] as const,
  user: (id: string) => ["users", id] as const,
  userProfile: ["users", "profile"] as const,

  // Sliders
  sliders: ["sliders"] as const,
  slidersList: () => ["sliders", "list"] as const,
  slider: (id: string) => ["sliders", id] as const,

  // Top Winners
  topWinners: ["topWinners"] as const,
  topWinnersList: (filters?: TopWinnerFilters) =>
    ["topWinners", "list", filters] as const,
  topWinner: (id: string) => ["topWinners", id] as const,
  topWinnersLive: (filters?: TopWinnerFilters) =>
    ["topWinners", "live", filters] as const,
  topWinnersByCategory: (category: string) =>
    ["topWinners", "category", category] as const,

  // Upcoming Matches
  upcomingMatches: ["upcomingMatches"] as const,
  upcomingMatchesList: (filters?: UpcomingMatchFilters) =>
    ["upcomingMatches", "list", filters] as const,
  upcomingMatch: (id: string) => ["upcomingMatches", id] as const,
  upcomingMatchesLive: (filters?: UpcomingMatchFilters) =>
    ["upcomingMatches", "live", filters] as const,
  upcomingMatchesByCategory: (category: string) =>
    ["upcomingMatches", "category", category] as const,

  // Analytics
  analytics: ["analytics"] as const,
  analyticsData: (period?: string) => ["analytics", "data", period] as const,

  // Reports
  reports: ["reports"] as const,
  reportsList: (type?: string) => ["reports", "list", type] as const,
  report: (id: string) => ["reports", id] as const,

  // Security
  security: ["security"] as const,
  securityLogs: (filters?: SecurityLogFilters) =>
    ["security", "logs", filters] as const,

  // Settings
  settings: ["settings"] as const,

  // Banner Text
  bannerText: ["bannerText"] as const,

  // Promo Section
  promoSection: ["promoSection"] as const,

  // Referral System
  referral: ["referral"] as const,
  referralAnalytics: ["referral", "analytics"] as const,
  referralTransactions: ["referral", "transactions"] as const,
  referralUsers: ["referral", "users"] as const,
  referralSettings: ["referral", "settings"] as const,
  referralCodesWithUsers: ["referral", "codes-with-users"] as const,
  referralUserSettings: (userId: string) =>
    ["referral", "user-settings", userId] as const,
  userReferralSettings: (userId: string) =>
    ["referral", "user-settings", userId] as const,
};

// Dashboard Queries
export const useDashboardStats = (
  options?: UseQueryOptions<
    AxiosResponse<ApiResponse<DashboardStats>>,
    Error,
    DashboardStats
  >
) => {
  return useQuery({
    queryKey: queryKeys.dashboardStats,
    queryFn: () =>
      apiClient.get<ApiResponse<DashboardStats>>("/dashboard/stats"),
    select: (data) => data.data.data,
    ...options,
  });
};

export const useRecentActivity = (
  limit = 10,
  options?: UseQueryOptions<
    AxiosResponse<ApiResponse<Activity[]>>,
    Error,
    Activity[]
  >
) => {
  return useQuery({
    queryKey: [...queryKeys.recentActivity, limit],
    queryFn: () =>
      apiClient.get<ApiResponse<Activity[]>>(
        `/dashboard/activity?limit=${limit}`
      ),
    select: (data) => data.data.data,
    ...options,
  });
};

// User Profile Query
export const useUserProfile = (
  options?: UseQueryOptions<
    AxiosResponse<ApiResponse<UserProfile>>,
    Error,
    UserProfile
  >
) => {
  return useQuery({
    queryKey: queryKeys.userProfile,
    queryFn: () => {
      return apiClient.get<ApiResponse<UserProfile>>("/users/profile");
    },
    select: (data) => {
      return data.data.data;
    },
    ...options,
  });
};

// Users Queries
export const useUsers = (
  filters?: UserFilters,
  options?: UseQueryOptions<
    AxiosResponse<
      ApiResponse<{
        users: User[];
        total: number;
        page: number;
        totalPages: number;
      }>
    >,
    Error,
    { users: User[]; total: number; page: number; totalPages: number }
  >
) => {
  const searchParams = new URLSearchParams();
  if (filters?.page) searchParams.set("page", filters.page.toString());
  if (filters?.limit) searchParams.set("limit", filters.limit.toString());
  if (filters?.search) searchParams.set("search", filters.search);
  if (filters?.role) searchParams.set("role", filters.role);
  if (filters?.status) searchParams.set("status", filters.status);

  return useQuery({
    queryKey: queryKeys.usersList(filters),
    queryFn: () =>
      apiClient.get<
        ApiResponse<{
          users: User[];
          total: number;
          page: number;
          totalPages: number;
        }>
      >(`/users?${searchParams.toString()}`),
    select: (data) => data.data.data,
    ...options,
  });
};

export const useUser = (
  id: string,
  options?: UseQueryOptions<AxiosResponse<ApiResponse<User>>, Error, User>
) => {
  return useQuery({
    queryKey: queryKeys.user(id),
    queryFn: () => apiClient.get<ApiResponse<User>>(`/users/${id}`),
    select: (data) => data.data.data,
    enabled: !!id,
    ...options,
  });
};

type InfiniteUserFilters = Omit<UserFilters, "page">;

type InfiniteUsersData = {
  users: User[];
  total: number;
  page: number;
  totalPages: number;
};

// Infinite Users Query (for pagination)
export const useInfiniteUsers = (
  filters?: InfiniteUserFilters,
  options?: UseInfiniteQueryOptions<
    AxiosResponse<ApiResponse<InfiniteUsersData>>,
    Error,
    { pages: InfiniteUsersData[]; pageParams: unknown[] },
    string[],
    number
  >
) => {
  return useInfiniteQuery({
    queryKey: [...queryKeys.users, "infinite", filters],
    queryFn: ({ pageParam = 1 }) => {
      const searchParams = new URLSearchParams();
      searchParams.set("page", pageParam.toString());
      if (filters?.limit) searchParams.set("limit", filters.limit.toString());
      if (filters?.search) searchParams.set("search", filters.search);
      if (filters?.role) searchParams.set("role", filters.role);
      if (filters?.status) searchParams.set("status", filters.status);

      return apiClient.get<
        ApiResponse<{
          users: User[];
          total: number;
          page: number;
          totalPages: number;
        }>
      >(`/users?${searchParams.toString()}`);
    },
    getNextPageParam: (lastPage) => {
      const data = lastPage.data.data;
      return data.page < data.totalPages ? data.page + 1 : undefined;
    },
    initialPageParam: 1,
    select: (data) => ({
      pages: data.pages.map((page) => page.data.data),
      pageParams: data.pageParams,
    }),
    ...options,
  });
};

// Sliders Queries
export const useSliders = (
  options?: UseQueryOptions<
    AxiosResponse<ApiResponse<Slider[]>>,
    Error,
    Slider[]
  >
) => {
  return useQuery({
    queryKey: queryKeys.slidersList(),
    queryFn: () => apiClient.get<ApiResponse<Slider[]>>("/sliders"),
    select: (data) => data.data.data,
    ...options,
  });
};

export const useSlider = (
  id: string,
  options?: UseQueryOptions<AxiosResponse<ApiResponse<Slider>>, Error, Slider>
) => {
  return useQuery({
    queryKey: queryKeys.slider(id),
    queryFn: () => apiClient.get<ApiResponse<Slider>>(`/sliders/${id}`),
    select: (data) => data.data.data,
    enabled: !!id,
    ...options,
  });
};

// Analytics Queries
export const useAnalyticsData = (
  period = "7d",
  options?: UseQueryOptions<
    AxiosResponse<ApiResponse<AnalyticsData>>,
    Error,
    AnalyticsData
  >
) => {
  return useQuery({
    queryKey: queryKeys.analyticsData(period),
    queryFn: () =>
      apiClient.get<ApiResponse<AnalyticsData>>(
        `/analytics/data?period=${period}`
      ),
    select: (data) => data.data.data,
    ...options,
  });
};

// Reports Queries
export const useReports = (
  type?: string,
  options?: UseQueryOptions<
    AxiosResponse<ApiResponse<Report[]>>,
    Error,
    Report[]
  >
) => {
  return useQuery({
    queryKey: queryKeys.reportsList(type),
    queryFn: () =>
      apiClient.get<ApiResponse<Report[]>>(
        `/reports${type ? `?type=${type}` : ""}`
      ),
    select: (data) => data.data.data,
    ...options,
  });
};

export const useReport = (
  id: string,
  options?: UseQueryOptions<AxiosResponse<ApiResponse<Report>>, Error, Report>
) => {
  return useQuery({
    queryKey: queryKeys.report(id),
    queryFn: () => apiClient.get<ApiResponse<Report>>(`/reports/${id}`),
    select: (data) => data.data.data,
    enabled: !!id,
    ...options,
  });
};

// Top Winners Queries
export const useTopWinners = (
  filters?: TopWinnerFilters,
  options?: UseQueryOptions<
    AxiosResponse<ApiResponse<TopWinner[]>>,
    Error,
    TopWinner[]
  >
) => {
  const searchParams = new URLSearchParams();
  if (filters?.limit) searchParams.set("limit", filters.limit.toString());
  if (filters?.category) searchParams.set("category", filters.category);
  if (filters?.isLive !== undefined)
    searchParams.set("isLive", filters.isLive.toString());

  return useQuery({
    queryKey: queryKeys.topWinnersList(filters),
    queryFn: () =>
      apiClient.get<ApiResponse<TopWinner[]>>(
        `/top-winners?${searchParams.toString()}`
      ),
    select: (data) => data.data.data,
    ...options,
  });
};

export const useLiveTopWinners = (
  filters?: TopWinnerFilters,
  options?: UseQueryOptions<
    AxiosResponse<ApiResponse<TopWinner[]>>,
    Error,
    TopWinner[]
  >
) => {
  const searchParams = new URLSearchParams();
  if (filters?.limit) searchParams.set("limit", filters.limit.toString());
  if (filters?.category) searchParams.set("category", filters.category);

  return useQuery({
    queryKey: queryKeys.topWinnersLive(filters),
    queryFn: () =>
      apiClient.get<ApiResponse<TopWinner[]>>(
        `/top-winners/live?${searchParams.toString()}`
      ),
    select: (data) => data.data.data,
    ...options,
  });
};

export const useTopWinnersByCategory = (
  category: string,
  options?: UseQueryOptions<
    AxiosResponse<ApiResponse<TopWinner[]>>,
    Error,
    TopWinner[]
  >
) => {
  return useQuery({
    queryKey: queryKeys.topWinnersByCategory(category),
    queryFn: () =>
      apiClient.get<ApiResponse<TopWinner[]>>(
        `/top-winners/category/${category}`
      ),
    select: (data) => data.data.data,
    enabled: !!category,
    ...options,
  });
};

export const useTopWinner = (
  id: string,
  options?: UseQueryOptions<
    AxiosResponse<ApiResponse<TopWinner>>,
    Error,
    TopWinner
  >
) => {
  return useQuery({
    queryKey: queryKeys.topWinner(id),
    queryFn: () => apiClient.get<ApiResponse<TopWinner>>(`/top-winners/${id}`),
    select: (data) => data.data.data,
    enabled: !!id,
    ...options,
  });
};

// Upcoming Matches Queries
export const useUpcomingMatches = (
  filters?: UpcomingMatchFilters,
  options?: UseQueryOptions<
    AxiosResponse<ApiResponse<UpcomingMatch[]>>,
    Error,
    UpcomingMatch[]
  >
) => {
  const searchParams = new URLSearchParams();
  if (filters?.limit) searchParams.set("limit", filters.limit.toString());
  if (filters?.category) searchParams.set("category", filters.category);
  if (filters?.isLive !== undefined)
    searchParams.set("isLive", filters.isLive.toString());

  return useQuery({
    queryKey: queryKeys.upcomingMatchesList(filters),
    queryFn: () =>
      apiClient.get<ApiResponse<UpcomingMatch[]>>(
        `/upcoming-matches?${searchParams.toString()}`
      ),
    select: (data) => data.data.data,
    ...options,
  });
};

export const useLiveUpcomingMatches = (
  filters?: UpcomingMatchFilters,
  options?: UseQueryOptions<
    AxiosResponse<ApiResponse<UpcomingMatch[]>>,
    Error,
    UpcomingMatch[]
  >
) => {
  const searchParams = new URLSearchParams();
  if (filters?.limit) searchParams.set("limit", filters.limit.toString());
  if (filters?.category) searchParams.set("category", filters.category);

  return useQuery({
    queryKey: queryKeys.upcomingMatchesLive(filters),
    queryFn: () =>
      apiClient.get<ApiResponse<UpcomingMatch[]>>(
        `/upcoming-matches/live?${searchParams.toString()}`
      ),
    select: (data) => data.data.data,
    ...options,
  });
};

export const useUpcomingMatchesByCategory = (
  category: string,
  options?: UseQueryOptions<
    AxiosResponse<ApiResponse<UpcomingMatch[]>>,
    Error,
    UpcomingMatch[]
  >
) => {
  return useQuery({
    queryKey: queryKeys.upcomingMatchesByCategory(category),
    queryFn: () =>
      apiClient.get<ApiResponse<UpcomingMatch[]>>(
        `/upcoming-matches/category/${category}`
      ),
    select: (data) => data.data.data,
    enabled: !!category,
    ...options,
  });
};

export const useUpcomingMatch = (
  id: string,
  options?: UseQueryOptions<
    AxiosResponse<ApiResponse<UpcomingMatch>>,
    Error,
    UpcomingMatch
  >
) => {
  return useQuery({
    queryKey: queryKeys.upcomingMatch(id),
    queryFn: () =>
      apiClient.get<ApiResponse<UpcomingMatch>>(`/upcoming-matches/${id}`),
    select: (data) => data.data.data,
    enabled: !!id,
    ...options,
  });
};

// Security Queries
export const useSecurityLogs = (
  filters?: SecurityLogFilters,
  options?: UseQueryOptions<
    AxiosResponse<
      ApiResponse<{
        logs: SecurityLog[];
        total: number;
        page: number;
        totalPages: number;
      }>
    >,
    Error,
    { logs: SecurityLog[]; total: number; page: number; totalPages: number }
  >
) => {
  const searchParams = new URLSearchParams();
  if (filters?.page) searchParams.set("page", filters.page.toString());
  if (filters?.limit) searchParams.set("limit", filters.limit.toString());
  if (filters?.type) searchParams.set("type", filters.type);
  if (filters?.severity) searchParams.set("severity", filters.severity);
  if (filters?.dateFrom) searchParams.set("dateFrom", filters.dateFrom);
  if (filters?.dateTo) searchParams.set("dateTo", filters.dateTo);

  return useQuery({
    queryKey: queryKeys.securityLogs(filters),
    queryFn: () =>
      apiClient.get<
        ApiResponse<{
          logs: SecurityLog[];
          total: number;
          page: number;
          totalPages: number;
        }>
      >(`/security/logs?${searchParams.toString()}`),
    select: (data) => data.data.data,
    ...options,
  });
};

// Settings Queries
export const useSettings = (
  options?: UseQueryOptions<
    AxiosResponse<ApiResponse<SettingsResponse>>,
    Error,
    Settings
  >
) => {
  return useQuery({
    queryKey: queryKeys.settings,
    queryFn: () => apiClient.get<ApiResponse<SettingsResponse>>("/settings"),
    select: (data) => data.data.data.settings,
    ...options,
  });
};

// Banner Text Queries
export const useBannerText = (
  options?: UseQueryOptions<
    AxiosResponse<ApiResponse<BannerTextResponse>>,
    Error,
    BannerText
  >
) => {
  return useQuery({
    queryKey: queryKeys.bannerText,
    queryFn: () =>
      apiClient.get<ApiResponse<BannerTextResponse>>("/banner-text"),
    select: (data) => data.data.data.bannerText,
    ...options,
  });
};

// Promo Section Queries
export const usePromoSection = (
  options?: UseQueryOptions<
    AxiosResponse<ApiResponse<PromoSectionResponse>>,
    Error,
    PromoSection
  >
) => {
  return useQuery({
    queryKey: queryKeys.promoSection,
    queryFn: () =>
      apiClient.get<ApiResponse<PromoSectionResponse>>("/promo-section"),
    select: (data) => data.data.data.promoSection,
    ...options,
  });
};

// Referral System interfaces
export interface ReferralSettings {
  _id: string;
  signupBonus: number;
  referralCommission: number;
  maxCommissionLimit: number;
  minWithdrawAmount: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ReferralCodesWithUsers {
  success: boolean;
  message: string;
  data: {
    summary: {
      totalReferrers: number;
      totalReferredUsers: number;
      totalEarnings: number;
      inconsistentReferrers: number;
    };
    referralCodes: Array<{
      referrer: {
        id: string;
        name: string;
        email: string;
        referralCode: string;
        referralEarnings: number;
        createdAt: string;
      };
      referredUsers: {
        fromReferredByField: {
          count: number;
          users: Array<{
            _id: string;
            name: string;
            email: string;
            referredBy: string;
            createdAt: string;
          }>;
        };
        fromReferredUsersArray: {
          count: number;
          users: Array<{
            _id: string;
            name: string;
            email: string;
            referredBy: string;
            createdAt: string;
          }>;
        };
      };
      transactions: {
        count: number;
        totalAmount: number;
        details: Array<{
          _id: string;
          referrer: string;
          referee: {
            _id: string;
            name: string;
            email: string;
          };
          amount: number;
          status: string;
          createdAt: string;
          updatedAt: string;
          __v: number;
        }>;
      };
      isConsistent: boolean;
    }>;
  };
}

export interface UserReferralSettings {
  useGlobalSettings: boolean;
  signupBonus: number;
  referralCommission: number;
  referralDepositBonus: number;
  minWithdrawAmount: number;
  minTransferAmount: number;
  maxCommissionLimit: number;
}

export interface ReferralTransaction {
  _id: string;
  referrer: {
    name: string;
    email: string;
    referralCode: string;
  };
  referee: {
    name: string;
    email: string;
  };
  amount: number;
  status: "pending" | "approved" | "paid" | "rejected";
  createdAt: string;
}

export interface ReferralAnalytics {
  overview: {
    totalReferrals: number;
    totalReferrers: number;
    totalCommissionsPaid: number;
    pendingTransactions: number;
    approvedTransactions: number;
    paidTransactions: number;
  };
  timeBasedStats: {
    monthlyReferrals: number;
    weeklyReferrals: number;
    monthlyTransactionAmounts: number[];
  };
  topReferrers: Array<{
    _id: string;
    name: string;
    email: string;
    referralCode: string;
    totalReferrals: number;
    totalEarnings: number;
  }>;
  recentTransactions: Array<{
    _id: string;
    referrer: {
      name: string;
      email: string;
      referralCode: string;
    };
    referee: {
      name: string;
      email: string;
    };
    amount: number;
    status: "pending" | "approved" | "paid" | "rejected";
    createdAt: string;
  }>;
}

export interface UserWithReferrals {
  _id: string;
  name: string;
  email: string;
  username: string;
  country: string;
  currency: string;
  phoneNumber: string | null;
  phoneNumberVerified: boolean;
  player_id: string;
  promoCode: string | null;
  isVerified: boolean;
  emailVerified: boolean;
  status: "active" | "deactivated";
  balance: number;
  deposit: number;
  withdraw: number;
  bonusSelection: string;
  birthday: string;
  role: string;
  profileImage: string;
  referredBy: string | null;
  referralEarnings: number;
  referredUsers: Array<{
    name: string;
    email: string;
    createdAt: string;
  }>;
  referralCode?: string;
  isActive?: boolean;
  lastLogin?: string;
  registrationDate?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Users with referrals API response interface
export interface UsersWithReferralsResponse {
  users: UserWithReferrals[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalUsers: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    isEmpty: boolean;
  };
  filters: {
    applied: Record<string, unknown>;
    search: string | null;
    status: string | null;
    isVerified: boolean | null;
    role: string | null;
  };
}

// Referral System Queries
export const useReferralAnalytics = (
  options?: Omit<
    UseQueryOptions<
      AxiosResponse<ApiResponse<ReferralAnalytics>>,
      Error,
      ReferralAnalytics
    >,
    "queryKey" | "queryFn" | "select"
  >
) => {
  return useQuery({
    queryKey: queryKeys.referralAnalytics,
    queryFn: () => {
      return apiClient.get<ApiResponse<ReferralAnalytics>>(
        "/referral/analytics"
      );
    },
    select: (data) => {
      return data.data.data;
    },
    ...options,
  });
};

export const useReferralTransactions = (
  options?: Omit<
    UseQueryOptions<
      AxiosResponse<ApiResponse<ReferralTransaction[]>>,
      Error,
      ReferralTransaction[]
    >,
    "queryKey" | "queryFn" | "select"
  >
) => {
  return useQuery({
    queryKey: queryKeys.referralTransactions,
    queryFn: () => {
      return apiClient.get<ApiResponse<ReferralTransaction[]>>(
        "/referral/transactions"
      );
    },
    select: (data) => {
      return data.data.data;
    },
    ...options,
  });
};

export const useReferralUsers = (
  filters?: { page?: number; limit?: number; search?: string },
  options?: Omit<
    UseQueryOptions<
      AxiosResponse<ApiResponse<UsersWithReferralsResponse>>,
      Error,
      UserWithReferrals[]
    >,
    "queryKey" | "queryFn" | "select"
  >
) => {
  const searchParams = new URLSearchParams();
  searchParams.set("includeReferrals", "true");
  if (filters?.page) searchParams.set("page", filters.page.toString());
  if (filters?.limit) searchParams.set("limit", filters.limit.toString());
  if (filters?.search) searchParams.set("search", filters.search);

  return useQuery({
    queryKey: [...queryKeys.referralUsers, filters],
    queryFn: () => {
      return apiClient.get<ApiResponse<UsersWithReferralsResponse>>(
        `/users?${searchParams.toString()}`
      );
    },
    select: (data) => {
      return data.data.data.users.filter(
        (user: UserWithReferrals) => user.referralCode
      );
    },
    ...options,
  });
};

export const useReferralSettings = (
  options?: Omit<
    UseQueryOptions<
      AxiosResponse<ApiResponse<ReferralSettings>>,
      Error,
      ReferralSettings
    >,
    "queryKey" | "queryFn" | "select"
  >
) => {
  return useQuery({
    queryKey: queryKeys.referralSettings,
    queryFn: () => {
      return apiClient.get<ApiResponse<ReferralSettings>>("/referral/settings");
    },
    select: (data) => {
      return data.data.data;
    },
    ...options,
  });
};

export const useReferralCodesWithUsers = (
  options?: Omit<
    UseQueryOptions<
      AxiosResponse<ReferralCodesWithUsers>,
      Error,
      ReferralCodesWithUsers
    >,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery({
    queryKey: queryKeys.referralCodesWithUsers,
    queryFn: () => {
      return apiClient.get<ReferralCodesWithUsers>(
        "/referral/all-codes-with-users"
      );
    },
    select: (data) => {
      return data.data;
    },
    ...options,
  });
};

export const useReferralUserSettings = (
  userId: string,
  options?: Omit<
    UseQueryOptions<
      AxiosResponse<ApiResponse<UserReferralSettings>>,
      Error,
      UserReferralSettings
    >,
    "queryKey" | "queryFn" | "select"
  >
) => {
  return useQuery({
    queryKey: queryKeys.referralUserSettings(userId),
    queryFn: () => {
      return apiClient.get<ApiResponse<UserReferralSettings>>(
        `/referral/user-settings/${userId}`
      );
    },
    select: (data) => {
      return data.data.data;
    },
    enabled: !!userId,
    ...options,
  });
};

export const useUserReferralSettings = (
  userId: string,
  options?: Omit<
    UseQueryOptions<
      AxiosResponse<ApiResponse<UserReferralSettings>>,
      Error,
      UserReferralSettings
    >,
    "queryKey" | "queryFn" | "select"
  >
) => {
  return useQuery({
    queryKey: queryKeys.userReferralSettings(userId),
    queryFn: () => {
      return apiClient.get<ApiResponse<UserReferralSettings>>(
        `/referral/user-settings/${userId}`
      );
    },
    select: (data) => {
      return data.data.data;
    },
    enabled: !!userId,
    ...options,
  });
};

export const useUpdateUserReferralSettings = (
  options?: UseMutationOptions<
    AxiosResponse<ApiResponse<UserReferralSettings>>,
    Error,
    { userId: string; settings: UserReferralSettings }
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, settings }) => {
      return apiClient.put<ApiResponse<UserReferralSettings>>(
        `/referral/user-settings/${userId}`,
        settings
      );
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch user referral settings
      queryClient.invalidateQueries({
        queryKey: queryKeys.userReferralSettings(variables.userId),
      });
      // Also invalidate referral codes with users to refresh the display
      queryClient.invalidateQueries({
        queryKey: queryKeys.referralCodesWithUsers,
      });
    },
    ...options,
  });
};

// Utility function to invalidate queries
export const invalidateQueries = {
  dashboardStats: () => queryKeys.dashboardStats,
  recentActivity: () => queryKeys.recentActivity,
  users: () => queryKeys.users,
  analytics: () => queryKeys.analytics,
  reports: () => queryKeys.reports,
  security: () => queryKeys.security,
  settings: () => queryKeys.settings,
  referral: () => queryKeys.referral,
  referralAnalytics: () => queryKeys.referralAnalytics,
  referralTransactions: () => queryKeys.referralTransactions,
  referralUsers: () => queryKeys.referralUsers,
  referralSettings: () => queryKeys.referralSettings,
  referralCodesWithUsers: () => queryKeys.referralCodesWithUsers,
  referralUserSettings: (userId: string) =>
    queryKeys.referralUserSettings(userId),
  userReferralSettings: (userId: string) =>
    queryKeys.userReferralSettings(userId),
};

// Payment Method interfaces
export interface UserInput {
  name: string;
  type: "text" | "number" | "email" | "tel" | "password" | "textarea";
  label_en: string;
  label_bd: string;
  isRequired: boolean;
  instruction_en?: string;
  instruction_bd?: string;
}

export interface PaymentMethod {
  _id: string;
  method_name_en: string;
  method_name_bd: string;
  agent_wallet_number: string;
  agent_wallet_text: string;
  gateways: string[];
  text_color: string;
  background_color: string;
  button_color: string;
  instruction_en: string;
  instruction_bd: string;
  status: "Active" | "Inactive";
  user_inputs: UserInput[];
  method_image?: string;
  payment_page_image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePaymentMethodData {
  method_name_en: string;
  method_name_bd: string;
  agent_wallet_number: string;
  agent_wallet_text: string;
  gateways: string[];
  text_color: string;
  background_color: string;
  button_color: string;
  instruction_en: string;
  instruction_bd: string;
  status: "Active" | "Inactive";
  user_inputs: UserInput[];
  method_image?: File;
  payment_page_image?: File;
}

// Payment Method Query Keys
export const paymentMethodQueryKeys = {
  paymentMethods: ["paymentMethods"] as const,
  paymentMethodsList: () => ["paymentMethods", "list"] as const,
  paymentMethod: (id: string) => ["paymentMethods", id] as const,
};

// Payment Method Queries
export const usePaymentMethods = (
  options?: UseQueryOptions<
    AxiosResponse<ApiResponse<PaymentMethod[]>>,
    Error,
    PaymentMethod[]
  >
) => {
  return useQuery({
    queryKey: paymentMethodQueryKeys.paymentMethodsList(),
    queryFn: () =>
      apiClient.get<ApiResponse<PaymentMethod[]>>("/payment-methods"),
    select: (data) => data.data.data,
    ...options,
  });
};

export const usePaymentMethod = (
  id: string,
  options?: UseQueryOptions<
    AxiosResponse<ApiResponse<PaymentMethod>>,
    Error,
    PaymentMethod
  >
) => {
  return useQuery({
    queryKey: paymentMethodQueryKeys.paymentMethod(id),
    queryFn: () =>
      apiClient.get<ApiResponse<PaymentMethod>>(`/payment-methods/${id}`),
    select: (data) => data.data.data,
    enabled: !!id,
    ...options,
  });
};

// Payment Method Mutations
export const useCreatePaymentMethod = (
  options?: UseMutationOptions<
    AxiosResponse<ApiResponse<PaymentMethod>>,
    Error,
    FormData
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FormData) =>
      apiClient.post<ApiResponse<PaymentMethod>>("/payment-methods", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: paymentMethodQueryKeys.paymentMethodsList(),
      });
    },
    ...options,
  });
};

export const useUpdatePaymentMethod = (
  options?: UseMutationOptions<
    AxiosResponse<ApiResponse<PaymentMethod>>,
    Error,
    { id: string; data: FormData }
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) =>
      apiClient.put<ApiResponse<PaymentMethod>>(
        `/payment-methods/${id}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      ),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: paymentMethodQueryKeys.paymentMethodsList(),
      });
      queryClient.invalidateQueries({
        queryKey: paymentMethodQueryKeys.paymentMethod(id),
      });
    },
    ...options,
  });
};

export const useDeletePaymentMethod = (
  options?: UseMutationOptions<AxiosResponse<ApiResponse<void>>, Error, string>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      apiClient.delete<ApiResponse<void>>(`/payment-methods/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: paymentMethodQueryKeys.paymentMethodsList(),
      });
    },
    ...options,
  });
};

export const useTogglePaymentMethodStatus = (
  options?: UseMutationOptions<
    AxiosResponse<ApiResponse<PaymentMethod>>,
    Error,
    string
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      apiClient.patch<ApiResponse<PaymentMethod>>(
        `/payment-methods/${id}/status`
      ),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: paymentMethodQueryKeys.paymentMethodsList(),
      });
      queryClient.invalidateQueries({
        queryKey: paymentMethodQueryKeys.paymentMethod(id),
      });
    },
    ...options,
  });
};
// Promotion interfaces
export interface BonusSettings {
  bonus_type?: "percentage" | "fixed";
  bonus_value?: number;
  max_bonus_limit?: number;
  min_deposit_amount?: number;
  wagering_requirements?: string;
  terms_conditions?: string;
}

export interface Promotion {
  _id: string;
  promotion_image?: string;
  title_en: string;
  title_bd?: string;
  description_en?: string;
  description_bd?: string;
  game_type: string;
  payment_methods?: (string | PaymentMethod)[];
  bonus_settings?: BonusSettings;
  status: "Active" | "Inactive";
  start_date?: string;
  end_date?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePromotionData {
  promotion_image?: File;
  title_en: string;
  title_bd?: string;
  description_en?: string;
  description_bd?: string;
  game_type: string;
  payment_methods?: string[];
  bonus_settings?: BonusSettings;
  status?: "Active" | "Inactive";
}

// Promotion Query Keys
export const promotionQueryKeys = {
  promotions: ["promotions"] as const,
  promotionsList: () => ["promotions", "list"] as const,
  promotion: (id: string) => ["promotions", id] as const,
  promotionsByGameType: (gameType: string) =>
    ["promotions", "game", gameType] as const,
};

// Promotion Queries
export const usePromotions = (
  options?: UseQueryOptions<
    AxiosResponse<ApiResponse<Promotion[]>>,
    Error,
    Promotion[]
  >
) => {
  return useQuery({
    queryKey: promotionQueryKeys.promotionsList(),
    queryFn: () => apiClient.get<ApiResponse<Promotion[]>>("/promotions"),
    select: (data) => data.data.data,
    ...options,
  });
};

export const usePromotion = (
  id: string,
  options?: UseQueryOptions<
    AxiosResponse<ApiResponse<Promotion>>,
    Error,
    Promotion
  >
) => {
  return useQuery({
    queryKey: promotionQueryKeys.promotion(id),
    queryFn: () => apiClient.get<ApiResponse<Promotion>>(`/promotions/${id}`),
    select: (data) => data.data.data,
    enabled: !!id,
    ...options,
  });
};

export const usePromotionsByGameType = (
  gameType: string,
  options?: UseQueryOptions<
    AxiosResponse<ApiResponse<Promotion[]>>,
    Error,
    Promotion[]
  >
) => {
  return useQuery({
    queryKey: promotionQueryKeys.promotionsByGameType(gameType),
    queryFn: () =>
      apiClient.get<ApiResponse<Promotion[]>>(`/promotions/game/${gameType}`),
    select: (data) => data.data.data,
    enabled: !!gameType,
    ...options,
  });
};

// Promotion Mutations
export const useCreatePromotion = (
  options?: UseMutationOptions<
    AxiosResponse<ApiResponse<Promotion>>,
    Error,
    FormData
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FormData) =>
      apiClient.post<ApiResponse<Promotion>>("/promotions", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: promotionQueryKeys.promotionsList(),
      });
    },
    ...options,
  });
};

export const useUpdatePromotion = (
  options?: UseMutationOptions<
    AxiosResponse<ApiResponse<Promotion>>,
    Error,
    { id: string; data: FormData }
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) =>
      apiClient.put<ApiResponse<Promotion>>(`/promotions/${id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: promotionQueryKeys.promotionsList(),
      });
      queryClient.invalidateQueries({
        queryKey: promotionQueryKeys.promotion(id),
      });
    },
    ...options,
  });
};

export const useDeletePromotion = (
  options?: UseMutationOptions<AxiosResponse<ApiResponse<void>>, Error, string>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      apiClient.delete<ApiResponse<void>>(`/promotions/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: promotionQueryKeys.promotionsList(),
      });
    },
    ...options,
  });
};

export const useTogglePromotionStatus = (
  options?: UseMutationOptions<
    AxiosResponse<ApiResponse<Promotion>>,
    Error,
    string
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      apiClient.patch<ApiResponse<Promotion>>(`/promotions/${id}/status`),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: promotionQueryKeys.promotionsList(),
      });
      queryClient.invalidateQueries({
        queryKey: promotionQueryKeys.promotion(id),
      });
    },
    ...options,
  });
};

// Transaction Interfaces
export interface Transaction {
  _id: string;
  amount: number;
  wallet_provider: string;
  transaction_id: string;
  wallet_number: string;
  status: "Pending" | "Completed" | "Failed" | "Cancelled";
  user_id?: string;
  transaction_type: "Deposit" | "Withdrawal" | "Transfer";
  description?: string;
  reference_number?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTransactionData {
  amount: number;
  wallet_provider: string;
  transaction_id: string;
  wallet_number: string;
  status?: "Pending" | "Completed" | "Failed" | "Cancelled";
  user_id?: string;
  transaction_type?: "Deposit" | "Withdrawal" | "Transfer";
  description?: string;
  reference_number?: string;
}

export interface TransactionStats {
  statusStats: Array<{
    _id: string;
    count: number;
    totalAmount: number;
  }>;
  totalTransactions: number;
  totalAmount: number;
  walletProviderStats: Array<{
    _id: string;
    count: number;
    totalAmount: number;
  }>;
}

// Transaction Query Keys
export const transactionQueryKeys = {
  all: ["transactions"] as const,
  lists: () => [...transactionQueryKeys.all, "list"] as const,
  list: (filters: string) =>
    [...transactionQueryKeys.lists(), { filters }] as const,
  details: () => [...transactionQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...transactionQueryKeys.details(), id] as const,
  stats: () => [...transactionQueryKeys.all, "stats"] as const,
  provider: (provider: string) =>
    [...transactionQueryKeys.all, "provider", provider] as const,
};

// Transaction Queries
export const useTransactions = (
  params?: {
    page?: number;
    limit?: number;
    status?: string;
    wallet_provider?: string;
    transaction_type?: string;
    search?: string;
  },
  options?: UseQueryOptions<
    AxiosResponse<{
      success: boolean;
      count: number;
      total: number;
      totalPages: number;
      currentPage: number;
      data: Transaction[];
    }>,
    Error
  >
) => {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.limit) queryParams.append("limit", params.limit.toString());
  if (params?.status) queryParams.append("status", params.status);
  if (params?.wallet_provider)
    queryParams.append("wallet_provider", params.wallet_provider);
  if (params?.transaction_type)
    queryParams.append("transaction_type", params.transaction_type);
  if (params?.search) queryParams.append("search", params.search);

  return useQuery({
    queryKey: transactionQueryKeys.list(queryParams.toString()),
    queryFn: () => apiClient.get(`/transactions?${queryParams.toString()}`),
    ...options,
  });
};

export const useTransaction = (
  id: string,
  options?: UseQueryOptions<AxiosResponse<ApiResponse<Transaction>>, Error>
) => {
  return useQuery({
    queryKey: transactionQueryKeys.detail(id),
    queryFn: () => apiClient.get(`/transactions/${id}`),
    enabled: !!id,
    ...options,
  });
};

export const useTransactionStats = (
  options?: UseQueryOptions<AxiosResponse<ApiResponse<TransactionStats>>, Error>
) => {
  return useQuery({
    queryKey: transactionQueryKeys.stats(),
    queryFn: () => apiClient.get("/transactions/stats"),
    ...options,
  });
};

export const useTransactionsByProvider = (
  provider: string,
  params?: {
    page?: number;
    limit?: number;
    status?: string;
  },
  options?: UseQueryOptions<
    AxiosResponse<{
      success: boolean;
      count: number;
      total: number;
      totalPages: number;
      currentPage: number;
      data: Transaction[];
    }>,
    Error
  >
) => {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.limit) queryParams.append("limit", params.limit.toString());
  if (params?.status) queryParams.append("status", params.status);

  return useQuery({
    queryKey: transactionQueryKeys.provider(provider),
    queryFn: () =>
      apiClient.get(
        `/transactions/provider/${provider}?${queryParams.toString()}`
      ),
    enabled: !!provider,
    ...options,
  });
};

// Transaction Mutations
export const useCreateTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTransactionData) =>
      apiClient.post("/transactions", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: transactionQueryKeys.stats() });
    },
  });
};

export const useUpdateTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CreateTransactionData>;
    }) => apiClient.put(`/transactions/${id}`, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: transactionQueryKeys.all });
      queryClient.invalidateQueries({
        queryKey: transactionQueryKeys.detail(id),
      });
      queryClient.invalidateQueries({ queryKey: transactionQueryKeys.stats() });
    },
  });
};

export const useUpdateTransactionStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: Transaction["status"];
    }) => apiClient.patch(`/transactions/${id}/status`, { status }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: transactionQueryKeys.all });
      queryClient.invalidateQueries({
        queryKey: transactionQueryKeys.detail(id),
      });
      queryClient.invalidateQueries({ queryKey: transactionQueryKeys.stats() });
    },
  });
};

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.delete(`/transactions/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: transactionQueryKeys.stats() });
    },
  });
};

// ============================================
// Contact Settings Types & Queries
// ============================================

export interface ContactSettings {
  _id: string;
  service247Url: string;
  whatsappUrl: string;
  telegramUrl: string;
  facebookUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContactSettingsInput {
  service247Url?: string;
  whatsappUrl?: string;
  telegramUrl?: string;
  facebookUrl?: string;
}

// Get Contact Settings
export const useContactSettings = (
  options?: UseQueryOptions<AxiosResponse<ApiResponse<ContactSettings>>, Error>
) => {
  return useQuery<AxiosResponse<ApiResponse<ContactSettings>>, Error>({
    queryKey: ["contactSettings"],
    queryFn: () => apiClient.get("/contact"),
    ...options,
  });
};

// Update Contact Settings
export const useUpdateContactSettings = (
  options?: UseMutationOptions<
    AxiosResponse<ApiResponse<ContactSettings>>,
    Error,
    ContactSettingsInput
  >
) => {
  const queryClient = useQueryClient();

  return useMutation<
    AxiosResponse<ApiResponse<ContactSettings>>,
    Error,
    ContactSettingsInput
  >({
    mutationFn: (data: ContactSettingsInput) => apiClient.put("/contact", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contactSettings"] });
    },
    ...options,
  });
};

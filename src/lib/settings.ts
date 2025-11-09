import { ApiResponse } from "./queries";

// Settings interface based on API documentation
export interface Settings {
  _id?: string;
  organizationName: string;
  organizationImage: string;
  themeColor: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  logoUrl: string;
  faviconUrl: string;
  supportEmail: string;
  supportPhone: string;
  address: string;
  websiteUrl: string;
  socialLinks: {
    facebook: string;
    twitter: string;
    instagram: string;
    linkedin: string;
  };
  maintenanceMode: boolean;
  registrationEnabled: boolean;
  emailVerificationRequired: boolean;
  twoFactorEnabled: boolean;
  maxLoginAttempts: number;
  sessionTimeout: number;
  createdAt?: string;
  updatedAt?: string;
  // UI Customization Settings
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
}

// Settings API response type
export type SettingsResponse = ApiResponse<Settings>;

// Update settings request type
export interface UpdateSettingsRequest {
  organizationName?: string;
  organizationImage?: string;
  themeColor?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
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
  maintenanceMode?: boolean;
  registrationEnabled?: boolean;
  emailVerificationRequired?: boolean;
  twoFactorEnabled?: boolean;
  maxLoginAttempts?: number;
  sessionTimeout?: number;
  // UI Customization Settings
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
}

// Theme update request type
export interface UpdateThemeRequest {
  themeColor?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
}

// Organization update request type
export interface UpdateOrganizationRequest {
  organizationName?: string;
  organizationImage?: string;
  logoUrl?: string;
  faviconUrl?: string;
  supportEmail?: string;
  supportPhone?: string;
  address?: string;
  websiteUrl?: string;
}

// UI Customization update request type
export interface UpdateUICustomizationRequest {
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
}

// Settings service
export class SettingsService {
  // Get settings
  static async getSettings(): Promise<SettingsResponse> {
    const response = await fetch("/api/settings", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.json();
  }

  // Update all settings
  static async updateSettings(
    settings: UpdateSettingsRequest
  ): Promise<SettingsResponse> {
    const response = await fetch("/api/settings", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      body: JSON.stringify(settings),
    });
    return response.json();
  }

  // Reset settings to default
  static async resetSettings(): Promise<SettingsResponse> {
    const response = await fetch("/api/settings/reset", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    });
    return response.json();
  }

  // Update theme only
  static async updateTheme(
    theme: UpdateThemeRequest
  ): Promise<SettingsResponse> {
    const response = await fetch("/api/settings/theme", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      body: JSON.stringify(theme),
    });
    return response.json();
  }

  // Update organization only
  static async updateOrganization(
    org: UpdateOrganizationRequest
  ): Promise<SettingsResponse> {
    const response = await fetch("/api/settings/organization", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      body: JSON.stringify(org),
    });
    return response.json();
  }

  // Update UI customization only
  static async updateUICustomization(
    ui: UpdateUICustomizationRequest
  ): Promise<SettingsResponse> {
    const response = await fetch("/api/settings/ui", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      body: JSON.stringify(ui),
    });
    return response.json();
  }
}

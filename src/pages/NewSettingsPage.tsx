import { useState, useEffect } from "react";
import { useSettings } from "../lib/queries";
import {
  useResetSettings,
  useUpdateAllSettings,
  useUpdateOrganizationSettings,
  useUpdateUICustomization,
} from "../lib/mutations";

import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

import { RotateCcw, Save, Building, Globe } from "lucide-react";
import { Settings as SettingsType } from "../lib/queries";
import { UICustomizationSettings } from "./components";
import { APKManagementSettings } from "./components/APKManagementSettings";

// Color picker component for better UX
const ColorPicker = ({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}) => {
  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <div className="flex items-center gap-2">
        <Input
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000"
          className="flex-1"
        />
        <div
          className="w-10 h-10 rounded border cursor-pointer"
          style={{ backgroundColor: value || "#FFFFFF" }}
          onClick={() => {
            // Simple color picker - in a real app, you might want to use a proper color picker library
            const colors = [
              "#3B82F6",
              "#1E40AF",
              "#64748B",
              "#F59E0B",
              "#EF4444",
              "#10B981",
              "#8B5CF6",
            ];
            const randomColor =
              colors[Math.floor(Math.random() * colors.length)];
            onChange(randomColor);
          }}
        />
      </div>
    </div>
  );
};

// Tab navigation component
const TabNavigation = ({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) => {
  const tabs = [
    {
      id: "organization",
      label: "Organization",
      icon: <Building className="w-4 h-4" />,
    },
    {
      id: "ui",
      label: "UI Customization",
      icon: <Globe className="w-4 h-4" />,
    },
    {
      id: "apk",
      label: "APK Management",
      icon: <Save className="w-4 h-4" />,
    },
    {
      id: "all",
      label: "All Settings",
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="flex flex-wrap gap-2 p-2 bg-gradient-to-r from-purple-100/50 via-blue-100/50 to-indigo-100/50 dark:from-purple-950/30 dark:via-blue-950/30 dark:to-indigo-950/30 rounded-xl border border-purple-200 dark:border-purple-800">
      {tabs.map((tab) => (
        <Button
          key={tab.id}
          variant={activeTab === tab.id ? "default" : "ghost"}
          onClick={() => setActiveTab(tab.id)}
          className={
            activeTab === tab.id
              ? "bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white shadow-lg shadow-purple-500/50 hover:shadow-purple-500/70 transition-all duration-300 flex items-center gap-2"
              : "hover:bg-purple-100 dark:hover:bg-purple-950 transition-all duration-300 flex items-center gap-2"
          }
        >
          {tab.icon}
          {tab.label}
        </Button>
      ))}
    </div>
  );
};

export function NewSettingsPage() {
  const { data: settingsData, isLoading, isError } = useSettings();

  const updateAllSettings = useUpdateAllSettings();
  const updateOrganizationSettings = useUpdateOrganizationSettings();
  const updateUICustomization = useUpdateUICustomization();
  const resetSettings = useResetSettings();

  const [settings, setSettings] = useState<SettingsType | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("organization");

  // Initialize form with settings data
  useEffect(() => {
    if (settingsData) {
      // Initialize socialLinks if it doesn't exist
      const initializedSettings = {
        ...settingsData,
        socialLinks: settingsData.socialLinks || {
          facebook: "",
          twitter: "",
          instagram: "",
          linkedin: "",
        },
        footerSocialLinks: settingsData.footerSocialLinks || {
          facebook: "",
          twitter: "",
          instagram: "",
          linkedin: "",
        },
        navigationItems: settingsData.navigationItems || [
          {
            id: "1",
            label: "Home",
            url: "/",
            order: 1,
            submenu: [],
          },
        ],
      };
      setSettings(initializedSettings);
    }
  }, [settingsData]);

  // Handle input changes
  const handleInputChange = (
    section: string,
    field: string,
    value:
      | string
      | boolean
      | number
      | Array<{
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
        }>
  ) => {
    if (!settings) return;

    setSettings({
      ...settings,
      [field]: value,
    });
  };

  // Handle file upload for header logo
  const handleHeaderLogoUpload = (file: File) => {
    if (!settings) return;

    // In a real app, you would upload the file to your server
    // For now, we'll just create a local URL for preview
    const localUrl = URL.createObjectURL(file);

    setSettings({
      ...settings,
      headerLogoUrl: localUrl,
    });
  };

  // Handle social links changes
  const handleSocialLinkChange = (platform: string, value: string) => {
    if (!settings) return;

    // Ensure socialLinks object exists
    const updatedSocialLinks = {
      ...(settings.socialLinks || {}),
      [platform]: value,
    };

    setSettings({
      ...settings,
      socialLinks: updatedSocialLinks,
    });
  };

  // Handle footer social links changes
  const handleFooterSocialLinkChange = (platform: string, value: string) => {
    if (!settings) return;

    // Ensure footerSocialLinks object exists
    const updatedFooterSocialLinks = {
      ...(settings.footerSocialLinks || {}),
      [platform]: value,
    };

    setSettings({
      ...settings,
      footerSocialLinks: updatedFooterSocialLinks,
    });
  };

  // Handle form submission for all settings
  const handleSaveAllSettings = () => {
    if (!settings) return;

    setIsSaving(true);
    updateAllSettings.mutate(settings, {
      onSuccess: () => {
        setIsSaving(false);
        // Show success message
      },
      onError: () => {
        setIsSaving(false);
        // Show error message
      },
    });
  };

  // Handle form submission for organization settings
  const handleSaveOrganizationSettings = () => {
    if (!settings) return;

    setIsSaving(true);
    updateOrganizationSettings.mutate(
      {
        organizationName: settings.organizationName,
        organizationImage: settings.organizationImage,
        logoUrl: settings.logoUrl,
        faviconUrl: settings.faviconUrl,
        supportEmail: settings.supportEmail,
        supportPhone: settings.supportPhone,
        address: settings.address,
        websiteUrl: settings.websiteUrl,
        socialLinks: settings.socialLinks,
      },
      {
        onSuccess: () => {
          setIsSaving(false);
          // Show success message
        },
        onError: () => {
          setIsSaving(false);
          // Show error message
        },
      }
    );
  };

  // Handle form submission for UI customization settings
  const handleSaveUICustomizationSettings = () => {
    if (!settings) return;

    setIsSaving(true);
    updateUICustomization.mutate(
      {
        headerLogoUrl: settings.headerLogoUrl,
        headerColor: settings.headerColor,
        headerLoginSignupButtonBgColor: settings.headerLoginSignupButtonBgColor,
        headerLoginSignupButtonTextColor:
          settings.headerLoginSignupButtonTextColor,
        webMenuBgColor: settings.webMenuBgColor,
        webMenuTextColor: settings.webMenuTextColor,
        webMenuFontSize: settings.webMenuFontSize,
        webMenuHoverColor: settings.webMenuHoverColor,
        mobileMenuLoginSignupButtonBgColor:
          settings.mobileMenuLoginSignupButtonBgColor,
        mobileMenuLoginSignupButtonTextColor:
          settings.mobileMenuLoginSignupButtonTextColor,
        mobileMenuFontSize: settings.mobileMenuFontSize,
        footerText: settings.footerText,
        footerSocialLinks: settings.footerSocialLinks,
        navigationItems: settings.navigationItems,
      },
      {
        onSuccess: () => {
          setIsSaving(false);
          // Show success message
        },
        onError: () => {
          setIsSaving(false);
          // Show error message
        },
      }
    );
  };

  // Handle reset settings
  const handleResetSettings = () => {
    if (
      window.confirm(
        "Are you sure you want to reset all settings to default values?"
      )
    ) {
      setIsSaving(true);
      resetSettings.mutate(undefined, {
        onSuccess: () => {
          setIsSaving(false);
          // Show success message
        },
        onError: () => {
          setIsSaving(false);
          // Show error message
        },
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    );
  }

  if (isError || !settings) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-pink-100 dark:from-red-900 dark:to-pink-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="h-8 w-8 text-red-600 dark:text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-muted-foreground">
            Error loading settings. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="animate-fade-in">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-3">
                <svg
                  className="h-8 w-8 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Settings
              </h1>
              <p className="text-muted-foreground mt-2">
                Manage your platform preferences and configuration
              </p>
            </div>
            <Button
              variant="outline"
              onClick={handleResetSettings}
              disabled={isSaving}
              className="hover:bg-red-50 dark:hover:bg-red-950 border-red-200 dark:border-red-800 hover:border-red-400 transition-all duration-300"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset to Default
            </Button>
          </div>
        </div>

        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === "organization" && (
          <Card className="border-0 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 dark:from-slate-900 dark:via-purple-950/30 dark:to-blue-950/30 shadow-lg animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <Building className="h-5 w-5 text-white" />
                </div>
                Organization Settings
              </CardTitle>
              <CardDescription>
                Manage your organization's information and contact details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="organization-name">Organization Name</Label>
                  <Input
                    id="organization-name"
                    value={settings.organizationName || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "organization",
                        "organizationName",
                        e.target.value
                      )
                    }
                    placeholder="Betting Platform"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="organization-image">
                    Organization Image URL
                  </Label>
                  <Input
                    id="organization-image"
                    value={settings.organizationImage || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "organization",
                        "organizationImage",
                        e.target.value
                      )
                    }
                    placeholder="https://example.com/logo.png"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="logo-url">Logo URL</Label>
                  <Input
                    id="logo-url"
                    value={settings.logoUrl || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "organization",
                        "logoUrl",
                        e.target.value
                      )
                    }
                    placeholder="https://example.com/logo.png"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="favicon-url">Favicon URL</Label>
                  <Input
                    id="favicon-url"
                    value={settings.faviconUrl || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "organization",
                        "faviconUrl",
                        e.target.value
                      )
                    }
                    placeholder="https://example.com/favicon.ico"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="support-email">Support Email</Label>
                  <Input
                    id="support-email"
                    type="email"
                    value={settings.supportEmail || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "organization",
                        "supportEmail",
                        e.target.value
                      )
                    }
                    placeholder="support@bettingsite.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="support-phone">Support Phone</Label>
                  <Input
                    id="support-phone"
                    value={settings.supportPhone || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "organization",
                        "supportPhone",
                        e.target.value
                      )
                    }
                    placeholder="+1234567890"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website-url">Website URL</Label>
                  <Input
                    id="website-url"
                    value={settings.websiteUrl || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "organization",
                        "websiteUrl",
                        e.target.value
                      )
                    }
                    placeholder="https://www.bettingsite.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={settings.address || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "organization",
                        "address",
                        e.target.value
                      )
                    }
                    placeholder="123 Betting Street, City, Country"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium text-lg">Social Links</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="facebook">Facebook</Label>
                    <Input
                      id="facebook"
                      value={settings.socialLinks?.facebook || ""}
                      onChange={(e) =>
                        handleSocialLinkChange("facebook", e.target.value)
                      }
                      placeholder="https://facebook.com/bettingsite"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="twitter">Twitter</Label>
                    <Input
                      id="twitter"
                      value={settings.socialLinks?.twitter || ""}
                      onChange={(e) =>
                        handleSocialLinkChange("twitter", e.target.value)
                      }
                      placeholder="https://twitter.com/bettingsite"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="instagram">Instagram</Label>
                    <Input
                      id="instagram"
                      value={settings.socialLinks?.instagram || ""}
                      onChange={(e) =>
                        handleSocialLinkChange("instagram", e.target.value)
                      }
                      placeholder="https://instagram.com/bettingsite"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn</Label>
                    <Input
                      id="linkedin"
                      value={settings.socialLinks?.linkedin || ""}
                      onChange={(e) =>
                        handleSocialLinkChange("linkedin", e.target.value)
                      }
                      placeholder="https://linkedin.com/company/bettingsite"
                    />
                  </div>
                </div>
              </div>

              <Button
                onClick={handleSaveOrganizationSettings}
                disabled={isSaving}
                className="w-full md:w-auto bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-purple-500/50 hover:shadow-purple-500/70 transition-all duration-300"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? "Saving..." : "Save Organization Settings"}
              </Button>
            </CardContent>
          </Card>
        )}

        {activeTab === "ui" && (
          <UICustomizationSettings
            settings={settings}
            handleInputChange={handleInputChange}
            handleFooterSocialLinkChange={handleFooterSocialLinkChange}
            handleSaveUICustomizationSettings={
              handleSaveUICustomizationSettings
            }
            handleHeaderLogoUpload={handleHeaderLogoUpload}
            isSaving={isSaving}
          />
        )}

        {activeTab === "apk" && <APKManagementSettings />}

        {activeTab === "all" && (
          <Card className="border-0 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 dark:from-slate-900 dark:via-purple-950/30 dark:to-blue-950/30 shadow-lg animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <svg
                    className="h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </div>
                All Settings
              </CardTitle>
              <CardDescription>
                View and edit all settings in one place
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 rounded-xl bg-gradient-to-r from-slate-50 to-purple-50/50 dark:from-slate-800 dark:to-purple-900/20 border border-purple-100 dark:border-purple-900/50">
                <pre className="text-sm overflow-x-auto text-slate-700 dark:text-slate-300">
                  {JSON.stringify(settings, null, 2)}
                </pre>
              </div>

              <Button
                onClick={handleSaveAllSettings}
                disabled={isSaving}
                className="w-full md:w-auto bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-purple-500/50 hover:shadow-purple-500/70 transition-all duration-300"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? "Saving..." : "Save All Settings"}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

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
    { id: "all", label: "All Settings" },
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {tabs.map((tab) => (
        <Button
          key={tab.id}
          variant={activeTab === tab.id ? "default" : "outline"}
          onClick={() => setActiveTab(tab.id)}
          className="flex items-center gap-2"
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
    return <div className="p-6">Loading settings...</div>;
  }

  if (isError || !settings) {
    return (
      <div className="p-6">Error loading settings. Please try again later.</div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Settings
              </h1>
              <p className="text-muted-foreground">
                Manage your platform preferences and configuration
              </p>
            </div>
            <Button
              variant="outline"
              onClick={handleResetSettings}
              disabled={isSaving}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset to Default
            </Button>
          </div>
        </div>

        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === "organization" && (
          <Card>
            <CardHeader>
              <CardTitle>Organization Settings</CardTitle>
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
                className="w-full md:w-auto"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Organization Settings
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
          <Card>
            <CardHeader>
              <CardTitle>All Settings</CardTitle>
              <CardDescription>
                View and edit all settings in one place
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <pre className="bg-muted p-4 rounded-md text-sm overflow-x-auto">
                {JSON.stringify(settings, null, 2)}
              </pre>

              <Button
                onClick={handleSaveAllSettings}
                disabled={isSaving}
                className="w-full md:w-auto"
              >
                <Save className="w-4 h-4 mr-2" />
                Save All Settings
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

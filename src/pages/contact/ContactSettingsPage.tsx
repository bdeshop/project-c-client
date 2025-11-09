"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";
import {
  useContactSettings,
  useUpdateContactSettings,
} from "../../lib/queries";
import { toast } from "sonner";
import {
  Save,
  MessageCircle,
  Send,
  Facebook,
  Headphones,
  ExternalLink,
} from "lucide-react";

export default function ContactSettingsPage() {
  const navigate = useNavigate();
  const { data: contactData, isLoading } = useContactSettings();
  const updateSettings = useUpdateContactSettings();

  const [formData, setFormData] = useState({
    service247Url: "",
    whatsappUrl: "",
    telegramUrl: "",
    facebookUrl: "",
  });

  useEffect(() => {
    if (contactData?.data?.data) {
      const settings = contactData.data.data;
      setFormData({
        service247Url: settings.service247Url || "",
        whatsappUrl: settings.whatsappUrl || "",
        telegramUrl: settings.telegramUrl || "",
        facebookUrl: settings.facebookUrl || "",
      });
    }
  }, [contactData]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateSettings.mutateAsync(formData);
      toast.success("Contact settings updated successfully!");
    } catch (error) {
      console.error("Contact settings update error:", error);
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Failed to update contact settings";
      toast.error(errorMessage);
    }
  };

  const testUrl = (url: string, name: string) => {
    if (!url) {
      toast.error(`${name} URL is empty`);
      return;
    }
    window.open(url, "_blank");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="container mx-auto max-w-4xl">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
            Contact Settings
          </h1>
          <p className="text-muted-foreground">
            Manage your customer support and social media contact URLs
          </p>
        </div>

        {/* Main Form Card */}
        <Card className="glass-effect">
          <CardHeader>
            <CardTitle>Contact URLs Configuration</CardTitle>
            <CardDescription>
              Configure URLs for 24/7 service, WhatsApp, Telegram, and Facebook
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 24/7 Service URL */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Headphones className="h-4 w-4 text-primary" />
                  24/7 Service URL
                </Label>
                <div className="flex gap-2">
                  <Input
                    value={formData.service247Url}
                    onChange={(e) =>
                      handleInputChange("service247Url", e.target.value)
                    }
                    placeholder="https://example.com/support"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      testUrl(formData.service247Url, "24/7 Service")
                    }
                    disabled={!formData.service247Url}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Example: https://support.yoursite.com
                </p>
              </div>

              {/* WhatsApp URL */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-green-500" />
                  WhatsApp URL
                </Label>
                <div className="flex gap-2">
                  <Input
                    value={formData.whatsappUrl}
                    onChange={(e) =>
                      handleInputChange("whatsappUrl", e.target.value)
                    }
                    placeholder="https://wa.me/1234567890"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => testUrl(formData.whatsappUrl, "WhatsApp")}
                    disabled={!formData.whatsappUrl}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Example: https://wa.me/1234567890 (with country code, no + or
                  spaces)
                </p>
              </div>

              {/* Telegram URL */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Send className="h-4 w-4 text-blue-500" />
                  Telegram URL
                </Label>
                <div className="flex gap-2">
                  <Input
                    value={formData.telegramUrl}
                    onChange={(e) =>
                      handleInputChange("telegramUrl", e.target.value)
                    }
                    placeholder="https://t.me/yourusername"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => testUrl(formData.telegramUrl, "Telegram")}
                    disabled={!formData.telegramUrl}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Example: https://t.me/yourusername or https://t.me/yourchannel
                </p>
              </div>

              {/* Facebook URL */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Facebook className="h-4 w-4 text-blue-600" />
                  Facebook URL
                </Label>
                <div className="flex gap-2">
                  <Input
                    value={formData.facebookUrl}
                    onChange={(e) =>
                      handleInputChange("facebookUrl", e.target.value)
                    }
                    placeholder="https://facebook.com/yourpage"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => testUrl(formData.facebookUrl, "Facebook")}
                    disabled={!formData.facebookUrl}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Example: https://facebook.com/yourpage or
                  https://m.me/yourpage
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 pt-6 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/dashboard")}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={updateSettings.isPending}
                  className="gradient-primary"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {updateSettings.isPending ? "Saving..." : "Save Settings"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="glass-effect mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Usage Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              • These URLs will be used across your platform for customer
              support links
            </p>
            <p>
              • All fields are optional - leave empty if you don't use that
              platform
            </p>
            <p>
              • Use the test button (
              <ExternalLink className="h-3 w-3 inline" />) to verify each URL
              opens correctly
            </p>
            <p>
              • Changes take effect immediately after saving and will be
              reflected on your website
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { Settings } from "../../lib/queries";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Monitor, Save, Plus, Trash2, ChevronRight } from "lucide-react";

// Define the navigation item type
interface NavigationItem {
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
}

// Define the submenu item type
interface SubmenuItem {
  id: string;
  name: string;
  path: string;
  icon?: string;
}

// Color picker component for better UX
const ColorPicker = ({
  value,
  onChange,
  label,
  id,
}: {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  id?: string;
}) => {
  return (
    <div className="space-y-2">
      {label && <Label htmlFor={id}>{label}</Label>}
      <div className="flex items-center gap-2">
        <Input
          id={id}
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
              "#FFFFFF",
              "#000000",
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

interface UICustomizationSettingsProps {
  settings: Settings;
  handleInputChange: (
    section: string,
    field: string,
    value: string | boolean | number | NavigationItem[]
  ) => void;
  handleFooterSocialLinkChange: (platform: string, value: string) => void;
  handleSaveUICustomizationSettings: () => void;
  handleHeaderLogoUpload: (file: File) => void;
  isSaving: boolean;
}

export function UICustomizationSettings({
  settings,
  handleInputChange,
  handleFooterSocialLinkChange,
  handleSaveUICustomizationSettings,
  handleHeaderLogoUpload,
  isSaving,
}: UICustomizationSettingsProps) {
  // Handle navigation item changes
  const handleNavigationItemChange = (
    index: number,
    field: string,
    value: string | number
  ) => {
    const navigationItems = settings.navigationItems
      ? [...settings.navigationItems]
      : [];
    navigationItems[index] = { ...navigationItems[index], [field]: value };

    handleInputChange("ui", "navigationItems", navigationItems);
  };

  // Handle submenu item changes
  const handleSubmenuItemChange = (
    navIndex: number,
    subIndex: number,
    field: string,
    value: string
  ) => {
    const navigationItems = settings.navigationItems
      ? [...settings.navigationItems]
      : [];
    const submenu = navigationItems[navIndex].submenu
      ? [...navigationItems[navIndex].submenu!]
      : [];

    submenu[subIndex] = { ...submenu[subIndex], [field]: value };
    navigationItems[navIndex] = { ...navigationItems[navIndex], submenu };

    handleInputChange("ui", "navigationItems", navigationItems);
  };

  // Add a new navigation item
  const addNavigationItem = () => {
    const navigationItems = settings.navigationItems
      ? [...settings.navigationItems]
      : [];
    navigationItems.push({
      id: Date.now().toString(),
      label: "",
      url: "",
      order: navigationItems.length + 1,
    });

    handleInputChange("ui", "navigationItems", navigationItems);
  };

  // Add a submenu item to a navigation item
  const addSubmenuItem = (navIndex: number) => {
    const navigationItems = settings.navigationItems
      ? [...settings.navigationItems]
      : [];
    const submenu = navigationItems[navIndex].submenu
      ? [...navigationItems[navIndex].submenu!]
      : [];

    submenu.push({
      id: `${navigationItems[navIndex].id}-${Date.now()}`,
      name: "",
      path: "",
    });

    navigationItems[navIndex] = { ...navigationItems[navIndex], submenu };

    handleInputChange("ui", "navigationItems", navigationItems);
  };

  // Remove a navigation item
  const removeNavigationItem = (index: number) => {
    const navigationItems = settings.navigationItems
      ? [...settings.navigationItems]
      : [];
    navigationItems.splice(index, 1);

    // Reorder remaining items
    const reorderedItems = navigationItems.map((item, idx) => ({
      ...item,
      order: idx + 1,
    }));

    handleInputChange("ui", "navigationItems", reorderedItems);
  };

  // Remove a submenu item
  const removeSubmenuItem = (navIndex: number, subIndex: number) => {
    const navigationItems = settings.navigationItems
      ? [...settings.navigationItems]
      : [];
    const submenu = navigationItems[navIndex].submenu
      ? [...navigationItems[navIndex].submenu!]
      : [];

    submenu.splice(subIndex, 1);
    navigationItems[navIndex] = { ...navigationItems[navIndex], submenu };

    handleInputChange("ui", "navigationItems", navigationItems);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Monitor className="w-5 h-5 mr-2" />
          UI Customization
        </CardTitle>
        <CardDescription>Customize header, menu, and footer</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Header Customization */}
        <div className="space-y-3">
          <h3 className="font-medium text-lg">Header</h3>
          <div className="space-y-2">
            <Label htmlFor="header-logo">Header Logo</Label>
            <Input
              id="header-logo"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleHeaderLogoUpload(file);
                }
              }}
            />
            {settings.headerLogoUrl && (
              <div className="mt-2">
                <img
                  src={settings.headerLogoUrl}
                  alt="Header Logo Preview"
                  className="max-h-16 max-w-xs"
                />
              </div>
            )}
          </div>

          <ColorPicker
            id="header-color"
            label="Header Background Color"
            value={settings.headerColor || ""}
            onChange={(value) => handleInputChange("ui", "headerColor", value)}
          />

          <ColorPicker
            id="header-button-bg-color"
            label="Login/Signup Button Background"
            value={settings.headerLoginSignupButtonBgColor || ""}
            onChange={(value) =>
              handleInputChange("ui", "headerLoginSignupButtonBgColor", value)
            }
          />

          <ColorPicker
            id="header-button-text-color"
            label="Login/Signup Button Text"
            value={settings.headerLoginSignupButtonTextColor || ""}
            onChange={(value) =>
              handleInputChange("ui", "headerLoginSignupButtonTextColor", value)
            }
          />
        </div>

        {/* Navigation Items */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-lg">Navigation Items</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addNavigationItem}
              className="flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              Add Item
            </Button>
          </div>

          <div className="space-y-4">
            {settings.navigationItems && settings.navigationItems.length > 0 ? (
              settings.navigationItems.map((item, index) => (
                <div key={item.id || index} className="border rounded-lg p-4">
                  <div className="grid grid-cols-12 gap-2 items-end mb-3">
                    <div className="col-span-5">
                      <Label>Label</Label>
                      <Input
                        value={item.label || ""}
                        onChange={(e) =>
                          handleNavigationItemChange(
                            index,
                            "label",
                            e.target.value
                          )
                        }
                        placeholder="Home"
                      />
                    </div>
                    <div className="col-span-5">
                      <Label>URL</Label>
                      <Input
                        value={item.url || ""}
                        onChange={(e) =>
                          handleNavigationItemChange(
                            index,
                            "url",
                            e.target.value
                          )
                        }
                        placeholder="/"
                      />
                    </div>
                    <div className="col-span-1">
                      <Label>Order</Label>
                      <Input
                        type="number"
                        value={item.order || index + 1}
                        onChange={(e) =>
                          handleNavigationItemChange(
                            index,
                            "order",
                            parseInt(e.target.value) || index + 1
                          )
                        }
                        min="1"
                      />
                    </div>
                    <div className="col-span-1">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeNavigationItem(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Submenu Items */}
                  <div className="ml-4 pl-4 border-l-2 border-gray-200">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium flex items-center">
                        <ChevronRight className="w-4 h-4 mr-1" />
                        Submenu Items
                      </h4>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addSubmenuItem(index)}
                        className="flex items-center gap-1"
                      >
                        <Plus className="w-4 h-4" />
                        Add Sub Item
                      </Button>
                    </div>

                    {item.submenu && item.submenu.length > 0 ? (
                      <div className="space-y-3">
                        {item.submenu.map((subItem, subIndex) => (
                          <div
                            key={subItem.id || subIndex}
                            className="grid grid-cols-12 gap-2 items-end"
                          >
                            <div className="col-span-5">
                              <Label>Name</Label>
                              <Input
                                value={subItem.name || ""}
                                onChange={(e) =>
                                  handleSubmenuItemChange(
                                    index,
                                    subIndex,
                                    "name",
                                    e.target.value
                                  )
                                }
                                placeholder="Sub Item"
                              />
                            </div>
                            <div className="col-span-5">
                              <Label>Path</Label>
                              <Input
                                value={subItem.path || ""}
                                onChange={(e) =>
                                  handleSubmenuItemChange(
                                    index,
                                    subIndex,
                                    "path",
                                    e.target.value
                                  )
                                }
                                placeholder="/sub-path"
                              />
                            </div>
                            <div className="col-span-1">
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() =>
                                  removeSubmenuItem(index, subIndex)
                                }
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-sm">
                        No submenu items added yet.
                      </p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-sm">
                No navigation items added yet.
              </p>
            )}
          </div>
        </div>

        {/* Web Menu Customization */}
        <div className="space-y-3">
          <h3 className="font-medium text-lg">Web Menu</h3>
          <ColorPicker
            id="web-menu-bg-color"
            label="Background Color"
            value={settings.webMenuBgColor || ""}
            onChange={(value) =>
              handleInputChange("ui", "webMenuBgColor", value)
            }
          />

          <ColorPicker
            id="web-menu-text-color"
            label="Text Color"
            value={settings.webMenuTextColor || ""}
            onChange={(value) =>
              handleInputChange("ui", "webMenuTextColor", value)
            }
          />

          <div className="space-y-2">
            <Label htmlFor="web-menu-font-size">Font Size</Label>
            <Input
              id="web-menu-font-size"
              value={settings.webMenuFontSize || ""}
              onChange={(e) =>
                handleInputChange("ui", "webMenuFontSize", e.target.value)
              }
              placeholder="16px"
            />
          </div>

          <ColorPicker
            id="web-menu-hover-color"
            label="Hover Color"
            value={settings.webMenuHoverColor || ""}
            onChange={(value) =>
              handleInputChange("ui", "webMenuHoverColor", value)
            }
          />
        </div>

        {/* Mobile Menu Customization */}
        <div className="space-y-3">
          <h3 className="font-medium text-lg">Mobile Menu</h3>
          <ColorPicker
            id="mobile-menu-button-bg-color"
            label="Login/Signup Button Background"
            value={settings.mobileMenuLoginSignupButtonBgColor || ""}
            onChange={(value) =>
              handleInputChange(
                "ui",
                "mobileMenuLoginSignupButtonBgColor",
                value
              )
            }
          />

          <ColorPicker
            id="mobile-menu-button-text-color"
            label="Login/Signup Button Text"
            value={settings.mobileMenuLoginSignupButtonTextColor || ""}
            onChange={(value) =>
              handleInputChange(
                "ui",
                "mobileMenuLoginSignupButtonTextColor",
                value
              )
            }
          />

          <div className="space-y-2">
            <Label htmlFor="mobile-menu-font-size">Font Size</Label>
            <Input
              id="mobile-menu-font-size"
              value={settings.mobileMenuFontSize || ""}
              onChange={(e) =>
                handleInputChange("ui", "mobileMenuFontSize", e.target.value)
              }
              placeholder="16px"
            />
          </div>
        </div>

        {/* Footer Customization */}
        <div className="space-y-3">
          <h3 className="font-medium text-lg">Footer</h3>
          <div className="space-y-2">
            <Label htmlFor="footer-text">Footer Text</Label>
            <Input
              id="footer-text"
              value={settings.footerText || ""}
              onChange={(e) =>
                handleInputChange("ui", "footerText", e.target.value)
              }
              placeholder="© 2025 Betting Platform. All rights reserved."
            />
          </div>
          <div className="space-y-2">
            <Label>Footer Social Links</Label>
            <div className="space-y-2 pl-2">
              <div>
                <Label htmlFor="footer-facebook" className="text-sm">
                  Facebook
                </Label>
                <Input
                  id="footer-facebook"
                  value={settings.footerSocialLinks?.facebook || ""}
                  onChange={(e) =>
                    handleFooterSocialLinkChange("facebook", e.target.value)
                  }
                  placeholder="https://facebook.com/..."
                />
              </div>
              <div>
                <Label htmlFor="footer-twitter" className="text-sm">
                  Twitter
                </Label>
                <Input
                  id="footer-twitter"
                  value={settings.footerSocialLinks?.twitter || ""}
                  onChange={(e) =>
                    handleFooterSocialLinkChange("twitter", e.target.value)
                  }
                  placeholder="https://twitter.com/..."
                />
              </div>
              <div>
                <Label htmlFor="footer-instagram" className="text-sm">
                  Instagram
                </Label>
                <Input
                  id="footer-instagram"
                  value={settings.footerSocialLinks?.instagram || ""}
                  onChange={(e) =>
                    handleFooterSocialLinkChange("instagram", e.target.value)
                  }
                  placeholder="https://instagram.com/..."
                />
              </div>
              <div>
                <Label htmlFor="footer-linkedin" className="text-sm">
                  LinkedIn
                </Label>
                <Input
                  id="footer-linkedin"
                  value={settings.footerSocialLinks?.linkedin || ""}
                  onChange={(e) =>
                    handleFooterSocialLinkChange("linkedin", e.target.value)
                  }
                  placeholder="https://linkedin.com/..."
                />
              </div>
            </div>
          </div>
        </div>

        <Button
          className="w-full"
          onClick={handleSaveUICustomizationSettings}
          disabled={isSaving}
        >
          <Save className="w-4 h-4 mr-2" />
          Save UI Customization
        </Button>
      </CardContent>
    </Card>
  );
}

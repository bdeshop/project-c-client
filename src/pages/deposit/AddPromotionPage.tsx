"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  usePaymentMethods,
  useCreatePromotion,
  BonusSettings,
} from "../../lib/queries";
import { toast } from "sonner";
import { ArrowLeft, Save, Upload } from "lucide-react";

export default function AddPromotionPage() {
  const navigate = useNavigate();
  const { data: paymentMethods, isLoading: loadingPaymentMethods } =
    usePaymentMethods();
  const createPromotion = useCreatePromotion();

  const [formData, setFormData] = useState({
    title_en: "",
    title_bd: "",
    description_en: "",
    description_bd: "",
    game_type: "",
    status: "Active" as "Active" | "Inactive",
  });

  const [bonusSettings, setBonusSettings] = useState<BonusSettings>({
    bonus_type: "percentage",
    bonus_value: 0,
    max_bonus_limit: 0,
  });

  const [promotionImage, setPromotionImage] = useState<File | null>(null);
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<
    string[]
  >([]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePaymentMethodToggle = (methodId: string) => {
    setSelectedPaymentMethods((prev) =>
      prev.includes(methodId)
        ? prev.filter((id) => id !== methodId)
        : [...prev, methodId]
    );
  };

  const handleBonusSettingsChange = (
    field: keyof BonusSettings,
    value: string | number
  ) => {
    setBonusSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formDataToSend = new FormData();

    // Add form fields
    formDataToSend.append("title_en", formData.title_en);
    if (formData.title_bd) formDataToSend.append("title_bd", formData.title_bd);
    if (formData.description_en)
      formDataToSend.append("description_en", formData.description_en);
    if (formData.description_bd)
      formDataToSend.append("description_bd", formData.description_bd);
    formDataToSend.append("game_type", formData.game_type);
    formDataToSend.append("status", formData.status);

    // Add payment methods as individual array items
    selectedPaymentMethods.forEach((methodId, index) => {
      formDataToSend.append(`payment_methods[${index}]`, methodId);
    });

    // Add bonus settings
    formDataToSend.append("bonus_settings", JSON.stringify(bonusSettings));

    // Add image if selected
    if (promotionImage) {
      formDataToSend.append("promotion_image", promotionImage);
    }

    try {
      await createPromotion.mutateAsync(formDataToSend);
      toast.success("Promotion created successfully!");
      navigate("/dashboard/deposit");
    } catch (error) {
      console.error("Promotion creation error:", error);
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Failed to create promotion";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/dashboard/deposit")}
            className="flex items-center gap-2 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Promotion Dashboard
          </h1>
        </div>

        {/* Main Form Card */}
        <Card className="glass-effect">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl">Create New Promotion</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information Section */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-primary">
                  Basic Information
                </h3>

                {/* Promotion Image */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Promotion Image</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center bg-muted/50">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setPromotionImage(e.target.files?.[0] || null)
                      }
                      className="hidden"
                      id="promotion-image"
                    />
                    <label htmlFor="promotion-image" className="cursor-pointer">
                      <div className="flex items-center justify-center gap-2 text-muted-foreground">
                        <Upload className="h-5 w-5" />
                        <span className="text-sm">
                          {promotionImage
                            ? promotionImage.name
                            : "Browse... No file selected."}
                        </span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Promotion Title */}
                <div className="space-y-2">
                  <Input
                    value={formData.title_en}
                    onChange={(e) =>
                      handleInputChange("title_en", e.target.value)
                    }
                    placeholder="Promotion Title"
                    className="h-12 text-base"
                    required
                  />
                </div>

                {/* Title (Bangla) */}
                <div className="space-y-2">
                  <Input
                    value={formData.title_bd}
                    onChange={(e) =>
                      handleInputChange("title_bd", e.target.value)
                    }
                    placeholder="Title (Bangla)"
                    className="h-12 text-base"
                    required
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Textarea
                    value={formData.description_en}
                    onChange={(e) =>
                      handleInputChange("description_en", e.target.value)
                    }
                    placeholder="Description"
                    rows={4}
                    className="text-base resize-none"
                    required
                  />
                </div>

                {/* Description (Bangla) */}
                <div className="space-y-2">
                  <Textarea
                    value={formData.description_bd}
                    onChange={(e) =>
                      handleInputChange("description_bd", e.target.value)
                    }
                    placeholder="Description (Bangla)"
                    rows={4}
                    className="text-base resize-none"
                    required
                  />
                </div>

                {/* Select Game Type */}
                <div className="space-y-2">
                  <select
                    value={formData.game_type}
                    onChange={(e) =>
                      handleInputChange("game_type", e.target.value)
                    }
                    className="w-full h-12 px-3 text-base bg-background border border-input rounded-md"
                    required
                  >
                    <option value="">Select Game Type</option>
                    <option value="slots">Slots</option>
                    <option value="casino">Casino</option>
                    <option value="sports">Sports Betting</option>
                    <option value="poker">Poker</option>
                    <option value="all">All Games</option>
                  </select>
                </div>
              </div>

              {/* Payment Methods Section */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-primary">
                  Payment Methods
                </h3>

                {loadingPaymentMethods ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {paymentMethods?.map((method) => (
                      <div
                        key={method._id}
                        className="flex items-center space-x-3"
                      >
                        <input
                          type="checkbox"
                          id={`method-${method._id}`}
                          checked={selectedPaymentMethods.includes(method._id)}
                          onChange={() => handlePaymentMethodToggle(method._id)}
                          className="w-4 h-4 text-primary border-input rounded focus:ring-primary"
                        />
                        <label
                          htmlFor={`method-${method._id}`}
                          className="text-sm font-medium cursor-pointer"
                        >
                          {method.method_name_en} ({method.method_name_bd})
                        </label>
                      </div>
                    ))}
                    {(!paymentMethods || paymentMethods.length === 0) && (
                      <p className="text-muted-foreground text-sm">
                        No payment methods available
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Bonus Settings Section */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-primary">
                  Bonus Settings
                </h3>

                {selectedPaymentMethods.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>
                      No payment methods selected. Please select at least one
                      payment method.
                    </p>
                  </div>
                ) : (
                  <div className="bg-muted/50 rounded-lg p-6">
                    <p className="text-sm text-muted-foreground mb-4">
                      Selected payment methods: {selectedPaymentMethods.length}
                    </p>

                    <div className="space-y-4">
                      {/* Bonus Type */}
                      <div>
                        <Label className="text-sm font-medium">
                          Bonus Type
                        </Label>
                        <select
                          value={bonusSettings.bonus_type}
                          onChange={(e) =>
                            handleBonusSettingsChange(
                              "bonus_type",
                              e.target.value as "percentage" | "fixed"
                            )
                          }
                          className="w-full mt-1 p-2 bg-background border border-input rounded-md"
                        >
                          <option value="percentage">Percentage</option>
                          <option value="fixed">Fixed Amount</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium">
                            {bonusSettings.bonus_type === "percentage"
                              ? "Bonus Percentage (%)"
                              : "Bonus Amount"}
                          </Label>
                          <Input
                            type="number"
                            value={bonusSettings.bonus_value}
                            onChange={(e) =>
                              handleBonusSettingsChange(
                                "bonus_value",
                                Number(e.target.value)
                              )
                            }
                            placeholder={
                              bonusSettings.bonus_type === "percentage"
                                ? "Enter percentage"
                                : "Enter amount"
                            }
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-sm font-medium">
                            Maximum Bonus Limit
                          </Label>
                          <Input
                            type="number"
                            value={bonusSettings.max_bonus_limit}
                            onChange={(e) =>
                              handleBonusSettingsChange(
                                "max_bonus_limit",
                                Number(e.target.value)
                              )
                            }
                            placeholder="Enter maximum limit"
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 pt-6 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/dashboard/deposit")}
                  className="px-6"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={
                    createPromotion.isPending ||
                    selectedPaymentMethods.length === 0
                  }
                  className="px-6 gradient-primary"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {createPromotion.isPending
                    ? "Creating..."
                    : "Create Promotion"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

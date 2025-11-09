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
    } catch (error: unknown) {
      console.error("Promotion creation error:", error);
      toast.error(
        error.response?.data?.message || "Failed to create promotion"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6">
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
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Promotion Dashboard
          </h1>
        </div>

        {/* Main Form Card */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl text-purple-600">
              Create New Promotion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information Section */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-purple-600">
                  Basic Information
                </h3>

                {/* Promotion Image */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Promotion Image
                  </Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50">
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
                      <div className="flex items-center justify-center gap-2 text-gray-600">
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
                    className="h-12 text-base bg-gray-50 border-gray-200"
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
                    className="h-12 text-base bg-gray-50 border-gray-200"
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
                    className="text-base bg-gray-50 border-gray-200 resize-none"
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
                    className="text-base bg-gray-50 border-gray-200 resize-none"
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
                    className="w-full h-12 px-3 text-base bg-gray-50 border border-gray-200 rounded-md text-gray-500"
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
                <h3 className="text-lg font-semibold text-purple-600">
                  Payment Methods
                </h3>

                {loadingPaymentMethods ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
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
                          className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                        />
                        <label
                          htmlFor={`method-${method._id}`}
                          className="text-sm font-medium text-gray-700 cursor-pointer"
                        >
                          {method.method_name_en} ({method.method_name_bd})
                        </label>
                      </div>
                    ))}
                    {(!paymentMethods || paymentMethods.length === 0) && (
                      <p className="text-gray-500 text-sm">
                        No payment methods available
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Bonus Settings Section */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-purple-600">
                  Bonus Settings
                </h3>

                {selectedPaymentMethods.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>
                      No payment methods selected. Please select at least one
                      payment method.
                    </p>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-6">
                    <p className="text-sm text-gray-600 mb-4">
                      Selected payment methods: {selectedPaymentMethods.length}
                    </p>

                    <div className="space-y-4">
                      {/* Bonus Type */}
                      <div>
                        <Label className="text-sm font-medium text-gray-700">
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
                          className="w-full mt-1 p-2 bg-white border border-gray-200 rounded-md"
                        >
                          <option value="percentage">Percentage</option>
                          <option value="fixed">Fixed Amount</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-700">
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
                            className="mt-1 bg-white"
                          />
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-700">
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
                            className="mt-1 bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 pt-6 border-t">
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
                  className="px-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
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

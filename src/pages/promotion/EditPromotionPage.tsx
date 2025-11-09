"use client";

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { Badge } from "../../components/ui/badge";
import {
  usePromotion,
  useUpdatePromotion,
  usePaymentMethods,
} from "../../lib/queries";
import { toast } from "sonner";
import { Upload, X, Save, ArrowLeft, Gift } from "lucide-react";
import { API_URL } from "../../lib/api";

export default function EditPromotionPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: promotion, isLoading } = usePromotion(id!);
  const { data: paymentMethods } = usePaymentMethods();
  const updatePromotion = useUpdatePromotion();

  const [formData, setFormData] = useState({
    title_en: "",
    title_bd: "",
    description_en: "",
    description_bd: "",
    game_type: "casino",
    payment_methods: [] as string[],
    status: "Active" as "Active" | "Inactive",
    start_date: "",
    end_date: "",
  });

  const [bonusSettings, setBonusSettings] = useState({
    bonus_type: "percentage" as "percentage" | "fixed",
    bonus_value: "",
    max_bonus_limit: "",
    min_deposit_amount: "",
    wagering_requirements: "",
    terms_conditions: "",
  });

  const [promotionImage, setPromotionImage] = useState<File | null>(null);

  console.log("promotion", promotion);

  // Load existing data when promotion is fetched
  useEffect(() => {
    if (promotion) {
      // Extract payment method IDs from the full objects
      const paymentMethodIds = Array.isArray(promotion.payment_methods)
        ? promotion.payment_methods.map((method) =>
            typeof method === "string" ? method : method._id
          )
        : [];

      setFormData({
        title_en: promotion.title_en,
        title_bd: promotion.title_bd || "",
        description_en: promotion.description_en || "",
        description_bd: promotion.description_bd || "",
        game_type: promotion.game_type,
        payment_methods: paymentMethodIds,
        status: promotion.status,
        start_date: promotion.start_date
          ? promotion.start_date.split("T")[0]
          : "",
        end_date: promotion.end_date ? promotion.end_date.split("T")[0] : "",
      });

      if (promotion.bonus_settings) {
        setBonusSettings({
          bonus_type: promotion.bonus_settings.bonus_type,
          bonus_value: promotion.bonus_settings.bonus_value.toString(),
          max_bonus_limit:
            promotion.bonus_settings.max_bonus_limit?.toString() || "",
          min_deposit_amount:
            promotion.bonus_settings.min_deposit_amount?.toString() || "",
          wagering_requirements:
            promotion.bonus_settings.wagering_requirements || "",
          terms_conditions: promotion.bonus_settings.terms_conditions || "",
        });
      }
    }
  }, [promotion]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleBonusChange = (field: string, value: string) => {
    setBonusSettings((prev) => ({ ...prev, [field]: value }));
  };

  const togglePaymentMethod = (methodId: string) => {
    setFormData((prev) => ({
      ...prev,
      payment_methods: prev.payment_methods.includes(methodId)
        ? prev.payment_methods.filter((id) => id !== methodId)
        : [...prev.payment_methods, methodId],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formDataToSend = new FormData();

    // Add form fields
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "payment_methods") {
        formDataToSend.append(key, JSON.stringify(value));
      } else {
        formDataToSend.append(key, String(value));
      }
    });

    // Add bonus settings
    formDataToSend.append(
      "bonus_settings",
      JSON.stringify({
        ...bonusSettings,
        bonus_value: parseFloat(bonusSettings.bonus_value) || 0,
        max_bonus_limit: bonusSettings.max_bonus_limit
          ? parseFloat(bonusSettings.max_bonus_limit)
          : undefined,
        min_deposit_amount: bonusSettings.min_deposit_amount
          ? parseFloat(bonusSettings.min_deposit_amount)
          : undefined,
      })
    );

    // Add image only if new one is selected
    if (promotionImage) {
      formDataToSend.append("promotion_image", promotionImage);
    }

    try {
      await updatePromotion.mutateAsync({ id: id!, data: formDataToSend });
      toast.success("Promotion updated successfully!");
      navigate(`/dashboard/promotions/view/${id}`);
    } catch (error) {
      console.error("Promotion update error:", error);
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Failed to update promotion";
      toast.error(errorMessage);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!promotion) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Promotion Not Found
          </h2>
          <p className="text-muted-foreground mb-4">
            The promotion you're trying to edit doesn't exist.
          </p>
          <Button onClick={() => navigate("/dashboard/promotions")}>
            Back to Promotions
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/dashboard/promotions/view/${id}`)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent flex items-center gap-3">
            <Gift className="h-8 w-8 text-primary" />
            Edit Promotion
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title_en">Title (English) *</Label>
                  <Input
                    id="title_en"
                    value={formData.title_en}
                    onChange={(e) =>
                      handleInputChange("title_en", e.target.value)
                    }
                    placeholder="Welcome Bonus"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title_bd">Title (Bangla)</Label>
                  <Input
                    id="title_bd"
                    value={formData.title_bd}
                    onChange={(e) =>
                      handleInputChange("title_bd", e.target.value)
                    }
                    placeholder="স্বাগতম বোনাস"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="game_type">Game Type *</Label>
                  <select
                    id="game_type"
                    value={formData.game_type}
                    onChange={(e) =>
                      handleInputChange("game_type", e.target.value)
                    }
                    className="w-full p-2 border border-input rounded-md bg-background text-foreground"
                    required
                  >
                    <option value="casino">Casino</option>
                    <option value="sports">Sports</option>
                    <option value="lottery">Lottery</option>
                    <option value="all">All Games</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) =>
                      handleInputChange("status", e.target.value)
                    }
                    className="w-full p-2 border border-input rounded-md bg-background text-foreground"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input
                    type="date"
                    id="start_date"
                    value={formData.start_date}
                    onChange={(e) =>
                      handleInputChange("start_date", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="end_date">End Date</Label>
                  <Input
                    type="date"
                    id="end_date"
                    value={formData.end_date}
                    onChange={(e) =>
                      handleInputChange("end_date", e.target.value)
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Descriptions */}
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle>Descriptions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description_en">Description (English)</Label>
                <Textarea
                  id="description_en"
                  value={formData.description_en}
                  onChange={(e) =>
                    handleInputChange("description_en", e.target.value)
                  }
                  placeholder="Get 100% bonus on your first deposit..."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description_bd">Description (Bangla)</Label>
                <Textarea
                  id="description_bd"
                  value={formData.description_bd}
                  onChange={(e) =>
                    handleInputChange("description_bd", e.target.value)
                  }
                  placeholder="আপনার প্রথম জমার উপর ১০০% বোনাস পান..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Payment Methods */}
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {paymentMethods?.map((method) => (
                  <div
                    key={method._id}
                    onClick={() => togglePaymentMethod(method._id)}
                    className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                      formData.payment_methods.includes(method._id)
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.payment_methods.includes(method._id)}
                        onChange={() => togglePaymentMethod(method._id)}
                        className="rounded text-primary"
                      />
                      <span className="text-sm font-medium">
                        {method.method_name_en}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              {formData.payment_methods.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground mb-2">
                    Selected methods:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {formData.payment_methods.map((methodId) => {
                      const method = paymentMethods?.find(
                        (m) => m._id === methodId
                      );
                      return (
                        <Badge key={methodId} variant="secondary">
                          {method?.method_name_en}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Bonus Settings */}
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle>Bonus Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bonus_type">Bonus Type</Label>
                  <select
                    id="bonus_type"
                    value={bonusSettings.bonus_type}
                    onChange={(e) =>
                      handleBonusChange("bonus_type", e.target.value)
                    }
                    className="w-full p-2 border border-input rounded-md bg-background text-foreground"
                  >
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bonus_value">
                    Bonus Value{" "}
                    {bonusSettings.bonus_type === "percentage"
                      ? "(%)"
                      : "(Amount)"}
                  </Label>
                  <Input
                    type="number"
                    id="bonus_value"
                    value={bonusSettings.bonus_value}
                    onChange={(e) =>
                      handleBonusChange("bonus_value", e.target.value)
                    }
                    placeholder={
                      bonusSettings.bonus_type === "percentage" ? "100" : "1000"
                    }
                    min="0"
                    step={
                      bonusSettings.bonus_type === "percentage" ? "0.01" : "1"
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max_bonus_limit">Max Bonus Limit</Label>
                  <Input
                    type="number"
                    id="max_bonus_limit"
                    value={bonusSettings.max_bonus_limit}
                    onChange={(e) =>
                      handleBonusChange("max_bonus_limit", e.target.value)
                    }
                    placeholder="5000"
                    min="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="min_deposit_amount">Min Deposit Amount</Label>
                  <Input
                    type="number"
                    id="min_deposit_amount"
                    value={bonusSettings.min_deposit_amount}
                    onChange={(e) =>
                      handleBonusChange("min_deposit_amount", e.target.value)
                    }
                    placeholder="100"
                    min="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="wagering_requirements">
                    Wagering Requirements
                  </Label>
                  <Input
                    id="wagering_requirements"
                    value={bonusSettings.wagering_requirements}
                    onChange={(e) =>
                      handleBonusChange("wagering_requirements", e.target.value)
                    }
                    placeholder="30x bonus amount"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="terms_conditions">Terms & Conditions</Label>
                <Textarea
                  id="terms_conditions"
                  value={bonusSettings.terms_conditions}
                  onChange={(e) =>
                    handleBonusChange("terms_conditions", e.target.value)
                  }
                  placeholder="Enter terms and conditions..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Promotion Image */}
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle>Promotion Image</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {promotion.promotion_image && !promotionImage && (
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground mb-2">
                    Current image:
                  </p>
                  <img
                    src={
                      promotion.promotion_image.startsWith("http")
                        ? promotion.promotion_image
                        : `${API_URL}/${promotion.promotion_image}`
                    }
                    alt="Current promotion"
                    className="w-48 h-32 object-cover rounded border"
                  />
                </div>
              )}
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
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
                  <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-lg font-medium text-foreground mb-2">
                    {promotionImage
                      ? promotionImage.name
                      : "Upload Promotion Image"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {promotionImage
                      ? "Click to change image"
                      : "Click to browse or drag and drop"}
                  </p>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/dashboard/promotions/view/${id}`)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={updatePromotion.isPending}
              className="flex items-center gap-2 gradient-primary"
            >
              <Save className="h-4 w-4" />
              {updatePromotion.isPending ? "Updating..." : "Update Promotion"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

"use client";

import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { usePromotion } from "../../lib/queries";
import {
  ArrowLeft,
  Edit,
  Gift,
  Calendar,
  Users,
  Settings,
  FileText,
  CreditCard,
} from "lucide-react";
import { API_URL } from "../../lib/api";

export default function ViewPromotionPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: promotion, isLoading, error } = usePromotion(id!);

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  if (error || !promotion) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Promotion Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The promotion you're looking for doesn't exist.
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
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/dashboard/promotions")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Promotion Details
            </h1>
          </div>
          <Button
            onClick={() => navigate(`/dashboard/promotions/edit/${id}`)}
            className="flex items-center gap-2 gradient-primary"
          >
            <Edit className="h-4 w-4" />
            Edit Promotion
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card className="glass-effect">
              <CardHeader className="flex flex-row items-center gap-2">
                <Gift className="h-5 w-5 text-primary" />
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Title (English)
                    </label>
                    <p className="text-lg font-semibold">
                      {promotion.title_en}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Title (Bangla)
                    </label>
                    <p className="text-lg font-semibold">
                      {promotion.title_bd || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Game Type
                    </label>
                    <Badge variant="outline" className="capitalize">
                      {promotion.game_type}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Status
                    </label>
                    <div>
                      <Badge
                        variant={
                          promotion.status === "Active"
                            ? "default"
                            : "secondary"
                        }
                        className={
                          promotion.status === "Active"
                            ? "bg-green-500 hover:bg-green-600"
                            : "bg-gray-500"
                        }
                      >
                        {promotion.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Descriptions */}
            <Card className="glass-effect">
              <CardHeader className="flex flex-row items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <CardTitle>Descriptions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    English Description
                  </label>
                  <p className="text-base whitespace-pre-wrap">
                    {promotion.description_en || "No description provided"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Bangla Description
                  </label>
                  <p className="text-base whitespace-pre-wrap">
                    {promotion.description_bd || "No description provided"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Payment Methods */}
            <Card className="glass-effect">
              <CardHeader className="flex flex-row items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                <CardTitle>Payment Methods</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {promotion.payment_methods &&
                  promotion.payment_methods.length > 0 ? (
                    promotion.payment_methods.map((method, index) => {
                      // Type guard: check if method is an object (PaymentMethod)
                      if (typeof method === "string") {
                        return (
                          <div
                            key={index}
                            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                          >
                            <p className="font-medium">{method}</p>
                          </div>
                        );
                      }

                      return (
                        <div
                          key={method._id || index}
                          className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                        >
                          {method.method_image && (
                            <img
                              src={
                                method.method_image.startsWith("http")
                                  ? method.method_image
                                  : `${API_URL}/${method.method_image}`
                              }
                              alt={method.method_name_en}
                              className="w-10 h-10 object-cover rounded"
                            />
                          )}
                          <div className="flex-1">
                            <p className="font-medium">
                              {method.method_name_en}
                            </p>
                            {method.method_name_bd && (
                              <p className="text-sm text-gray-600">
                                {method.method_name_bd}
                              </p>
                            )}
                          </div>
                          <Badge
                            variant={
                              method.status === "Active"
                                ? "default"
                                : "secondary"
                            }
                            className={
                              method.status === "Active"
                                ? "bg-green-500 hover:bg-green-600"
                                : "bg-gray-500"
                            }
                          >
                            {method.status}
                          </Badge>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-gray-500">No payment methods selected</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Bonus Settings */}
            {promotion.bonus_settings && (
              <Card className="glass-effect">
                <CardHeader className="flex flex-row items-center gap-2">
                  <Settings className="h-5 w-5 text-primary" />
                  <CardTitle>Bonus Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Bonus Type
                      </label>
                      <Badge variant="outline" className="capitalize">
                        {promotion.bonus_settings.bonus_type}
                      </Badge>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Bonus Value
                      </label>
                      <p className="text-lg font-semibold text-purple-700">
                        {promotion.bonus_settings.bonus_value}
                        {promotion.bonus_settings.bonus_type === "percentage"
                          ? "%"
                          : ""}
                      </p>
                    </div>
                    {promotion.bonus_settings.max_bonus_limit && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Maximum Bonus Limit
                        </label>
                        <p className="text-lg font-semibold text-purple-700">
                          {promotion.bonus_settings.max_bonus_limit}
                        </p>
                      </div>
                    )}
                    {promotion.bonus_settings.min_deposit_amount && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Minimum Deposit Amount
                        </label>
                        <p className="text-lg font-semibold text-purple-700">
                          {promotion.bonus_settings.min_deposit_amount}
                        </p>
                      </div>
                    )}
                  </div>

                  {promotion.bonus_settings.wagering_requirements && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Wagering Requirements
                      </label>
                      <p className="text-base">
                        {promotion.bonus_settings.wagering_requirements}
                      </p>
                    </div>
                  )}

                  {promotion.bonus_settings.terms_conditions && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Terms & Conditions
                      </label>
                      <p className="text-base whitespace-pre-wrap">
                        {promotion.bonus_settings.terms_conditions}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Promotion Image */}
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle>Promotion Image</CardTitle>
              </CardHeader>
              <CardContent>
                {promotion.promotion_image ? (
                  <img
                    src={
                      promotion.promotion_image.startsWith("http")
                        ? promotion.promotion_image
                        : `${API_URL}/${promotion.promotion_image}`
                    }
                    alt={promotion.title_en}
                    className="w-full h-48 object-cover rounded-lg border"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-100 rounded-lg border flex items-center justify-center">
                    <div className="text-center">
                      <Gift className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500 text-sm">No image uploaded</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Dates */}
            <Card className="glass-effect">
              <CardHeader className="flex flex-row items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <CardTitle>Dates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {promotion.start_date && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Start Date
                    </label>
                    <p className="text-sm">
                      {new Date(promotion.start_date).toLocaleDateString()}
                    </p>
                  </div>
                )}
                {promotion.end_date && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      End Date
                    </label>
                    <p className="text-sm">
                      {new Date(promotion.end_date).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Metadata */}
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle>Metadata</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Created
                  </label>
                  <p className="text-sm">
                    {new Date(promotion.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Updated
                  </label>
                  <p className="text-sm">
                    {new Date(promotion.updatedAt).toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

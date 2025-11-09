"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import {
  usePromotions,
  useDeletePromotion,
  useTogglePromotionStatus,
} from "../../lib/queries";
import { toast } from "sonner";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  ToggleLeft,
  ToggleRight,
  Gift,
  Calendar,
  Users,
} from "lucide-react";

export default function PromotionsListPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: promotions, isLoading } = usePromotions();
  const deletePromotion = useDeletePromotion();
  const toggleStatus = useTogglePromotionStatus();

  const filteredPromotions =
    promotions?.filter(
      (promotion) =>
        promotion.title_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (promotion.title_bd &&
          promotion.title_bd
            .toLowerCase()
            .includes(searchTerm.toLowerCase())) ||
        promotion.game_type.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await deletePromotion.mutateAsync(id);
        toast.success("Promotion deleted successfully!");
      } catch (error: unknown) {
        const errorMessage =
          (error as { response?: { data?: { message?: string } } })?.response
            ?.data?.message || "Failed to delete promotion";
        toast.error(errorMessage);
      }
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await toggleStatus.mutateAsync(id);
      toast.success("Status updated successfully!");
    } catch (error: unknown) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Failed to update status";
      toast.error(errorMessage);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6">
      <div className="container mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-3">
              <Gift className="h-8 w-8 text-purple-600" />
              Promotions
            </h1>
            <p className="text-gray-600 mt-2">
              Manage promotional campaigns and bonuses
            </p>
          </div>
          <Link to="/dashboard/deposit/add-promotion">
            <Button className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              <Plus className="h-4 w-4" />
              Add Promotion
            </Button>
          </Link>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search promotions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/80 backdrop-blur-sm border-white/20"
            />
          </div>
        </div>

        {/* Promotions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPromotions.map((promotion) => (
            <Card
              key={promotion._id}
              className="hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm border-white/20 overflow-hidden"
            >
              {/* Promotion Image */}
              {promotion.promotion_image && (
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={
                      promotion.promotion_image.startsWith("http")
                        ? promotion.promotion_image
                        : `http://localhost:8000/${promotion.promotion_image}`
                    }
                    alt={promotion.title_en}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute top-3 right-3">
                    <Badge
                      variant={
                        promotion.status === "Active" ? "default" : "secondary"
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
              )}

              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2">
                      {promotion.title_en}
                    </CardTitle>
                    {promotion.title_bd && (
                      <p className="text-sm text-gray-600 mt-1">
                        {promotion.title_bd}
                      </p>
                    )}
                  </div>
                  {!promotion.promotion_image && (
                    <Badge
                      variant={
                        promotion.status === "Active" ? "default" : "secondary"
                      }
                      className={
                        promotion.status === "Active"
                          ? "bg-green-500 hover:bg-green-600"
                          : "bg-gray-500"
                      }
                    >
                      {promotion.status}
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Description */}
                {promotion.description_en && (
                  <div>
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {promotion.description_en}
                    </p>
                  </div>
                )}

                {/* Game Type */}
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium text-gray-700">
                    Game Type:
                  </span>
                  <Badge variant="outline" className="text-xs capitalize">
                    {promotion.game_type}
                  </Badge>
                </div>

                {/* Payment Methods */}
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium text-gray-700">
                    Payment Methods:
                  </span>
                  <span className="text-sm text-gray-600">
                    {promotion.payment_methods?.length || 0} methods
                  </span>
                </div>

                {/* Bonus Settings */}
                {promotion.bonus_settings && (
                  <div className="bg-purple-50 rounded-lg p-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-purple-700">
                        {promotion.bonus_settings.bonus_type === "percentage"
                          ? "Bonus %"
                          : "Bonus Amount"}
                        :
                      </span>
                      <span className="font-bold text-purple-800">
                        {promotion.bonus_settings.bonus_value}
                        {promotion.bonus_settings.bonus_type === "percentage"
                          ? "%"
                          : ""}
                      </span>
                    </div>
                    {promotion.bonus_settings.max_bonus_limit && (
                      <div className="flex items-center justify-between text-sm mt-1">
                        <span className="text-purple-600">Max Limit:</span>
                        <span className="text-purple-700">
                          {promotion.bonus_settings.max_bonus_limit}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleStatus(promotion._id)}
                      disabled={toggleStatus.isPending}
                      className="flex items-center gap-1"
                    >
                      {promotion.status === "Active" ? (
                        <ToggleRight className="h-4 w-4 text-green-600" />
                      ) : (
                        <ToggleLeft className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>

                    <Link to={`/dashboard/promotions/edit/${promotion._id}`}>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleDelete(promotion._id, promotion.title_en)
                      }
                      disabled={deletePromotion.isPending}
                      className="text-red-600 hover:text-red-700 hover:border-red-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <Link to={`/dashboard/promotions/view/${promotion._id}`}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredPromotions.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 max-w-md mx-auto">
              <Gift className="h-16 w-16 text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No promotions found
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm
                  ? "No promotions match your search criteria."
                  : "Get started by creating your first promotion."}
              </p>
              {!searchTerm && (
                <Link to="/dashboard/deposit/add-promotion">
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Promotion
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

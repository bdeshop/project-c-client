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
import { API_URL } from "../../lib/api";
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
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="animate-fade-in">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent flex items-center gap-3">
              <Gift className="h-8 w-8 text-yellow-400" />
              Promotions
            </h1>
            <p className="text-gray-400 mt-2">
              Manage promotional campaigns and bonuses
            </p>
          </div>
          <Link to="/dashboard/deposit/add-promotion">
            <Button className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 font-semibold shadow-lg shadow-yellow-400/30 hover:shadow-yellow-400/50 transition-all duration-300 hover:scale-105">
              <Plus className="h-4 w-4" />
              Add Promotion
            </Button>
          </Link>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow-400 h-5 w-5" />
            <Input
              placeholder="Search promotions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 bg-gray-800/50 border-gray-700/50 focus:border-yellow-400 focus:ring-yellow-400 text-white placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Promotions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPromotions.map((promotion, index) => (
            <Card
              key={promotion._id}
              className="relative overflow-hidden border-0 bg-gray-800/50 hover:shadow-2xl hover:shadow-yellow-400/10 transition-all duration-300 hover:scale-105 group animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Decorative gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              {/* Decorative corner accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-400/10 to-yellow-500/10 rounded-full blur-3xl -translate-y-16 translate-x-16" />

              {/* Promotion Image */}
              {promotion.promotion_image && (
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={
                      promotion.promotion_image.startsWith("http")
                        ? promotion.promotion_image
                        : `${API_URL}/${promotion.promotion_image}`
                    }
                    alt={promotion.title_en}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* Gradient overlay on image */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <div className="absolute top-3 right-3">
                    <Badge
                      variant={
                        promotion.status === "Active" ? "default" : "secondary"
                      }
                      className={
                        promotion.status === "Active"
                          ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/50 animate-pulse"
                          : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                      }
                    >
                      {promotion.status}
                    </Badge>
                  </div>
                </div>
              )}

              <CardHeader className="pb-4 relative z-10">
                <div className="flex justify-between items-start gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-400/50 group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                      <Gift className="h-6 w-6 text-gray-900" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg font-bold text-white line-clamp-2">
                        {promotion.title_en}
                      </CardTitle>
                      {promotion.title_bd && (
                        <p className="text-sm text-yellow-400 font-medium mt-1 line-clamp-1">
                          {promotion.title_bd}
                        </p>
                      )}
                    </div>
                  </div>
                  {!promotion.promotion_image && (
                    <Badge
                      variant={
                        promotion.status === "Active" ? "default" : "secondary"
                      }
                      className={
                        promotion.status === "Active"
                          ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md shadow-green-500/50 animate-pulse"
                          : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                      }
                    >
                      {promotion.status}
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4 relative z-10">
                {/* Description */}
                {promotion.description_en && (
                  <div className="p-3 rounded-lg bg-gray-800/50 border border-gray-700/50">
                    <p className="text-sm text-gray-300 line-clamp-3">
                      {promotion.description_en}
                    </p>
                  </div>
                )}

                {/* Game Type */}
                <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-800/30">
                  <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar className="h-4 w-4 text-gray-900" />
                  </div>
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Game Type:
                  </span>
                  <Badge
                    variant="outline"
                    className="text-xs capitalize bg-gray-800/50 border-gray-600/50 text-yellow-400 font-semibold ml-auto"
                  >
                    {promotion.game_type}
                  </Badge>
                </div>

                {/* Payment Methods */}
                <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-800/30">
                  <div className="w-8 h-8 bg-gray-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Payment Methods:
                  </span>
                  <span className="text-sm font-bold text-yellow-400 ml-auto">
                    {promotion.payment_methods?.length || 0} methods
                  </span>
                </div>

                {/* Bonus Settings */}
                {promotion.bonus_settings && (
                  <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-950/30 dark:via-emerald-950/30 dark:to-teal-950/30 border-2 border-green-200 dark:border-green-800 shadow-md">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-green-700 dark:text-green-300 uppercase tracking-wide">
                        {promotion.bonus_settings.bonus_type === "percentage"
                          ? "Bonus Percentage"
                          : "Bonus Amount"}
                      </span>
                      <div className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full">
                        <span className="text-lg font-black text-white">
                          {promotion.bonus_settings.bonus_value}
                          {promotion.bonus_settings.bonus_type === "percentage"
                            ? "%"
                            : "৳"}
                        </span>
                      </div>
                    </div>
                    {promotion.bonus_settings.max_bonus_limit && (
                      <div className="flex items-center justify-between pt-2 border-t border-green-200 dark:border-green-800">
                        <span className="text-xs font-semibold text-green-600 dark:text-green-400">
                          Max Limit:
                        </span>
                        <span className="text-sm font-bold text-green-700 dark:text-green-300">
                          ৳{promotion.bonus_settings.max_bonus_limit}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-700/50">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleStatus(promotion._id)}
                      disabled={toggleStatus.isPending}
                      className="flex items-center gap-1 hover:bg-gray-700/50 border-gray-700/50 transition-all duration-300"
                    >
                      {promotion.status === "Active" ? (
                        <ToggleRight className="h-4 w-4 text-green-400" />
                      ) : (
                        <ToggleLeft className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>

                    <Link to={`/dashboard/promotions/edit/${promotion._id}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="hover:bg-gray-700/50 border-gray-700/50"
                      >
                        <Edit className="h-4 w-4 text-yellow-400" />
                      </Button>
                    </Link>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleDelete(promotion._id, promotion.title_en)
                      }
                      disabled={deletePromotion.isPending}
                      className="hover:bg-red-500/20 border-gray-700/50"
                    >
                      <Trash2 className="h-4 w-4 text-red-400" />
                    </Button>
                  </div>

                  <Link to={`/dashboard/promotions/view/${promotion._id}`}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-gray-700/50 transition-all duration-300"
                    >
                      <Eye className="h-4 w-4 text-yellow-400" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredPromotions.length === 0 && (
          <div className="text-center py-16">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-yellow-400/10 rounded-full blur-3xl" />
              <div className="relative w-24 h-24 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg border border-gray-700/50">
                <Gift className="h-12 w-12 text-yellow-400" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              No promotions found
            </h3>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              {searchTerm
                ? "No promotions match your search criteria. Try adjusting your search."
                : "Get started by creating your first promotional campaign."}
            </p>
            {!searchTerm && (
              <Link to="/dashboard/deposit/add-promotion">
                <Button className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 font-semibold shadow-lg shadow-yellow-400/30 transition-all duration-300 hover:scale-105">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Promotion
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

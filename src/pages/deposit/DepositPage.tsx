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
  usePaymentMethods,
  useDeletePaymentMethod,
  useTogglePaymentMethodStatus,
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
  Wallet,
} from "lucide-react";

export default function DepositPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: paymentMethods, isLoading } = usePaymentMethods();
  const deletePaymentMethod = useDeletePaymentMethod();
  const toggleStatus = useTogglePaymentMethodStatus();

  const filteredMethods =
    paymentMethods?.filter(
      (method) =>
        method.method_name_en
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        method.method_name_bd.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await deletePaymentMethod.mutateAsync(id);
        toast.success("Payment method deleted successfully!");
      } catch (error) {
        const errorMessage =
          (error as { response?: { data?: { message?: string } } })?.response
            ?.data?.message || "Failed to delete payment method";
        toast.error(errorMessage);
      }
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await toggleStatus.mutateAsync(id);
      toast.success("Status updated successfully!");
    } catch (error) {
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
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="animate-fade-in">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-3">
              <Wallet className="h-8 w-8 text-purple-600" />
              Deposit Methods
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage payment methods for deposits
            </p>
          </div>
          <Link to="/dashboard/deposit/add-method">
            <Button className="flex items-center gap-2 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-purple-500/50 hover:shadow-purple-500/70 transition-all duration-300 hover:scale-105">
              <Plus className="h-4 w-4" />
              Add Deposit Method
            </Button>
          </Link>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 h-5 w-5" />
            <Input
              placeholder="Search payment methods..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 border-purple-200 dark:border-purple-800 focus:border-purple-500 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* Payment Methods Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMethods.map((method, index) => (
            <Card
              key={method._id}
              className="relative overflow-hidden border-0 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 dark:from-slate-900 dark:via-purple-950/30 dark:to-blue-950/30 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 hover:scale-105 group animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Decorative gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 via-blue-600/5 to-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Decorative corner accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-full blur-3xl -translate-y-16 translate-x-16" />

              <CardHeader className="pb-4 relative z-10">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/50 group-hover:scale-110 transition-transform duration-300">
                      <Wallet className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">
                        {method.method_name_en}
                      </CardTitle>
                      <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                        {method.method_name_bd}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={
                      method.status === "Active" ? "default" : "secondary"
                    }
                    className={
                      method.status === "Active"
                        ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md shadow-green-500/50 animate-pulse"
                        : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                    }
                  >
                    {method.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 relative z-10">
                <div className="p-3 rounded-lg bg-gradient-to-r from-purple-100/50 to-blue-100/50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200/50 dark:border-purple-800/50">
                  <p className="text-xs font-semibold text-purple-700 dark:text-purple-300 uppercase tracking-wide mb-1">
                    Agent Number
                  </p>
                  <p className="text-sm font-mono font-bold text-slate-900 dark:text-white">
                    {method.agent_wallet_number}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-2">
                    Gateways
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {method.gateways.map((gateway, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="text-xs bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 font-semibold"
                      >
                        {gateway}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2 rounded-lg bg-blue-50/50 dark:bg-blue-950/20">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {method.user_inputs.length}
                    </span>
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">
                    Input fields configured
                  </p>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-purple-200/50 dark:border-purple-800/50">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleStatus(method._id)}
                      disabled={toggleStatus.isPending}
                      className="flex items-center gap-1 hover:bg-purple-50 dark:hover:bg-purple-950 border-purple-200 dark:border-purple-800 hover:border-purple-400 transition-all duration-300"
                    >
                      {method.status === "Active" ? (
                        <ToggleRight className="h-4 w-4 text-green-600" />
                      ) : (
                        <ToggleLeft className="h-4 w-4 text-slate-400" />
                      )}
                    </Button>

                    <Link to={`/dashboard/deposit/edit/${method._id}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="hover:bg-blue-50 dark:hover:bg-blue-950 border-blue-200 dark:border-blue-800 hover:border-blue-400 transition-all duration-300"
                      >
                        <Edit className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </Button>
                    </Link>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleDelete(method._id, method.method_name_en)
                      }
                      disabled={deletePaymentMethod.isPending}
                      className="hover:bg-red-50 dark:hover:bg-red-950 border-red-200 dark:border-red-800 hover:border-red-400 transition-all duration-300"
                    >
                      <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
                    </Button>
                  </div>

                  <Link to={`/dashboard/deposit/view/${method._id}`}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-indigo-50 dark:hover:bg-indigo-950 transition-all duration-300"
                    >
                      <Eye className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredMethods.length === 0 && (
          <div className="text-center py-16">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full blur-3xl" />
              <div className="relative w-24 h-24 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Wallet className="h-12 w-12 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              No payment methods found
            </h3>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              {searchTerm
                ? "No methods match your search criteria. Try adjusting your search."
                : "Get started by adding your first payment method to enable deposits."}
            </p>
            {!searchTerm && (
              <Link to="/dashboard/deposit/add-method">
                <Button className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-purple-500/50 hover:shadow-purple-500/70 transition-all duration-300 hover:scale-105">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Deposit Method
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

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
      } catch (error: any) {
        toast.error(
          error.response?.data?.message || "Failed to delete payment method"
        );
      }
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await toggleStatus.mutateAsync(id);
      toast.success("Status updated successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update status");
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
    <div className="container mx-auto p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Wallet className="h-6 w-6" />
            Deposit Methods
          </h1>
          <p className="text-gray-600 mt-1">
            Manage payment methods for deposits
          </p>
        </div>
        <Link to="/dashboard/deposit/add-method">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Deposit Method
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search payment methods..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Payment Methods Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMethods.map((method) => (
          <Card key={method._id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">
                    {method.method_name_en}
                  </CardTitle>
                  <p className="text-sm text-gray-600">
                    {method.method_name_bd}
                  </p>
                </div>
                <Badge
                  variant={method.status === "Active" ? "default" : "secondary"}
                  className={
                    method.status === "Active"
                      ? "bg-green-100 text-green-800"
                      : ""
                  }
                >
                  {method.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Agent Number:
                </p>
                <p className="text-sm">{method.agent_wallet_number}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700">Gateways:</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {method.gateways.map((gateway, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {gateway}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700">
                  User Inputs:
                </p>
                <p className="text-sm text-gray-600">
                  {method.user_inputs.length} fields configured
                </p>
              </div>

              <div className="flex justify-between items-center pt-2 border-t">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleStatus(method._id)}
                    disabled={toggleStatus.isPending}
                    className="flex items-center gap-1"
                  >
                    {method.status === "Active" ? (
                      <ToggleRight className="h-4 w-4 text-green-600" />
                    ) : (
                      <ToggleLeft className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>

                  <Link to={`/dashboard/deposit/edit/${method._id}`}>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleDelete(method._id, method.method_name_en)
                    }
                    disabled={deletePaymentMethod.isPending}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <Link to={`/dashboard/deposit/view/${method._id}`}>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMethods.length === 0 && (
        <div className="text-center py-12">
          <Wallet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No payment methods found
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm
              ? "No methods match your search criteria."
              : "Get started by adding your first payment method."}
          </p>
          {!searchTerm && (
            <Link to="/dashboard/deposit/add-method">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Deposit Method
              </Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

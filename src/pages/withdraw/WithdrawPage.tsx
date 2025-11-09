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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import {
  useWithdrawMethods,
  useDeleteWithdrawMethod,
  useToggleWithdrawMethodStatus,
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
  TrendingUp,
  MoreHorizontal,
} from "lucide-react";
import { API_URL } from "../../lib/api";

export default function WithdrawPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: withdrawMethodsData, isLoading } = useWithdrawMethods();
  const deleteWithdrawMethod = useDeleteWithdrawMethod();
  const toggleStatus = useToggleWithdrawMethodStatus();

  const withdrawMethods = withdrawMethodsData?.data?.data || [];

  const filteredMethods =
    withdrawMethods.filter(
      (method) =>
        method.method_name_en
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        method.method_name_bd.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await deleteWithdrawMethod.mutateAsync(id);
        toast.success("Withdraw method deleted successfully!");
      } catch (error) {
        const errorMessage =
          (error as { response?: { data?: { message?: string } } })?.response
            ?.data?.message || "Failed to delete withdraw method";
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
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-primary" />
              Withdraw Methods
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage withdrawal methods for users
            </p>
          </div>
          <Link to="/dashboard/withdraw/add-method">
            <Button className="flex items-center gap-2 gradient-primary">
              <Plus className="h-4 w-4" />
              Add Withdraw Method
            </Button>
          </Link>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search withdraw methods..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Withdraw Methods Table */}
        <Card className="glass-effect">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Withdraw Methods ({filteredMethods.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Method</TableHead>
                    <TableHead>Min/Max</TableHead>
                    <TableHead>Fee</TableHead>
                    <TableHead>Processing Time</TableHead>
                    <TableHead>User Fields</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMethods.map((method) => (
                    <TableRow key={method._id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {method.method_image && (
                            <img
                              src={`${API_URL}/${method.method_image}`}
                              alt={method.method_name_en}
                              className="w-10 h-10 object-cover rounded"
                            />
                          )}
                          <div>
                            <p className="font-medium">
                              {method.method_name_en}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {method.method_name_bd}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p className="font-medium">
                            ৳{method.min_withdrawal.toLocaleString()}
                          </p>
                          <p className="text-muted-foreground">
                            to ৳{method.max_withdrawal.toLocaleString()}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {method.withdrawal_fee}
                          {method.fee_type === "percentage" ? "%" : " ৳"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {method.processing_time}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {method.user_inputs.length} fields
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            method.status === "Active" ? "default" : "secondary"
                          }
                          className={
                            method.status === "Active"
                              ? "bg-green-500 hover:bg-green-600"
                              : ""
                          }
                        >
                          {method.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link
                                to={`/dashboard/withdraw/view/${method._id}`}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link
                                to={`/dashboard/withdraw/edit/${method._id}`}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleToggleStatus(method._id)}
                            >
                              {method.status === "Active" ? (
                                <ToggleLeft className="h-4 w-4 mr-2" />
                              ) : (
                                <ToggleRight className="h-4 w-4 mr-2" />
                              )}
                              {method.status === "Active"
                                ? "Deactivate"
                                : "Activate"}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleDelete(method._id, method.method_name_en)
                              }
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {filteredMethods.length === 0 && (
          <div className="text-center py-12">
            <div className="glass-effect rounded-2xl p-8 max-w-md mx-auto">
              <TrendingUp className="h-16 w-16 text-primary/60 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No withdraw methods found
              </h3>
              <p className="text-muted-foreground mb-6">
                {searchTerm
                  ? "No methods match your search criteria."
                  : "Get started by adding your first withdraw method."}
              </p>
              {!searchTerm && (
                <Link to="/dashboard/withdraw/add-method">
                  <Button className="gradient-primary">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Withdraw Method
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

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
import { useTransaction, useUpdateTransactionStatus } from "../../lib/queries";
import { toast } from "sonner";
import {
  ArrowLeft,
  Edit,
  TrendingDown,
  Wallet,
  User,
  Calendar,
  FileText,
  Hash,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
} from "lucide-react";

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Completed":
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    case "Failed":
      return <XCircle className="h-5 w-5 text-red-600" />;
    case "Cancelled":
      return <XCircle className="h-5 w-5 text-gray-600" />;
    default:
      return <Clock className="h-5 w-5 text-yellow-600" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Completed":
      return "bg-green-500 hover:bg-green-600";
    case "Failed":
      return "bg-red-500 hover:bg-red-600";
    case "Cancelled":
      return "bg-gray-500 hover:bg-gray-600";
    default:
      return "bg-yellow-500 hover:bg-yellow-600";
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case "Deposit":
      return "bg-green-100 text-green-800";
    case "Withdrawal":
      return "bg-red-100 text-red-800";
    case "Transfer":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function ViewTransactionPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: transaction, isLoading, error } = useTransaction(id!);
  const updateStatus = useUpdateTransactionStatus();

  const handleStatusUpdate = async (status: string) => {
    try {
      await updateStatus.mutateAsync({ id: id!, status: status as any });
      toast.success("Transaction status updated successfully!");
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

  if (error || !transaction?.data?.data) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Transaction Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The transaction you're looking for doesn't exist.
          </p>
          <Button onClick={() => navigate("/dashboard/transactions")}>
            Back to Transactions
          </Button>
        </div>
      </div>
    );
  }

  const transactionData = transaction.data.data;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/dashboard/transactions")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Transaction Details
            </h1>
          </div>
          <div className="flex gap-2">
            {transactionData.status === "Pending" && (
              <>
                <Button
                  onClick={() => handleStatusUpdate("Completed")}
                  disabled={updateStatus.isPending}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark Completed
                </Button>
                <Button
                  onClick={() => handleStatusUpdate("Failed")}
                  disabled={updateStatus.isPending}
                  variant="destructive"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Mark Failed
                </Button>
              </>
            )}
            <Button
              onClick={() => navigate(`/dashboard/transactions/edit/${id}`)}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              <Edit className="h-4 w-4" />
              Edit Transaction
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card className="bg-white/80 backdrop-blur-sm border-white/20">
              <CardHeader className="flex flex-row items-center gap-2">
                <TrendingDown className="h-5 w-5 text-blue-600" />
                <CardTitle>Transaction Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Transaction ID
                    </label>
                    <p className="text-lg font-semibold font-mono">
                      {transactionData.transaction_id}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Amount
                    </label>
                    <p className="text-2xl font-bold text-green-600">
                      ৳{transactionData.amount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Wallet Provider
                    </label>
                    <Badge variant="outline" className="text-base capitalize">
                      {transactionData.wallet_provider}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Wallet Number
                    </label>
                    <p className="text-lg font-semibold font-mono">
                      {transactionData.wallet_number}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Transaction Type
                    </label>
                    <Badge
                      className={getTypeColor(transactionData.transaction_type)}
                    >
                      {transactionData.transaction_type}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Status
                    </label>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(transactionData.status)}
                      <Badge
                        variant="default"
                        className={getStatusColor(transactionData.status)}
                      >
                        {transactionData.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                {transactionData.reference_number && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Reference Number
                    </label>
                    <p className="text-lg font-semibold font-mono">
                      {transactionData.reference_number}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Description */}
            {transactionData.description && (
              <Card className="bg-white/80 backdrop-blur-sm border-white/20">
                <CardHeader className="flex flex-row items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-base whitespace-pre-wrap">
                    {transactionData.description}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* User Information */}
            {transactionData.user_id && (
              <Card className="bg-white/80 backdrop-blur-sm border-white/20">
                <CardHeader className="flex flex-row items-center gap-2">
                  <User className="h-5 w-5 text-blue-600" />
                  <CardTitle>User Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      User ID
                    </label>
                    <p className="text-base font-mono">
                      {transactionData.user_id}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Card */}
            <Card className="bg-white/80 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle>Current Status</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="flex flex-col items-center gap-3">
                  {getStatusIcon(transactionData.status)}
                  <Badge
                    variant="default"
                    className={`${getStatusColor(
                      transactionData.status
                    )} text-lg px-4 py-2`}
                  >
                    {transactionData.status}
                  </Badge>
                  {transactionData.status === "Pending" && (
                    <p className="text-sm text-gray-600 text-center">
                      This transaction is awaiting processing
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            {transactionData.status === "Pending" && (
              <Card className="bg-white/80 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    onClick={() => handleStatusUpdate("Completed")}
                    disabled={updateStatus.isPending}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark as Completed
                  </Button>
                  <Button
                    onClick={() => handleStatusUpdate("Failed")}
                    disabled={updateStatus.isPending}
                    variant="destructive"
                    className="w-full"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Mark as Failed
                  </Button>
                  <Button
                    onClick={() => handleStatusUpdate("Cancelled")}
                    disabled={updateStatus.isPending}
                    variant="outline"
                    className="w-full"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Cancel Transaction
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Timestamps */}
            <Card className="bg-white/80 backdrop-blur-sm border-white/20">
              <CardHeader className="flex flex-row items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                <CardTitle>Timestamps</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Created
                  </label>
                  <p className="text-sm">
                    {new Date(transactionData.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Last Updated
                  </label>
                  <p className="text-sm">
                    {new Date(transactionData.updatedAt).toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Transaction Hash */}
            <Card className="bg-white/80 backdrop-blur-sm border-white/20">
              <CardHeader className="flex flex-row items-center gap-2">
                <Hash className="h-5 w-5 text-blue-600" />
                <CardTitle>Transaction Hash</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs font-mono bg-gray-100 p-2 rounded break-all">
                  {transactionData._id}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

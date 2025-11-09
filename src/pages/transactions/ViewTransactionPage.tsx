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
      await updateStatus.mutateAsync({
        id: id!,
        status: status as "Pending" | "Completed" | "Failed" | "Cancelled",
      });
      toast.success("Transaction status updated successfully!");
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

  if (error || !transaction?.data?.data) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Transaction Not Found
          </h2>
          <p className="text-muted-foreground mb-4">
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
    <div className="min-h-screen bg-background p-6">
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
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
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
              className="flex items-center gap-2 gradient-primary"
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
            <Card className="glass-effect">
              <CardHeader className="flex flex-row items-center gap-2">
                <TrendingDown className="h-5 w-5 text-primary" />
                <CardTitle>Transaction Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Transaction ID
                    </label>
                    <p className="text-lg font-semibold font-mono">
                      {transactionData.transaction_id}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Amount
                    </label>
                    <p className="text-2xl font-bold text-green-600">
                      ৳{transactionData.amount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Wallet Provider
                    </label>
                    <Badge variant="outline" className="text-base capitalize">
                      {transactionData.wallet_provider}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Wallet Number
                    </label>
                    <p className="text-lg font-semibold font-mono">
                      {transactionData.wallet_number}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Transaction Type
                    </label>
                    <Badge
                      className={getTypeColor(transactionData.transaction_type)}
                    >
                      {transactionData.transaction_type}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
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
                    <label className="text-sm font-medium text-muted-foreground">
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
              <Card className="glass-effect">
                <CardHeader className="flex flex-row items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
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
              <Card className="glass-effect">
                <CardHeader className="flex flex-row items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  <CardTitle>User Information</CardTitle>
                </CardHeader>
                <CardContent>
                  {typeof transactionData.user_id === "object" ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-lg">
                            {transactionData.user_id.username}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {transactionData.user_id.email}
                          </p>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          User ID
                        </label>
                        <p className="text-sm font-mono bg-muted p-2 rounded mt-1">
                          {transactionData.user_id._id}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        User ID
                      </label>
                      <p className="text-base font-mono">
                        {transactionData.user_id}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Card */}
            <Card className="glass-effect">
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
                    <p className="text-sm text-muted-foreground text-center">
                      This transaction is awaiting processing
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            {transactionData.status === "Pending" && (
              <Card className="glass-effect">
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
            <Card className="glass-effect">
              <CardHeader className="flex flex-row items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <CardTitle>Timestamps</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Created
                  </label>
                  <p className="text-sm">
                    {new Date(transactionData.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Last Updated
                  </label>
                  <p className="text-sm">
                    {new Date(transactionData.updatedAt).toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Transaction Hash */}
            <Card className="glass-effect">
              <CardHeader className="flex flex-row items-center gap-2">
                <Hash className="h-5 w-5 text-primary" />
                <CardTitle>Transaction Hash</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs font-mono bg-muted p-2 rounded break-all">
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

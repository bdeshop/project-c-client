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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  useTransactions,
  useDeleteTransaction,
  useUpdateTransactionStatus,
  useWithdrawalRequests,
} from "../../lib/queries";
import { toast } from "sonner";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Filter,
  TrendingDown,
  Wallet,
  ArrowUpDown,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  User,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";

const WALLET_PROVIDERS = ["bKash", "Nagad", "Rocket", "Upay", "SureCash"];
const TRANSACTION_TYPES = ["Deposit", "Withdrawal", "Transfer"];
const STATUSES = ["Pending", "Completed", "Failed", "Cancelled"];

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Completed":
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    case "Failed":
      return <XCircle className="h-4 w-4 text-red-600" />;
    case "Cancelled":
      return <XCircle className="h-4 w-4 text-gray-600" />;
    default:
      return <Clock className="h-4 w-4 text-yellow-600" />;
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

export default function TransactionsPage() {
  const [activeTab, setActiveTab] = useState<"deposit" | "withdraw">("deposit");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [providerFilter, setProviderFilter] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  const { data: transactionsData, isLoading } = useTransactions({
    page: currentPage,
    limit: pageSize,
    search: searchTerm || undefined,
    status: statusFilter || undefined,
    wallet_provider: providerFilter || undefined,
    transaction_type: activeTab === "deposit" ? "Deposit" : "Withdrawal",
  });

  // Fetch withdrawal requests when withdraw tab is active
  const { data: withdrawalRequestsData, isLoading: isLoadingWithdrawals } =
    useWithdrawalRequests({
      status: statusFilter || undefined,
      page: currentPage,
      limit: pageSize,
    });

  const deleteTransaction = useDeleteTransaction();
  const updateStatus = useUpdateTransactionStatus();

  // Use withdrawal requests data when withdraw tab is active
  const transactions =
    activeTab === "withdraw"
      ? withdrawalRequestsData?.data?.data || []
      : transactionsData?.data?.data || [];
  const totalPages =
    activeTab === "withdraw"
      ? withdrawalRequestsData?.data?.totalPages || 1
      : transactionsData?.data?.totalPages || 1;
  const total =
    activeTab === "withdraw"
      ? withdrawalRequestsData?.data?.total || 0
      : transactionsData?.data?.total || 0;

  const handleDelete = async (id: string, transactionId: string) => {
    if (
      window.confirm(
        `Are you sure you want to delete transaction "${transactionId}"?`
      )
    ) {
      try {
        await deleteTransaction.mutateAsync(id);
        toast.success("Transaction deleted successfully!");
      } catch (error) {
        const errorMessage =
          error instanceof Error && "response" in error
            ? (error as { response?: { data?: { message?: string } } }).response
                ?.data?.message
            : "Failed to delete transaction";
        toast.error(errorMessage || "Failed to delete transaction");
      }
    }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await updateStatus.mutateAsync({
        id,
        status: status as "Pending" | "Completed" | "Failed" | "Cancelled",
      });
      toast.success("Transaction status updated successfully!");
    } catch (error) {
      const errorMessage =
        error instanceof Error && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response
              ?.data?.message
          : "Failed to update status";
      toast.error(errorMessage || "Failed to update status");
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setProviderFilter("");
    setTypeFilter("");
    setCurrentPage(1);
  };

  // Log data based on active tab
  console.log("transactionsData", transactionsData);
  console.log("withdrawalRequestsData", withdrawalRequestsData);

  if (isLoading || (activeTab === "withdraw" && isLoadingWithdrawals)) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg p-6">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-4xl font-bold gradient-primary bg-clip-text text-transparent flex items-center gap-3">
              <TrendingDown className="h-8 w-8 text-primary" />
              Transactions
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage financial transactions and wallet operations
            </p>
          </div>
          <Link to="/dashboard/transactions/create">
            <Button className="flex items-center gap-2 gradient-primary hover:opacity-90">
              <Plus className="h-4 w-4" />
              Add Transaction
            </Button>
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={activeTab === "deposit" ? "default" : "outline"}
            onClick={() => {
              setActiveTab("deposit");
              setCurrentPage(1);
            }}
            className={activeTab === "deposit" ? "gradient-primary" : ""}
          >
            <Wallet className="h-4 w-4 mr-2" />
            Deposit Transactions
          </Button>
          <Button
            variant={activeTab === "withdraw" ? "default" : "outline"}
            onClick={() => {
              setActiveTab("withdraw");
              setCurrentPage(1);
            }}
            className={activeTab === "withdraw" ? "gradient-primary" : ""}
          >
            <TrendingDown className="h-4 w-4 mr-2" />
            Withdraw Transactions
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-6 glass-effect">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select
                value={statusFilter || undefined}
                onValueChange={(value) => setStatusFilter(value || "")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={providerFilter || undefined}
                onValueChange={(value) => setProviderFilter(value || "")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Providers" />
                </SelectTrigger>
                <SelectContent>
                  {WALLET_PROVIDERS.map((provider) => (
                    <SelectItem key={provider} value={provider}>
                      {provider}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Transactions Table */}
        <Card className="glass-effect">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                {activeTab === "deposit" ? (
                  <Wallet className="h-5 w-5" />
                ) : (
                  <TrendingDown className="h-5 w-5" />
                )}
                {activeTab === "deposit" ? "Deposit" : "Withdraw"} Transactions
                ({total})
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>Wallet Number</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => {
                    const user =
                      typeof transaction.user_id === "object"
                        ? transaction.user_id
                        : null;

                    return (
                      <TableRow key={transaction._id}>
                        <TableCell className="font-medium">
                          {transaction.transaction_id}
                        </TableCell>
                        <TableCell>
                          {user ? (
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                <User className="h-4 w-4 text-primary" />
                              </div>
                              <div className="flex flex-col">
                                <span className="font-medium text-sm">
                                  {user.username || user.name}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {user.email}
                                </span>
                                {user.balance !== undefined && (
                                  <span className="text-xs text-primary font-medium">
                                    Balance: ৳{user.balance}
                                  </span>
                                )}
                              </div>
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-sm">
                              N/A
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <span className="font-semibold text-success">
                            ৳{transaction.amount.toLocaleString()}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {transaction.wallet_provider}
                          </Badge>
                        </TableCell>
                        <TableCell>{transaction.wallet_number}</TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={
                              transaction.transaction_type === "Deposit"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                            }
                          >
                            {transaction.transaction_type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(transaction.status)}
                            <Badge
                              variant="default"
                              className={getStatusColor(transaction.status)}
                            >
                              {transaction.status}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-sm">
                              {new Date(
                                transaction.createdAt
                              ).toLocaleDateString()}
                            </span>
                            {transaction.reference_number && (
                              <span className="text-xs text-muted-foreground">
                                Ref: {transaction.reference_number}
                              </span>
                            )}
                          </div>
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
                                  to={`/dashboard/transactions/view/${transaction._id}`}
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </Link>
                              </DropdownMenuItem>
                              {activeTab === "deposit" && (
                                <DropdownMenuItem asChild>
                                  <Link
                                    to={`/dashboard/transactions/edit/${transaction._id}`}
                                  >
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                  </Link>
                                </DropdownMenuItem>
                              )}
                              {transaction.status === "Pending" && (
                                <>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleStatusUpdate(
                                        transaction._id,
                                        "Completed"
                                      )
                                    }
                                  >
                                    <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                                    {activeTab === "withdraw"
                                      ? "Approve & Complete"
                                      : "Mark Completed"}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleStatusUpdate(
                                        transaction._id,
                                        "Failed"
                                      )
                                    }
                                  >
                                    <XCircle className="h-4 w-4 mr-2 text-red-600" />
                                    {activeTab === "withdraw"
                                      ? "Reject"
                                      : "Mark Failed"}
                                  </DropdownMenuItem>
                                </>
                              )}
                              <DropdownMenuItem
                                onClick={() =>
                                  handleDelete(
                                    transaction._id,
                                    transaction.transaction_id
                                  )
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
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Empty State */}
        {transactions.length === 0 && (
          <div className="text-center py-12">
            <div className="glass-effect rounded-2xl p-8 max-w-md mx-auto">
              <TrendingDown className="h-16 w-16 text-primary/60 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No {activeTab} transactions found
              </h3>
              <p className="text-muted-foreground mb-6">
                {searchTerm || statusFilter || providerFilter
                  ? `No ${activeTab} transactions match your search criteria.`
                  : `No ${activeTab} transactions yet.`}
              </p>
              {!searchTerm && !statusFilter && !providerFilter && (
                <Link to="/dashboard/transactions/create">
                  <Button className="gradient-primary hover:opacity-90">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Transaction
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

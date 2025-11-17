import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { useTransactionCharts, useUserProfile } from "../lib/queries";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";

export function AnalyticsChart() {
  const { data: transactionData, isLoading } = useTransactionCharts(7);
  const { data: userProfile } = useUserProfile();
  const isAdmin = userProfile?.user?.role === "admin";

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transaction Analytics</CardTitle>
          <CardDescription>Last 7 days transaction overview</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate totals
  const depositTotal =
    transactionData?.typeDistribution.find((t) => t._id === "Deposit")
      ?.totalAmount || 0;
  const withdrawalTotal =
    transactionData?.typeDistribution.find((t) => t._id === "Withdrawal")
      ?.totalAmount || 0;
  const completedCount =
    transactionData?.statusDistribution.find((s) => s._id === "Completed")
      ?.count || 0;
  const pendingCount =
    transactionData?.statusDistribution.find((s) => s._id === "Pending")
      ?.count || 0;
  const failedCount =
    transactionData?.statusDistribution.find((s) => s._id === "Failed")
      ?.count || 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction Analytics</CardTitle>
        <CardDescription>Last 7 days transaction overview</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Transaction Type Distribution */}
        <div>
          <h3 className="text-sm font-semibold mb-3">Transaction Types</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-green-700 dark:text-green-300">
                  Deposits
                </span>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                ৳{depositTotal.toLocaleString()}
              </p>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                {transactionData?.typeDistribution.find(
                  (t) => t._id === "Deposit"
                )?.count || 0}{" "}
                transactions
              </p>
            </div>

            <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                  Withdrawals
                </span>
                <TrendingDown className="h-4 w-4 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                ৳{withdrawalTotal.toLocaleString()}
              </p>
              <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                {transactionData?.typeDistribution.find(
                  (t) => t._id === "Withdrawal"
                )?.count || 0}{" "}
                transactions
              </p>
            </div>
          </div>
        </div>

        {/* Status Distribution */}
        <div>
          <h3 className="text-sm font-semibold mb-3">Transaction Status</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 text-center">
              <Activity className="h-5 w-5 text-blue-600 mx-auto mb-1" />
              <p className="text-lg font-bold text-blue-900 dark:text-blue-100">
                {completedCount}
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-400">
                Completed
              </p>
            </div>

            <div className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 text-center">
              <Activity className="h-5 w-5 text-yellow-600 mx-auto mb-1" />
              <p className="text-lg font-bold text-yellow-900 dark:text-yellow-100">
                {pendingCount}
              </p>
              <p className="text-xs text-yellow-600 dark:text-yellow-400">
                Pending
              </p>
            </div>

            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-center">
              <Activity className="h-5 w-5 text-red-600 mx-auto mb-1" />
              <p className="text-lg font-bold text-red-900 dark:text-red-100">
                {failedCount}
              </p>
              <p className="text-xs text-red-600 dark:text-red-400">Failed</p>
            </div>
          </div>
        </div>

        {/* Net Revenue (Admin only) */}
        {isAdmin && (
          <div className="p-4 rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 border border-indigo-200 dark:border-indigo-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
                  Net Revenue (7 days)
                </p>
                <p className="text-3xl font-bold text-indigo-900 dark:text-indigo-100 mt-1">
                  ৳{(depositTotal - withdrawalTotal).toLocaleString()}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-indigo-600" />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

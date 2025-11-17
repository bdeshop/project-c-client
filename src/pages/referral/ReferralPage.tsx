import { useState } from "react";
import { Button } from "../../components/ui/button";
import {
  useReferralAnalytics,
  useReferralTransactions,
  useReferralUsers,
  useReferralSettings,
  ReferralSettings,
} from "../../lib/queries";
import {
  useUpdateReferralTransactionStatus,
  useUpdateReferralSettings,
} from "../../lib/mutations";
import { OverviewTab } from "./components/OverviewTab";
import { UsersTab } from "./components/UsersTab";
import { TransactionsTab } from "./components/TransactionsTab";
import { SettingsTab } from "./components/SettingsTab";

export function ReferralPage() {
  const [activeTab, setActiveTab] = useState<
    "overview" | "users" | "transactions" | "settings"
  >("overview");

  // TanStack Query hooks
  const {
    data: analytics,
    isLoading: analyticsLoading,
    error: analyticsError,
  } = useReferralAnalytics({
    enabled: activeTab === "overview",
  });

  const {
    data: transactions,
    isLoading: transactionsLoading,
    error: transactionsError,
  } = useReferralTransactions({
    enabled: activeTab === "transactions",
  });

  const {
    data: users,
    isLoading: usersLoading,
    error: usersError,
  } = useReferralUsers(
    { limit: 100 }, // Fetch more users
    {
      enabled: activeTab === "users",
    }
  );

  const {
    data: settings,
    isLoading: settingsLoading,
    error: settingsError,
  } = useReferralSettings({
    enabled: activeTab === "settings",
  });

  // Mutations
  const updateTransactionStatusMutation = useUpdateReferralTransactionStatus();
  const updateSettingsMutation = useUpdateReferralSettings();

  // Determine error state based on active tab
  const error =
    (activeTab === "overview" && analyticsError?.message) ||
    (activeTab === "transactions" && transactionsError?.message) ||
    (activeTab === "users" && usersError?.message) ||
    (activeTab === "settings" && settingsError?.message) ||
    updateTransactionStatusMutation.error?.message ||
    updateSettingsMutation.error?.message;

  const handleUpdateTransactionStatus = (
    transactionId: string,
    status: "approved" | "rejected" | "paid"
  ) => {
    updateTransactionStatusMutation.mutate({ transactionId, status });
  };

  const handleUpdateSettings = (newSettings: ReferralSettings) => {
    updateSettingsMutation.mutate(newSettings);
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="animate-fade-in">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-3">
            <svg
              className="h-8 w-8 text-purple-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            Referral System
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage and monitor the referral program
          </p>
        </div>

        {error && (
          <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950/30 dark:to-pink-950/30 border-2 border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 px-6 py-4 rounded-xl shadow-lg animate-fade-in">
            <div className="flex items-center gap-3">
              <svg
                className="h-5 w-5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-semibold">{error}</span>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2 p-2 bg-gradient-to-r from-purple-100/50 via-blue-100/50 to-indigo-100/50 dark:from-purple-950/30 dark:via-blue-950/30 dark:to-indigo-950/30 rounded-xl border border-purple-200 dark:border-purple-800">
          <Button
            variant={activeTab === "overview" ? "default" : "ghost"}
            onClick={() => setActiveTab("overview")}
            className={
              activeTab === "overview"
                ? "bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white shadow-lg shadow-purple-500/50 hover:shadow-purple-500/70 transition-all duration-300"
                : "hover:bg-purple-100 dark:hover:bg-purple-950 transition-all duration-300"
            }
          >
            <svg
              className="h-4 w-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            Overview
          </Button>
          <Button
            variant={activeTab === "users" ? "default" : "ghost"}
            onClick={() => setActiveTab("users")}
            className={
              activeTab === "users"
                ? "bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white shadow-lg shadow-purple-500/50 hover:shadow-purple-500/70 transition-all duration-300"
                : "hover:bg-purple-100 dark:hover:bg-purple-950 transition-all duration-300"
            }
          >
            <svg
              className="h-4 w-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            Users
          </Button>
          <Button
            variant={activeTab === "transactions" ? "default" : "ghost"}
            onClick={() => setActiveTab("transactions")}
            className={
              activeTab === "transactions"
                ? "bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white shadow-lg shadow-purple-500/50 hover:shadow-purple-500/70 transition-all duration-300"
                : "hover:bg-purple-100 dark:hover:bg-purple-950 transition-all duration-300"
            }
          >
            <svg
              className="h-4 w-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            Transactions
          </Button>
          <Button
            variant={activeTab === "settings" ? "default" : "ghost"}
            onClick={() => setActiveTab("settings")}
            className={
              activeTab === "settings"
                ? "bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white shadow-lg shadow-purple-500/50 hover:shadow-purple-500/70 transition-all duration-300"
                : "hover:bg-purple-100 dark:hover:bg-purple-950 transition-all duration-300"
            }
          >
            <svg
              className="h-4 w-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Settings
          </Button>
        </div>

        {activeTab === "overview" && (
          <OverviewTab analytics={analytics} isLoading={analyticsLoading} />
        )}

        {activeTab === "users" && (
          <UsersTab users={users} isLoading={usersLoading} />
        )}

        {activeTab === "transactions" && (
          <TransactionsTab
            transactions={transactions}
            isLoading={transactionsLoading}
            onUpdateTransactionStatus={handleUpdateTransactionStatus}
            isUpdating={updateTransactionStatusMutation.isPending}
          />
        )}

        {activeTab === "settings" && (
          <SettingsTab
            settings={settings}
            isLoading={settingsLoading}
            onUpdateSettings={handleUpdateSettings}
            isUpdating={updateSettingsMutation.isPending}
          />
        )}
      </div>
    </div>
  );
}

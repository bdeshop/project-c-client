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
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Referral System Admin</h1>
          <p className="text-muted-foreground">
            Manage and monitor the referral program
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="flex space-x-4 border-b">
          <Button
            variant={activeTab === "overview" ? "default" : "ghost"}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </Button>
          <Button
            variant={activeTab === "users" ? "default" : "ghost"}
            onClick={() => setActiveTab("users")}
          >
            Users
          </Button>
          <Button
            variant={activeTab === "transactions" ? "default" : "ghost"}
            onClick={() => setActiveTab("transactions")}
          >
            Transactions
          </Button>
          <Button
            variant={activeTab === "settings" ? "default" : "ghost"}
            onClick={() => setActiveTab("settings")}
          >
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

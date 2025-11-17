import { DashboardStats } from "../components/dashboard-stats";
import { RecentActivity } from "../components/recent-activity";
import { QuickActions } from "../components/quick-actions";
import { AnalyticsChart } from "../components/analytics-chart";
import { useUserProfile, useAdminStats, useUserStats } from "../lib/queries";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { AlertCircle } from "lucide-react";

export function DashboardPage() {
  const { data: userProfile } = useUserProfile();
  const {
    data: adminStats,
    isLoading: adminLoading,
    error: adminError,
  } = useAdminStats();
  const {
    data: userStats,
    isLoading: userLoading,
    error: userError,
  } = useUserStats();

  // Determine if user is admin
  const isAdmin = userProfile?.user?.role === "admin";
  const statsError = isAdmin ? adminError : userError;

  console.log("📊 Dashboard Debug:", {
    userProfile,
    isAdmin,
    adminStats,
    userStats,
    adminError,
    userError,
  });

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Debug Info - Remove after debugging */}

        {/* Stats Grid */}
        <DashboardStats
          adminStats={adminStats}
          userStats={userStats}
          isAdmin={isAdmin}
          isLoading={isAdmin ? adminLoading : userLoading}
        />

        {/* Charts and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <AnalyticsChart />
          </div>
          <div>
            <RecentActivity />
          </div>
        </div>

        {/* Quick Actions */}
        <QuickActions />
      </div>
    </div>
  );
}

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
        {statsError && (
          <Card className="border-red-500 bg-red-50 dark:bg-red-950">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-300">
                <AlertCircle className="h-5 w-5" />
                API Error - Debug Info
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs overflow-auto">
                {JSON.stringify(
                  {
                    error: statsError,
                    isAdmin,
                    userRole: userProfile?.user?.role,
                    endpoint: isAdmin ? "/stats/admin" : "/stats/user",
                  },
                  null,
                  2
                )}
              </pre>
            </CardContent>
          </Card>
        )}

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

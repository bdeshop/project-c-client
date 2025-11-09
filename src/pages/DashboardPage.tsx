import { DashboardStats } from "../components/dashboard-stats";
import { RecentActivity } from "../components/recent-activity";
import { QuickActions } from "../components/quick-actions";
import { AnalyticsChart } from "../components/analytics-chart";
import { useUserProfile } from "../lib/queries";
import { Sparkles, TrendingUp } from "lucide-react";

export function DashboardPage() {
  const {
    data: userProfile,
    isLoading: profileLoading,
    error: profileError,
    refetch: refetchProfile,
  } = useUserProfile();

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Stats Grid */}
        <DashboardStats />

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

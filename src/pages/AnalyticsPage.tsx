import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Button } from "../components/ui/button";
import {
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { useAnalyticsData } from "../lib/queries";

export function AnalyticsPage() {
  const [period, setPeriod] = useState("7d");

  // Fetch analytics data using TanStack Query
  const {
    data: analyticsData,
    isLoading,
    error,
    refetch,
  } = useAnalyticsData(period);

  const handleRefresh = () => {
    refetch();
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Analytics
            </h1>
            <p className="text-muted-foreground">
              Track your platform's performance and user engagement
            </p>
          </div>

          <div className="flex gap-2">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">Last 24h</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <RefreshCw
                className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
              />
            </Button>
          </div>
        </div>

        {/* Error display */}
        {error && (
          <Card className="border-destructive">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-destructive">
                <AlertCircle className="w-4 h-4" />
                <span>
                  Failed to load analytics data. Please try again later.
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  className="ml-auto"
                >
                  Retry
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Loading state */}
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            <span>Loading analytics data...</span>
          </div>
        )}

        {/* Analytics Cards */}
        {!isLoading && !error && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Revenue
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {analyticsData?.chartData?.[0]?.revenue
                      ? `$${analyticsData.chartData[0].revenue.toLocaleString()}`
                      : "$45,231.89"}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +20.1% from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Users
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {analyticsData?.chartData?.[0]?.users
                      ? analyticsData.chartData[0].users.toLocaleString()
                      : "2,350"}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +180.1% from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Bets
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {analyticsData?.chartData?.[0]?.bets
                      ? analyticsData.chartData[0].bets.toLocaleString()
                      : "12,500"}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +19% from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Top Performers
                  </CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {analyticsData?.topPerformers?.[0]?.value
                      ? analyticsData.topPerformers[0].value.toLocaleString()
                      : "573"}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +201 since last period
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Top Performers */}
            {analyticsData?.topPerformers &&
              analyticsData.topPerformers.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Top Performers</CardTitle>
                    <CardDescription>
                      Best performing metrics for the selected period
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analyticsData.topPerformers.map((performer, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div>
                            <h4 className="font-medium">{performer.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              Change: {performer.change > 0 ? "+" : ""}
                              {performer.change}%
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-semibold">
                              {performer.value.toLocaleString()}
                            </div>
                            <div
                              className={`text-sm ${
                                performer.change > 0
                                  ? "text-green-600"
                                  : performer.change < 0
                                  ? "text-red-600"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {performer.change > 0
                                ? "↗"
                                : performer.change < 0
                                ? "↘"
                                : "→"}{" "}
                              {Math.abs(performer.change)}%
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

            {/* Chart Data Visualization */}
            {analyticsData?.chartData && analyticsData.chartData.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Performance Overview</CardTitle>
                  <CardDescription>
                    Revenue, users, and bets trend for the selected period
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.chartData
                      .slice(0, 7)
                      .map((dataPoint, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div className="font-medium">
                            {new Date(dataPoint.date).toLocaleDateString()}
                          </div>
                          <div className="flex gap-6 text-sm">
                            <div className="text-center">
                              <div className="text-muted-foreground">
                                Revenue
                              </div>
                              <div className="font-semibold">
                                ${dataPoint.revenue.toLocaleString()}
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-muted-foreground">Users</div>
                              <div className="font-semibold">
                                {dataPoint.users.toLocaleString()}
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-muted-foreground">Bets</div>
                              <div className="font-semibold">
                                {dataPoint.bets.toLocaleString()}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* Fallback when no data */}
        {!isLoading && !error && !analyticsData && (
          <Card>
            <CardHeader>
              <CardTitle>Analytics Dashboard</CardTitle>
              <CardDescription>
                No analytics data available for the selected period
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4" />
                  <p>No data available for this period</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

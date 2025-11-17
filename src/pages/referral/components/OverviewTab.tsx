import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { ReferralAnalytics } from "../../../lib/queries";

interface OverviewTabProps {
  analytics: ReferralAnalytics | undefined;
  isLoading: boolean;
}

export function OverviewTab({ analytics, isLoading }: OverviewTabProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="h-8 w-8 text-purple-600 dark:text-purple-400"
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
        </div>
        <p className="text-muted-foreground">No analytics data available</p>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Referrers",
      value: analytics.overview.totalReferrers,
      gradient: "from-purple-500 to-pink-500",
      bgGradient:
        "from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30",
    },
    {
      title: "Total Referrals",
      value: analytics.overview.totalReferrals,
      gradient: "from-blue-500 to-cyan-500",
      bgGradient:
        "from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30",
    },
    {
      title: "Commissions Paid",
      value: `$${analytics.overview.totalCommissionsPaid}`,
      gradient: "from-green-500 to-emerald-500",
      bgGradient:
        "from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30",
    },
    {
      title: "Pending",
      value: analytics.overview.pendingTransactions,
      gradient: "from-yellow-500 to-orange-500",
      bgGradient:
        "from-yellow-50 to-orange-50 dark:from-yellow-950/30 dark:to-orange-950/30",
    },
    {
      title: "Approved",
      value: analytics.overview.approvedTransactions,
      gradient: "from-indigo-500 to-purple-500",
      bgGradient:
        "from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30",
    },
    {
      title: "Paid",
      value: analytics.overview.paidTransactions,
      gradient: "from-teal-500 to-green-500",
      bgGradient:
        "from-teal-50 to-green-50 dark:from-teal-950/30 dark:to-green-950/30",
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((card, index) => (
          <Card
            key={card.title}
            className={`relative overflow-hidden border-0 bg-gradient-to-br ${card.bgGradient} hover:shadow-xl transition-all duration-300 hover:scale-105 group`}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent dark:from-white/5 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardHeader className="pb-2 relative z-10">
              <CardTitle className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                {card.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <p
                className={`text-3xl font-black bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent`}
              >
                {card.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 dark:from-slate-900 dark:via-purple-950/30 dark:to-blue-950/30 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <svg
                  className="h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              Time-Based Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 border border-purple-200 dark:border-purple-800">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Monthly Referrals:
                  </span>
                  <span className="text-2xl font-black bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    {analytics.timeBasedStats.monthlyReferrals}
                  </span>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 border border-blue-200 dark:border-blue-800">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Weekly Referrals:
                  </span>
                  <span className="text-2xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    {analytics.timeBasedStats.weeklyReferrals}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 dark:from-slate-900 dark:via-purple-950/30 dark:to-blue-950/30 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                <svg
                  className="h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
              </div>
              Top Referrers
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analytics.topReferrers.length > 0 ? (
              <div className="space-y-3">
                {analytics.topReferrers.map((referrer, index) => (
                  <div
                    key={referrer._id}
                    className="flex justify-between items-center p-3 rounded-xl bg-gradient-to-r from-slate-50 to-purple-50/50 dark:from-slate-800 dark:to-purple-900/20 border border-purple-100 dark:border-purple-900/50 hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center font-bold text-white">
                        #{index + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {referrer.name}
                        </p>
                        <p className="text-xs text-purple-600 dark:text-purple-400 font-mono">
                          {referrer.referralCode}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-900 dark:text-white">
                        {referrer.totalReferrals} referrals
                      </p>
                      <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                        ${referrer.totalEarnings}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No top referrers yet
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {analytics.recentTransactions.length > 0 && (
        <Card className="border-0 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 dark:from-slate-900 dark:via-purple-950/30 dark:to-blue-950/30 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
                <svg
                  className="h-5 w-5 text-white"
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
              </div>
              Recent Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.recentTransactions.map((transaction) => (
                <div
                  key={transaction._id}
                  className="flex justify-between items-center p-4 rounded-xl bg-gradient-to-r from-slate-50 to-purple-50/50 dark:from-slate-800 dark:to-purple-900/20 border border-purple-100 dark:border-purple-900/50 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="font-semibold text-slate-900 dark:text-white">
                        {transaction.referrer.name}
                      </p>
                      <svg
                        className="h-4 w-4 text-purple-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                      <p className="font-semibold text-slate-900 dark:text-white">
                        {transaction.referee.name}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded font-mono">
                        {transaction.referrer.referralCode}
                      </span>
                      <span className="text-muted-foreground">
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end gap-2">
                    <p className="text-xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      ${transaction.amount.toFixed(2)}
                    </p>
                    <Badge
                      variant={
                        transaction.status === "approved"
                          ? "default"
                          : transaction.status === "paid"
                          ? "secondary"
                          : transaction.status === "rejected"
                          ? "destructive"
                          : "outline"
                      }
                      className={
                        transaction.status === "approved"
                          ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
                          : transaction.status === "paid"
                          ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                          : ""
                      }
                    >
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="h-8 w-8 text-gray-900"
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
        <p className="text-gray-400">No analytics data available</p>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Referrers",
      value: analytics.overview.totalReferrers,
      gradient: "from-yellow-400 to-yellow-500",
      bgGradient:
        "from-yellow-500/10 to-yellow-600/10",
    },
    {
      title: "Total Referrals",
      value: analytics.overview.totalReferrals,
      gradient: "from-yellow-400 to-yellow-500",
      bgGradient:
        "from-yellow-500/10 to-yellow-600/10",
    },
    {
      title: "Commissions Paid",
      value: `$${analytics.overview.totalCommissionsPaid}`,
      gradient: "from-yellow-400 to-yellow-500",
      bgGradient:
        "from-yellow-500/10 to-yellow-600/10",
    },
    {
      title: "Pending",
      value: analytics.overview.pendingTransactions,
      gradient: "from-yellow-400 to-yellow-500",
      bgGradient:
        "from-yellow-500/10 to-yellow-600/10",
    },
    {
      title: "Approved",
      value: analytics.overview.approvedTransactions,
      gradient: "from-yellow-400 to-yellow-500",
      bgGradient:
        "from-yellow-500/10 to-yellow-600/10",
    },
    {
      title: "Paid",
      value: analytics.overview.paidTransactions,
      gradient: "from-yellow-400 to-yellow-500",
      bgGradient:
        "from-yellow-500/10 to-yellow-600/10",
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((card, index) => (
          <Card
            key={card.title}
            className={`relative overflow-hidden border border-gray-700/50 bg-gray-800/50 hover:shadow-xl hover:shadow-yellow-400/5 hover:border-yellow-400/20 transition-all duration-300 hover:scale-105 group`}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardHeader className="pb-2 relative z-10">
              <CardTitle className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
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
        <Card className="border border-gray-700/50 bg-gray-800/50 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center">
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
              <div className="p-4 rounded-xl bg-gray-700/30 border border-gray-700/50">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-300">
                    Monthly Referrals:
                  </span>
                  <span className="text-2xl font-black bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">
                    {analytics.timeBasedStats.monthlyReferrals}
                  </span>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-gray-700/30 border border-gray-700/50">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-300">
                    Weekly Referrals:
                  </span>
                  <span className="text-2xl font-black bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">
                    {analytics.timeBasedStats.weeklyReferrals}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-700/50 bg-gray-800/50 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center">
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
                    className="flex justify-between items-center p-3 rounded-xl bg-gray-800/30 border border-gray-700/50 hover:shadow-md hover:border-yellow-400/20 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center font-bold text-gray-900">
                        #{index + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-white">
                          {referrer.name}
                        </p>
                        <p className="text-xs text-yellow-400 font-mono">
                          {referrer.referralCode}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-white">
                        {referrer.totalReferrals} referrals
                      </p>
                      <p className="text-sm font-semibold text-yellow-400">
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
        <Card className="border border-gray-700/50 bg-gray-800/50 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center">
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
              {analytics.recentTransactions.map((transaction) => (                  <div
                    key={transaction._id}
                    className="flex justify-between items-center p-4 rounded-xl bg-gray-800/30 border border-gray-700/50 hover:shadow-md hover:border-yellow-400/20 transition-all duration-300"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <p className="font-semibold text-white">
                          {transaction.referrer.name}
                        </p>
                        <svg
                          className="h-4 w-4 text-yellow-400"
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
                        <p className="font-semibold text-white">
                          {transaction.referee.name}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="px-2 py-1 bg-gray-700/50 text-yellow-400 rounded font-mono">
                          {transaction.referrer.referralCode}
                        </span>
                        <span className="text-gray-400">
                          {new Date(transaction.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end gap-2">
                      <p className="text-xl font-black bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">
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
                            ? "bg-yellow-400 text-gray-900"
                            : transaction.status === "paid"
                            ? "bg-green-500/20 text-green-400"
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

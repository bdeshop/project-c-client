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
    return <div className="text-center py-8">Loading analytics...</div>;
  }

  if (!analytics) {
    return <div className="text-center py-8">No analytics data available</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Referrers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {analytics.overview.totalReferrers}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Referrals</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {analytics.overview.totalReferrals}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Commissions Paid</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              ${analytics.overview.totalCommissionsPaid}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {analytics.overview.pendingTransactions}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {analytics.overview.approvedTransactions}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Paid</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {analytics.overview.paidTransactions}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Time-Based Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Monthly Referrals:</span>
                <span className="font-bold">
                  {analytics.timeBasedStats.monthlyReferrals}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Weekly Referrals:</span>
                <span className="font-bold">
                  {analytics.timeBasedStats.weeklyReferrals}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Referrers</CardTitle>
          </CardHeader>
          <CardContent>
            {analytics.topReferrers.length > 0 ? (
              <div className="space-y-3">
                {analytics.topReferrers.map((referrer) => (
                  <div
                    key={referrer._id}
                    className="flex justify-between items-center p-2 border rounded"
                  >
                    <div>
                      <p className="font-medium">{referrer.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {referrer.referralCode}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">
                        {referrer.totalReferrals} referrals
                      </p>
                      <p className="text-sm text-muted-foreground">
                        ${referrer.totalEarnings}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No top referrers yet</p>
            )}
          </CardContent>
        </Card>
      </div>

      {analytics.recentTransactions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.recentTransactions.map((transaction) => (
                <div
                  key={transaction._id}
                  className="flex justify-between items-center p-3 border rounded"
                >
                  <div>
                    <p className="font-medium">
                      {transaction.referrer.name} → {transaction.referee.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Code: {transaction.referrer.referralCode}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">
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

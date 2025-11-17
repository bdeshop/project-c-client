import { Card, CardContent } from "./ui/card";
import {
  Users,
  UserCheck,
  CreditCard,
  Wallet,
  Clock,
  TrendingUp,
  DollarSign,
  UserPlus,
  Activity,
  CheckCircle,
  XCircle,
  Gift,
} from "lucide-react";
import { AdminStats, UserStats } from "../lib/queries";

interface DashboardStatsProps {
  adminStats?: AdminStats;
  userStats?: UserStats;
  isAdmin: boolean;
  isLoading: boolean;
}

export function DashboardStats({
  adminStats,
  userStats,
  isAdmin,
  isLoading,
}: DashboardStatsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <Card
            key={i}
            className="border-0 bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-700 animate-pulse"
          >
            <CardContent className="p-6">
              <div className="h-20"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Admin Stats Cards
  const adminStatCards = adminStats
    ? [
        // Row 1 - User Stats (Red/Dark gradient)
        {
          title: "TOTAL USERS",
          value: adminStats.users.total.toString(),
          icon: Users,
          gradient: "from-red-900 via-red-800 to-red-700",
        },
        {
          title: "ACTIVE USERS",
          value: adminStats.users.active.toString(),
          icon: UserCheck,
          gradient: "from-red-900 via-red-800 to-red-700",
        },
        {
          title: "NEW THIS MONTH",
          value: adminStats.users.newThisMonth.toString(),
          icon: UserPlus,
          gradient: "from-red-900 via-red-800 to-red-700",
        },
        {
          title: "NEW TODAY",
          value: adminStats.users.newToday.toString(),
          icon: Activity,
          gradient: "from-red-900 via-red-800 to-red-700",
        },

        // Row 2 - Financial Stats (Green gradient)
        {
          title: "TOTAL DEPOSITS",
          value: `৳${adminStats.financial.totalDeposits.toLocaleString()}`,
          icon: CreditCard,
          gradient: "from-green-600 via-green-500 to-green-400",
        },
        {
          title: "TOTAL WITHDRAWALS",
          value: `৳${adminStats.financial.totalWithdrawals.toLocaleString()}`,
          icon: Wallet,
          gradient: "from-green-600 via-green-500 to-green-400",
        },
        {
          title: "NET REVENUE",
          value: `৳${adminStats.financial.netRevenue.toLocaleString()}`,
          icon: TrendingUp,
          gradient: "from-green-600 via-green-500 to-green-400",
        },
        {
          title: "TOTAL BALANCE",
          value: `৳${adminStats.financial.totalBalance.toLocaleString()}`,
          icon: DollarSign,
          gradient: "from-green-600 via-green-500 to-green-400",
        },

        // Row 3 - Transaction Stats (Blue gradient)
        {
          title: "TOTAL TRANSACTIONS",
          value: adminStats.transactions.total.toString(),
          icon: Activity,
          gradient: "from-blue-600 via-blue-500 to-blue-400",
        },
        {
          title: "PENDING",
          value: adminStats.transactions.pending.toString(),
          icon: Clock,
          gradient: "from-blue-600 via-blue-500 to-blue-400",
        },
        {
          title: "COMPLETED",
          value: adminStats.transactions.completed.toString(),
          icon: CheckCircle,
          gradient: "from-blue-600 via-blue-500 to-blue-400",
        },
        {
          title: "FAILED",
          value: adminStats.transactions.failed.toString(),
          icon: XCircle,
          gradient: "from-blue-600 via-blue-500 to-blue-400",
        },

        // Row 4 - Referral Stats (Purple gradient)
        {
          title: "REFERRAL EARNINGS",
          value: `৳${adminStats.referrals.totalEarnings.toLocaleString()}`,
          icon: Gift,
          gradient: "from-purple-600 via-purple-500 to-purple-400",
        },
        {
          title: "TOTAL REFERRALS",
          value: adminStats.referrals.totalReferredUsers.toString(),
          icon: Users,
          gradient: "from-purple-600 via-purple-500 to-purple-400",
        },
        {
          title: "ACTIVE REFERRERS",
          value: adminStats.referrals.usersWithReferralCodes.toString(),
          icon: UserPlus,
          gradient: "from-purple-600 via-purple-500 to-purple-400",
        },
        {
          title: "PENDING PAYOUTS",
          value: adminStats.referrals.pendingPayouts.toString(),
          icon: Clock,
          gradient: "from-purple-600 via-purple-500 to-purple-400",
        },
      ]
    : [];

  // User Stats Cards
  const userStatCards = userStats
    ? [
        {
          title: "ACCOUNT BALANCE",
          value: `৳${userStats.account.balance.toLocaleString()}`,
          icon: DollarSign,
          gradient: "from-green-600 via-green-500 to-green-400",
        },
        {
          title: "TOTAL DEPOSITS",
          value: `৳${userStats.account.totalDeposits.toLocaleString()}`,
          icon: CreditCard,
          gradient: "from-blue-600 via-blue-500 to-blue-400",
        },
        {
          title: "TOTAL WITHDRAWALS",
          value: `৳${userStats.account.totalWithdrawals.toLocaleString()}`,
          icon: Wallet,
          gradient: "from-purple-600 via-purple-500 to-purple-400",
        },
        {
          title: "TOTAL TRANSACTIONS",
          value: userStats.transactions.total.toString(),
          icon: Activity,
          gradient: "from-red-900 via-red-800 to-red-700",
        },
        {
          title: "PENDING TRANSACTIONS",
          value: userStats.transactions.pending.toString(),
          icon: Clock,
          gradient: "from-orange-600 via-orange-500 to-orange-400",
        },
        {
          title: "COMPLETED TRANSACTIONS",
          value: userStats.transactions.completed.toString(),
          icon: CheckCircle,
          gradient: "from-green-600 via-green-500 to-green-400",
        },
        {
          title: "REFERRAL EARNINGS",
          value: `৳${userStats.referrals.totalEarnings.toLocaleString()}`,
          icon: Gift,
          gradient: "from-purple-600 via-purple-500 to-purple-400",
        },
        {
          title: "TOTAL REFERRALS",
          value: userStats.referrals.totalReferrals.toString(),
          icon: Users,
          gradient: "from-indigo-600 via-indigo-500 to-indigo-400",
        },
      ]
    : [];

  const statCards = isAdmin ? adminStatCards : userStatCards;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card
            key={index}
            className={`border-0 bg-gradient-to-r ${card.gradient} text-white overflow-hidden relative`}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="text-3xl font-bold mb-1">{card.value}</div>
                  <div className="text-sm font-medium opacity-90 uppercase tracking-wide">
                    {card.title}
                  </div>
                </div>
                <div className="ml-4">
                  <Icon className="w-12 h-12 opacity-80" />
                </div>
              </div>
              {/* Decorative overlay */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

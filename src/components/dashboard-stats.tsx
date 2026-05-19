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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <Card
            key={i}
            className="border-0 bg-gray-800/50 dark:bg-gray-800/50 animate-pulse"
          >
            <CardContent className="p-4">
              <div className="h-16"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Admin Stats Cards
  const adminStatCards = adminStats
    ? [
        // Row 1 - User Stats (Yellow/Gray gradient)
        {
          title: "TOTAL USERS",
          value: adminStats.users.total.toString(),
          icon: Users,
          gradient: "from-yellow-600 via-yellow-500 to-yellow-400",
        },
        {
          title: "ACTIVE USERS",
          value: adminStats.users.active.toString(),
          icon: UserCheck,
          gradient: "from-yellow-600 via-yellow-500 to-yellow-400",
        },
        {
          title: "NEW THIS MONTH",
          value: adminStats.users.newThisMonth.toString(),
          icon: UserPlus,
          gradient: "from-yellow-600 via-yellow-500 to-yellow-400",
        },
        {
          title: "NEW TODAY",
          value: adminStats.users.newToday.toString(),
          icon: Activity,
          gradient: "from-yellow-600 via-yellow-500 to-yellow-400",
        },

        // Row 2 - Financial Stats (Gray gradient)
        {
          title: "TOTAL DEPOSITS",
          value: `৳${adminStats.financial.totalDeposits.toLocaleString()}`,
          icon: CreditCard,
          gradient: "from-gray-700 via-gray-600 to-gray-500",
        },
        {
          title: "TOTAL WITHDRAWALS",
          value: `৳${adminStats.financial.totalWithdrawals.toLocaleString()}`,
          icon: Wallet,
          gradient: "from-gray-700 via-gray-600 to-gray-500",
        },
        {
          title: "NET REVENUE",
          value: `৳${adminStats.financial.netRevenue.toLocaleString()}`,
          icon: TrendingUp,
          gradient: "from-gray-700 via-gray-600 to-gray-500",
        },
        {
          title: "TOTAL BALANCE",
          value: `৳${adminStats.financial.totalBalance.toLocaleString()}`,
          icon: DollarSign,
          gradient: "from-gray-700 via-gray-600 to-gray-500",
        },

        // Row 3 - Transaction Stats (Dark gray gradient)
        {
          title: "TOTAL TRANSACTIONS",
          value: adminStats.transactions.total.toString(),
          icon: Activity,
          gradient: "from-gray-800 via-gray-700 to-gray-600",
        },
        {
          title: "PENDING",
          value: adminStats.transactions.pending.toString(),
          icon: Clock,
          gradient: "from-gray-800 via-gray-700 to-gray-600",
        },
        {
          title: "COMPLETED",
          value: adminStats.transactions.completed.toString(),
          icon: CheckCircle,
          gradient: "from-gray-800 via-gray-700 to-gray-600",
        },
        {
          title: "FAILED",
          value: adminStats.transactions.failed.toString(),
          icon: XCircle,
          gradient: "from-gray-800 via-gray-700 to-gray-600",
        },

        // Row 4 - Referral Stats (Yellow/Gray gradient)
        {
          title: "REFERRAL EARNINGS",
          value: `৳${adminStats.referrals.totalEarnings.toLocaleString()}`,
          icon: Gift,
          gradient: "from-yellow-600 via-yellow-500 to-yellow-400",
        },
        {
          title: "TOTAL REFERRALS",
          value: adminStats.referrals.totalReferredUsers.toString(),
          icon: Users,
          gradient: "from-yellow-600 via-yellow-500 to-yellow-400",
        },
        {
          title: "ACTIVE REFERRERS",
          value: adminStats.referrals.usersWithReferralCodes.toString(),
          icon: UserPlus,
          gradient: "from-yellow-600 via-yellow-500 to-yellow-400",
        },
        {
          title: "PENDING PAYOUTS",
          value: adminStats.referrals.pendingPayouts.toString(),
          icon: Clock,
          gradient: "from-yellow-600 via-yellow-500 to-yellow-400",
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
          gradient: "from-yellow-600 via-yellow-500 to-yellow-400",
        },
        {
          title: "TOTAL DEPOSITS",
          value: `৳${userStats.account.totalDeposits.toLocaleString()}`,
          icon: CreditCard,
          gradient: "from-gray-700 via-gray-600 to-gray-500",
        },
        {
          title: "TOTAL WITHDRAWALS",
          value: `৳${userStats.account.totalWithdrawals.toLocaleString()}`,
          icon: Wallet,
          gradient: "from-gray-800 via-gray-700 to-gray-600",
        },
        {
          title: "TOTAL TRANSACTIONS",
          value: userStats.transactions.total.toString(),
          icon: Activity,
          gradient: "from-yellow-600 via-yellow-500 to-yellow-400",
        },
        {
          title: "PENDING TRANSACTIONS",
          value: userStats.transactions.pending.toString(),
          icon: Clock,
          gradient: "from-gray-700 via-gray-600 to-gray-500",
        },
        {
          title: "COMPLETED TRANSACTIONS",
          value: userStats.transactions.completed.toString(),
          icon: CheckCircle,
          gradient: "from-gray-800 via-gray-700 to-gray-600",
        },
        {
          title: "REFERRAL EARNINGS",
          value: `৳${userStats.referrals.totalEarnings.toLocaleString()}`,
          icon: Gift,
          gradient: "from-yellow-600 via-yellow-500 to-yellow-400",
        },
        {
          title: "TOTAL REFERRALS",
          value: userStats.referrals.totalReferrals.toString(),
          icon: Users,
          gradient: "from-gray-700 via-gray-600 to-gray-500",
        },
      ]
    : [];

  const statCards = isAdmin ? adminStatCards : userStatCards;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card
            key={index}
            className={`border-0 bg-gradient-to-r ${card.gradient} text-white overflow-hidden relative`}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="text-2xl font-bold mb-1">{card.value}</div>
                  <div className="text-xs font-medium opacity-90 uppercase tracking-wide">
                    {card.title}
                  </div>
                </div>
                <div className="ml-3">
                  <Icon className="w-10 h-10 opacity-80" />
                </div>
              </div>
              {/* Decorative overlay */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12" />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

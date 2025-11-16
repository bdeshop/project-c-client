import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { TrendingUp, TrendingDown, Activity, DollarSign } from "lucide-react";

interface ProfileStatsProps {
  user?: {
    balance: number;
    deposit: number;
    withdraw: number;
    currency: string;
  };
}

export function ProfileStats({ user }: ProfileStatsProps) {
  if (!user) return null;

  const stats = [
    {
      title: "Current Balance",
      value: `${user.currency} ${user.balance.toFixed(2)}`,
      icon: DollarSign,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20",
    },
    {
      title: "Total Deposits",
      value: `${user.currency} ${user.deposit.toFixed(2)}`,
      icon: TrendingUp,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
    },
    {
      title: "Total Withdrawals",
      value: `${user.currency} ${user.withdraw.toFixed(2)}`,
      icon: TrendingDown,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
    },
    {
      title: "Net Activity",
      value: `${user.currency} ${(user.deposit - user.withdraw).toFixed(2)}`,
      icon: Activity,
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/20",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className={`glass-effect ${stat.bgColor} border ${stat.borderColor}`}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    {stat.title}
                  </p>
                  <p className={`text-2xl font-bold ${stat.color}`}>
                    {stat.value}
                  </p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="glass-effect">
        <CardHeader>
          <CardTitle>Account Activity</CardTitle>
          <CardDescription>
            Your recent account statistics and trends
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-slate-500/10 border border-slate-500/20">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Deposit Rate
                </p>
                <p className="text-lg font-bold text-foreground">
                  {user.deposit > 0
                    ? (
                        (user.deposit / (user.deposit + user.withdraw)) *
                        100
                      ).toFixed(1)
                    : 0}
                  %
                </p>
              </div>
              <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-slate-500/10 border border-slate-500/20">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Withdrawal Rate
                </p>
                <p className="text-lg font-bold text-foreground">
                  {user.withdraw > 0
                    ? (
                        (user.withdraw / (user.deposit + user.withdraw)) *
                        100
                      ).toFixed(1)
                    : 0}
                  %
                </p>
              </div>
              <TrendingDown className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-slate-500/10 border border-slate-500/20">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Account Health
                </p>
                <p className="text-lg font-bold text-foreground">
                  {user.balance > 0 ? "Good" : "Low Balance"}
                </p>
              </div>
              <Activity className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

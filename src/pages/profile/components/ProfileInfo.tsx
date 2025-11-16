import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  Hash,
  Gift,
  Wallet,
} from "lucide-react";

interface ProfileInfoProps {
  user?: {
    name: string;
    username: string;
    email: string;
    phoneNumber: string | null;
    country: string;
    currency: string;
    player_id: string;
    balance: number;
    deposit: number;
    withdraw: number;
    birthday: string;
    referralCode: string;
    role: string;
    status: string;
  };
}

export function ProfileInfo({ user }: ProfileInfoProps) {
  if (!user) return null;

  const infoItems = [
    { icon: User, label: "Full Name", value: user.name },
    { icon: User, label: "Username", value: user.username },
    { icon: Mail, label: "Email", value: user.email },
    {
      icon: Phone,
      label: "Phone Number",
      value: user.phoneNumber || "Not provided",
    },
    { icon: MapPin, label: "Country", value: user.country },
    { icon: CreditCard, label: "Currency", value: user.currency },
    { icon: Hash, label: "Player ID", value: user.player_id },
    {
      icon: Calendar,
      label: "Birthday",
      value: user.birthday || "Not provided",
    },
    { icon: Gift, label: "Referral Code", value: user.referralCode },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Personal Information */}
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Personal Information
          </CardTitle>
          <CardDescription>
            Your account details and information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {infoItems.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-3 border-b border-border/50 last:border-0"
            >
              <div className="flex items-center gap-3">
                <item.icon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">
                  {item.label}
                </span>
              </div>
              <span className="text-sm font-semibold text-foreground">
                {item.value}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Financial Information */}
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Financial Overview
          </CardTitle>
          <CardDescription>
            Your balance and transaction summary
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-lg bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                Current Balance
              </span>
              <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                {user.currency} {user.balance.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <div className="text-sm font-medium text-muted-foreground mb-1">
                Total Deposits
              </div>
              <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                {user.currency} {user.deposit.toFixed(2)}
              </div>
            </div>

            <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
              <div className="text-sm font-medium text-muted-foreground mb-1">
                Total Withdrawals
              </div>
              <div className="text-xl font-bold text-purple-600 dark:text-purple-400">
                {user.currency} {user.withdraw.toFixed(2)}
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-slate-500/10 border border-slate-500/20">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                Net Activity
              </span>
              <span className="text-lg font-bold text-foreground">
                {user.currency} {(user.deposit - user.withdraw).toFixed(2)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

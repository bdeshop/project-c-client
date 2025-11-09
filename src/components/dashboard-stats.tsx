import { Card, CardContent } from "./ui/card";
import {
  Users,
  UserCheck,
  Gamepad2,
  Play,
  Square,
  Cpu,
  CreditCard,
  Calendar,
  Wallet,
  Clock,
  Timer,
  UserPlus,
  Shield,
} from "lucide-react";

export function DashboardStats() {
  const statCards = [
    // Row 1 - User Stats (Red/Dark gradient)
    {
      title: "TOTAL USER",
      value: "25",
      icon: Users,
      gradient: "from-red-900 via-red-800 to-red-700",
    },
    {
      title: "TOTAL AFFILIATOR",
      value: "0",
      icon: Users,
      gradient: "from-red-900 via-red-800 to-red-700",
    },
    {
      title: "TOTAL WALLET AGENT",
      value: "0",
      icon: UserCheck,
      gradient: "from-red-900 via-red-800 to-red-700",
    },
    {
      title: "TOTAL WHITE LEBEL",
      value: "0",
      icon: Shield,
      gradient: "from-red-900 via-red-800 to-red-700",
    },

    // Row 2 - Game Stats (Green gradient)
    {
      title: "TOTAL GAME",
      value: "0",
      icon: Gamepad2,
      gradient: "from-green-600 via-green-500 to-green-400",
    },
    {
      title: "ACTIVE GAME",
      value: "0",
      icon: Play,
      gradient: "from-green-600 via-green-500 to-green-400",
    },
    {
      title: "DATIVE GAME",
      value: "0",
      icon: Square,
      gradient: "from-green-600 via-green-500 to-green-400",
    },
    {
      title: "TOTAL GAME API",
      value: "0",
      icon: Cpu,
      gradient: "from-green-600 via-green-500 to-green-400",
    },

    // Row 3 - Financial Stats (Blue gradient)
    {
      title: "TOTAL DEPOSIT",
      value: "10800",
      icon: CreditCard,
      gradient: "from-blue-600 via-blue-500 to-blue-400",
    },
    {
      title: "TODAY DEPOSIT",
      value: "0",
      icon: Calendar,
      gradient: "from-blue-600 via-blue-500 to-blue-400",
    },
    {
      title: "TOTAL WITHDRAW",
      value: "1200",
      icon: Wallet,
      gradient: "from-blue-600 via-blue-500 to-blue-400",
    },
    {
      title: "TODAY WITHDRAW",
      value: "0",
      icon: Calendar,
      gradient: "from-blue-600 via-blue-500 to-blue-400",
    },

    // Row 4 - Request Stats (Purple gradient)
    {
      title: "DEPOSIT REQUEST",
      value: "1",
      icon: Clock,
      gradient: "from-purple-600 via-purple-500 to-purple-400",
    },
    {
      title: "WITHDRAW REQUEST",
      value: "2",
      icon: Timer,
      gradient: "from-purple-600 via-purple-500 to-purple-400",
    },
    {
      title: "AFFILIATE SIGNUP REQ",
      value: "0",
      icon: UserPlus,
      gradient: "from-purple-600 via-purple-500 to-purple-400",
    },
    {
      title: "WALLET AGENT SIGN...",
      value: "0",
      icon: Users,
      gradient: "from-purple-600 via-purple-500 to-purple-400",
    },
  ];

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

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Wallet,
  TrendingUp,
  Receipt,
  Lock,
  Users,
  Gamepad2,
  AlertCircle,
  Loader,
} from "lucide-react";
import { getUserCompleteInfo } from "../../config/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type TabType = "overview" | "referrals" | "games" | "transactions";

interface UserData {
  userInfo: any;
  commissions: any;
  earnings: any;
  referrals: any;
  transactionSummary: any;
  gameStats: any;
}

export function UserDetailPage() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userDetails, setUserDetails] = useState<UserData | null>(null);

  useEffect(() => {
    fetchUserDetails();
  }, [userId]);

  const fetchUserDetails = async () => {
    if (!userId) return;
    try {
      setLoading(true);
      setError(null);
      const response = await getUserCompleteInfo(userId);
      const data = response.data || response;
      setUserDetails(data);
    } catch (err) {
      console.error("Error fetching user details:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch user details",
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[400px] w-full flex-col items-center justify-center gap-4">
        <Loader className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">
          Loading user details...
        </p>
      </div>
    );
  }

  if (error || !userDetails) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate("/users")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Users
        </Button>
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-800/50 dark:bg-red-900/10">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            <div>
              <h3 className="font-semibold text-red-600 dark:text-red-400">
                Error
              </h3>
              <p className="text-sm text-red-600 dark:text-red-400">
                {error || "User not found"}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const user = userDetails.userInfo;
  const earnings = userDetails.earnings;
  const referrals = userDetails.referrals;
  const gameStats = userDetails.gameStats;
  const transactions = userDetails.transactionSummary;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate("/users")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{user.name}</h1>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-white text-2xl font-bold">
          {user.name.charAt(0).toUpperCase()}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ৳{user.balance.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Total Earnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ৳{earnings.totalEarnings.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="h-4 w-4" />
              Referrals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{referrals.count}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {referrals.activeCount} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Gamepad2 className="h-4 w-4" />
              Total Bets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{gameStats.totalBets}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Win rate: {gameStats.winRate}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <div className="flex gap-8">
          {[
            { id: "overview", label: "Overview", icon: User },
            { id: "referrals", label: "Referrals", icon: Users },
            { id: "games", label: "Games", icon: Gamepad2 },
            { id: "transactions", label: "Transactions", icon: Receipt },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`px-4 py-3 font-medium border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* User Information */}
            <Card>
              <CardHeader>
                <CardTitle>User Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Username</p>
                    <p className="font-medium">{user.username}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Country</p>
                    <p className="font-medium">{user.country}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p
                      className={`font-medium ${user.status === "active" ? "text-green-600" : "text-red-600"}`}
                    >
                      {user.status.charAt(0).toUpperCase() +
                        user.status.slice(1)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Role</p>
                    <p className="font-medium">{user.role}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Member Since
                    </p>
                    <p className="font-medium">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Financial Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Financial Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Deposit
                    </p>
                    <p className="font-medium">
                      ৳{transactions.totalDeposit.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Withdraw
                    </p>
                    <p className="font-medium">
                      ৳{transactions.totalWithdraw.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Net Amount</p>
                    <p className="font-medium">
                      ৳{transactions.netAmount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Referral Earnings
                    </p>
                    <p className="font-medium">
                      ৳{earnings.referralEarnings.toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "referrals" && (
          <Card>
            <CardHeader>
              <CardTitle>Referred Users ({referrals.count})</CardTitle>
            </CardHeader>
            <CardContent>
              {referrals.list.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium">
                          Name
                        </th>
                        <th className="text-left py-3 px-4 font-medium">
                          Email
                        </th>
                        <th className="text-left py-3 px-4 font-medium">
                          Balance
                        </th>
                        <th className="text-left py-3 px-4 font-medium">
                          Status
                        </th>
                        <th className="text-left py-3 px-4 font-medium">
                          Joined
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {referrals.list.map((referral: any) => (
                        <tr
                          key={referral._id}
                          className="border-b hover:bg-muted/50"
                        >
                          <td className="py-3 px-4">{referral.name}</td>
                          <td className="py-3 px-4">{referral.email}</td>
                          <td className="py-3 px-4">
                            ৳{referral.balance.toLocaleString()}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                referral.status === "active"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                  : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
                              }`}
                            >
                              {referral.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            {new Date(referral.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No referrals yet
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === "games" && (
          <Card>
            <CardHeader>
              <CardTitle>Game Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Total Bets</p>
                  <p className="text-2xl font-bold">{gameStats.totalBets}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Won</p>
                  <p className="text-2xl font-bold text-green-600">
                    {gameStats.wonBets}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Lost</p>
                  <p className="text-2xl font-bold text-red-600">
                    {gameStats.lostBets}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Win Rate</p>
                  <p className="text-2xl font-bold">{gameStats.winRate}%</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-3">
                  Total Wagered
                </p>
                <p className="text-3xl font-bold">
                  ৳{gameStats.totalWagered.toLocaleString()}
                </p>
              </div>

              {gameStats.recentGames.length > 0 && (
                <div>
                  <h4 className="font-medium mb-3">Recent Games</h4>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {gameStats.recentGames.map((game: any, idx: number) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center p-3 bg-muted rounded"
                      >
                        <div>
                          <p className="font-medium">{game.game_code}</p>
                          <p className="text-xs text-muted-foreground">
                            {game.provider_code}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">৳{game.amount}</p>
                          <p
                            className={`text-xs ${game.status === "won" ? "text-green-600" : "text-red-600"}`}
                          >
                            {game.status}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === "transactions" && (
          <Card>
            <CardHeader>
              <CardTitle>Transaction Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Total Deposits
                  </p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    ৳{transactions.totalDeposit.toLocaleString()}
                  </p>
                </div>
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Total Withdrawals
                  </p>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                    ৳{transactions.totalWithdraw.toLocaleString()}
                  </p>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-sm text-muted-foreground">Net Amount</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    ৳{transactions.netAmount.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default UserDetailPage;

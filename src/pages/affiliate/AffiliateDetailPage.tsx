import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Wallet,
  TrendingUp,
  Users,
  AlertCircle,
  Loader,
  DollarSign,
  Percent,
} from "lucide-react";
import { getAffiliateCompleteInfo } from "../../config/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type TabType = "overview" | "referrals" | "earnings" | "commissions";

interface AffiliateData {
  _id: string;
  userName: string;
  fullName: string;
  email?: string;
  phone: number;
  callingCode: string;
  myReferralCode: string;
  friendReferrerCode: string;
  balance: number;
  role: string;
  status: string;
  betWinCommission: number;
  betLossCommission: number;
  depositCommission: number;
  registrationCommission: number;
  totalReferrals?: number;
  activeReferrals?: number;
  totalEarnings?: number;
  pendingCommission?: number;
  createdAt: string;
}

export function AffiliateDetailPage() {
  const { affiliateId } = useParams<{ affiliateId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [affiliateDetails, setAffiliateDetails] =
    useState<AffiliateData | null>(null);

  useEffect(() => {
    fetchAffiliateDetails();
  }, [affiliateId]);

  const fetchAffiliateDetails = async () => {
    if (!affiliateId) return;
    try {
      setLoading(true);
      setError(null);
      const response = await getAffiliateCompleteInfo(affiliateId);
      console.log("Affiliate response:", response);

      // Handle both response.data and direct response
      const data = response.data || response;

      // Map the response to match our interface
      const mappedData: AffiliateData = {
        _id: data.id || data._id,
        userName: data.userName,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        callingCode: data.callingCode,
        myReferralCode: data.myReferralCode,
        friendReferrerCode: data.friendReferrerCode || "",
        balance: data.balance,
        role: data.role,
        status: data.status,
        betWinCommission: data.betWinCommission,
        betLossCommission: data.betLossCommission,
        depositCommission: data.depositCommission,
        registrationCommission: data.registrationCommission,
        totalReferrals: data.totalUsers || data.totalReferrals,
        activeReferrals: data.activeReferrals || 0,
        totalEarnings: data.totalEarnings,
        pendingCommission: data.payoutBalance || 0,
        createdAt: data.createdAt,
      };

      setAffiliateDetails(mappedData);
    } catch (err) {
      console.error("Error fetching affiliate details:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to fetch affiliate details",
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
          Loading affiliate details...
        </p>
      </div>
    );
  }

  if (error || !affiliateDetails) {
    return (
      <div className="p-6 w-full">
        <Button
          variant="ghost"
          onClick={() => navigate("/dashboard/affiliates")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Affiliates
        </Button>
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-800/50 dark:bg-red-900/10">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            <div>
              <h3 className="font-semibold text-red-600 dark:text-red-400">
                Error
              </h3>
              <p className="text-sm text-red-600 dark:text-red-400">
                {error || "Affiliate not found"}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const affiliate = affiliateDetails;

  return (
    <div className="p-6 w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard/affiliates")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{affiliate.userName}</h1>
            <p className="text-muted-foreground">
              {affiliate.email || `+${affiliate.callingCode}${affiliate.phone}`}
            </p>
          </div>
        </div>
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-white text-2xl font-bold">
          {affiliate.userName.charAt(0).toUpperCase()}
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
              ৳{affiliate.balance.toLocaleString()}
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
              ৳{(affiliate.totalEarnings || 0).toLocaleString()}
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
            <div className="text-2xl font-bold">
              {affiliate.totalReferrals || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {affiliate.activeReferrals || 0} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ৳{(affiliate.pendingCommission || 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <div className="flex gap-8">
          {[
            { id: "overview", label: "Overview", icon: User },
            { id: "commissions", label: "Commissions", icon: Percent },
            { id: "earnings", label: "Earnings", icon: TrendingUp },
            { id: "referrals", label: "Referrals", icon: Users },
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
            {/* Affiliate Information */}
            <Card>
              <CardHeader>
                <CardTitle>Affiliate Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Username</p>
                    <p className="font-medium">{affiliate.userName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Full Name</p>
                    <p className="font-medium">{affiliate.fullName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{affiliate.email || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">
                      +{affiliate.callingCode}
                      {affiliate.phone}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p
                      className={`font-medium ${affiliate.status === "active" ? "text-green-600" : "text-red-600"}`}
                    >
                      {affiliate.status.charAt(0).toUpperCase() +
                        affiliate.status.slice(1)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Member Since
                    </p>
                    <p className="font-medium">
                      {new Date(affiliate.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Referral Information */}
            <Card>
              <CardHeader>
                <CardTitle>Referral Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Referral Code
                    </p>
                    <p className="font-mono font-medium bg-muted px-2 py-1 rounded">
                      {affiliate.myReferralCode}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Referred By</p>
                    <p className="font-mono font-medium bg-muted px-2 py-1 rounded">
                      {affiliate.friendReferrerCode || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Referrals
                    </p>
                    <p className="text-2xl font-bold">
                      {affiliate.totalReferrals || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Active Referrals
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      {affiliate.activeReferrals || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "commissions" && (
          <Card>
            <CardHeader>
              <CardTitle>Commission Rates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Bet Win Commission
                  </p>
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {affiliate.betWinCommission}%
                  </p>
                </div>
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Bet Loss Commission
                  </p>
                  <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                    {affiliate.betLossCommission}%
                  </p>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Deposit Commission
                  </p>
                  <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {affiliate.depositCommission}%
                  </p>
                </div>
                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Registration Commission
                  </p>
                  <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                    ৳{affiliate.registrationCommission}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "earnings" && (
          <Card>
            <CardHeader>
              <CardTitle>Earnings Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Current Balance
                  </p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    ৳{affiliate.balance.toLocaleString()}
                  </p>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Total Earnings
                  </p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    ৳{(affiliate.totalEarnings || 0).toLocaleString()}
                  </p>
                </div>
                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Pending Commission
                  </p>
                  <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                    ৳{(affiliate.pendingCommission || 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "referrals" && (
          <Card>
            <CardHeader>
              <CardTitle>Referral Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Total Referrals
                  </p>
                  <p className="text-3xl font-bold">
                    {affiliate.totalReferrals || 0}
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Active Referrals
                  </p>
                  <p className="text-3xl font-bold text-green-600">
                    {affiliate.activeReferrals || 0}
                  </p>
                </div>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">
                  Referral Code
                </p>
                <p className="font-mono text-lg font-bold">
                  {affiliate.myReferralCode}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Share this code with others to earn commissions
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default AffiliateDetailPage;

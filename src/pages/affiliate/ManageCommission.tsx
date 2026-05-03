import { useState, useEffect } from "react";
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Send, 
  Settings, 
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import {
  getAffiliateStats,
  getAffiliateCompleteInfo,
  distributeAffiliatePayouts,
  updatePayoutSettings,
  getPayoutSettings,
} from "../../config/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface PayoutResult {
  totalAffiliatesProcessed: number;
  distribution: DistributionItem[];
}

interface DistributionItem {
  affiliateId: string;
  affiliateName: string;
  affiliateCode: string;
  userCount: number;
  currentBalance: number;
  previousPayoutBalance: number;
  newPayoutBalance: number;
}

interface TopEarner {
  id: string;
  userName: string;
  email: string;
  totalUsers: number;
  totalEarnings: number;
  currentBalance: number;
  status: "active" | "inactive" | "pending";
}

interface Affiliate {
  id: string;
  userName: string;
  balance: number;
  gameStats?: {
    winCommissionEarned: number;
    lossCommissionEarned: number;
  };
  lastDistribution?: {
    winCommissionEarned: number;
    lossCommissionEarned: number;
    distributedAmount: number;
    distributedAt: string;
  };
}

interface AffiliateStats {
  platformTotals: {
    totalAffiliates: number;
    activeAffiliates: number;
    pendingAffiliates: number;
    inactiveAffiliates: number;
    totalUsers: number;
    totalEarnings: number;
    topEarners: TopEarner[];
  };
  affiliates: Affiliate[];
}

function ManageCommission() {
  const [statsLoading, setStatsLoading] = useState(true);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [stats, setStats] = useState<AffiliateStats | null>(null);
  const [payoutLoading, setPayoutLoading] = useState(false);
  const [payoutResult, setPayoutResult] = useState<PayoutResult | null>(null);
  const [selectedAffiliates, setSelectedAffiliates] = useState<string[]>([]);
  const [payoutNotes, setPayoutNotes] = useState<string>("");
  const [minimumPayoutBalance, setMinimumPayoutBalance] = useState<string>("100");
  const [payoutSettingsLoading, setPayoutSettingsLoading] = useState(false);

  useEffect(() => {
    fetchStats();
    fetchPayoutSettings();
  }, []);

  const fetchPayoutSettings = async () => {
    try {
      const response = await getPayoutSettings();
      if (response.success) {
        setMinimumPayoutBalance(response.data.minimumPayoutBalance.toString());
      }
    } catch (error) {
      console.error("Failed to fetch payout settings:", error);
    }
  };

  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      const response = await getAffiliateStats();
      const statsData = response.data || response;

      // Enrich affiliates with complete info including commission stats
      if (statsData.affiliates && statsData.affiliates.length > 0) {
        const enrichedAffiliates = await Promise.all(
          statsData.affiliates.map(async (affiliate: Affiliate) => {
            try {
              const completeResponse = await getAffiliateCompleteInfo(affiliate.id);
              const completeInfo = completeResponse.data || completeResponse;
              return {
                ...affiliate,
                gameStats: completeInfo.gameStats,
                lastDistribution: completeInfo.lastDistribution,
              };
            } catch (error) {
              console.error(`Failed to fetch complete info for ${affiliate.id}:`, error);
              return affiliate;
            }
          })
        );
        statsData.affiliates = enrichedAffiliates;
      }

      setStats(statsData);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
      setMessage({
        type: "error",
        text: "Failed to load affiliate statistics",
      });
    } finally {
      setStatsLoading(false);
    }
  };

  const handleDistributePayout = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedAffiliates.length === 0) {
      setMessage({
        type: "error",
        text: "Please select at least one affiliate to distribute payout",
      });
      return;
    }

    if (!confirm(`Are you sure you want to distribute payout to ${selectedAffiliates.length} selected affiliate(s)?`)) return;

    setPayoutLoading(true);
    setMessage(null);
    setPayoutResult(null);

    try {
      const response = await distributeAffiliatePayouts(selectedAffiliates, payoutNotes);
      setPayoutResult(response.data || response);
      setSelectedAffiliates([]);
      setPayoutNotes("");
      setMessage({
        type: "success",
        text: "Payout distributed successfully!",
      });
      fetchStats();
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Failed to distribute payout",
      });
    } finally {
      setPayoutLoading(false);
    }
  };

  const handleUpdatePayoutSettings = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!minimumPayoutBalance || parseFloat(minimumPayoutBalance) < 0) {
      setMessage({
        type: "error",
        text: "Please enter a valid minimum payout balance",
      });
      return;
    }

    setPayoutSettingsLoading(true);
    setMessage(null);

    try {
      const response = await updatePayoutSettings(parseFloat(minimumPayoutBalance));
      setMessage({
        type: "success",
        text: response.message || "Minimum payout balance updated successfully!",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Failed to update payout settings",
      });
    } finally {
      setPayoutSettingsLoading(false);
    }
  };

  if (statsLoading) {
    return (
      <div className="flex h-[400px] w-full flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse font-medium">Analyzing commission data...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-white shadow-lg shadow-primary/20">
            <DollarSign size={32} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Manage Commission</h1>
            <p className="text-muted-foreground">Configure distribution and monitor network performance</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Affiliates", value: stats?.platformTotals?.totalAffiliates || 0, icon: Users, color: "text-blue-500 bg-blue-500/10" },
          { label: "Active Affiliates", value: stats?.platformTotals?.activeAffiliates || 0, icon: CheckCircle2, color: "text-emerald-500 bg-emerald-500/10" },
          { label: "Total Earnings", value: `৳${(stats?.platformTotals?.totalEarnings || 0).toLocaleString()}`, icon: DollarSign, color: "text-primary bg-primary/10" },
          { label: "Network Users", value: stats?.platformTotals?.totalUsers || 0, icon: Users, color: "text-purple-500 bg-purple-500/10" },
        ].map((stat, idx) => (
          <div key={idx} className="rounded-2xl border bg-card p-6 shadow-sm dark:border-border">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-muted-foreground">{stat.label}</span>
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.color}`}>
                <stat.icon size={20} />
              </div>
            </div>
            <div className="text-2xl font-bold">{stat.value}</div>
          </div>
        ))}
      </div>

      {message && (
        <div className={`flex items-center gap-3 p-4 rounded-xl border animate-in slide-in-from-top-2 ${
          message.type === "success" 
            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" 
            : "bg-destructive/10 text-destructive border-destructive/20"
        }`}>
          {message.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <p className="text-sm font-bold uppercase tracking-wider">{message.text}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Payout Distribution Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-3xl border bg-card shadow-sm dark:border-border overflow-hidden">
            <div className="p-8 border-b dark:border-border bg-gradient-to-br from-primary/5 via-transparent to-transparent">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                  <Send size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Distribute Payouts</h2>
                  <p className="text-sm text-muted-foreground">Move affiliate balances to their withdrawal wallets</p>
                </div>
              </div>
            </div>

            <div className="p-8 space-y-8">
              {stats?.affiliates && stats.affiliates.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Select Affiliates</h3>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setSelectedAffiliates(stats.affiliates.map(a => a.id))}
                      className="text-[10px] font-bold uppercase tracking-widest h-7 px-3 rounded-full"
                    >
                      Select All
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin">
                    {stats.affiliates.map((affiliate) => (
                      <label 
                        key={affiliate.id} 
                        className={`group flex items-start gap-4 p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                          selectedAffiliates.includes(affiliate.id)
                            ? "border-primary bg-primary/5 shadow-md shadow-primary/5"
                            : "border-muted bg-muted/20 hover:border-primary/30 hover:bg-muted/40"
                        }`}
                      >
                        <div className="relative mt-1">
                          <input
                            type="checkbox"
                            className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border-2 border-primary/30 transition-all checked:border-primary checked:bg-primary"
                            checked={selectedAffiliates.includes(affiliate.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedAffiliates([...selectedAffiliates, affiliate.id]);
                              } else {
                                setSelectedAffiliates(selectedAffiliates.filter(id => id !== affiliate.id));
                              }
                            }}
                          />
                          <CheckCircle2 className="pointer-events-none absolute left-0.5 top-0.5 h-4 w-4 text-white opacity-0 transition-opacity peer-checked:opacity-100" />
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-sm">{affiliate.userName}</span>
                            <span className="text-xs font-black text-primary">৳{affiliate.balance?.toLocaleString()}</span>
                          </div>
                          {affiliate.gameStats && (
                            <div className="flex flex-wrap gap-2">
                              <span className="text-[9px] font-bold bg-blue-500/10 text-blue-600 px-2 py-0.5 rounded-full">W: ৳{affiliate.gameStats.winCommissionEarned?.toLocaleString()}</span>
                              <span className="text-[9px] font-bold bg-rose-500/10 text-rose-600 px-2 py-0.5 rounded-full">L: ৳{affiliate.gameStats.lossCommissionEarned?.toLocaleString()}</span>
                            </div>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>

                  <form onSubmit={handleDistributePayout} className="space-y-6 pt-4 border-t dark:border-border">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">Internal Notes (Optional)</label>
                      <Textarea 
                        placeholder="Add context for this distribution..." 
                        value={payoutNotes}
                        onChange={(e) => setPayoutNotes(e.target.value)}
                        className="rounded-2xl bg-muted/30 border-transparent focus:bg-background focus:border-primary/30 transition-all resize-none"
                      />
                    </div>
                    <Button 
                      type="submit" 
                      disabled={payoutLoading || selectedAffiliates.length === 0}
                      className="w-full h-14 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all border-none"
                    >
                      {payoutLoading ? <Loader2 className="animate-spin mr-2 h-5 w-5" /> : <Send className="mr-2 h-5 w-5" />}
                      {payoutLoading ? "Processing..." : `Finalize Distribution (${selectedAffiliates.length})`}
                    </Button>
                  </form>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-12 text-center gap-4 bg-muted/20 rounded-3xl border border-dashed">
                  <Users size={40} className="text-muted-foreground opacity-30" />
                  <p className="text-muted-foreground font-medium">No affiliates available for distribution</p>
                </div>
              )}
            </div>
          </div>

          {payoutResult && (
            <div className="rounded-3xl border bg-card p-8 shadow-sm dark:border-border animate-in slide-in-from-bottom-4">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <CheckCircle2 className="text-emerald-500" />
                Distribution Summary
              </h3>
              <div className="overflow-x-auto rounded-2xl border dark:border-border">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-muted/50 border-b dark:border-border">
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Affiliate</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">Referrals</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Transfer Amount</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">New Payout Bal.</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y dark:divide-border">
                    {payoutResult.distribution?.map((item) => (
                      <tr key={item.affiliateId}>
                        <td className="px-6 py-4 font-bold text-sm">{item.affiliateName}</td>
                        <td className="px-6 py-4 text-center font-medium text-sm">{item.userCount}</td>
                        <td className="px-6 py-4 text-right font-black text-sm text-primary">৳{item.currentBalance?.toLocaleString()}</td>
                        <td className="px-6 py-4 text-right font-black text-sm text-emerald-500">৳{item.newPayoutBalance?.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Sections */}
        <div className="space-y-8">
          {/* Settings Section */}
          <div className="rounded-3xl border bg-card shadow-sm dark:border-border p-8 space-y-8">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
                <Settings size={20} />
              </div>
              <h2 className="text-lg font-bold">Payout Rules</h2>
            </div>

            <form onSubmit={handleUpdatePayoutSettings} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">Min. Payout Threshold (BDT)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                  <Input 
                    type="number" 
                    value={minimumPayoutBalance}
                    onChange={(e) => setMinimumPayoutBalance(e.target.value)}
                    className="pl-10 h-12 rounded-xl bg-muted/30 border-transparent focus:bg-background focus:border-primary/30 transition-all font-bold"
                  />
                </div>
                <p className="text-[10px] text-muted-foreground italic px-1 leading-relaxed">
                  Affiliates must reach this balance to initiate a withdrawal request.
                </p>
              </div>
              <Button 
                type="submit" 
                disabled={payoutSettingsLoading}
                className="w-full h-12 rounded-xl font-bold uppercase tracking-widest text-[10px] shadow-lg hover:translate-y-[-2px] transition-all"
              >
                {payoutSettingsLoading ? "Updating..." : "Save Settings"}
              </Button>
            </form>
          </div>

          {/* Top Earners Section */}
          {stats?.platformTotals?.topEarners && stats.platformTotals.topEarners.length > 0 && (
            <div className="rounded-3xl border bg-card shadow-sm dark:border-border p-8 space-y-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                    <TrendingUp size={20} />
                  </div>
                  <h2 className="text-lg font-bold">Top Earners</h2>
                </div>
              </div>

              <div className="space-y-4">
                {stats.platformTotals.topEarners.map((earner, index) => (
                  <div key={earner.id} className="group flex items-center justify-between p-4 rounded-2xl bg-muted/20 border border-transparent hover:border-amber-500/30 hover:bg-amber-500/5 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 text-white text-xs font-bold shadow-md">
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-sm font-bold truncate max-w-[120px]">{earner.userName}</p>
                        <p className="text-[10px] text-muted-foreground uppercase font-black tracking-tighter">{earner.totalUsers} Referrals</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-amber-500">৳{earner.totalEarnings?.toLocaleString()}</p>
                      <div className="flex items-center justify-end text-[9px] text-muted-foreground gap-1">
                        View <ArrowRight size={10} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ManageCommission;

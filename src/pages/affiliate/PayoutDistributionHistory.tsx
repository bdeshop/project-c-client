import { useState, useEffect, useCallback } from "react";
import {
  History,
  ChevronDown,
  ChevronUp,
  Calendar,
  User,
  DollarSign,
  Users,
  Search,
  ArrowRight,
  Loader2,
  FileText,
  Clock,
} from "lucide-react";
import { getPayoutDistributionHistory } from "../../config/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface DistributionAffiliateItem {
  affiliateId: string;
  affiliateName: string;
  affiliateCode: string;
  userCount: number;
  currentBalance: number;
  previousPayoutBalance: number;
  newPayoutBalance: number;
}

interface DistributionRecord {
  id: string;
  adminName: string;
  adminEmail: string;
  totalAffiliatesProcessed: number;
  totalAmountDistributed: number;
  distributedAt: string;
  notes?: string;
  affiliates: DistributionAffiliateItem[];
  createdAt: string;
}

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

function PayoutDistributionHistory() {
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<DistributionRecord[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
  });
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const fetchHistory = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getPayoutDistributionHistory({
        page: pagination.page,
        limit: pagination.limit,
      });

      setHistory(response.data?.history || response.history || []);
      setPagination(
        response.data?.pagination || response.pagination || {
          total: 0,
          page: 1,
          limit: 10,
          pages: 0,
        },
      );
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Failed to load distribution history",
      });
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredHistory = history.filter(record => 
    record.adminName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && history.length === 0) {
    return (
      <div className="flex h-[400px] w-full flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse font-medium uppercase tracking-widest text-[10px]">Accessing archives...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 p-6 w-full uppercase">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-white shadow-lg shadow-primary/20">
            <History size={32} />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight leading-none mb-1">Distribution Audit</h1>
            <p className="text-muted-foreground font-medium lowercase first-letter:uppercase tracking-normal">
              Review full history of affiliate payout distributions
            </p>
          </div>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <Input 
            placeholder="Search audit logs..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-10 rounded-xl bg-card border-border font-bold text-xs"
          />
        </div>
      </div>

      {message && (
        <div className={`rounded-2xl border p-4 flex items-center gap-3 animate-in slide-in-from-top-2 ${
          message.type === "success" 
            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" 
            : "bg-destructive/10 text-destructive border-destructive/20"
        }`}>
          {message.type === "success" ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
          <p className="font-black text-[10px] tracking-widest uppercase">{message.text}</p>
        </div>
      )}

      {filteredHistory.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-20 text-center gap-6 border-2 border-dashed rounded-[2.5rem] bg-muted/20 border-muted-foreground/10">
          <FileText size={48} className="text-muted-foreground opacity-20" />
          <div className="space-y-2">
            <h3 className="text-xl font-black tracking-widest">NO RECORDS FOUND</h3>
            <p className="text-muted-foreground max-w-sm mx-auto text-xs font-medium lowercase first-letter:uppercase tracking-normal">
              Either no distributions have been made yet, or your search didn't match any archives.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredHistory.map((record) => (
            <div 
              key={record.id} 
              className={`group flex flex-col overflow-hidden rounded-[2rem] border bg-card shadow-sm transition-all dark:border-border ${
                expandedId === record.id ? "ring-2 ring-primary shadow-xl" : "hover:bg-muted/10 hover:shadow-md"
              }`}
            >
              {/* Header Row */}
              <div 
                className="flex flex-col md:flex-row md:items-center justify-between p-6 md:p-8 cursor-pointer gap-6"
                onClick={() => toggleExpand(record.id)}
              >
                <div className="flex items-center gap-6 flex-1">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-all ${
                    expandedId === record.id ? "bg-primary text-white" : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                  }`}>
                    {expandedId === record.id ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-black tracking-tight">{formatDate(record.distributedAt)}</span>
                      <Badge variant="outline" className="rounded-full bg-primary/5 text-[9px] font-black tracking-[0.15em] border-primary/20 text-primary">
                        ID: {record.id.slice(-6)}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-[10px] font-bold text-muted-foreground">
                      <div className="flex items-center gap-1.5 uppercase tracking-widest">
                        <User size={12} className="text-primary" /> {record.adminName}
                      </div>
                      <div className="flex items-center gap-1.5 uppercase tracking-widest">
                        <Clock size={12} className="text-primary" /> {new Date(record.distributedAt).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 md:gap-8 justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0 dark:border-border">
                  <div className="flex flex-col md:items-end gap-1">
                    <span className="text-[9px] font-black text-muted-foreground opacity-60 tracking-widest">PROCESSED</span>
                    <div className="flex items-center gap-1.5 font-black text-sm">
                      <Users size={14} className="text-primary" />
                      {record.totalAffiliatesProcessed} PARTNER{record.totalAffiliatesProcessed !== 1 ? "S" : ""}
                    </div>
                  </div>
                  <div className="flex flex-col md:items-end gap-1">
                    <span className="text-[9px] font-black text-muted-foreground opacity-60 tracking-widest">TOTAL VALUE</span>
                    <div className="flex items-center gap-1.5 font-black text-lg text-primary tracking-tighter">
                      <DollarSign size={18} />
                      ৳{record.totalAmountDistributed.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Expanded Content */}
              {expandedId === record.id && (
                <div className="p-8 pt-0 space-y-8 animate-in slide-in-from-top-4 duration-300">
                  <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                  
                  {record.notes && (
                    <div className="p-6 rounded-2xl bg-muted/30 border border-border space-y-3">
                      <div className="flex items-center gap-2 text-xs font-black tracking-widest text-primary uppercase">
                        <FileText size={14} /> DISTRIBUTION NOTES
                      </div>
                      <p className="text-xs font-medium lowercase first-letter:uppercase tracking-normal leading-relaxed text-muted-foreground">
                        {record.notes}
                      </p>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                      <h4 className="text-[10px] font-black tracking-[0.2em] text-muted-foreground uppercase">Partner Breakdown</h4>
                      <div className="text-[9px] font-bold text-muted-foreground italic">Showing {record.affiliates.length} records</div>
                    </div>
                    <div className="overflow-hidden rounded-3xl border dark:border-border">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-muted/50 border-b dark:border-border">
                            <th className="px-6 py-4 text-[9px] font-black tracking-widest text-muted-foreground">PARTNER</th>
                            <th className="px-6 py-4 text-[9px] font-black tracking-widest text-muted-foreground text-center">REFERRALS</th>
                            <th className="px-6 py-4 text-[9px] font-black tracking-widest text-muted-foreground text-right">OLD BALANCE</th>
                            <th className="px-6 py-4 text-[9px] font-black tracking-widest text-muted-foreground text-right">SETTLED</th>
                            <th className="px-6 py-4 text-[9px] font-black tracking-widest text-muted-foreground text-right">NEW BALANCE</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y dark:divide-border">
                          {record.affiliates.map((affiliate) => (
                            <tr key={affiliate.affiliateId} className="hover:bg-muted/10 transition-colors">
                              <td className="px-6 py-4">
                                <div className="space-y-0.5">
                                  <p className="text-xs font-black tracking-tight">{affiliate.affiliateName}</p>
                                  <p className="text-[9px] font-bold font-mono text-muted-foreground uppercase">{affiliate.affiliateCode}</p>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-center">
                                <span className="text-xs font-black">{affiliate.userCount}</span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <span className="text-xs font-bold text-muted-foreground opacity-60">৳{affiliate.previousPayoutBalance.toLocaleString()}</span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-1 font-black text-xs text-primary">
                                  <ArrowRight size={12} className="opacity-40" />
                                  ৳{affiliate.currentBalance.toLocaleString()}
                                </div>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <span className="text-xs font-black text-emerald-500">৳{affiliate.newPayoutBalance.toLocaleString()}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[9px] font-black tracking-widest text-muted-foreground opacity-40 uppercase pt-4">
                    <div className="flex items-center gap-2">ADMIN AUTHOR: {record.adminEmail}</div>
                    <div className="flex items-center justify-end gap-2">ARCHIVE ID: {record.id}</div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-between pt-8 border-t dark:border-border">
          <p className="text-[10px] font-black tracking-widest text-muted-foreground">
            PAGE {pagination.page} OF {pagination.pages} <span className="mx-2 opacity-20">|</span> {pagination.total} ENTRIES
          </p>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              disabled={pagination.page === 1}
              onClick={() => setPagination(p => ({...p, page: p.page - 1}))}
              className="rounded-xl font-black text-[9px] tracking-widest h-10 px-6"
            >
              PREVIOUS
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              disabled={pagination.page === pagination.pages}
              onClick={() => setPagination(p => ({...p, page: p.page + 1}))}
              className="rounded-xl font-black text-[9px] tracking-widest h-10 px-6"
            >
              NEXT
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PayoutDistributionHistory;

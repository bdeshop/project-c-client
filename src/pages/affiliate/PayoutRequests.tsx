import { useState, useEffect } from "react";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Send, 
  Search, 
  Filter, 
  MoreHorizontal, 
  User, 
  CreditCard, 
  Info,
  Loader2,
  AlertCircle,
  CheckCircle2,
  X,
  ChevronRight
} from "lucide-react";
import {
  getPayoutRequests,
  approvePayoutRequest,
  rejectPayoutRequest,
} from "../../config/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface PaymentDetails {
  phoneNumber?: string;
  accountType?: string;
  binanceEmail?: string;
  walletAddress?: string;
  binanceId?: string;
  bankName?: string;
  accountNumber?: string;
  accountName?: string;
  branchName?: string;
  routingNumber?: string;
  swiftCode?: string;
}

interface PayoutRequest {
  id: string;
  affiliateId: {
    _id: string;
    userName: string;
    email: string;
    phone: number;
    myReferralCode: string;
  };
  userName: string;
  email: string;
  phone: number;
  amount: number;
  paymentMethod: string;
  paymentDetails: PaymentDetails;
  status: "pending" | "approved" | "rejected";
  rejectionReason: string | null;
  createdAt: string;
  approvedAt: string | null;
  rejectedAt?: string;
}

function PayoutRequests() {
  const [requests, setRequests] = useState<PayoutRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("pending");
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string>("");
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchRequests();
  }, [filterStatus]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await getPayoutRequests({
        status: filterStatus !== "all" ? filterStatus : undefined,
      });
      setRequests(response.data || response || []);
    } catch (error) {
      console.error("Failed to fetch payout requests:", error);
      setMessage({
        type: "error",
        text: "Failed to load payout requests",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    if (!confirm("Are you sure you want to approve this payout request?")) return;

    setProcessingId(id);
    setMessage(null);

    try {
      const response = await approvePayoutRequest(id);
      setMessage({
        type: "success",
        text: response.message || "Payout request approved successfully!",
      });
      fetchRequests();
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Failed to approve request",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: string) => {
    if (!rejectionReason.trim()) {
      alert("Please provide a rejection reason");
      return;
    }

    setProcessingId(id);
    setMessage(null);

    try {
      const response = await rejectPayoutRequest(id, rejectionReason);
      setMessage({
        type: "success",
        text: response.message || "Payout request rejected successfully!",
      });
      setRejectingId(null);
      setRejectionReason("");
      fetchRequests();
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Failed to reject request",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const filteredRequests = requests.filter(req => 
    req.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPaymentDetailsSummary = (method: string, details: PaymentDetails) => {
    switch (method) {
      case "bKash":
      case "Nagad":
      case "Rocket":
        return details.phoneNumber ? `${details.phoneNumber} (${details.accountType || 'Personal'})` : "N/A";
      case "Binance":
        return details.binanceEmail || details.walletAddress || details.binanceId || "N/A";
      case "Bank Transfer":
        return details.accountNumber ? `${details.bankName}: ${details.accountNumber}` : "N/A";
      default:
        return "N/A";
    }
  };

  if (loading && requests.length === 0) {
    return (
      <div className="flex h-[400px] w-full flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse font-medium uppercase tracking-widest text-[10px]">Processing requests...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 p-6 w-full uppercase">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-white shadow-lg shadow-primary/20">
            <Send size={32} />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight leading-none mb-1">Payout Requests</h1>
            <p className="text-muted-foreground font-medium lowercase first-letter:uppercase tracking-normal">
              Review and settle pending affiliate withdrawal requests
            </p>
          </div>
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

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-card border rounded-[2rem] p-6 dark:border-border">
        <div className="flex p-1 bg-muted rounded-xl w-fit">
          {["pending", "approved", "rejected", "all"].map((status) => (
            <button
              key={status}
              className={`px-6 py-2 text-[10px] font-black tracking-[0.15em] rounded-lg transition-all uppercase ${
                filterStatus === status 
                  ? "bg-background text-primary shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setFilterStatus(status)}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <Input 
            placeholder="Search by affiliate or method..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-12 rounded-xl bg-muted/20 border-transparent focus:bg-background focus:border-primary/20 transition-all font-bold text-xs"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="rounded-[2.5rem] border bg-card shadow-sm dark:border-border overflow-hidden">
        <div className="overflow-x-auto">
          {filteredRequests.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-primary to-secondary border-b dark:border-border">
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white">Partner Info</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white">Amount</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white">Gateway</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white">Account Details</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white">Status</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-border">
                {filteredRequests.map((request) => (
                  <tr key={request.id} className="transition-colors hover:bg-muted/5 group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary font-black shadow-inner shadow-primary/5">
                          {request.userName.charAt(0).toUpperCase()}
                        </div>
                        <div className="space-y-0.5">
                          <p className="font-black text-sm tracking-tight leading-none mb-1">{request.userName}</p>
                          <p className="text-[10px] font-bold text-muted-foreground lowercase">{request.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="font-black text-lg text-primary tracking-tighter">৳{request.amount.toLocaleString()}</span>
                        <span className="text-[9px] font-bold text-muted-foreground tracking-widest">{new Date(request.createdAt).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <Badge variant="outline" className="rounded-xl font-black text-[10px] tracking-widest px-3 border-2 py-1">
                        {request.paymentMethod.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <CreditCard size={14} className="text-muted-foreground opacity-40 shrink-0" />
                        <span className="text-[11px] font-bold tracking-tight lowercase first-letter:uppercase truncate max-w-[200px]">
                          {getPaymentDetailsSummary(request.paymentMethod, request.paymentDetails)}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[9px] font-black tracking-widest border-2 ${
                        request.status === "pending" ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                        request.status === "approved" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                        "bg-destructive/10 text-destructive border-destructive/20"
                      }`}>
                        {request.status === "pending" && <Clock size={12} className="animate-pulse" />}
                        {request.status === "approved" && <CheckCircle size={12} />}
                        {request.status === "rejected" && <XCircle size={12} />}
                        {request.status.toUpperCase()}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-3">
                        {request.status === "pending" ? (
                          <>
                            <Button 
                              size="sm" 
                              onClick={() => handleApprove(request.id)}
                              disabled={!!processingId}
                              className="rounded-xl h-10 w-10 p-0 bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 border-none"
                            >
                              {processingId === request.id ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={18} />}
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => setRejectingId(request.id)}
                              disabled={!!processingId}
                              className="rounded-xl h-10 w-10 p-0 shadow-lg shadow-destructive/20 border-none"
                            >
                              <XCircle size={18} />
                            </Button>
                          </>
                        ) : (
                          <div className="flex flex-col items-end gap-1">
                            <span className="text-[9px] font-bold text-muted-foreground uppercase opacity-40">SETTLED ON</span>
                            <span className="text-[10px] font-black tracking-widest">{new Date(request.approvedAt || request.rejectedAt || "").toLocaleDateString()}</span>
                          </div>
                        )}
                        {request.status === "rejected" && request.rejectionReason && (
                          <div className="group/reason relative">
                            <Info size={16} className="text-destructive opacity-40 cursor-help" />
                            <div className="absolute right-full mr-4 bottom-1/2 translate-y-1/2 w-64 p-4 rounded-2xl bg-card border shadow-2xl invisible group-hover/reason:visible z-50 animate-in fade-in slide-in-from-right-2">
                              <p className="text-[9px] font-black text-destructive uppercase tracking-widest mb-2 border-b border-destructive/10 pb-2">Rejection Reason</p>
                              <p className="text-[11px] font-medium leading-relaxed normal-case text-muted-foreground">{request.rejectionReason}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex flex-col items-center justify-center p-24 text-center gap-6">
              <div className="flex h-24 w-24 items-center justify-center rounded-[2.5rem] bg-muted/30">
                <Send size={48} className="text-muted-foreground opacity-20" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black tracking-widest opacity-40">NO REQUESTS FOUND</h3>
                <p className="text-muted-foreground max-w-sm mx-auto text-xs font-medium lowercase first-letter:uppercase tracking-normal">
                  There are no {filterStatus !== 'all' ? filterStatus : ''} payout requests matching your current filters.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Rejection Modal */}
      <Dialog open={!!rejectingId} onOpenChange={(open) => !open && setRejectingId(null)}>
        <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden rounded-[2rem] border-none bg-card shadow-2xl">
          <DialogHeader className="p-8 border-b dark:border-border bg-gradient-to-r from-destructive/10 via-transparent to-transparent">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-destructive text-white shadow-lg shadow-destructive/20">
                <XCircle size={24} />
              </div>
              <div>
                <DialogTitle className="text-xl font-black tracking-tight">Reject Request</DialogTitle>
                <DialogDescription className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">AFFILIATE PAYOUT CANCELLATION</DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="p-8 space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black tracking-[0.2em] text-muted-foreground px-1 uppercase">Reason for Rejection *</label>
              <Textarea 
                placeholder="e.g. Invalid account details, Suspicious activity, etc." 
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="rounded-2xl bg-muted/30 border-transparent focus:bg-background focus:border-destructive/30 transition-all min-h-[120px] font-bold text-sm leading-relaxed"
              />
              <p className="text-[10px] text-muted-foreground/60 italic font-medium px-1">This reason will be visible to the affiliate in their dashboard.</p>
            </div>
          </div>
          <DialogFooter className="p-8 bg-muted/20 border-t dark:border-border flex sm:justify-between items-center gap-4">
            <Button variant="ghost" onClick={() => setRejectingId(null)} className="rounded-xl font-black text-[10px] tracking-widest px-8">ABORT</Button>
            <Button 
              variant="destructive" 
              onClick={() => handleReject(rejectingId!)} 
              disabled={!!processingId || !rejectionReason.trim()}
              className="rounded-xl h-12 px-10 font-black text-[10px] tracking-widest shadow-xl shadow-destructive/20 border-none"
            >
              {processingId === rejectingId ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <XCircle className="mr-2 h-4 w-4" />}
              CONFIRM REJECTION
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default PayoutRequests;

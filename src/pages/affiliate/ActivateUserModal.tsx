import { useState } from "react";
import { CheckCircle, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ActivateUserModalProps {
  user: {
    id: string;
    userName: string;
    email?: string;
    phone?: number;
    callingCode?: string;
  };
  onClose: () => void;
  onActivate: (
    userId: string,
    commissions: {
      betWinCommission: number;
      betLossCommission: number;
      depositCommission: number;
      registrationCommission: number;
    },
  ) => Promise<void>;
}

function ActivateUserModal({
  user,
  onClose,
  onActivate,
}: ActivateUserModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    betWinCommission: 10,
    betLossCommission: 15,
    depositCommission: 2,
    registrationCommission: 100,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: parseFloat(value) || 0,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onActivate(user.id, formData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to activate user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden rounded-[1.5rem] border bg-card dark:border-border">
        <DialogHeader className="p-8 border-b dark:border-border bg-gradient-to-r from-primary/10 via-transparent to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-white shadow-lg shadow-primary/20">
                <CheckCircle size={24} />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold tracking-tight">Activate Affiliate</DialogTitle>
                <DialogDescription className="text-sm font-medium mt-1">
                  Configure partner commission rates for <span className="text-foreground font-bold">{user.userName}</span>
                </DialogDescription>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
            >
              <X size={18} className="text-muted-foreground" />
            </button>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="p-8 space-y-8">
            {error && (
              <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive font-medium animate-in fade-in slide-in-from-top-2">
                {error}
              </div>
            )}

            <div className="space-y-4 rounded-2xl border bg-muted/30 p-5 dark:border-border">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground font-bold uppercase tracking-widest text-[10px]">Affiliate Account</span>
                <span className="font-bold">{user.userName}</span>
              </div>
              <div className="flex justify-between items-center text-sm border-t dark:border-border pt-4">
                <span className="text-muted-foreground font-bold uppercase tracking-widest text-[10px]">Contact Point</span>
                <span className="font-bold">
                  {user.email || `+${user.callingCode}${user.phone}`}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
              {[
                { id: "betWinCommission", label: "Bet Win (%)", desc: "Commission on referral wins" },
                { id: "betLossCommission", label: "Bet Loss (%)", desc: "Commission on referral losses" },
                { id: "depositCommission", label: "Deposit (%)", desc: "On every referral deposit" },
                { id: "registrationCommission", label: "Registration (BDT)", desc: "Fixed bonus per sign-up", isFixed: true },
              ].map((field) => (
                <div key={field.id} className="space-y-2">
                  <label htmlFor={field.id} className="text-[11px] font-bold uppercase tracking-[0.1em] text-muted-foreground block">
                    {field.label}
                  </label>
                  <Input
                    type="number"
                    id={field.id}
                    name={field.id}
                    value={(formData as any)[field.id]}
                    onChange={handleChange}
                    min="0"
                    max={field.isFixed ? undefined : "100"}
                    step={field.isFixed ? "1" : "0.1"}
                    required
                    className="h-11 rounded-xl bg-muted/50 border-transparent focus:border-primary/30 focus:bg-background transition-all font-bold"
                  />
                  <p className="text-[10px] text-muted-foreground/70 font-medium px-1 italic">{field.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter className="p-8 border-t dark:border-border bg-muted/20 flex sm:justify-between items-center gap-4">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={loading}
              className="rounded-xl font-bold uppercase tracking-widest text-xs h-12 px-6"
            >
              Dismiss
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-gradient-to-r from-primary to-secondary text-white shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all font-bold uppercase tracking-widest text-xs h-12 px-10 border-none"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Activating...</span>
                </div>
              ) : "Finalize Activation"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default ActivateUserModal;

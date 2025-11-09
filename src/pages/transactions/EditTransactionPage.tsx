"use client";

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { useTransaction, useUpdateTransaction } from "../../lib/queries";
import { toast } from "sonner";
import { ArrowLeft, Save, TrendingDown } from "lucide-react";

const WALLET_PROVIDERS = ["bKash", "Nagad", "Rocket", "Upay", "SureCash"];
const TRANSACTION_TYPES = ["Deposit", "Withdrawal", "Transfer"];
const STATUSES = ["Pending", "Completed", "Failed", "Cancelled"];

export default function EditTransactionPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: transaction, isLoading } = useTransaction(id!);
  const updateTransaction = useUpdateTransaction();

  const [formData, setFormData] = useState({
    amount: "",
    wallet_provider: "",
    transaction_id: "",
    wallet_number: "",
    status: "Pending" as const,
    transaction_type: "Deposit" as const,
    description: "",
    reference_number: "",
  });

  // Load existing data when transaction is fetched
  useEffect(() => {
    if (transaction?.data?.data) {
      const transactionData = transaction.data.data;
      setFormData({
        amount: transactionData.amount.toString(),
        wallet_provider: transactionData.wallet_provider,
        transaction_id: transactionData.transaction_id,
        wallet_number: transactionData.wallet_number,
        status: transactionData.status,
        transaction_type: transactionData.transaction_type,
        description: transactionData.description || "",
        reference_number: transactionData.reference_number || "",
      });
    }
  }, [transaction]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.amount ||
      !formData.wallet_provider ||
      !formData.transaction_id ||
      !formData.wallet_number
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    const submitData = {
      ...formData,
      amount: parseFloat(formData.amount),
    };

    try {
      await updateTransaction.mutateAsync({ id: id!, data: submitData });
      toast.success("Transaction updated successfully!");
      navigate(`/dashboard/transactions/view/${id}`);
    } catch (error: any) {
      console.error("Transaction update error:", error);
      toast.error(
        error.response?.data?.message || "Failed to update transaction"
      );
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!transaction?.data?.data) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Transaction Not Found
          </h2>
          <p className="text-muted-foreground mb-4">
            The transaction you're trying to edit doesn't exist.
          </p>
          <Button onClick={() => navigate("/dashboard/transactions")}>
            Back to Transactions
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/dashboard/transactions/view/${id}`)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent flex items-center gap-3">
            <TrendingDown className="h-8 w-8 text-primary" />
            Edit Transaction
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle>Transaction Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (৳) *</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={formData.amount}
                    onChange={(e) =>
                      handleInputChange("amount", e.target.value)
                    }
                    placeholder="1000"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="wallet_provider">Wallet Provider *</Label>
                  <Select
                    value={formData.wallet_provider}
                    onValueChange={(value) =>
                      handleInputChange("wallet_provider", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select wallet provider" />
                    </SelectTrigger>
                    <SelectContent>
                      {WALLET_PROVIDERS.map((provider) => (
                        <SelectItem key={provider} value={provider}>
                          {provider}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="transaction_id">Transaction ID *</Label>
                  <Input
                    id="transaction_id"
                    value={formData.transaction_id}
                    onChange={(e) =>
                      handleInputChange("transaction_id", e.target.value)
                    }
                    placeholder="TXN123456789"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="wallet_number">Wallet Number *</Label>
                  <Input
                    id="wallet_number"
                    value={formData.wallet_number}
                    onChange={(e) =>
                      handleInputChange("wallet_number", e.target.value)
                    }
                    placeholder="01712345678"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="transaction_type">Transaction Type</Label>
                  <Select
                    value={formData.transaction_type}
                    onValueChange={(value) =>
                      handleInputChange("transaction_type", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TRANSACTION_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      handleInputChange("status", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUSES.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reference_number">Reference Number</Label>
                <Input
                  id="reference_number"
                  value={formData.reference_number}
                  onChange={(e) =>
                    handleInputChange("reference_number", e.target.value)
                  }
                  placeholder="REF123456"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder="User deposit via bKash mobile banking"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/dashboard/transactions/view/${id}`)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={updateTransaction.isPending}
              className="flex items-center gap-2 gradient-primary"
            >
              <Save className="h-4 w-4" />
              {updateTransaction.isPending
                ? "Updating..."
                : "Update Transaction"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { ReferralTransaction } from "../../../lib/queries";

interface TransactionsTabProps {
  transactions: ReferralTransaction[] | undefined;
  isLoading: boolean;
  onUpdateTransactionStatus: (
    transactionId: string,
    status: "approved" | "rejected" | "paid"
  ) => void;
  isUpdating: boolean;
}

export function TransactionsTab({
  transactions,
  isLoading,
  onUpdateTransactionStatus,
  isUpdating,
}: TransactionsTabProps) {
  if (isLoading) {
    return <div className="text-center py-8">Loading transactions...</div>;
  }

  if (!transactions || transactions.length === 0) {
    return <div className="text-center py-8">No transactions found</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Referral Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div key={transaction._id} className="p-4 border rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">
                    {transaction.referrer.name} → {transaction.referee.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Code: {transaction.referrer.referralCode}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(transaction.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right space-y-2">
                  <p className="font-medium">
                    ${transaction.amount.toFixed(2)}
                  </p>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant={
                        transaction.status === "approved"
                          ? "default"
                          : transaction.status === "paid"
                          ? "secondary"
                          : transaction.status === "rejected"
                          ? "destructive"
                          : "outline"
                      }
                    >
                      {transaction.status}
                    </Badge>
                    {transaction.status === "pending" && (
                      <div className="space-x-1">
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={isUpdating}
                          onClick={() =>
                            onUpdateTransactionStatus(
                              transaction._id,
                              "approved"
                            )
                          }
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={isUpdating}
                          onClick={() =>
                            onUpdateTransactionStatus(
                              transaction._id,
                              "rejected"
                            )
                          }
                        >
                          Reject
                        </Button>
                      </div>
                    )}
                    {transaction.status === "approved" && (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={isUpdating}
                        onClick={() =>
                          onUpdateTransactionStatus(transaction._id, "paid")
                        }
                      >
                        Mark Paid
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

import { Link } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import { Plus, TrendingUp } from "lucide-react";

interface WithdrawHeaderProps {
  onAddMethod: () => void;
}

export function WithdrawHeader({ onAddMethod }: WithdrawHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent flex items-center gap-3">
          <TrendingUp className="h-8 w-8 text-primary" />
          Withdraw Methods
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage withdrawal methods for users
        </p>
      </div>
      <Link to="/dashboard/withdraw/add-method">
        <Button
          className="flex items-center gap-2 gradient-primary"
          onClick={onAddMethod}
        >
          <Plus className="h-4 w-4" />
          Add Withdraw Method
        </Button>
      </Link>
    </div>
  );
}

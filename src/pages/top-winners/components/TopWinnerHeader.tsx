import { Button } from "../../../components/ui/button";
import { Plus, RefreshCw } from "lucide-react";

interface TopWinnerHeaderProps {
  onAddTopWinner: () => void;
  onRefresh: () => void;
  isLoading?: boolean;
  isAdmin?: boolean;
}

export function TopWinnerHeader({
  onAddTopWinner,
  onRefresh,
  isLoading = false,
  isAdmin = false,
}: TopWinnerHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Top Winners</h1>
        <p className="text-muted-foreground">
          {isAdmin
            ? "Manage top winners and their records"
            : "View top winners and their records"}
        </p>
      </div>
      <div className="flex items-center space-x-3">
        <Button variant="outline" onClick={onRefresh} disabled={isLoading}>
          <RefreshCw
            className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
        {isAdmin && (
          <Button onClick={onAddTopWinner}>
            <Plus className="h-4 w-4 mr-2" />
            Add Top Winner
          </Button>
        )}
      </div>
    </div>
  );
}

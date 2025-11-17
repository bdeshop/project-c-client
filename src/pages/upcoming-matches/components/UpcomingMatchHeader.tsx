import { Button } from "../../../components/ui/button";
import { Plus, RefreshCw } from "lucide-react";

interface UpcomingMatchHeaderProps {
  onAddUpcomingMatch: () => void;
  onRefresh: () => void;
  isLoading?: boolean;
  isAdmin?: boolean;
}

export function UpcomingMatchHeader({
  onAddUpcomingMatch,
  onRefresh,
  isLoading = false,
  isAdmin = false,
}: UpcomingMatchHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Upcoming Matches</h1>
        <p className="text-muted-foreground">
          {isAdmin
            ? "Manage upcoming matches and their details"
            : "View upcoming matches and their details"}
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
          <Button onClick={onAddUpcomingMatch}>
            <Plus className="h-4 w-4 mr-2" />
            Add Match
          </Button>
        )}
      </div>
    </div>
  );
}

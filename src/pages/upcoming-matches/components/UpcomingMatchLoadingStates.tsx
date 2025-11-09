import { Loader2, AlertCircle } from "lucide-react";

interface UpcomingMatchLoadingStatesProps {
  isLoading: boolean;
  error: Error | null;
  hasUpcomingMatches: boolean;
}

export function UpcomingMatchLoadingStates({
  isLoading,
  error,
  hasUpcomingMatches,
}: UpcomingMatchLoadingStatesProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        <span>Loading upcoming matches...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-8 text-destructive">
        <AlertCircle className="w-5 h-5 mr-2" />
        <span>Error loading upcoming matches: {error.message}</span>
      </div>
    );
  }

  if (!hasUpcomingMatches) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No upcoming matches found.
      </div>
    );
  }

  return null;
}
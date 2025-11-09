import { Loader2, AlertCircle } from "lucide-react";

interface TopWinnerLoadingStatesProps {
  isLoading: boolean;
  error: Error | null;
  hasTopWinners: boolean;
}

export function TopWinnerLoadingStates({
  isLoading,
  error,
  hasTopWinners,
}: TopWinnerLoadingStatesProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        <span>Loading top winners...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-8 text-destructive">
        <AlertCircle className="w-5 h-5 mr-2" />
        <span>Error loading top winners: {error.message}</span>
      </div>
    );
  }

  if (!hasTopWinners) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No top winners found.
      </div>
    );
  }

  return null;
}
import { Loader2, AlertCircle } from "lucide-react";

interface UserLoadingStatesProps {
  isLoading: boolean;
  error: Error | null;
  hasUsers: boolean;
}

export function UserLoadingStates({
  isLoading,
  error,
  hasUsers,
}: UserLoadingStatesProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        <span>Loading users...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-8 text-destructive">
        <AlertCircle className="w-5 h-5 mr-2" />
        <span>Error loading users: {error.message}</span>
      </div>
    );
  }

  if (!hasUsers) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No users found matching your criteria.
      </div>
    );
  }

  return null;
}

import { Link } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import { Plus, TrendingUp } from "lucide-react";

interface WithdrawLoadingStatesProps {
  isLoading: boolean;
  hasData: boolean;
  searchTerm: string;
}

export function WithdrawLoadingStates({
  isLoading,
  hasData,
  searchTerm,
}: WithdrawLoadingStatesProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!hasData) {
    return (
      <div className="text-center py-12">
        <div className="glass-effect rounded-2xl p-8 max-w-md mx-auto">
          <TrendingUp className="h-16 w-16 text-primary/60 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">
            No withdraw methods found
          </h3>
          <p className="text-muted-foreground mb-6">
            {searchTerm
              ? "No methods match your search criteria."
              : "Get started by adding your first withdraw method."}
          </p>
          {!searchTerm && (
            <Link to="/dashboard/withdraw/add-method">
              <Button className="gradient-primary">
                <Plus className="h-4 w-4 mr-2" />
                Add Withdraw Method
              </Button>
            </Link>
          )}
        </div>
      </div>
    );
  }

  return null;
}

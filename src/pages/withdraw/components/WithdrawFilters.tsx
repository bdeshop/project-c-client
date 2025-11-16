import { Input } from "../../../components/ui/input";
import { Search } from "lucide-react";

interface WithdrawFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export function WithdrawFilters({
  searchTerm,
  onSearchChange,
}: WithdrawFiltersProps) {
  return (
    <div className="mb-6">
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search withdraw methods..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
    </div>
  );
}

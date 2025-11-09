import { Button } from "../../../components/ui/button";
import { Plus } from "lucide-react";

interface UserHeaderProps {
  onAddUser: () => void;
}

export function UserHeader({ onAddUser }: UserHeaderProps) {
  return (
    <div className="flex items-center justify-between w-full bg-background p-4 rounded-lg shadow-md">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Users</h1>
        <p className="text-muted-foreground">
          Manage your team members and their permissions
        </p>
      </div>
      <Button
        onClick={onAddUser}
        className="gradient-primary text-white hover:opacity-90 shadow-lg min-h-[40px] px-4 py-2 font-medium"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add User
      </Button>
    </div>
  );
}

import { Button } from "../../../components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { Badge } from "../../../components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2, Eye } from "lucide-react";
import { User } from "../../../lib/queries";
import { useNavigate } from "react-router-dom";

interface UserTableProps {
  users: User[];
  onEditUser: (user: User) => void;
  onDeleteUser: (user: User) => void;
}

export function UserTable({ users, onEditUser, onDeleteUser }: UserTableProps) {
  const navigate = useNavigate();

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin":
        return "destructive";
      case "editor":
        return "default";
      case "user":
        return "secondary";
      default:
        return "secondary";
    }
  };

  const getStatusBadgeVariant = (isActive: boolean) => {
    return isActive ? "default" : "secondary";
  };

  const handleViewDetails = (userId: string) => {
    navigate(`/dashboard/users/${userId}`);
  };

  return (
    <div className="rounded-lg border border-border/50 overflow-hidden shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-yellow-400 hover:bg-yellow-500 border-b-2 border-yellow-500 transition-all duration-300">
            <TableHead className="font-bold text-gray-900">
              User
            </TableHead>
            <TableHead className="font-bold text-gray-900">
              Role
            </TableHead>
            <TableHead className="font-bold text-gray-900">
              Status
            </TableHead>
            <TableHead className="font-bold text-gray-900">
              Last Login
            </TableHead>
            <TableHead className="text-right font-bold text-gray-900">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user, index) => (
            <TableRow
              key={user._id}
              className={`
                transition-all duration-300 ease-in-out
                hover:bg-gray-700/40
                hover:shadow-md hover:scale-[1.01] hover:border-l-4 hover:border-l-yellow-400
                ${
                  index % 2 === 0
                    ? "bg-gray-800/30"
                    : "bg-gray-800/10"
                }
                border-b border-gray-700/50
              `}
            >
              <TableCell className="py-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center shadow-md ring-2 ring-yellow-300/50">
                    <span className="text-sm font-semibold text-gray-900">
                      {user.username
                        ? user.username
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                        : "?"}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-white">
                      {user.username || "Unknown"}
                    </div>
                    <div className="text-sm text-gray-400">
                      {user.email || "No email"}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      <span className="font-medium text-yellow-400">
                        ${user.balance || 0}
                      </span>
                      {" • "}
                      <span
                        className={
                          user.isVerified
                            ? "text-yellow-400"
                            : "text-amber-400"
                        }
                      >
                        {user.isVerified ? "✓ Verified" : "⚠ Unverified"}
                      </span>
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant={getRoleBadgeVariant(user.role)}
                  className="font-medium shadow-sm"
                >
                  {user.role
                    ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
                    : "Unknown"}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  variant={getStatusBadgeVariant(user.isActive)}
                  className="font-medium shadow-sm"
                >
                  {user.isActive ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell className="text-gray-400 font-medium">
                {user.lastLogin
                  ? new Date(user.lastLogin).toLocaleDateString()
                  : "Never"}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-gray-700/50 transition-colors"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="shadow-lg">
                    <DropdownMenuItem
                      onClick={() => handleViewDetails(user._id)}
                      className="cursor-pointer hover:bg-yellow-400/10 text-gray-300 hover:text-yellow-400"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onEditUser(user)}
                      className="cursor-pointer hover:bg-yellow-400/10 text-gray-300 hover:text-yellow-400"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit User
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-400 cursor-pointer hover:bg-red-500/10"
                      onClick={() => onDeleteUser(user)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete User
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

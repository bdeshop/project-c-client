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
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { User } from "../../../lib/queries";

interface UserTableProps {
  users: User[];
  onEditUser: (user: User) => void;
  onDeleteUser: (user: User) => void;
}

export function UserTable({ users, onEditUser, onDeleteUser }: UserTableProps) {
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

  return (
    <div className="rounded-lg border border-border/50 overflow-hidden shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 dark:from-purple-700 dark:via-blue-700 dark:to-indigo-700 hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700 dark:hover:from-purple-600 dark:hover:via-blue-600 dark:hover:to-indigo-600 border-b-2 border-purple-400 dark:border-purple-500 transition-all duration-300">
            <TableHead className="font-bold text-white dark:text-white bg-gradient-to-r from-transparent to-transparent">
              User
            </TableHead>
            <TableHead className="font-bold text-white dark:text-white">
              Role
            </TableHead>
            <TableHead className="font-bold text-white dark:text-white">
              Status
            </TableHead>
            <TableHead className="font-bold text-white dark:text-white">
              Last Login
            </TableHead>
            <TableHead className="text-right font-bold text-white dark:text-white">
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
                hover:bg-gradient-to-r hover:from-purple-50 hover:via-blue-50 hover:to-indigo-50 
                dark:hover:from-purple-950/40 dark:hover:via-blue-950/40 dark:hover:to-indigo-950/40
                hover:shadow-md hover:scale-[1.01] hover:border-l-4 hover:border-l-purple-500
                ${
                  index % 2 === 0
                    ? "bg-white dark:bg-slate-950"
                    : "bg-slate-50/50 dark:bg-slate-900/50"
                }
                border-b border-slate-100 dark:border-slate-800
              `}
            >
              <TableCell className="py-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 flex items-center justify-center shadow-md ring-2 ring-blue-100 dark:ring-blue-900">
                    <span className="text-sm font-semibold text-white">
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
                    <div className="font-semibold text-slate-900 dark:text-slate-100">
                      {user.username || "Unknown"}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      {user.email || "No email"}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-500 mt-0.5">
                      <span className="font-medium text-green-600 dark:text-green-400">
                        ${user.balance || 0}
                      </span>
                      {" • "}
                      <span
                        className={
                          user.isVerified
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-amber-600 dark:text-amber-400"
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
              <TableCell className="text-slate-600 dark:text-slate-400 font-medium">
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
                      className="hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="shadow-lg">
                    <DropdownMenuItem
                      onClick={() => onEditUser(user)}
                      className="cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-950"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit User
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive cursor-pointer hover:bg-red-50 dark:hover:bg-red-950"
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

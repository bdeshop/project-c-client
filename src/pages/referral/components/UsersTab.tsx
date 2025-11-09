import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { UserWithReferrals } from "../../../lib/queries";

interface UsersTabProps {
  users: UserWithReferrals[] | undefined;
  isLoading: boolean;
}

export function UsersTab({ users, isLoading }: UsersTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  if (isLoading) {
    return <div className="text-center py-8">Loading users...</div>;
  }

  if (!users || users.length === 0) {
    return (
      <div className="text-center py-8">No users with referral codes found</div>
    );
  }

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.referralCode?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Users with Referral Codes</CardTitle>
        <div className="flex items-center space-x-4">
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page when searching
            }}
            className="max-w-sm"
          />
          <div className="text-sm text-muted-foreground">
            Showing {paginatedUsers.length} of {filteredUsers.length} users
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {paginatedUsers.map((user) => (
            <div key={user._id} className="p-4 border rounded-lg">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{user.name || user.username}</p>
                    <Badge
                      variant={
                        user.status === "active" ? "default" : "destructive"
                      }
                    >
                      {user.status}
                    </Badge>
                    <Badge variant="outline">{user.role}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <p className="text-sm">
                    Username:{" "}
                    <span className="font-medium">{user.username}</span>
                  </p>
                  <p className="text-sm">
                    Referral Code:{" "}
                    <span className="font-mono font-bold text-blue-600">
                      {user.referralCode}
                    </span>
                  </p>
                  <div className="flex gap-4 text-sm">
                    <span>
                      Balance:{" "}
                      <span className="font-medium">
                        {user.balance} {user.currency}
                      </span>
                    </span>
                    <span>
                      Earnings:{" "}
                      <span className="font-medium">
                        ${user.referralEarnings}
                      </span>
                    </span>
                  </div>
                  <p className="text-sm">
                    Referred: {user.referredUsers?.length || 0} users
                  </p>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span>Country: {user.country}</span>
                    <span>Player ID: {user.player_id}</span>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-sm text-muted-foreground">
                    Joined: {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                  {user.lastLogin && (
                    <p className="text-sm text-muted-foreground">
                      Last Login:{" "}
                      {new Date(user.lastLogin).toLocaleDateString()}
                    </p>
                  )}
                  <div className="flex flex-col gap-1">
                    <Badge
                      variant={user.isVerified ? "default" : "outline"}
                      className="text-xs"
                    >
                      {user.isVerified ? "Verified" : "Not Verified"}
                    </Badge>
                    <Badge
                      variant={user.emailVerified ? "default" : "outline"}
                      className="text-xs"
                    >
                      {user.emailVerified
                        ? "Email Verified"
                        : "Email Not Verified"}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

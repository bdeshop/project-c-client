"use client";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { useUsers, UserFilters } from "../../lib/queries";
import {
  UserTable,
  UserFilters as UserFiltersComponent,
  AddUserDialog,
  EditUserDialog,
  UserHeader,
  UserLoadingStates,
} from "./components";
import { useUserFilters, useUserActions } from "./hooks";

export function UsersPage() {
  const [currentPage, setCurrentPage] = useState(1);

  // Custom hooks for managing state and actions
  const {
    searchTerm,
    roleFilter,
    statusFilter,
    setSearchTerm,
    setRoleFilter,
    setStatusFilter,
    filterUsers,
  } = useUserFilters();

  const {
    isAddUserOpen,
    isEditUserOpen,
    newUser,
    editUser,
    signupMutation,
    updateUserMutation,
    setNewUser,
    setEditUser,
    handleOpenAddUser,
    handleCloseAddDialog,
    handleCloseEditDialog,
    handleEditUser,
    handleAddUser,
    handleUpdateUser,
    handleDeleteUser,
  } = useUserActions();

  // Prepare filters for the query
  const filters: UserFilters = {
    page: currentPage,
    limit: 10,
    ...(searchTerm && { search: searchTerm }),
    ...(roleFilter && roleFilter !== "all" && { role: roleFilter }),
    ...(statusFilter && statusFilter !== "all" && { status: statusFilter }),
  };

  // Fetch users using TanStack Query
  const { data: usersData, isLoading, error, refetch } = useUsers(filters);

  console.log("✅ TanStack Query Response:", usersData);

  // Filter users based on search and filters
  const filteredUsers = filterUsers(usersData?.users || []);

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <UserHeader onAddUser={handleOpenAddUser} />

        {/* Add User Dialog */}
        <AddUserDialog
          isOpen={isAddUserOpen}
          onClose={handleCloseAddDialog}
          newUser={newUser}
          onUserChange={setNewUser}
          onSubmit={() => handleAddUser(refetch)}
          isLoading={signupMutation.isPending}
        />

        {/* Edit User Dialog */}
        <EditUserDialog
          isOpen={isEditUserOpen}
          onClose={handleCloseEditDialog}
          editUser={editUser}
          onUserChange={setEditUser}
          onSubmit={() => handleUpdateUser(refetch)}
          isLoading={updateUserMutation.isPending}
        />

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>
              Search and filter users by role, status, or name
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UserFiltersComponent
              searchTerm={searchTerm}
              roleFilter={roleFilter}
              statusFilter={statusFilter}
              onSearchChange={setSearchTerm}
              onRoleFilterChange={setRoleFilter}
              onStatusFilterChange={setStatusFilter}
            />

            {/* Loading, Error, and Empty States */}
            <UserLoadingStates
              isLoading={isLoading}
              error={error}
              hasUsers={filteredUsers.length > 0}
            />

            {/* Users Table */}
            {!isLoading && !error && filteredUsers.length > 0 && (
              <UserTable
                users={filteredUsers}
                onEditUser={handleEditUser}
                onDeleteUser={handleDeleteUser}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

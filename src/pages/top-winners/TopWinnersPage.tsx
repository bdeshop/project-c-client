"use client";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Breadcrumb } from "../../components/ui/breadcrumb";
import { useTopWinners, useUserProfile } from "../../lib/queries";
import {
  TopWinnerTable,
  AddTopWinnerDialog,
  EditTopWinnerDialog,
  TopWinnerHeader,
  TopWinnerLoadingStates,
} from "./components";
import { useTopWinnerActions } from "./hooks";

export function TopWinnersPage() {
  const {
    isAddTopWinnerOpen,
    isEditTopWinnerOpen,
    newTopWinner,
    editTopWinner,
    createTopWinnerMutation,
    updateTopWinnerMutation,
    deleteTopWinnerMutation,
    setNewTopWinner,
    setEditTopWinner,
    handleOpenAddTopWinner,
    handleCloseAddDialog,
    handleCloseEditDialog,
    handleEditTopWinner,
    handleAddTopWinner,
    handleUpdateTopWinner,
    handleDeleteTopWinner,
  } = useTopWinnerActions();

  // Get user profile to check role
  const { data: userProfile } = useUserProfile();
  const isAdmin = userProfile?.user?.role === "admin";

  // Fetch top winners using TanStack Query
  const { data: topWinnersData, isLoading, error, refetch } = useTopWinners();

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Breadcrumb */}
        <Breadcrumb items={[{ label: "Top Winners" }]} />

        {/* Header */}
        <TopWinnerHeader
          onAddTopWinner={handleOpenAddTopWinner}
          onRefresh={refetch}
          isLoading={isLoading}
          isAdmin={isAdmin}
        />

        {/* Add Top Winner Dialog - Admin Only */}
        {isAdmin && (
          <AddTopWinnerDialog
            isOpen={isAddTopWinnerOpen}
            onClose={handleCloseAddDialog}
            newTopWinner={newTopWinner}
            onTopWinnerChange={setNewTopWinner}
            onSubmit={() => handleAddTopWinner(refetch)}
            isLoading={createTopWinnerMutation.isPending}
          />
        )}

        {/* Edit Top Winner Dialog - Admin Only */}
        {isAdmin && (
          <EditTopWinnerDialog
            isOpen={isEditTopWinnerOpen}
            onClose={handleCloseEditDialog}
            editTopWinner={editTopWinner}
            onTopWinnerChange={(winner) =>
              setEditTopWinner(winner as TopWinner)
            }
            onSubmit={() => handleUpdateTopWinner(refetch)}
            isLoading={updateTopWinnerMutation.isPending}
          />
        )}

        {/* Top Winners Table */}
        <Card>
          <CardHeader>
            <CardTitle>
              {isAdmin ? "Top Winners Management" : "Top Winners"}
            </CardTitle>
            <CardDescription>
              {isAdmin
                ? "Manage your top winners records"
                : "View top winners records"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Loading, Error, and Empty States */}
            <TopWinnerLoadingStates
              isLoading={isLoading}
              error={error}
              hasTopWinners={topWinnersData?.length > 0}
            />

            {/* Top Winners Table */}
            {!isLoading &&
              !error &&
              topWinnersData &&
              topWinnersData.length > 0 && (
                <TopWinnerTable
                  topWinners={topWinnersData}
                  onEditTopWinner={isAdmin ? handleEditTopWinner : undefined}
                  onDeleteTopWinner={
                    isAdmin
                      ? (id) => handleDeleteTopWinner(id, refetch)
                      : undefined
                  }
                  isAdmin={isAdmin}
                />
              )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

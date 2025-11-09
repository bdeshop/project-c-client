"use client";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { useTopWinners } from "../../lib/queries";
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

  // Fetch top winners using TanStack Query
  const { data: topWinnersData, isLoading, error, refetch } = useTopWinners();

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <TopWinnerHeader 
          onAddTopWinner={handleOpenAddTopWinner} 
          onRefresh={refetch}
          isLoading={isLoading}
        />

        {/* Add Top Winner Dialog */}
        <AddTopWinnerDialog
          isOpen={isAddTopWinnerOpen}
          onClose={handleCloseAddDialog}
          newTopWinner={newTopWinner}
          onTopWinnerChange={setNewTopWinner}
          onSubmit={() => handleAddTopWinner(refetch)}
          isLoading={createTopWinnerMutation.isPending}
        />

        {/* Edit Top Winner Dialog */}
        <EditTopWinnerDialog
          isOpen={isEditTopWinnerOpen}
          onClose={handleCloseEditDialog}
          editTopWinner={editTopWinner}
          onTopWinnerChange={setEditTopWinner}
          onSubmit={() => handleUpdateTopWinner(refetch)}
          isLoading={updateTopWinnerMutation.isPending}
        />

        {/* Top Winners Table */}
        <Card>
          <CardHeader>
            <CardTitle>Top Winners Management</CardTitle>
            <CardDescription>
              Manage your top winners records
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
            {!isLoading && !error && topWinnersData && topWinnersData.length > 0 && (
              <TopWinnerTable
                topWinners={topWinnersData}
                onEditTopWinner={handleEditTopWinner}
                onDeleteTopWinner={(id) => handleDeleteTopWinner(id, refetch)}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
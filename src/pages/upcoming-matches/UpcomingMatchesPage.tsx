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
import { useUpcomingMatches } from "../../lib/queries";
import {
  UpcomingMatchTable,
  AddUpcomingMatchDialog,
  EditUpcomingMatchDialog,
  UpcomingMatchHeader,
  UpcomingMatchLoadingStates,
} from "./components";
import { useUpcomingMatchActions } from "./hooks";
import { UpcomingMatch } from "../../lib/queries";

export function UpcomingMatchesPage() {
  const {
    isAddUpcomingMatchOpen,
    isEditUpcomingMatchOpen,
    newUpcomingMatch,
    editUpcomingMatch,
    createUpcomingMatchMutation,
    updateUpcomingMatchMutation,
    deleteUpcomingMatchMutation,
    setNewUpcomingMatch,
    setEditUpcomingMatch,
    handleOpenAddUpcomingMatch,
    handleCloseAddDialog,
    handleCloseEditDialog,
    handleEditUpcomingMatch,
    handleAddUpcomingMatch,
    handleUpdateUpcomingMatch,
    handleDeleteUpcomingMatch,
  } = useUpcomingMatchActions();

  // Fetch upcoming matches using TanStack Query
  const {
    data: upcomingMatchesData,
    isLoading,
    error,
    refetch,
  } = useUpcomingMatches();

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Breadcrumb */}
        <Breadcrumb items={[{ label: "Upcoming Matches" }]} />

        {/* Header */}
        <UpcomingMatchHeader
          onAddUpcomingMatch={handleOpenAddUpcomingMatch}
          onRefresh={refetch}
          isLoading={isLoading}
        />

        {/* Add Upcoming Match Dialog */}
        <AddUpcomingMatchDialog
          isOpen={isAddUpcomingMatchOpen}
          onClose={handleCloseAddDialog}
          newUpcomingMatch={newUpcomingMatch}
          onUpcomingMatchChange={setNewUpcomingMatch}
          onSubmit={() => handleAddUpcomingMatch(refetch)}
          isLoading={createUpcomingMatchMutation.isPending}
        />

        {/* Edit Upcoming Match Dialog */}
        <EditUpcomingMatchDialog
          isOpen={isEditUpcomingMatchOpen}
          onClose={handleCloseEditDialog}
          editUpcomingMatch={editUpcomingMatch}
          onUpcomingMatchChange={(match) =>
            setEditUpcomingMatch(match as UpcomingMatch)
          }
          onSubmit={() => handleUpdateUpcomingMatch(refetch)}
          isLoading={updateUpcomingMatchMutation.isPending}
        />

        {/* Upcoming Matches Table */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Matches Management</CardTitle>
            <CardDescription>
              Manage your upcoming matches and their details
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Loading, Error, and Empty States */}
            <UpcomingMatchLoadingStates
              isLoading={isLoading}
              error={error}
              hasUpcomingMatches={upcomingMatchesData?.length > 0}
            />

            {/* Upcoming Matches Table */}
            {!isLoading &&
              !error &&
              upcomingMatchesData &&
              upcomingMatchesData.length > 0 && (
                <UpcomingMatchTable
                  upcomingMatches={upcomingMatchesData}
                  onEditUpcomingMatch={handleEditUpcomingMatch}
                  onDeleteUpcomingMatch={(id) =>
                    handleDeleteUpcomingMatch(id, refetch)
                  }
                />
              )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

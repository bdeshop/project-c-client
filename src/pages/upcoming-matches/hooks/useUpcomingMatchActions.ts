import { useState } from "react";
import {
  useCreateUpcomingMatch,
  useUpdateUpcomingMatch,
  useDeleteUpcomingMatch,
} from "../../../lib/mutations";
import { UpcomingMatch } from "../../../lib/queries";

export const useUpcomingMatchActions = () => {
  // State for dialogs
  const [isAddUpcomingMatchOpen, setIsAddUpcomingMatchOpen] = useState(false);
  const [isEditUpcomingMatchOpen, setIsEditUpcomingMatchOpen] = useState(false);

  // State for upcoming match data
  const [newUpcomingMatch, setNewUpcomingMatch] = useState({
    matchType: "",
    matchDate: new Date().toISOString().slice(0, 16),
    teamA: {
      name: "",
      flagImage: "",
      odds: 0,
    },
    teamB: {
      name: "",
      flagImage: "",
      odds: 0,
    },
    isLive: false,
    category: "",
  });

  const [editUpcomingMatch, setEditUpcomingMatch] = useState<UpcomingMatch | null>(null);

  // Mutations
  const createUpcomingMatchMutation = useCreateUpcomingMatch();
  const updateUpcomingMatchMutation = useUpdateUpcomingMatch();
  const deleteUpcomingMatchMutation = useDeleteUpcomingMatch();

  // Dialog handlers
  const handleOpenAddUpcomingMatch = () => setIsAddUpcomingMatchOpen(true);
  const handleCloseAddDialog = () => {
    setIsAddUpcomingMatchOpen(false);
    setNewUpcomingMatch({
      matchType: "",
      matchDate: new Date().toISOString().slice(0, 16),
      teamA: {
        name: "",
        flagImage: "",
        odds: 0,
      },
      teamB: {
        name: "",
        flagImage: "",
        odds: 0,
      },
      isLive: false,
      category: "",
    });
  };

  const handleCloseEditDialog = () => {
    setIsEditUpcomingMatchOpen(false);
    setEditUpcomingMatch(null);
  };

  const handleEditUpcomingMatch = (upcomingMatch: UpcomingMatch) => {
    setEditUpcomingMatch(upcomingMatch);
    setIsEditUpcomingMatchOpen(true);
  };

  // Form handlers
  const handleAddUpcomingMatch = async (refetch: () => void) => {
    try {
      await createUpcomingMatchMutation.mutateAsync({
        matchType: newUpcomingMatch.matchType,
        matchDate: newUpcomingMatch.matchDate,
        teamA: newUpcomingMatch.teamA,
        teamB: newUpcomingMatch.teamB,
        isLive: newUpcomingMatch.isLive,
        category: newUpcomingMatch.category,
      });

      handleCloseAddDialog();
      refetch();
    } catch (error) {
      console.error("Failed to create upcoming match:", error);
    }
  };

  const handleUpdateUpcomingMatch = async (refetch: () => void) => {
    if (!editUpcomingMatch) return;

    try {
      await updateUpcomingMatchMutation.mutateAsync({
        id: editUpcomingMatch._id,
        matchType: editUpcomingMatch.matchType,
        matchDate: editUpcomingMatch.matchDate,
        teamA: editUpcomingMatch.teamA,
        teamB: editUpcomingMatch.teamB,
        isLive: editUpcomingMatch.isLive,
        category: editUpcomingMatch.category,
      });

      handleCloseEditDialog();
      refetch();
    } catch (error) {
      console.error("Failed to update upcoming match:", error);
    }
  };

  const handleDeleteUpcomingMatch = async (id: string, refetch: () => void) => {
    try {
      await deleteUpcomingMatchMutation.mutateAsync(id);
      refetch();
    } catch (error) {
      console.error("Failed to delete upcoming match:", error);
    }
  };

  return {
    // Dialog states
    isAddUpcomingMatchOpen,
    isEditUpcomingMatchOpen,

    // Upcoming match data
    newUpcomingMatch,
    editUpcomingMatch,
    setEditUpcomingMatch, // Expose this so the dialog can update it directly

    // Mutations
    createUpcomingMatchMutation,
    updateUpcomingMatchMutation,
    deleteUpcomingMatchMutation,

    // Handlers
    setNewUpcomingMatch,
    handleOpenAddUpcomingMatch,
    handleCloseAddDialog,
    handleCloseEditDialog,
    handleEditUpcomingMatch,
    handleAddUpcomingMatch,
    handleUpdateUpcomingMatch,
    handleDeleteUpcomingMatch,
  };
};
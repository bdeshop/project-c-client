import { useState } from "react";
import {
  useCreateTopWinner,
  useUpdateTopWinner,
  useDeleteTopWinner,
} from "../../../lib/mutations";
import { TopWinner } from "../../../lib/queries";

export const useTopWinnerActions = () => {
  // State for dialogs
  const [isAddTopWinnerOpen, setIsAddTopWinnerOpen] = useState(false);
  const [isEditTopWinnerOpen, setIsEditTopWinnerOpen] = useState(false);

  // State for top winner data
  const [newTopWinner, setNewTopWinner] = useState({
    gameName: "",
    gameCategory: "",
    username: "",
    winAmount: 0,
    currency: "BDT",
    gameImage: "",
    multiplier: 0,
    isLive: true,
  });

  const [editTopWinner, setEditTopWinner] = useState<TopWinner | null>(null);

  // Mutations
  const createTopWinnerMutation = useCreateTopWinner();
  const updateTopWinnerMutation = useUpdateTopWinner();
  const deleteTopWinnerMutation = useDeleteTopWinner();

  // Dialog handlers
  const handleOpenAddTopWinner = () => setIsAddTopWinnerOpen(true);
  const handleCloseAddDialog = () => {
    setIsAddTopWinnerOpen(false);
    setNewTopWinner({
      gameName: "",
      gameCategory: "",
      username: "",
      winAmount: 0,
      currency: "BDT",
      gameImage: "",
      multiplier: 0,
      isLive: true,
    });
  };

  const handleCloseEditDialog = () => {
    setIsEditTopWinnerOpen(false);
    setEditTopWinner(null);
  };

  const handleEditTopWinner = (topWinner: TopWinner) => {
    setEditTopWinner(topWinner);
    setIsEditTopWinnerOpen(true);
  };

  // Form handlers
  const handleAddTopWinner = async (refetch: () => void) => {
    try {
      await createTopWinnerMutation.mutateAsync({
        gameName: newTopWinner.gameName,
        gameCategory: newTopWinner.gameCategory,
        username: newTopWinner.username,
        winAmount: newTopWinner.winAmount,
        currency: newTopWinner.currency,
        gameImage: newTopWinner.gameImage,
        multiplier: newTopWinner.multiplier,
        isLive: newTopWinner.isLive,
      });

      handleCloseAddDialog();
      refetch();
    } catch (error) {
      console.error("Failed to create top winner:", error);
    }
  };

  const handleUpdateTopWinner = async (refetch: () => void) => {
    if (!editTopWinner) return;

    try {
      await updateTopWinnerMutation.mutateAsync({
        id: editTopWinner._id,
        gameName: editTopWinner.gameName,
        gameCategory: editTopWinner.gameCategory,
        username: editTopWinner.username,
        winAmount: editTopWinner.winAmount,
        currency: editTopWinner.currency,
        gameImage: editTopWinner.gameImage,
        multiplier: editTopWinner.multiplier,
        isLive: editTopWinner.isLive,
      });

      handleCloseEditDialog();
      refetch();
    } catch (error) {
      console.error("Failed to update top winner:", error);
    }
  };

  const handleDeleteTopWinner = async (id: string, refetch: () => void) => {
    try {
      await deleteTopWinnerMutation.mutateAsync(id);
      refetch();
    } catch (error) {
      console.error("Failed to delete top winner:", error);
    }
  };

  return {
    // Dialog states
    isAddTopWinnerOpen,
    isEditTopWinnerOpen,

    // Top winner data
    newTopWinner,
    editTopWinner,
    setEditTopWinner, // Expose this so the dialog can update it directly

    // Mutations
    createTopWinnerMutation,
    updateTopWinnerMutation,
    deleteTopWinnerMutation,

    // Handlers
    setNewTopWinner,
    handleOpenAddTopWinner,
    handleCloseAddDialog,
    handleCloseEditDialog,
    handleEditTopWinner,
    handleAddTopWinner,
    handleUpdateTopWinner,
    handleDeleteTopWinner,
  };
};
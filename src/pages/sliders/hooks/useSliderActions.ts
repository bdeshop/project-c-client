import { useState } from "react";
import {
  useCreateSlider,
  useUpdateSlider,
  useDeleteSlider,
} from "../../../lib/mutations";
import { Slider } from "../../../lib/queries";
import { UpdateSliderData } from "../../../lib/mutations";

// Extended Slider type to include image file for editing
interface EditableSlider extends Slider {
  image?: File;
}

export const useSliderActions = () => {
  // State for dialogs
  const [isAddSliderOpen, setIsAddSliderOpen] = useState(false);
  const [isEditSliderOpen, setIsEditSliderOpen] = useState(false);

  // State for slider data
  const [newSlider, setNewSlider] = useState({
    title: "",
    status: "active" as "active" | "inactive",
    image: null as File | null,
  });

  const [editSlider, setEditSlider] = useState<Slider | null>(null);

  // Mutations
  const createSliderMutation = useCreateSlider();
  const updateSliderMutation = useUpdateSlider();
  const deleteSliderMutation = useDeleteSlider();

  // Dialog handlers
  const handleOpenAddSlider = () => setIsAddSliderOpen(true);
  const handleCloseAddDialog = () => {
    setIsAddSliderOpen(false);
    setNewSlider({
      title: "",
      status: "active",
      image: null,
    });
  };

  const handleCloseEditDialog = () => {
    setIsEditSliderOpen(false);
    setEditSlider(null);
  };

  const handleEditSlider = (slider: Slider) => {
    setEditSlider(slider);
    setIsEditSliderOpen(true);
  };

  // Form handlers
  const handleAddSlider = async (refetch: () => void) => {
    if (!newSlider.title || !newSlider.image) return;

    try {
      await createSliderMutation.mutateAsync({
        title: newSlider.title,
        status: newSlider.status,
        image: newSlider.image,
      });

      handleCloseAddDialog();
      refetch();
    } catch (error) {
      console.error("Failed to create slider:", error);
    }
  };

  const handleUpdateSlider = async (refetch: () => void) => {
    if (!editSlider) return;

    try {
      // Prepare the update data
      const updateData: UpdateSliderData = {
        id: editSlider._id,
        title: editSlider.title,
        status: editSlider.status,
      };

      // Check if image property exists and is a File
      const editableSlider = editSlider as EditableSlider;
      if (editableSlider.image instanceof File) {
        updateData.image = editableSlider.image;
      }

      await updateSliderMutation.mutateAsync(updateData);

      handleCloseEditDialog();
      refetch();
    } catch (error) {
      console.error("Failed to update slider:", error);
    }
  };

  const handleDeleteSlider = async (id: string, refetch: () => void) => {
    try {
      await deleteSliderMutation.mutateAsync(id);
      refetch();
    } catch (error) {
      console.error("Failed to delete slider:", error);
    }
  };

  return {
    // Dialog states
    isAddSliderOpen,
    isEditSliderOpen,

    // Slider data
    newSlider,
    editSlider,
    setEditSlider, // Expose this so the dialog can update it directly

    // Mutations
    createSliderMutation,
    updateSliderMutation,
    deleteSliderMutation,

    // Handlers
    setNewSlider,
    handleOpenAddSlider,
    handleCloseAddDialog,
    handleCloseEditDialog,
    handleEditSlider,
    handleAddSlider,
    handleUpdateSlider,
    handleDeleteSlider,
  };
};

import { useState } from "react";
import { useSignupUser, useUpdateUser } from "../../../lib/mutations";
import { User } from "../../../lib/queries";

export const useUserActions = () => {
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    country: "",
    currency: "",
    phoneNumber: "",
    player_id: "",
    promoCode: "",
    bonusSelection: "",
    birthday: "",
  });

  const [editUser, setEditUser] = useState({
    id: "",
    name: "",
    email: "",
    password: "",
    country: "",
    currency: "",
    phoneNumber: "",
    player_id: "",
    promoCode: "",
    bonusSelection: "",
    birthday: "",
    role: "",
    status: "",
  });

  const signupMutation = useSignupUser();
  const updateUserMutation = useUpdateUser();

  const handleOpenAddUser = () => {
    setIsAddUserOpen(true);
  };

  const handleCloseAddDialog = () => {
    setNewUser({
      name: "",
      email: "",
      password: "",
      country: "",
      currency: "",
      phoneNumber: "",
      player_id: "",
      promoCode: "",
      bonusSelection: "",
      birthday: "",
    });
    setIsAddUserOpen(false);
  };

  const handleCloseEditDialog = () => {
    setEditUser({
      id: "",
      name: "",
      email: "",
      password: "",
      country: "",
      currency: "",
      phoneNumber: "",
      player_id: "",
      promoCode: "",
      bonusSelection: "",
      birthday: "",
      role: "",
      status: "",
    });
    setSelectedUser(null);
    setIsEditUserOpen(false);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);

    // Convert API status values to frontend display values
    let displayStatus = "Inactive";
    if (user.isActive) {
      displayStatus = "Active";
    }
    // If there's a specific status field that indicates banned users
    // you might need to check that field as well

    setEditUser({
      id: user._id,
      name: user.name || user.username || "",
      email: user.email || "",
      password: "", // Don't populate password for security
      country: user.country || "",
      currency: user.currency || "",
      phoneNumber: user.phoneNumber || "",
      player_id: user.player_id || "",
      promoCode: user.promoCode || "",
      bonusSelection: user.bonusSelection || "",
      birthday: user.birthday || "",
      role: user.role || "",
      status: displayStatus,
    });
    setIsEditUserOpen(true);
  };

  const handleAddUser = async (refetch: () => void) => {
    if (newUser.email && newUser.password && newUser.player_id) {
      try {
        await signupMutation.mutateAsync({
          name: newUser.name || undefined,
          email: newUser.email,
          password: newUser.password,
          country: newUser.country || undefined,
          currency: newUser.currency || undefined,
          phoneNumber: newUser.phoneNumber || undefined,
          player_id: newUser.player_id,
          promoCode: newUser.promoCode || undefined,
          bonusSelection: newUser.bonusSelection || undefined,
          birthday: newUser.birthday || undefined,
        });
        handleCloseAddDialog();
        refetch();
      } catch (error: unknown) {
        console.error("Failed to create user:", error);
        // Log the detailed error for debugging
        if (error && typeof error === "object" && "response" in error) {
          const apiError = error as { response?: { data?: unknown } };
          if (apiError.response?.data) {
            console.error("API Error Details:", apiError.response.data);
          }
        }
        throw error; // Re-throw to let the UI handle it
      }
    } else {
      console.error("Missing required fields:", {
        email: !!newUser.email,
        password: !!newUser.password,
        player_id: !!newUser.player_id,
      });
    }
  };

  const handleUpdateUser = async (refetch: () => void) => {
    if (editUser.id && editUser.name && editUser.email) {
      try {
        // Convert frontend status values to API expected values
        let apiStatus = editUser.status;
        if (editUser.status === "Active") {
          apiStatus = "active";
        } else if (editUser.status === "Inactive") {
          apiStatus = "deactivated";
        } else if (editUser.status === "Banned") {
          apiStatus = "banned";
        }

        await updateUserMutation.mutateAsync({
          id: editUser.id,
          name: editUser.name,
          username: editUser.name, // API might expect username field
          email: editUser.email,
          role: editUser.role,
          status: apiStatus,
        });
        handleCloseEditDialog();
        refetch();
      } catch (error) {
        console.error("Failed to update user:", error);
        // Log the detailed error for debugging
        if (error && typeof error === "object" && "response" in error) {
          const apiError = error as { response?: { data?: unknown } };
          if (apiError.response?.data) {
            console.error("API Error Details:", apiError.response.data);
          }
        }
        throw error; // Re-throw to let the UI handle it
      }
    }
  };

  const handleDeleteUser = (user: User) => {
    // TODO: Implement delete functionality
    console.log("Delete user:", user);
  };

  return {
    // State
    isAddUserOpen,
    isEditUserOpen,
    selectedUser,
    newUser,
    editUser,

    // Mutations
    signupMutation,
    updateUserMutation,

    // Setters
    setNewUser,
    setEditUser,

    // Actions
    handleOpenAddUser,
    handleCloseAddDialog,
    handleCloseEditDialog,
    handleEditUser,
    handleAddUser,
    handleUpdateUser,
    handleDeleteUser,
  };
};

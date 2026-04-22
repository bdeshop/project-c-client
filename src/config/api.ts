import axios from "axios";
import { API_BASE_URL } from "./constants";

const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken");
  const headers: any = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

const handleApiError = (error: any) => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message;
  }
  return "An error occurred";
};

// Get game categories
export const getGameCategories = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/game-categories`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// Create game category (Admin only)
export const createGameCategory = async (formData: FormData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/game-categories`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// Update game category (Admin only)
export const updateGameCategory = async (id: string, formData: FormData) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/api/game-categories/${id}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// Delete game category (Admin only)
export const deleteGameCategory = async (id: string) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/api/game-categories/${id}`,
      {
        headers: getAuthHeaders(),
      },
    );
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

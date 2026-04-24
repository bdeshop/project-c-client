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

// Get all deposit bonuses
export const getAllDepositBonuses = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/deposit-bonuses`, {
      headers: getAuthHeaders(),
    });
    return response.data.depositBonuses || [];
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// Create deposit bonus
export const createDepositBonus = async (data: any) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/deposit-bonuses`,
      data,
      {
        headers: getAuthHeaders(),
      },
    );
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// Update deposit bonus
export const updateDepositBonus = async (id: string, data: any) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/api/deposit-bonuses/${id}`,
      data,
      {
        headers: getAuthHeaders(),
      },
    );
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// Delete deposit bonus
export const deleteDepositBonus = async (id: string) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/api/deposit-bonuses/${id}`,
      {
        headers: getAuthHeaders(),
      },
    );
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// Get active deposit methods (needed for bonus creation)
export const getActiveDepositMethods = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/payment-methods/active`,
      {
        headers: getAuthHeaders(),
      },
    );
    return response.data.data || [];
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

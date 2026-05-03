import axios from "axios";
import { API_BASE_URL } from "./constants";
export { API_BASE_URL };

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

// --- Affiliate & Payout APIs ---

// Get all affiliates (Admin only)
export const getAllAffiliates = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/affiliate/users`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// Get pending affiliates (Admin only)
export const getPendingAffiliates = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/affiliate/users/pending`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// Activate affiliate (Admin only)
export const activateAffiliate = async (userId: string, data: any) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/affiliate/users/${userId}/activate`,
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

// Update affiliate status (Admin only)
export const updateAffiliateStatus = async (userId: string, status: string) => {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/api/affiliate/users/${userId}/status`,
      { status },
      {
        headers: getAuthHeaders(),
      },
    );
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// Delete affiliate (Admin only)
export const deleteAffiliate = async (userId: string) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/api/affiliate/users/${userId}`,
      {
        headers: getAuthHeaders(),
      },
    );
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// Get affiliate stats (Admin only)
export const getAffiliateStats = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/affiliate/stats`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// Get affiliate complete info (Admin only)
export const getAffiliateCompleteInfo = async (userId: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/affiliate/users/${userId}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// Distribute payouts (Admin only)
export const distributeAffiliatePayouts = async (affiliateIds: string[], notes?: string) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/payout/distribute`,
      { affiliateIds, notes },
      {
        headers: getAuthHeaders(),
      },
    );
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// Get payout settings (Admin only)
export const getPayoutSettings = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/payout/settings`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// Update payout settings (Admin only)
export const updatePayoutSettings = async (minimumPayoutBalance: number) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/api/payout/settings`,
      { minimumPayoutBalance },
      {
        headers: getAuthHeaders(),
      },
    );
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// Get payout requests (Admin only)
export const getPayoutRequests = async (params?: any) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/payout/requests`, {
      headers: getAuthHeaders(),
      params,
    });
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// Approve payout request (Admin only)
export const approvePayoutRequest = async (id: string) => {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/api/payout/requests/${id}/approve`,
      {},
      {
        headers: getAuthHeaders(),
      },
    );
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// Reject payout request (Admin only)
export const rejectPayoutRequest = async (id: string, rejectionReason: string) => {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/api/payout/requests/${id}/reject`,
      { rejectionReason },
      {
        headers: getAuthHeaders(),
      },
    );
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// Get payout distribution history (Admin only)
export const getPayoutDistributionHistory = async (params?: any) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/payout/distribution-history`, {
      headers: getAuthHeaders(),
      params,
    });
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// Get all affiliate withdraw methods (Admin only)
export const getAllAffiliateWithdrawMethods = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/affiliate/withdraw-methods`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// Create affiliate withdraw method (Admin only)
export const createAffiliateWithdrawMethod = async (formData: FormData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/affiliate/withdraw-methods`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// Update affiliate withdraw method (Admin only)
export const updateAffiliateWithdrawMethod = async (id: string, formData: FormData) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/api/affiliate/withdraw-methods/${id}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// Delete affiliate withdraw method (Admin only)
export const deleteAffiliateWithdrawMethod = async (id: string) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/api/affiliate/withdraw-methods/${id}`,
      {
        headers: getAuthHeaders(),
      },
    );
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

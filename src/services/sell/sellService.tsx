import { PrivateAxios } from "@/helpers/PrivateAxios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getAllShares = async () => {
  try {
    const response = await PrivateAxios.get(`${API_URL}/sell`);
    return response.data;
  } catch (error) {
    console.error("Failed to get shares:", error);
    throw error;
  }
};

export const getAllSellShares = async () => {
  try {
    const response = await PrivateAxios.get(`${API_URL}/sell/all-sells`);
    return response.data;
  } catch (error) {
    console.error("Failed to get shares:", error);
    throw error;
  }
};

export const getUsersAllShares = async () => {
  try {
    const response = await PrivateAxios.get(`${API_URL}/sell/users-shares`);
    return response.data;
  } catch (error) {
    console.error("Failed to get shares:", error);
    throw error;
  }
};

export interface CreateSellPayload {
  shareName: string;
  quantityAvailable: number;
  price: number;
  deliveryTimeline?: string;
  moq?: number;
  fixedPrice?: boolean;
  confirmDelivery?: boolean;
  shareInStock?: boolean;
  preShareTransfer?: boolean;
  endSellerName?: string;
  endSellerProfile?: string;
  endSellerLocation?: string;
}

export const createSell = async (payload: CreateSellPayload) => {
  try {
    const response = await PrivateAxios.post(
      `${API_URL}/sell/create-sell`,
      payload
    );
    return response.data;
  } catch (error: any) {
    console.error("Failed to create sell:", error);
    throw error;
  }
};

export const updateSell = async (
  id: number,
  payload: { price?: number; quantityAvailable?: number }
) => {
  try {
    const response = await PrivateAxios.put(
      `${API_URL}/sell/update-sell/${id}`,
      payload
    );
    return response.data;
  } catch (error: any) {
    console.error("Failed to update sell:", error);
    throw error;
  }
};

export const getSellsByShareId = async (shareId: string | number) => {
  try {
    const response = await PrivateAxios.get(`${API_URL}/sell/share/${shareId}`);
    return response.data.data; // assuming backend returns { success: true, data: [...] }
  } catch (error) {
    console.error("Failed to get sells for share:", error);
    throw error;
  }
};

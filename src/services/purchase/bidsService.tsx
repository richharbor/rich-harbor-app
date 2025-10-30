import { PrivateAxios } from "@/helpers/PrivateAxios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getAllBids = async () => {
  try {
    const response = await PrivateAxios.get(`${API_URL}/bids/all-bids`);
    return response.data;
  } catch (error) {
    console.error("Failed to get shares:", error);
    throw error;
  }
};

export interface BookSharePayload {
  sellId: number;
  quantity:number;
  bidPrice:number;
}

export const BidShare = async (payload: BookSharePayload) => {
  try {
    const response = await PrivateAxios.post(
      `${API_URL}/bids/bid`,
      payload
    );
    return response.data;
  } catch (error: any) {
    console.error("Failed to create sell:", error);
    throw error;
  }
};
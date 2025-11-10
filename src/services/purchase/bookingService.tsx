import { PrivateAxios } from "@/helpers/PrivateAxios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getAllbookings = async () => {
  try {
    const response = await PrivateAxios.get(`${API_URL}/booking/all-bookings`);
    return response.data;
  } catch (error) {
    console.error("Failed to get shares:", error);
    throw error;
  }
};

export interface BookSharePayload {
  sellId: number;
  quantity:number;
}

export const bookShare = async (payload: BookSharePayload) => {
  try {
    const response = await PrivateAxios.post(
      `${API_URL}/booking/book`,
      payload
    );
    return response.data;
  } catch (error: any) {
    console.error("Failed to create sell:", error);
    throw error;
  }
};

export const discardBooking = async(id: number | string) =>{
  try{
    const response = await PrivateAxios.delete(`${API_URL}/booking/discard/${id}`);
    return response;
  }catch(error){
    console.error('Faild to discard booking :', error);
    throw error;
  }
}
export interface closeDealPayload {
  id:number;
  sellId: number;
  sellerId: number;
  buyerId: number;
  dealQuantity: string;
  goodBuyer: string;
  goodSeller: string;
}
export const closeDeal = async (payload: closeDealPayload) =>{
  try {
    const response = await PrivateAxios.post(
      `${API_URL}/booking/close-deal`,
      payload
    );
    return response;
  } catch (error: any) {
    console.error("Failed to close deal:", error);
    throw error;
  }
}
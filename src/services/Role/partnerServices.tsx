import { PrivateAxios } from "@/helpers/PrivateAxios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Get all onboarding applications with filters & pagination
export const getApplications = async (params?: {
  status?: string;
  page?: number;
  limit?: number;
}) => {
  try {
    const response = await PrivateAxios.get(`${API_URL}/admin/applications`, {
      params, // query params { status, page, limit }
    });
    return response.data; // { applications, pagination }
  } catch (error) {
    console.error("Failed to fetch applications", error);
    throw error;
  }
};

// Update application status (approve/reject)
export const updateApplicationStatus = async (
  applicationId: number,
  status: "approved" | "rejected",
  reviewNotes?: string
) => {
  try {
    const response = await PrivateAxios.patch(
      `${API_URL}/admin/applications/${applicationId}/status`,
      { status, reviewNotes }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to update application status", error);
    throw error;
  }
};

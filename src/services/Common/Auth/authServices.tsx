import { PrivateAxios } from "@/helpers/PrivateAxios";
import axios from "axios";

interface ILoginBody {
  email: string;
  password: string;
}

interface IRegisterBody {
  email: string;
  password: string;
  name: string;
  roleName: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const postLogin = async (requestBody: ILoginBody) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, requestBody);
    return response.data;
  } catch (error) {
    console.error("Login failed", error);
    throw error;
  }
};

export const postRegister = async (requestBody: IRegisterBody) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, requestBody);
    return response.data;
  } catch (error) {
    console.error("Login failed", error);
    throw error;
  }
};

export const getUserDetails = async () => {
  try {
    const response = await PrivateAxios.get(`${API_URL}/auth/me`);
    return response.data;
  } catch (error) {
    console.error("Login failed", error);
    throw error;
  }
};

export const postLogout = async () => {
  try {
    const response = await PrivateAxios.post(`${API_URL}/auth/logout`);
    return response.data;
  } catch (error) {
    console.error("Login failed", error);
    throw error;
  }
};

export const getNewAccessToken = async (requestBody: any) => {
  try {
    const response = await PrivateAxios.post(`${API_URL}/auth/refresh`, requestBody);
    return response.data;
  } catch (error) {
    console.error("Login failed", error);
    throw error;
  }
};

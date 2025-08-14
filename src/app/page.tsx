"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Cookies from "js-cookie";
import Loading from "./loading";
import {
  getNewAccessToken,
  getUserDetails,
} from "@/services/Common/Auth/authServices";

export default function Home() {
  const router = useRouter();
  const authToken = Cookies.get("authToken");
  const refreshToken = Cookies.get("refreshToken");

  const redirectAccToUserRole = (userRole: string) => {
    switch (userRole) {
      case "superadmin":
        router.push("/superadmin/dashboard");
        break;
      case "broker":
        router.push("/broker/dashboard");
        break;
    }
  };

  const getUserDetailsFn = async () => {
    try {
      let response = await getUserDetails();

      Cookies.set("currentRole", response.currentRole.name);

      if (response.profile) {
        redirectAccToUserRole(response.currentRole.name);
      } else {
        router.push(`/auth/onboarding`);
      }
    } catch (error: any) {
      // Check if it's a 403 and token invalid
      if (error.response?.status === 403) {
        console.log("Access token expired, trying refresh...");

        try {
          const refreshRes = await getNewAccessToken({ refreshToken });
          Cookies.set("authToken", refreshRes.accessToken);

          // Retry after getting new token
          const response = await getUserDetails();
          Cookies.set("currentRole", response.currentRole.name);

          if (response.profile) {
            redirectAccToUserRole(response.currentRole.name);
          } else {
            router.push(`/auth/onboarding`);
          }
        } catch (refreshError) {
          console.error("Token refresh failed", refreshError);
          router.push(`/auth/login`); // fallback to login
        }
      } else {
        console.error("Unexpected error", error);
      }
    }
  };

  useEffect(() => {
    if (authToken) {
      getUserDetailsFn();
    } else {
      Cookies.remove("authToken");
      router.push("/auth/login");
    }
  }, []);

  return (
    <>
      <Loading />
    </>
  );
}

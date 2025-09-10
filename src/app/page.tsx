"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Cookies from "js-cookie";
import Loading from "./loading";
import { getUserDetails } from "@/services/Auth/authServices";

import useAuthStore from "@/helpers/authStore";

export default function Home() {
  const router = useRouter();
  const authToken = Cookies.get("authToken");

  const getUserDetailsFn = async () => {
    try {
      const response = await getUserDetails();
      console.log("User details:", response);

      const setAuth = useAuthStore.getState().setAuth;
      const setOnboardingStatus = useAuthStore.getState().setOnboardingStatus;

      //  Onboarding redirect
      if (response.onboarding?.required || !response.user?.emailVerified) {
        setOnboardingStatus(response.onboarding);
        router.push("/auth/onboarding");
        return;
      }

      if (response.user) {
        const roles = response.user.roles || [];

        // Save user + roles in store
        setAuth(response.user, Cookies.get("authToken") || "", roles);

        // Set currentRole in store
        if (response.user.currentRole) {
          useAuthStore.getState().setCurrentRole(response.user.currentRole.id);
        }

        // Redirect based on role
        if (
          response.user.isSuperAdmin &&
          response.user.currentRole?.name.toLowerCase() === "superadmin"
        ) {
          router.push("/superadmin/dashboard");
        } else if (response.user.currentRole) {
          router.push(
            `/${response.user.currentRole.name.toLowerCase()}/dashboard`
          );
        } else {
          // fallback: no role → login
          router.push("/auth/login");
        }
      }
    } catch (error) {
      console.error("Failed to fetch user details:", error);
      useAuthStore.getState().clearAuth();
      router.push("/auth/login");
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

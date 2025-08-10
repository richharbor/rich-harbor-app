"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Cookies from "js-cookie";
import Loading from "./loading";
import { getUserDetails } from "@/services/Common/Auth/authServices";

export default function Home() {
  const router = useRouter();

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
      const response = await getUserDetails();
      Cookies.set("currentRole", response.role.name);
      if(response.profile){
        redirectAccToUserRole(response.role.name);
      } else {
        router.push(`/auth/onboarding`)
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const authToken = Cookies.get("authToken");
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

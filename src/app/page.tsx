"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Cookies from "js-cookie";
import Loading from "./loading";

export default function Home() {
  const router = useRouter();
  //   const authToken = Cookies.get("authToken");

  const redirectAccToUserRole = (userRole: string) => {
    switch (userRole) {
      case "superadmin":
        router.push("/superadmin/dashboard");
        break;
      case "admin":
        router.push("/admin/dashboard");
        break;
    }
  };

  useEffect(() => {
    const authToken = Cookies.get("authToken");
    if (authToken) {
      // fetchIpAddress(userEmail, provider);
      const currentRole = Cookies.get("role");
      if (currentRole) redirectAccToUserRole(currentRole.toString());
    } else {
      // the user will be redirected to the login page after 1000 millisecound.
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

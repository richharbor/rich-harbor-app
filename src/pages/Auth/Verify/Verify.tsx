"use client";

import { verifyEmail } from "@/services/Auth/authServices";
import { useSearchParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "sonner";

export default function Verify() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams?.get("token");

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        toast.error("Invalid or missing token");
        router.push("/auth/login");
        return;
      }

      try {
        const res = await verifyEmail({ token });

        if (res?.Result === "SUCCESS") {
          toast.success(res?.message || "Email confirmed successfully");
        } else {
          toast.error(res?.message || "Email verification failed");
        }
      } catch (error: any) {
        console.error("Verification failed:", error);
        toast.error(
          error?.response?.data?.message || "An unexpected error occurred"
        );
      } finally {
        router.push("/auth/login");
      }
    };

    verify();
  }, [token, router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-16 h-16 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
    </div>
  );
}

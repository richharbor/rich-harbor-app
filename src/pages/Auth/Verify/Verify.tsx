"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { verifyEmailAndSetNewPassword } from "@/services/Auth/authServices";

export default function Verify() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams?.get("token");

  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null); // null = loading
  const [tempPassword, setTempPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Step 1: Verify token
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        toast.error("Invalid or missing token");
        router.push("/auth/login");
        return;
      }

      try {
        const res = await verifyEmailAndSetNewPassword({
          token,
        });

        if (res?.Result === "SUCCESS") {
          setIsTokenValid(true);
        } else {
          toast.error(res?.message || "Token verification failed");
          setIsTokenValid(false);
          router.push("/auth/login");
        }
      } catch (error: any) {
        console.error("Token verification failed:", error);
        toast.error(
          error?.response?.data?.message || "An unexpected error occurred"
        );
        setIsTokenValid(false);
        router.push("/auth/login");
      }
    };

    verifyToken();
  }, [token, router]);

  // Step 2: Handle password submission
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!tempPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await verifyEmailAndSetNewPassword({
        token: token!,
        tempPassword,
        newPassword,
      });

      if (res?.Result === "SUCCESS") {
        toast.success(res?.message || "Password updated successfully");
        router.push("/auth/login");
      } else {
        toast.error(res?.message || "Failed to update password");
      }
    } catch (error: any) {
      console.error("Password update failed:", error);
      toast.error(
        error?.response?.data?.message || "An unexpected error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  // Loading spinner while verifying token
  if (isTokenValid === null) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Password form once token is valid
  return (
    <div className="flex items-center justify-center h-screen">
      <form
        className="flex flex-col gap-4 w-full max-w-sm p-6 border rounded-md shadow-md"
        onSubmit={handlePasswordSubmit}>
        <h2 className="text-xl font-semibold text-center">Set New Password</h2>

        <input
          type="password"
          placeholder="Temporary Password"
          value={tempPassword}
          onChange={(e) => setTempPassword(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="border p-2 rounded"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          {loading ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
}

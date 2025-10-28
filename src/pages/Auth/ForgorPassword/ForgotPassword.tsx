"use client";

import React, { useEffect, useState } from "react";
import {
  requestPasswordReset,
  resetPassword,
  verifyResetToken,
} from "@/services/Auth/authServices";
import { useSearchParams, useRouter } from "next/navigation";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<"request" | "reset" | "done">("request");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams?.get("token");

  // Auto verify token on load
  useEffect(() => {
    const autoVerify = async () => {
      if (token) {
        setLoading(true);
        try {
          const res = await verifyResetToken({ token });
          setMessage(res.message || "Token verified successfully.");
          setStatus("reset");
        } catch (error: any) {
          setMessage(
            error?.response?.data?.message || "Invalid or expired reset link."
          );
          setStatus("request");
        } finally {
          setLoading(false);
        }
      }
    };
    autoVerify();
  }, [token]);

  // Redirect after success
  useEffect(() => {
    if (status === "done") {
      const timer = setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [status, router]);

  // Request reset link
  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await requestPasswordReset({ email });
      setMessage(res.message || "Reset link sent to your email.");
    } catch (error: any) {
      setMessage(
        error?.response?.data?.message || "Failed to send reset email."
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle password reset
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) return setMessage("Token missing.");
    if (newPassword !== confirmPassword)
      return setMessage("Passwords do not match.");

    setLoading(true);
    try {
      const res = await resetPassword({ token, newPassword });
      setMessage(res.message || "Password updated successfully!");
      setStatus("done");
    } catch (error: any) {
      setMessage(error?.response?.data?.message || "Password reset failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-sm text-center">
        <h2 className="text-xl font-semibold text-blue-600 mb-4">
          Forgot Password
        </h2>

        {message && (
          <p
            className={`text-sm px-3 py-2 rounded mb-3 ${
              message.toLowerCase().includes("success")
                ? "text-green-700 bg-green-50"
                : "text-blue-700 bg-blue-50"
            }`}>
            {message}
          </p>
        )}

        {/* Step 1: Enter Email */}
        {status === "request" && (
          <form onSubmit={handleRequestReset} className="space-y-3 text-left">
            <label className="block text-sm font-medium text-gray-700">
              Enter your email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        )}

        {/* Step 2: Enter New Password */}
        {status === "reset" && (
          <form onSubmit={handleResetPassword} className="space-y-3 text-left">
            <label className="block text-sm font-medium text-gray-700">
              New password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
            />

            <label className="block text-sm font-medium text-gray-700">
              Confirm password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
              {loading ? "Updating..." : "Reset Password"}
            </button>
          </form>
        )}

        {/* Step 3: Success */}
        {status === "done" && (
          <div>
            <p className="text-green-600 font-medium text-sm mb-3">
              Password updated successfully! Redirecting to login...
            </p>
            <a
              href="/auth/login"
              className="text-blue-600 text-sm font-medium hover:underline">
              Back to Login
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;

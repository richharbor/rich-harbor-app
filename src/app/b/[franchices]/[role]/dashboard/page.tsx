"use client";

import { useParams } from "next/navigation";
import Dashboard from "@/pages/Users/Dashboard/Dashboard";

export default function DashboardPage() {
  const params = useParams(); // { franchiseOrRole: string, role?: string }

  console.log(params); // Useful for role-based logic

  return <Dashboard />;
}

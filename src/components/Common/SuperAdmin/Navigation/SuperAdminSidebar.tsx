"use client";

import * as React from "react";
import {
  AudioWaveform,
  BanknoteArrowDown,
  BanknoteArrowUp,
  BookOpen,
  Bot,
  Command,
  GalleryVerticalEnd,
  Settings2,
  Sparkles,
  SquareTerminal,
} from "lucide-react";

import { NavMain } from "@/components/Common/Providers/nav-main";
import { NavUser } from "@/components/Common/Providers/nav-user";
import { RoleSwitcher } from "@/components/Common/Providers/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";

import {
  getCurrentUser,
  getAllRoles,
  assignRoleToUser,
  getUserRoles,
  switchRole,
} from "@/services/Common/Role/roleServices";
import Cookies from "js-cookie";
import { ComponentProps, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function SuperAdminSidebar(props: ComponentProps<typeof Sidebar>) {
  const [user, setUser] = useState<any>(null);
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  async function fetchData() {
    try {
      const userData = await getCurrentUser();
      const userRoleData = await getUserRoles(userData.id);

      setUser(userRoleData);
      setRoles(userRoleData.assignedRoles);
    } catch (error) {
      console.error("Failed to load sidebar data", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const handleRoleChange = async (role: any) => {
    if (!user) return;
    try {
      const response = await switchRole({ roleId: role.id });
      Cookies.set("authToken", response.accessToken);

      router.push("/");
    } catch (error) {
      console.error("Failed to switch role", error);
    }
  };
  const navMain = [
    {
      title: "Dashboard",
      url: "/superadmin/dashboard",
      icon: SquareTerminal,
    },
    {
      title: "Buying",
      url: "/superadmin/buying",
      icon: BanknoteArrowUp,
    },
    {
      title: "Selling",
      url: "/superadmin/selling",
      icon: BanknoteArrowDown,
    },
    {
      title: "Best Deals",
      url: "/superadmin/best-deals",
      icon: Sparkles,
    },
    {
      title: "Partners",
      url: "/superadmin/partners",
      icon: Sparkles,
    },
  ];

  if (loading) {
    return (
      <Sidebar {...props}>
        <SidebarHeader>
          <div className="px-4 py-2 text-sm text-muted-foreground">
            Loading...
          </div>
        </SidebarHeader>
      </Sidebar>
    );
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        {user && (
          <RoleSwitcher
            currentRole={user.currentRole}
            availableRoles={roles}
            onRoleChange={handleRoleChange}
          />
        )}
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarFooter>{user && <NavUser user={user} />}</SidebarFooter>
    </Sidebar>
  );
}

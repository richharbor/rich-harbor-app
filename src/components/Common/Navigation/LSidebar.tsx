"use client";

import * as React from "react";
import {
  BanknoteArrowDown,
  BanknoteArrowUp,
  Sparkles,
  SquareTerminal,
  Users,
  FileText,
  ShoppingCart,
  UserCog,
  Building2,
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

import { switchRole } from "@/services/Role/roleServices";
import Cookies from "js-cookie";
import { ComponentProps, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuthStore, { Role } from "@/helpers/authStore";

export function LSidebar(props: ComponentProps<typeof Sidebar>) {
  const router = useRouter();
  const { user, allRoles, currentRole } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && allRoles.length > 0) {
      setLoading(false);
    }
  }, [user, allRoles]);

  const handleRoleChange = async (role: Role) => {
    if (!user) return;
    try {
      const response = await switchRole({ roleId: role.id });

      Cookies.set("authToken", response.token);
      Cookies.set("currentRole", role.name);
      useAuthStore.getState().setCurrentRole(role.id);

      router.push(`/${role.name}/dashboard`);
    } catch (error) {
      console.error("Failed to switch role", error);
    }
  };

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

  const role = useAuthStore.getState().currentRole;

  // All possible nav items with required permissions
  const allNavItems = [
    {
      title: "Dashboard",
      url: `/${role?.name}/dashboard`,
      icon: SquareTerminal,
      permission: "dashboard",
    },
    {
      title: "Buy",
      url: `/${role?.name}/buy`,
      icon: BanknoteArrowUp,
      permission: "buying",
    },
    {
      title: "Sell",
      url: `/${role?.name}/sell`,
      icon: BanknoteArrowDown,
      permission: "selling",
    },
    {
      title: "Best Deals",
      url: `/${role?.name}/best-deals`,
      icon: Sparkles,
      permission: "best_deals",
    },
    // {
    //   title: "Products",
    //   url: `/${role?.name}/products`,
    //   icon: ShoppingCart,
    //   permission: "manage_products",
    // },
    // {
    //   title: "Users",
    //   url: `/${role?.name}/users`,
    //   icon: Users,
    //   permission: "manage_users",
    // },
    // {
    //   title: "Reports",
    //   url: `/${role?.name}/reports`,
    //   icon: FileText,
    //   permission: "view_reports",
    // },
    {
      title: "Teams",
      url: `/${role?.name}/teams`,
      icon: UserCog,
      permission: "manage_team", // visible to Super Admin & Admin
    },
    {
      title: "Franchises",
      url: `/${role?.name}/franchises`,
      icon: Building2,
      permission: "manage_franchise", // visible to Super Admin, Admin, Franchise Admin
    },
    {
      title: "Partners",
      url: `/${role?.name}/partners`,
      icon: Sparkles,
      permission: "manage_partners", // visible to Super Admin only
    },
  ];

  // SuperAdmin → all permissions
  // Filter nav items based on role
  let navMain = [];

  if (role?.name === "superadmin") {
    // SuperAdmin → all items
    navMain = allNavItems;
  } else if (role?.name === "franchise-admin") {
    // Franchises Admin → all except Teams & Franchises
    navMain = allNavItems.filter(
      (item) =>
        item.permission !== "manage_team" &&
        item.permission !== "manage_franchise"
    );
  } else {
    // Other roles → filter based on permissions
    navMain = allNavItems.filter((item) =>
      role?.permissions?.includes(item.permission)
    );
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        {user && currentRole && (
          <RoleSwitcher
            currentRole={currentRole}
            availableRoles={allRoles}
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

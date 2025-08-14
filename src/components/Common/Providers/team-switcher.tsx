"use client";
import { ChevronsUpDown, Shield } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

interface Role {
  id: number;
  name: string;
  description: string;
}

export function RoleSwitcher({
  currentRole,
  availableRoles,
  onRoleChange,
}: {
  currentRole: Role;
  availableRoles: Role[];
  onRoleChange: (role: Role) => void;
}) {
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <Shield className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{currentRole.name}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {currentRole.description}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          {availableRoles.length > 0 && (
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              align="start"
              side={isMobile ? "bottom" : "right"}
              sideOffset={4}
            >
              <DropdownMenuLabel className="text-muted-foreground text-xs">
                Switch Role
              </DropdownMenuLabel>
              {availableRoles.map((role, index) => (
                <DropdownMenuItem
                  key={role.id}
                  onClick={() => onRoleChange(role)}
                  className="gap-2 p-2"
                >
                  <div className="flex size-6 items-center justify-center rounded-md border">
                    <Shield className="size-3.5 shrink-0" />
                  </div>
                  <div className="flex flex-col flex-1">
                    <span className="font-medium">{role.name}</span>
                    <span className="text-xs text-muted-foreground truncate">
                      {role.description}
                    </span>
                  </div>
                  <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          )}
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

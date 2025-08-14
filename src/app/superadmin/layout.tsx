import type { Metadata } from "next";
import { SuperAdminSidebar } from "@/components/Common/SuperAdmin/Navigation/SuperAdminSidebar";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ThemeModeToggle } from "@/components/Common/Providers/ThemeModeToggle";

export const metadata: Metadata = {
  title: "Rich Harbor | Super Admin",
};

export default function SuperAdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex min-h-screen w-full flex-col">
      <SidebarProvider>
        <SuperAdminSidebar />
        <SidebarInset>
          <header className="flex bg-sidebar h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center justify-between px-4 w-full">
              <SidebarTrigger className="-ml-1" />
              <ThemeModeToggle />
            </div>
          </header>
          <div className="flex flex-1 flex-col m-2 mt-0 bg-background rounded-lg border-2 border-border">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </main>
  );
}

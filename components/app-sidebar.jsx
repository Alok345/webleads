"use client";
import * as React from "react";
import { GalleryVerticalEnd } from "lucide-react";
import { useRouter } from "next/navigation";

import { SearchForm } from "@/components/search-form";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Button } from "./ui/button";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
    },
    {
      title: "NRI 1501",
      url: "/nri-1501",
    },
    
    {
      title: "NRI 1502",
      url: "/nri-1502",
    },
    {
      title: "NRI 1503",
      url: "/nri-1503",
    },
    {
      title: "Health Nri 1",
      url: "/health-nri-1",
    },
    {
      title: "Health Nri 2",
      url: "/health-nri-2",
    },
    {
      title: "Domestic Gujrat",
      url: "/dom-guj-01",
    },
    
  ],
};


export function AppSidebar(props) {

  const router = useRouter();

function handleLogout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  router.push("/login");
}

  return (
    <Sidebar {...props}>
      {/* HEADER LOGO */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">Web Leads</span>
                  <span className="text-xs opacity-70">v1.0.0</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <SearchForm />
      </SidebarHeader>

      {/* MAIN MENU */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {data.navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <a href={item.url}>{item.title}</a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        
      </SidebarContent>
<SidebarGroup>
  <SidebarMenu>
    <SidebarMenuItem>
      <Button 
        variant="destructive"
        className="w-full"
        onClick={handleLogout}
      >
        Logout
      </Button>
    </SidebarMenuItem>
  </SidebarMenu>
</SidebarGroup>

      <SidebarRail />
    </Sidebar>
  );
}

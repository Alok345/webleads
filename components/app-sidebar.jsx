"use client";
import * as React from "react";
import { GalleryVerticalEnd, ChevronDown, ChevronRight } from "lucide-react";
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
import { useState } from "react";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      type: "single",
    },
    {
      title: "NRI Leads",
      type: "dropdown",
      items: [
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
          title: "NRI 1504",
          url: "/nri-1504",
        },
      ],
    },
    {
      title: "Health NRI Leads",
      type: "dropdown",
      items: [
        {
          title: "Health NRI 1",
          url: "/health-nri-1",
        },
        {
          title: "Health NRI 2",
          url: "/health-nri-2",
        },
      ],
    },
    {
      title: "Domestic Leads",
      type: "dropdown",
      items: [
        {
          title: "Gujarat 1509",
          url: "/dom-guj-01",
        },
        {
          title: "English 1503",
          url: "/dom-eng-01",
        },
        {
          title: "Hindi 1504",
          url: "/dom-hin-01",
        },
        {
          title: "Malayalam",
          url: "/dom-mal-01",
        },
        {
          title: "Marathi 1508",
          url: "/dom-mar-01",
        },
        {
          title: "Punjabi 1512",
          url: "/dom-pun-01",
        },
        {
          title: "Telugu",
          url: "/dom-tel-01",
        },
        {
          title: "Bengali 1510",
          url: "/dom-ben-01",
        },
      ],
    },
  ],
};

export function AppSidebar(props) {
  const router = useRouter();
  const [expandedDropdowns, setExpandedDropdowns] = useState({});

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  }

  const toggleDropdown = (title) => {
    setExpandedDropdowns((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

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
            {data.navMain.map((item) => {
              if (item.type === "single") {
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>{item.title}</a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              }

              if (item.type === "dropdown") {
                const isExpanded = expandedDropdowns[item.title];
                return (
                  <React.Fragment key={item.title}>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        onClick={() => toggleDropdown(item.title)}
                        className="justify-between cursor-pointer"
                      >
                        <span>{item.title}</span>
                        {isExpanded ? (
                          <ChevronDown className="size-4" />
                        ) : (
                          <ChevronRight className="size-4" />
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    
                    {/* Dropdown Items */}
                    {isExpanded && (
                      <div className="ml-4 pl-2 border-l border-sidebar-border">
                        <SidebarMenu>
                          {item.items.map((subItem) => (
                            <SidebarMenuItem key={subItem.title}>
                              <SidebarMenuButton asChild className="pl-6">
                                <a href={subItem.url}>{subItem.title}</a>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          ))}
                        </SidebarMenu>
                      </div>
                    )}
                  </React.Fragment>
                );
              }

              return null;
            })}
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
"use client";

import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  CreditCard,
  Users,
  Settings,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
import { useState } from "react";

interface SidebarProps {
  userRole: "admin" | "analyst";
  onLogout: () => void;
}

const navItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    active: true,
  },
  {
    label: "Transactions",
    icon: CreditCard,
    active: false,
  },
  {
    label: "Users",
    icon: Users,
    active: false,
    adminOnly: true,
  },
  {
    label: "Settings",
    icon: Settings,
    active: false,
  },
];

export function DashboardSidebar({ userRole, onLogout }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  const filteredNavItems = navItems.filter(item => 
    !item.adminOnly || userRole === "admin"
  );

  return (
    <aside
      className={cn(
        "hidden h-screen flex-col border-r border-border bg-card/80 backdrop-blur md:flex transition-all duration-300",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo + Collapse */}
      <div className="flex items-center justify-between px-4 pt-6 pb-5">
        {!collapsed && (
          <Image src="/logo.png" alt="Logo" width={100} height={40} />
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="rounded-md p-1 hover:bg-muted"
        >
          {collapsed ? (
            <PanelLeftOpen className="size-4" />
          ) : (
            <PanelLeftClose className="size-4" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-1 px-2">
        {filteredNavItems.map((item) => (
          <button
            key={item.label}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
              item.active
                ? "bg-sidebar-accent text-primary shadow-sm"
                : "text-sidebar-foreground hover:bg-sidebar-accent/50"
            )}
          >
            <item.icon className="size-[18px]" />

            {!collapsed && (
              <span className="flex-1 text-left">{item.label}</span>
            )}
          </button>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="flex flex-col gap-1 border-t border-border px-2 pt-3 pb-4">
        <button 
          onClick={onLogout}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent/50"
        >
          <LogOut className="size-[18px]" />
          {!collapsed && <span>Logout</span>}
        </button>

        {/* User */}
        <div className="flex items-center gap-3 rounded-xl px-3 py-2.5">
          <Avatar className="size-8">
            <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
              {userRole === "admin" ? "AD" : "AN"}
            </AvatarFallback>
          </Avatar>

          {!collapsed && (
            <div className="flex flex-1 flex-col">
              <span className="text-xs font-semibold text-foreground">
                {userRole === "admin" ? "Admin User" : "Analyst User"}
              </span>
              <span className="truncate text-[10px] text-muted-foreground">
                Role: {userRole}
              </span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
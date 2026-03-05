"use client";

import { Bell, Menu, Search, X } from "lucide-react";
import Image from "next/image";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { sidebarNavItems } from "./data";

export function Header() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <>
      <header className="border-b border-border/80 bg-card/60 px-4 py-4 backdrop-blur md:px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileNavOpen(true)}
              className="flex size-10 items-center justify-center rounded-full border border-border bg-card text-muted-foreground md:hidden"
              aria-label="Open navigation"
            >
              <Menu className="size-4" />
            </button>

            <Avatar className="size-10 border-2 border-primary/20">
              <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
                <Image
                  src="/avatar.png"
                  alt="avatar"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm text-muted-foreground">Good morning</p>
              <h1 className="text-lg font-semibold text-foreground">
                Emmanuel Israel
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <div className="relative flex-1 md:w-64 md:flex-none">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search"
                className="h-10 rounded-full bg-background pl-9"
              />
            </div>

            <button className="flex size-10 items-center justify-center rounded-full border border-border bg-card text-muted-foreground hover:text-foreground">
              <Bell className="size-4" />
            </button>

            <div className="hidden size-9 items-center justify-center rounded-full border border-border bg-card text-xs font-medium text-muted-foreground md:flex">
              RK
            </div>

            <Avatar className="size-9 border border-border">
              <AvatarFallback className="bg-primary text-xs font-semibold text-primary-foreground">
                EI
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            aria-label="Close navigation overlay"
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileNavOpen(false)}
          />

          <aside className="relative z-10 flex h-full w-[82%] max-w-[300px] flex-col border-r border-border bg-card p-4">
            <div className="mb-4 flex items-center justify-between">
              <Image src="/logo.png" alt="Logo" width={95} height={34} />
              <button
                onClick={() => setMobileNavOpen(false)}
                className="rounded-md p-1 text-muted-foreground hover:bg-muted"
                aria-label="Close navigation"
              >
                <X className="size-4" />
              </button>
            </div>

            <nav className="flex flex-1 flex-col gap-1">
              {sidebarNavItems.map((item) => (
                <button
                  key={item.label}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                    item.active
                      ? "bg-sidebar-accent text-primary"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                  }`}
                >
                  <item.icon className="size-[18px]" />
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge ? (
                    <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                      {item.badge}
                    </span>
                  ) : null}
                </button>
              ))}
            </nav>

            <div className="mt-4 rounded-xl border border-border px-3 py-2.5">
              <p className="text-xs font-semibold text-foreground">Emmanuel Israel</p>
              <p className="truncate text-[10px] text-muted-foreground">
                emmanuel.e.isra...
              </p>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}

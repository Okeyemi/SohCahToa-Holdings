"use client";

import { cn } from "@/lib/utils";
import {
  ChevronDown,
  Flag,
  Info,
} from "lucide-react";
import { useState } from "react";
import { fxActionButtons } from "./data";
import { USFlagIcon } from "./us-flag-icon";

type FxTab = "FX bought" | "FX sold" | "Others";

const fxTabs: FxTab[] = ["FX bought", "FX sold", "Others"];

function ActionButtonItem({
  icon: Icon,
  label,
}: {
  icon: React.ElementType;
  label: string;
}) {
  return (
    <button className="flex min-w-0 flex-1 flex-col items-center gap-2 rounded-xl border border-border/80 bg-background px-2 py-3 transition-colors hover:bg-muted/80">
      <div className="flex size-10 items-center justify-center rounded-lg border border-border bg-card transition-colors">
        <Icon className="size-[18px] text-foreground" />
      </div>

      <span className="text-[11px] font-medium text-muted-foreground md:text-xs">
        {label}
      </span>
    </button>
  );
}

export function FxOverview() {
  const [activeTab, setActiveTab] = useState<FxTab>("FX bought");

  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-sm md:p-6">
      {/* Tabs + Currency */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-1">
          {fxTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                activeTab === tab
                  ? "bg-primary/10 text-primary shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        <button className="flex w-fit items-center gap-1.5 rounded-full bg-black px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-sm">
          <USFlagIcon className="size-3" />
          USD
          <ChevronDown className="size-3.5 opacity-90" />
        </button>
      </div>

      {/* Balance */}
      <div className="mt-6">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-medium text-muted-foreground">
            Total FX balance
          </span>
          <Info className="size-3 text-muted-foreground" />
        </div>

        <div className="mt-1.5 flex items-baseline gap-1.5">
          <span className="text-base font-medium text-muted-foreground">$</span>

          <span className="text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
            67,048
          </span>

          <span className="text-lg font-bold text-foreground">.00</span>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        {fxActionButtons.map((action) => (
          <ActionButtonItem key={action.label} {...action} />
        ))}
      </div>
    </section>
  );
}
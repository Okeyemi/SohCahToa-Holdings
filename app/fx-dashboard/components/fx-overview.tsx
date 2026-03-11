"use client";

import { cn } from "@/lib/utils";
import { ChevronDown, Info } from "lucide-react";
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
    <button className="flex flex-1 flex-col items-center gap-1.5 rounded-xl border border-border bg-background py-3 transition hover:bg-muted/60">
      
      <div className="flex size-9 items-center justify-center rounded-lg border border-border bg-card">
        <Icon className="size-[17px]" />
      </div>

      <span className="text-[11px] font-medium text-muted-foreground">
        {label}
      </span>
    </button>
  );
}

export function FxOverview() {
  const [activeTab, setActiveTab] = useState<FxTab>("FX bought");

  return (
    <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      
      {/* Tabs + Currency */}
      <div className="flex items-center justify-between">

        {/* Tabs */}
        <div className="flex items-center gap-1">
          {fxTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition",
                activeTab === tab
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Currency */}
        <button className="flex items-center gap-1.5 rounded-full bg-black px-3 py-1 text-xs font-semibold text-white">
          <USFlagIcon className="size-3" />
          USD
          <ChevronDown className="size-3.5 opacity-80" />
        </button>
      </div>

      {/* Balance */}
      <div className="mt-5">
        <div className="flex items-center gap-1">
          <span className="text-xs text-muted-foreground">
            Total FX units
          </span>
          <Info className="size-3 text-muted-foreground" />
        </div>

        <div className="mt-1 flex items-end gap-1">
          <span className="text-base text-muted-foreground">$</span>

          <span className="text-[34px] font-bold tracking-tight">
            67,048
          </span>

          <span className="text-lg font-semibold">.00</span>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-5 grid grid-cols-3 gap-3">
        {fxActionButtons.map((action) => (
          <ActionButtonItem key={action.label} {...action} />
        ))}
      </div>
    </section>
  );
}
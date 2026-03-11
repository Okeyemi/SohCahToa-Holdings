"use client";

import { cn } from "@/lib/utils";
import { ChevronDown, Eye, EyeOff} from "lucide-react";
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
    <button className="flex flex-1 flex-col items-center gap-1.5 rounded-xl border border-border bg-card py-2 sm:py-3 transition hover:bg-muted/60 min-w-0 ">
      
      <div className="flex size-8 sm:size-9 items-center justify-center rounded-lg bg-card">
        <Icon className="size-4 sm:size-[17px]" />
      </div>

      <span className="text-[10px] sm:text-[11px] font-medium text-muted-foreground truncate px-1">
        {label}
      </span>
    </button>
  );
}

export function FxOverview() {
  const [activeTab, setActiveTab] = useState<FxTab>("FX bought");
  const [isVisible, setIsVisible] = useState(true);

  return (
    <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      
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
          <button
            onClick={() => setIsVisible(!isVisible)}
            className="text-foreground hover:text-foreground transition cursor-pointer"
            aria-label={isVisible ? "Hide amount" : "Show amount"}
          >
            {isVisible ? <Eye className="size-3"  /> : <EyeOff className="size-3" />}
          </button>
        </div>

       <div className="mt-1 flex items-baseline gap-1">
        {isVisible ? (
          <>
            <div className="bg-muted/40 rounded-full px-1 ">
              <span className="text-sm text-muted-foreground">$</span>
            </div>
            <span className="text-3xl font-semibold tracking-tight">
              67,048
            </span>
            <span className="text-sm text-muted-foreground">
              .00
            </span>
          </>
        ) : (
          <span className="text-3xl font-semibold tracking-tight">••••••</span>
        )}
</div>
      </div>

      {/* Actions */}
      <div className="mt-5 grid md:grid-cols-5 grid-cols-3 gap-1 sm:gap-2">
        {fxActionButtons.map((action) => (
          <ActionButtonItem key={action.label} {...action} />
        ))}
      </div>
    </section>
  );
}
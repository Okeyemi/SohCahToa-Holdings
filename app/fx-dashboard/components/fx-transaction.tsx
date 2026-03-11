"use client";

import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { useMemo, useState } from "react";
import { filterTabs, FilterType, fxTransactions, FxTransaction } from "./data";

function TransactionItem({ tx }: { tx: FxTransaction }) {
  const isOutgoing = tx.type === "outgoing";

  return (
    <div className="flex items-center gap-3 rounded-xl border border-transparent px-2 py-3 transition-colors hover:border-border hover:bg-card">
      {/* Icon */}
      <div
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-full",
          isOutgoing ? "bg-destructive/10" : "bg-green-500/10"
        )}
      >
        {isOutgoing ? (
          <ArrowUpRight className="size-4 text-destructive" />
        ) : (
          <ArrowDownLeft className="size-4 text-green-500" />
        )}
      </div>

      {/* Transaction details */}
      <div className="flex flex-1 flex-col">
        <span className="text-sm font-medium text-foreground">
          {tx.title}
        </span>
        <span className="text-[11px] text-muted-foreground">
          {tx.date}
        </span>
      </div>

      {/* Amount */}
      <span
        className={cn(
          "text-sm font-semibold",
          isOutgoing ? "text-foreground" : "text-green-600"
        )}
      >
        {isOutgoing ? "-" : "+"}${tx.amount.toFixed(2)}
      </span>
    </div>
  );
}

export function FxTransactions() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("All");
  
  const filteredTransactions = useMemo(() => {
    if (activeFilter === "All") return fxTransactions;
    return fxTransactions.filter((tx) => tx.category === activeFilter);
  }, [activeFilter]);

  return (
    <section className="mt-6 rounded-2xl border border-border bg-card p-5 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground md:text-base">
          FX Transactions
        </h3>

        <button className="text-xs font-medium text-muted-foreground hover:text-foreground">
          See all
        </button>
      </div>

      {/* Filters */}
      <div className="mt-3 flex flex-wrap items-center gap-1">
        {filterTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
              activeFilter === tab
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Transactions */}
      <div className="mt-4 flex flex-col gap-0.5">
        {filteredTransactions.map((tx) => (
          <TransactionItem key={tx.id} tx={tx} />
        ))}
      </div>
    </section>
  );
}
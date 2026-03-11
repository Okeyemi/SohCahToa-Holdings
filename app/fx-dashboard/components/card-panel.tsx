"use client";

import Image from "next/image";
import { Plus, ArrowUpRight, ArrowDownLeft, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import { cardTransactions, CardTransaction } from "./data";

function CardTransactionItem({ tx }: { tx: CardTransaction }) {
  const isOutgoing = tx.type === "outgoing";
  const isIncoming = tx.type === "incoming";

  return (
    <div className="flex items-center gap-3 rounded-lg py-2.5 px-1 transition hover:bg-muted/50">
      <div
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-full",
          isIncoming
            ? "bg-green-500/10"
            : isOutgoing
            ? "bg-destructive/10"
            : "bg-muted"
        )}
      >
        {isOutgoing && (
          <ArrowUpRight className="size-3.5 text-destructive" />
        )}

        {isIncoming && (
          <ArrowDownLeft className="size-3.5 text-green-600" />
        )}

        {tx.type === "wallet" && (
          <Wallet className="size-3.5 text-muted-foreground" />
        )}
      </div>

      <div className="flex flex-1 flex-col">
        <span className="text-xs font-medium text-foreground">
          {tx.title}
        </span>
        <span className="text-[10px] text-muted-foreground">
          {tx.date}
        </span>
      </div>

      <span
        className={cn(
          "text-xs font-semibold",
          isIncoming ? "text-green-600" : "text-foreground"
        )}
      >
        {isIncoming ? "+" : "-"}${tx.amount.toFixed(2)}
      </span>
    </div>
  );
}

export function CardsPanel() {
  return (
    <div className="rounded-2xl border border-border bg-card p-3">
      <aside className="flex w-full shrink-0 flex-col gap-6">
        {/* Card Section */}
        <div className="rounded-2xl border border-border bg-background p-4">
      
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground md:text-base">
              Cards
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative flex-1 overflow-hidden  transition hover:shadow-sm h-[156px] rounded-2xl">
              
              <Image
                src="/card.png"
                alt="Visa card"
                fill
                priority
                className="object-cover"
              />
            </div>
          
            <button 
              type="button"
              aria-label="Add new card"
              className="flex  items-center h-[156px] size-11 justify-center rounded-xl border-2 border-dashed border-border text-muted-foreground transition hover:border-primary hover:text-primary"
            >
              <Plus className="size-5" />
            </button>
          </div>
        </div>

        {/* Card Transactions */}
        <div className="rounded-2xl border border-border bg-background p-5">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-foreground">
              Card transactions
            </h4>

            <button className="text-xs font-medium text-muted-foreground hover:text-foreground">
              See all
            </button>
          </div>

          <div className="mt-3 flex flex-col gap-0.5">
            {cardTransactions.map((tx) => (
              <CardTransactionItem key={tx.id} tx={tx} />
            ))}
          </div>
        </div>

        {/* Transaction Flow */}
        <div className="rounded-2xl border border-border bg-background p-5">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold text-foreground">
              Card transaction flows
            </h4>

            <span className="text-xs font-bold text-primary">
              +$3,048.00
            </span>
          </div>

          <div className="mt-4 flex flex-col gap-4">
            {/* Money In */}
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground">
                  Money in
                </span>

                <span className="text-xs font-semibold text-foreground">
                  $4,046.00
                </span>
              </div>

              <div className="mt-2 h-2.5 w-full rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-green-500"
                  style={{ width: "35%" }}
                />
              </div>
            </div>

            {/* Money Out */}
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground">
                  Money out
                </span>

                <span className="text-xs font-semibold text-foreground">
                  $1,046.00
                </span>
              </div>

              <div className="mt-2 h-2.5 w-full rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: "80%" }}
                />
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

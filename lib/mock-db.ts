import { Transaction } from "@/types/transaction";

export const transactions: Transaction[] = Array.from(
  { length: 120 },
  (_, i) => ({
    id: String(i + 1),
    amount: Math.floor(Math.random() * 100000),
    status: ["success", "pending", "failed"][
      Math.floor(Math.random() * 3)
    ] as Transaction["status"],
    date: new Date(
      Date.now() - Math.random() * 1000000000
    ).toISOString(),
    description:
      i === 5
        ? '<script>alert("xss")</script>'
        : "Payment transaction",
    cardLast4: String(1000 + i).slice(-4),
  })
);
export type TransactionStatus =
  | "success"
  | "pending"
  | "failed"
  | "flagged";

export interface Transaction {
  id: string;
  amount: number;
  status: TransactionStatus;
  date: string;
  description: string;
  cardLast4: string;
  flagged?: boolean;
  internalNote?: string;
}
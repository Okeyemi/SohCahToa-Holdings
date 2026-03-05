import {
  ArrowDownToLine,
  ArrowLeftRight,
  ArrowUpFromLine,
  Calculator,
  CreditCard,
  Home,
  LayoutGrid,
  Wallet,
} from "lucide-react";

export const sidebarNavItems = [
  { icon: Home, label: "Home", active: true, badge: null },
  { icon: LayoutGrid, label: "Dashboard", active: false, badge: null },
  { icon: Calculator, label: "Calculator", active: false, badge: null },
  { icon: ArrowLeftRight, label: "Transactions", active: false, badge: null },
  { icon: CreditCard, label: "Cards", active: false, badge: 2 },
];

export const fxActionButtons = [
  { icon: ArrowDownToLine, label: "Buy FX" },
  { icon: ArrowUpFromLine, label: "Sell FX" },
  { icon: Wallet, label: "Receive" },
];

export type FilterType = "All" | "FX" | "PTA" | "BTA" | "Medicals";

export const filterTabs: FilterType[] = ["All", "FX", "PTA", "BTA", "Medicals"];

export interface FxTransaction {
  id: string;
  type: "outgoing" | "incoming";
  title: string;
  date: string;
  amount: number;
  category: Exclude<FilterType, "All">;
}

export const fxTransactions: FxTransaction[] = [
  {
    id: "1",
    type: "outgoing",
    title: "Transfer to Ruth",
    date: "Fri, Apr 18, 2025 • 7:32PM",
    amount: 7.54,
    category: "FX",
  },
  {
    id: "2",
    type: "incoming",
    title: "Transfer from Tobi",
    date: "Sat, Mar 2, 2025 • 6:59AM",
    amount: 3,
    category: "PTA",
  },
  {
    id: "3",
    type: "outgoing",
    title: "Transfer to Esrael",
    date: "Sat, Mar 2, 2025 • 10:08AM",
    amount: 200,
    category: "BTA",
  },
  {
    id: "4",
    type: "outgoing",
    title: "Wallet to wallet",
    date: "Mon, Feb 19, 2025 • 4:27PM",
    amount: 10.53,
    category: "FX",
  },
  {
    id: "5",
    type: "incoming",
    title: "Transfer from Tochukwu",
    date: "Tue, Feb 7, 2025 • 11:50PM",
    amount: 850.89,
    category: "Medicals",
  },
];

export interface CardTransaction {
  id: string;
  type: "outgoing" | "incoming" | "wallet";
  title: string;
  date: string;
  amount: number;
}

export const cardTransactions: CardTransaction[] = [
  {
    id: "1",
    type: "outgoing",
    title: "Transfer to Ruth",
    date: "Fri, Apr 18, 2025 • 7:32PM",
    amount: 7.54,
  },
  {
    id: "2",
    type: "wallet",
    title: "Wallet to wallet",
    date: "Sat, Mar 2, 2025 • 8:12AM",
    amount: 14,
  },
  {
    id: "3",
    type: "incoming",
    title: "Transfer from Tochukwu",
    date: "Tue, Feb 1, 2025 • 11:50PM",
    amount: 850.89,
  },
];

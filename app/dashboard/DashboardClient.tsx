"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Transaction } from "@/types/transaction";
import { useGetTransactionsQuery, useFlagTransactionMutation } from "@/store/api";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { setTransactions, updateTransactionOptimistically } from "@/store/transactionSlice";
import { DashboardSidebar } from "./components/DashboardSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Props {
  initialData: {
    data: Transaction[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
  userRole: "admin" | "analyst";
}

export default function DashboardClient({ initialData, userRole }: Props) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { data: reduxTransactions } = useAppSelector(state => state.transactions);
  
  const [mounted, setMounted] = useState(false);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  
  const { data: apiData, error, isLoading } = useGetTransactionsQuery({
    page,
    limit: 10,
    status: status || undefined,
    sort: sortBy,
    order,
    from: dateFrom || undefined,
    to: dateTo || undefined,
  });
  
  const [flagTransaction] = useFlagTransactionMutation();
  
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [note, setNote] = useState("");
  
  const eventSourceRef = useRef<EventSource | null>(null);
  const seenIdsRef = useRef(new Set<string>());

  const transactions = apiData?.data || initialData.data;
  const meta = apiData?.meta || initialData.meta;

  useEffect(() => {
    if (apiData) {
      dispatch(setTransactions({
        data: apiData.data,
        page: apiData.meta.page,
        total: apiData.meta.total
      }));
    }
  }, [apiData, dispatch]);

  useEffect(() => {
    transactions.forEach(t => seenIdsRef.current.add(t.id));
  }, [transactions]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return; // Wait for hydration to complete
    
    eventSourceRef.current = new EventSource("/api/transactions/stream");
    
    eventSourceRef.current.onmessage = (event) => {
      try {
        const newTx: Transaction = JSON.parse(event.data);
        
        if (!seenIdsRef.current.has(newTx.id)) {
          seenIdsRef.current.add(newTx.id);
          
          dispatch(setTransactions({
            data: [newTx, ...reduxTransactions].slice(0, 10),
            page: meta.page,
            total: meta.total + 1
          }));
        }
      } catch (err) {
        console.error("SSE parse error:", err);
      }
    };

    return () => {
      eventSourceRef.current?.close();
    };
  }, [dispatch, reduxTransactions, meta, mounted]);

  const handleFlag = async () => {
    if (!selectedTransaction) return;
    
    if (userRole !== "admin") {
      alert("Only admins can flag transactions");
      return;
    }

    // Store previous state for rollback
    const previousData = [...transactions];
    const previousTransaction = { ...selectedTransaction };

    // Optimistic update
    dispatch(updateTransactionOptimistically({
      id: selectedTransaction.id,
      flagged: true,
      note,
    }));

    // Update local state immediately
    setSelectedTransaction({
      ...selectedTransaction,
      flagged: true,
      internalNote: note,
      status: "flagged",
    });

    try {
      await flagTransaction({ 
        id: selectedTransaction.id, 
        note 
      }).unwrap();
      
      // Success - close panel
      setSelectedTransaction(null);
      setNote("");
    } catch (err) {
      // Rollback on failure
      dispatch(setTransactions({
        data: previousData,
        page: meta.page,
        total: meta.total,
      }));
      setSelectedTransaction(previousTransaction);
      alert("Failed to flag transaction. Changes have been reverted.");
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      success: "default",
      pending: "secondary",
      failed: "destructive",
      flagged: "destructive",
    };
    return <Badge variant={variants[status] || "default"}>{status}</Badge>;
  };

  return (
    <div className="flex h-screen overflow-hidden bg-muted/40">
      <DashboardSidebar userRole={userRole} onLogout={handleLogout} />
      
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Transaction Dashboard</h1>
              <p className="text-sm text-muted-foreground">Monitor and manage transactions</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">

        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium">Status</label>
                <select
                  value={status}
                  onChange={(e) => { setStatus(e.target.value); setPage(1); }}
                  className="w-full mt-1 p-2 border rounded"
                >
                  <option value="">All</option>
                  <option value="success">Success</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                  <option value="flagged">Flagged</option>
                </select>
              </div>
              
              <div>
                <label className="text-sm font-medium">From Date</label>
                <Input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => { setDateFrom(e.target.value); setPage(1); }}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">To Date</label>
                <Input
                  type="date"
                  value={dateTo}
                  onChange={(e) => { setDateTo(e.target.value); setPage(1); }}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full mt-1 p-2 border rounded"
                >
                  <option value="date">Date</option>
                  <option value="amount">Amount</option>
                  <option value="status">Status</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {error && (
          <div className="bg-destructive/10 text-destructive p-4 rounded">
            Failed to load transactions
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-12">Loading...</div>
        ) : transactions.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No transactions found
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Card</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((tx) => (
                    <TableRow
                      key={tx.id}
                      onClick={() => setSelectedTransaction(tx)}
                      className="cursor-pointer hover:bg-muted/50"
                    >
                      <TableCell>{tx.id}</TableCell>
                      <TableCell>${(tx.amount / 100).toFixed(2)}</TableCell>
                      <TableCell>{getStatusBadge(tx.status)}</TableCell>
                      <TableCell>
                        {new Date(tx.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>**** **** **** {tx.cardLast4}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {tx.description}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Page {meta.page} of {meta.totalPages} ({meta.total} total)
          </p>
          <div className="flex gap-2">
            <Button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1 || isLoading}
              variant="outline"
            >
              Previous
            </Button>
            <Button
              onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))}
              disabled={page === meta.totalPages || isLoading}
              variant="outline"
            >
              Next
            </Button>
          </div>
        </div>

        {selectedTransaction && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-lg">
              <CardHeader>
                <CardTitle>Transaction Details</CardTitle>
                <CardDescription>ID: {selectedTransaction.id}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <strong>Amount:</strong> ${(selectedTransaction.amount / 100).toFixed(2)}
                </div>
                <div>
                  <strong>Status:</strong> {getStatusBadge(selectedTransaction.status)}
                </div>
                <div>
                  <strong>Date:</strong> {new Date(selectedTransaction.date).toLocaleString()}
                </div>
                <div>
                  <strong>Card:</strong> **** **** **** {selectedTransaction.cardLast4}
                </div>
                <div>
                  <strong>Description:</strong>
                  <p className="mt-1 p-2 bg-muted rounded text-sm">
                    {selectedTransaction.description}
                  </p>
                </div>
                
                {userRole === "admin" && !selectedTransaction.flagged && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Internal Note</label>
                    <Input
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Add a note..."
                    />
                    <Button
                      onClick={handleFlag}
                      className="w-full"
                    >
                      Flag Transaction
                    </Button>
                  </div>
                )}
                
                {selectedTransaction.flagged && (
                  <div className="bg-destructive/10 p-3 rounded">
                    <strong className="text-destructive">Flagged</strong>
                    {selectedTransaction.internalNote && (
                      <p className="text-sm mt-1">{selectedTransaction.internalNote}</p>
                    )}
                  </div>
                )}
                
                <Button
                  onClick={() => setSelectedTransaction(null)}
                  variant="outline"
                  className="w-full"
                >
                  Close
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
          </div>
        </div>
      </div>
    </div>
  );
}

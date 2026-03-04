"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setTransactions } from "@/store/transactionSlice";
import { Transaction } from "@/types/transaction";

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
}

export default function TransactionsTable({ initialData }: Props) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      setTransactions({
        data: initialData.data,
        page: initialData.meta.page,
        total: initialData.meta.total,
      })
    );
  }, [dispatch, initialData]);

  return (
    <table border={1} cellPadding={10}>
      <thead>
        <tr>
          <th>ID</th>
          <th>Amount</th>
          <th>Status</th>
          <th>Date</th>
          <th>Card</th>
          <th>Description</th>
        </tr>
      </thead>

      <tbody>
        {initialData.data.map((transaction) => (
          <tr key={transaction.id}>
            <td>{transaction.id}</td>
            <td>{transaction.amount}</td>
            <td>{transaction.status}</td>
            <td>{new Date(transaction.date).toLocaleDateString()}</td>
            <td>**** **** **** {transaction.cardLast4}</td>
            {/* React auto-escapes this — prevents XSS */}
            <td>{transaction.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Transaction } from "@/types/transaction";

interface TransactionsState {
  data: Transaction[];
  page: number;
  total: number;
}

const initialState: TransactionsState = {
  data: [],
  page: 1,
  total: 0,
};

const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    setTransactions(
      state,
      action: PayloadAction<{
        data: Transaction[];
        page: number;
        total: number;
      }>
    ) {
      state.data = action.payload.data;
      state.page = action.payload.page;
      state.total = action.payload.total;
    },
    updateTransactionOptimistically(
      state,
      action: PayloadAction<{ id: string; flagged: boolean; note: string }>
    ) {
      const transaction = state.data.find((t) => t.id === action.payload.id);
      if (transaction) {
        transaction.flagged = action.payload.flagged;
        transaction.internalNote = action.payload.note;
        transaction.status = "flagged";
      }
    },
  },
});

export const { setTransactions, updateTransactionOptimistically } = transactionsSlice.actions;

export default transactionsSlice.reducer;
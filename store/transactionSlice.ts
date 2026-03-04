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
  },
});

export const { setTransactions } = transactionsSlice.actions;

export default transactionsSlice.reducer;
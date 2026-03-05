import { configureStore } from "@reduxjs/toolkit";
import transactionsReducer from "./transactionSlice";
import { transactionsApi } from "./api";

export const store = configureStore({
  reducer: {
    transactions: transactionsReducer,
    [transactionsApi.reducerPath]: transactionsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(transactionsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
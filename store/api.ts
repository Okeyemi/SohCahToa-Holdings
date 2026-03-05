import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Transaction } from '@/types/transaction';

interface TransactionsResponse {
  data: Transaction[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface TransactionsQuery {
  page?: number;
  limit?: number;
  status?: string;
  sort?: string;
  order?: 'asc' | 'desc';
  from?: string;
  to?: string;
}

export const transactionsApi = createApi({
  reducerPath: 'transactionsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    credentials: 'include',
  }),
  tagTypes: ['Transaction'],
  endpoints: (builder) => ({
    getTransactions: builder.query<TransactionsResponse, TransactionsQuery>({
      query: (params) => ({
        url: '/transactions',
        params,
      }),
      providesTags: ['Transaction'],
    }),
    flagTransaction: builder.mutation<void, { id: string; note: string }>({
      query: ({ id, note }) => ({
        url: '/transactions/flag',
        method: 'POST',
        body: { id, note },
      }),
      invalidatesTags: ['Transaction'],
    }),
  }),
});

export const { useGetTransactionsQuery, useFlagTransactionMutation } = transactionsApi;
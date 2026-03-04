import { NextRequest, NextResponse } from "next/server";
import { transactions } from "@/lib/mock-db";
import { Transaction } from "@/types/transaction";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page") ?? 1);
    const limit = Number(searchParams.get("limit") ?? 10);
    const status = searchParams.get("status");
    const sort = searchParams.get("sort") ?? "date";
    const order = searchParams.get("order") ?? "desc";
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    let filtered: Transaction[] = [...transactions];

    // Filter by status
    if (status) {
      filtered = filtered.filter((t) => t.status === status);
    }

    // Filter by date range
    if (from && to) {
      filtered = filtered.filter(
        (t) =>
          new Date(t.date) >= new Date(from) &&
          new Date(t.date) <= new Date(to)
      );
    }

    // Sorting
    filtered.sort((a, b) => {
      const valueA = a[sort as keyof Transaction];
      const valueB = b[sort as keyof Transaction];

      if (valueA < valueB) return order === "asc" ? -1 : 1;
      if (valueA > valueB) return order === "asc" ? 1 : -1;
      return 0;
    });

    // Pagination
    const total = filtered.length;
    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + limit);

    return NextResponse.json(
      {
        data: paginated,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
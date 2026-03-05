import { NextRequest, NextResponse } from "next/server";
import { transactions } from "@/lib/mock-db";
import { Transaction } from "@/types/transaction";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page") ?? "1");
    const limit = Number(searchParams.get("limit") ?? "10");
    const status = searchParams.get("status");
    const sort = searchParams.get("sort") ?? "date";
    const order = searchParams.get("order") ?? "desc";
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: "Invalid pagination parameters" },
        { status: 400 }
      );
    }

    let filtered: Transaction[] = [...transactions];

    if (status && !["success", "pending", "failed", "flagged"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status filter" },
        { status: 400 }
      );
    }

    if (status) {
      filtered = filtered.filter((t) => t.status === status);
    }

    if (from && to) {
      const fromDate = new Date(from);
      const toDate = new Date(to);

      if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
        return NextResponse.json(
          { error: "Invalid date format" },
          { status: 400 }
        );
      }

      filtered = filtered.filter((t) => {
        const txDate = new Date(t.date);
        return txDate >= fromDate && txDate <= toDate;
      });
    }

    filtered.sort((a, b) => {
      const aValue = a[sort as keyof Transaction];
      const bValue = b[sort as keyof Transaction];

      if (aValue < bValue) return order === "asc" ? -1 : 1;
      if (aValue > bValue) return order === "asc" ? 1 : -1;
      return 0;
    });

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
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("Transaction fetch error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
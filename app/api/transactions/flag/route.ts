import { NextRequest, NextResponse } from "next/server";
import { transactions } from "@/lib/mock-db";

interface FlagRequest {
  id: string;
  note?: string;
}

export async function POST(req: NextRequest) {
  try {
    const userRole = req.cookies.get("userRole")?.value;

    if (userRole !== "admin") {
      return NextResponse.json(
        { error: "Forbidden: Only admins can flag transactions" },
        { status: 403 }
      );
    }

    const body: FlagRequest = await req.json();
    const { id, note } = body;

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { error: "Transaction ID required" },
        { status: 400 }
      );
    }

    if (note && (typeof note !== "string" || note.length > 500)) {
      return NextResponse.json(
        { error: "Note must be a string with max 500 characters" },
        { status: 400 }
      );
    }

    const transaction = transactions.find((t) => t.id === id);

    if (!transaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    transaction.flagged = true;
    transaction.internalNote = note ?? "";
    transaction.status = "flagged";

    return NextResponse.json(
      {
        message: "Transaction flagged",
        transaction,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}
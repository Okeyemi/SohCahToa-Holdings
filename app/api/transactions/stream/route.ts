import { NextResponse } from "next/server";
import { transactions } from "@/lib/mock-db";

export async function GET() {
  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();

      const sendEvent = () => {
        const randomTx =
          transactions[Math.floor(Math.random() * transactions.length)];

        const data = `data: ${JSON.stringify(randomTx)}\n\n`;

        controller.enqueue(encoder.encode(data));
      };

      const interval = setInterval(sendEvent, 5000);

      return () => clearInterval(interval);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
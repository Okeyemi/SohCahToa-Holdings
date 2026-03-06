import { NextResponse } from "next/server";
import { transactions } from "@/lib/mock-db";

export async function GET() {
  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();
      let isActive = true;

      const sendEvent = () => {
        if (!isActive) return;
        
        try {
          const randomTx =
            transactions[Math.floor(Math.random() * transactions.length)];

          const data = `data: ${JSON.stringify(randomTx)}\n\n`;

          if (!controller.desiredSize || controller.desiredSize > 0) {
            controller.enqueue(encoder.encode(data));
          }
        } catch (error) {
          console.error("SSE send error:", error);
          cleanup();
        }
      };

      const interval = setInterval(sendEvent, 5000);

      const cleanup = () => {
        isActive = false;
        clearInterval(interval);
        try {
          if (!controller.desiredSize) {
            controller.close();
          }
        } catch (error) {
          // Controller already closed
        }
      };

      // Handle client disconnect
      const abortHandler = () => cleanup();
      
      return cleanup;
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

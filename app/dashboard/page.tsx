import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";

async function getInitialTransactions() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    
    const res = await fetch(
      `${baseUrl}/api/transactions?page=1&limit=10`,
      { 
        cache: "no-store",
        headers: {
          Cookie: (await cookies()).toString(),
        }
      }
    );

    if (!res.ok) {
      return { data: [], meta: { total: 0, page: 1, limit: 10, totalPages: 0 } };
    }

    return res.json();
  } catch (error) {
    console.error("Failed to fetch initial transactions:", error);
    return { data: [], meta: { total: 0, page: 1, limit: 10, totalPages: 0 } };
  }
}

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const userRole = cookieStore.get("userRole")?.value;

  if (!userRole) {
    redirect("/login");
  }

  const initialData = await getInitialTransactions();

  return <DashboardClient initialData={initialData} userRole={userRole as "admin" | "analyst"} />;
}

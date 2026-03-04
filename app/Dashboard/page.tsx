import TransactionsTable from "./TransactionsTable";

export default async function DashboardPage() {
  const res = await fetch(
    "http://localhost:3000/api/transactions?page=1&limit=10",
    { cache: "no-store" } // Important for financial dashboards
  );

  const data = await res.json();

  return (
    <div style={{ padding: "20px" }}>
      <h1>Transactions Dashboard</h1>

      <TransactionsTable initialData={data} />
    </div>
  );
}
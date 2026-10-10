export const instant = false;
import { getTransactions } from "@/lib/actions";
import ClientHistory from "@/components/ClientHistory";



export default async function History() {
  const transactions = await getTransactions();

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">History</h1>
        <p className="text-zinc-400 mt-1">View and filter your past transactions.</p>
      </div>

      <ClientHistory transactions={transactions} />
    </div>
  );
}

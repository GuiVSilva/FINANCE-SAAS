import { db } from "../_lib/prisma";
import { DataTable } from "../_components/ui/data-table";
import { transactionsColumns } from "./_columns";
import AddTransactionButton from "../_components/add-transaction-button";
import NavBar from "../_components/navbar";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ScrollArea } from "../_components/ui/scroll-area";
import { canUserAddTransaction } from "../_data/can-user-add-transaction";

const TransactionsPage = async () => {
  const { userId } = await auth();
  if (!userId) {
    redirect("/login");
  }
  const transactions = await db.transaction.findMany({
    where: { userId: userId },
  });

  const userCanAddTransaction = await canUserAddTransaction();

  return (
    <>
      <NavBar />
      <div className="space-y-6 overflow-hidden p-6">
        <div className="flex w-full items-center justify-between">
          <h2 className="text-2xl font-bold">Transações</h2>
          <AddTransactionButton userCanAddTransaction={userCanAddTransaction} />
        </div>
        <ScrollArea>
          <DataTable columns={transactionsColumns} data={transactions} />
        </ScrollArea>
      </div>
    </>
  );
};

export default TransactionsPage;

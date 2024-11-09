import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import NavBar from "./_components/navbar";
import SummaryCards from "./[home]/_components/summary-cards";
import TimeSelect from "./[home]/_components/time-select";
import { isMatch } from "date-fns";
import TransactionsPieChart from "./[home]/_components/transactions-pie-chart";
import { getDashboard } from "./_data/get-dashboard";
import ExpensesPerCategory from "./_components/expenses.per-category";
import LastTransactions from "./[home]/_components/last-transactions";

interface HomeProps {
  searchParams: {
    month: string;
  };
}

const Home = async ({ searchParams: { month } }: HomeProps) => {
  const { userId } = await auth();
  if (!userId) {
    redirect("/login");
  }

  const monthIsValid = !month || !isMatch(month, "MM");
  if (monthIsValid) {
    redirect("?month=01");
  }
  const dashboard = await getDashboard(month);
  return (
    <>
      <NavBar />
      <div className="space-y-6 p-6">
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <TimeSelect />
        </div>
        <div className="grid grid-cols-[2fr,1fr] gap-6">
          <div className="flex flex-col gap-6">
            <SummaryCards month={month} {...dashboard} />
            <div className="grid grid-cols-3 grid-rows-1 gap-6">
              <TransactionsPieChart {...dashboard} />
              <ExpensesPerCategory
                expensesPerCategory={dashboard.totalExpensePerCategory}
              />
            </div>
          </div>
          <LastTransactions lasTransactions={dashboard.lastTransactions} />
        </div>
      </div>
    </>
  );
};

export default Home;

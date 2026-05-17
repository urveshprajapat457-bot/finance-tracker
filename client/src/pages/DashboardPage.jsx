import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import StatCard from '../components/ui/StatCard';
import SummaryChart from '../components/charts/SummaryChart';
import api from '../services/api';
import { formatCurrency } from '../utils/format';

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [budget, setBudget] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const [dashboardResponse, budgetResponse] = await Promise.all([
        api.get('/analytics/dashboard'),
        api.get('/budgets'),
      ]);
      setStats(dashboardResponse.data);
      setBudget(budgetResponse.data);
    };
    loadData().catch(console.error);
  }, []);

  const barData = {
    labels: stats?.monthlyTrend.map((item) => item.month) || [],
    datasets: [
      { label: 'Income', data: stats?.monthlyTrend.map((item) => item.income) || [], backgroundColor: '#6366F1' },
      { label: 'Expenses', data: stats?.monthlyTrend.map((item) => item.expense) || [], backgroundColor: '#F97316' },
    ],
  };

  const doughnutData = {
    labels: stats?.categoryDistribution.map((item) => item.category) || [],
    datasets: [{ data: stats?.categoryDistribution.map((item) => item.amount) || [], backgroundColor: ['#6366F1', '#F97316', '#22C55E', '#38BDF8', '#C084FC'] }],
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-6 text-white">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[280px_1fr]">
        <Sidebar />
        <main className="space-y-6">
          <Navbar />
          <motion.section initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <StatCard title="Total Income" value={formatCurrency(stats?.totalIncome)} subtitle="Track earnings and revenue" accent />
            <StatCard title="Total Expense" value={formatCurrency(stats?.totalExpense)} subtitle="Monitor spending across categories" />
            <StatCard title="Current Balance" value={formatCurrency(stats?.balance)} subtitle="Your available balance" />
            <StatCard title="Savings Goal" value={formatCurrency(stats?.savings)} subtitle="Estimated savings potential" />
          </motion.section>
          <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
            <div className="rounded-[32px] border border-slate-800 bg-slate-950/90 p-6 shadow-soft">
              <div className="flex items-center justify-between gap-4 pb-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Monthly insights</p>
                  <h2 className="mt-3 text-2xl font-semibold text-white">Income vs Expense trend</h2>
                </div>
              </div>
              <div className="mt-6 h-[360px]"><SummaryChart type="bar" data={barData} /></div>
            </div>
            <div className="space-y-6">
              <div className="rounded-[32px] border border-slate-800 bg-slate-950/90 p-6 shadow-soft">
                <h2 className="text-xl font-semibold text-white">Expense distribution</h2>
                <p className="mt-2 text-sm text-slate-400">By category spending share</p>
                <div className="mt-6 h-[320px]"><SummaryChart type="doughnut" data={doughnutData} /></div>
              </div>
              <div className="rounded-[32px] border border-slate-800 bg-slate-950/90 p-6 shadow-soft">
                <h2 className="text-xl font-semibold text-white">Budget progress</h2>
                <div className="mt-6 space-y-4">
                  <p className="text-sm text-slate-400">Monthly target: {formatCurrency(budget?.monthlyLimit)}</p>
                  <div className="h-4 overflow-hidden rounded-full bg-slate-900">
                    <div className="h-full rounded-full bg-brand-500" style={{ width: `${Math.min(100, budget?.monthlyLimit ? (budget.spentAmount / budget.monthlyLimit) * 100 : 0)}%` }} />
                  </div>
                  <div className="flex items-center justify-between text-sm text-slate-300">
                    <span>Spent: {formatCurrency(budget?.spentAmount)}</span>
                    <span>Remaining: {formatCurrency(budget?.remainingAmount)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-[32px] border border-slate-800 bg-slate-950/90 p-6 shadow-soft">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-white">Recent activity</h2>
                <p className="text-sm text-slate-400">Most recent transactions and spending highlights.</p>
              </div>
            </div>
            <div className="mt-6 grid gap-4">
              {stats?.recentTransactions?.map((transaction) => (
                <div key={transaction._id} className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-slate-800 bg-slate-900/80 p-4">
                  <div>
                    <p className="text-sm text-slate-400">{transaction.category} • {transaction.shopName || '-'}</p>
                    <h3 className="text-lg font-semibold text-white">{transaction.itemName || transaction.title}</h3>
                    <p className="text-sm text-slate-500">{new Date(transaction.purchaseDate || transaction.date).toLocaleDateString()}</p>
                  </div>
                  <div className={transaction.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}>
                    {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;

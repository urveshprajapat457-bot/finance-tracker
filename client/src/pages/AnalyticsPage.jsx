import { useEffect, useMemo, useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import SummaryChart from '../components/charts/SummaryChart';
import StatCard from '../components/ui/StatCard';
import api from '../services/api';
import { formatCurrency } from '../utils/format';

const AnalyticsPage = () => {
  const [dashboard, setDashboard] = useState(null);
  const [reports, setReports] = useState(null);

  useEffect(() => {
    const loadAnalytics = async () => {
      const [dashboardRes, reportsRes] = await Promise.all([api.get('/analytics/dashboard'), api.get('/analytics/reports')]);
      setDashboard(dashboardRes.data);
      setReports(reportsRes.data);
    };
    loadAnalytics().catch(console.error);
  }, []);

  const savingsData = useMemo(() => ({
    labels: dashboard?.monthlyTrend.map((item) => item.month) || [],
    datasets: [{ label: 'Savings', data: dashboard?.monthlyTrend.map((item) => item.income - item.expense) || [], borderColor: '#22C55E', backgroundColor: 'rgba(34, 197, 94, 0.15)' }],
  }), [dashboard]);

  const categoryData = useMemo(() => ({
    labels: dashboard?.categoryDistribution.map((item) => item.category) || [],
    datasets: [{ label: 'Contribution', data: dashboard?.categoryDistribution.map((item) => item.amount) || [], backgroundColor: ['#6366F1', '#F97316', '#22C55E', '#38BDF8', '#C084FC'] }],
  }), [dashboard]);

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-6 text-white">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[280px_1fr]">
        <Sidebar />
        <main className="space-y-6">
          <Navbar />
          <div className="rounded-[32px] border border-slate-800 bg-slate-950/90 p-6 shadow-soft">
            <h1 className="text-2xl font-semibold text-white">Analytics overview</h1>
            <p className="mt-2 text-sm text-slate-400">Explore your financial trends and category insights.</p>
          </div>
          <div className="grid gap-6 xl:grid-cols-3">
            <StatCard title="Balance" value={formatCurrency(dashboard?.balance)} subtitle="Net financial position" accent />
            <StatCard title="Total Income" value={formatCurrency(dashboard?.totalIncome)} subtitle="Income tracked so far" />
            <StatCard title="Total Expense" value={formatCurrency(dashboard?.totalExpense)} subtitle="Spending summary" />
          </div>
          <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
            <div className="rounded-[32px] border border-slate-800 bg-slate-950/90 p-6 shadow-soft">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-white">Savings growth</h2>
                  <p className="text-sm text-slate-400">Forecast your progress month over month.</p>
                </div>
              </div>
              <div className="mt-6 h-[360px]"><SummaryChart type="line" data={savingsData} /></div>
            </div>
            <div className="rounded-[32px] border border-slate-800 bg-slate-950/90 p-6 shadow-soft">
              <div>
                <h2 className="text-xl font-semibold text-white">Category concentration</h2>
                <p className="mt-2 text-sm text-slate-400">See which categories consume the most budget.</p>
              </div>
              <div className="mt-6 h-[360px]"><SummaryChart type="doughnut" data={categoryData} /></div>
            </div>
          </div>
          <div className="grid gap-6 xl:grid-cols-3">
            {reports && Object.entries(reports.monthlyReport).slice(0, 3).map(([period, values]) => (
              <div key={period} className="rounded-[32px] border border-slate-800 bg-slate-950/90 p-6 shadow-soft">
                <p className="text-sm text-slate-400">{period}</p>
                <h3 className="mt-4 text-2xl font-semibold text-white">{formatCurrency(values.income - values.expense)}</h3>
                <p className="mt-2 text-sm text-slate-400">Income {formatCurrency(values.income)} • Expense {formatCurrency(values.expense)}</p>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AnalyticsPage;

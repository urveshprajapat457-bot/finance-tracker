import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaChartLine, FaShieldAlt, FaMobileAlt, FaFileInvoiceDollar } from 'react-icons/fa';

const features = [
  { icon: FaChartLine, title: 'Real-time analytics', description: 'Track income, expenses and trends in one place.' },
  { icon: FaShieldAlt, title: 'Secure authentication', description: 'Brand-grade security with JWT and encrypted passwords.' },
  { icon: FaMobileAlt, title: 'Responsive dashboard', description: 'Works beautifully on mobile, tablet and desktop.' },
  { icon: FaFileInvoiceDollar, title: 'Export reports', description: 'Download summaries and export transaction reports.' },
];

const LandingPage = () => (
  <div className="min-h-screen bg-app-gradient px-4 py-10 text-white">
    <div className="mx-auto flex max-w-7xl flex-col gap-16">
      <section className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div className="space-y-6">
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm text-brand-100">
            Modern fintech for personal finance
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-5xl font-bold leading-tight text-white sm:text-6xl">
            Control your money with premium analytics.
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl text-lg text-slate-300">
            FinFlow empowers you to track income, spend smarter, and grow savings with elegant dashboards and powerful reporting.
          </motion.p>
          <div className="flex flex-wrap gap-4">
            <Link to="/register" className="rounded-3xl bg-brand-500 px-6 py-4 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-400">
              Start free today
            </Link>
            <Link to="/login" className="rounded-3xl border border-slate-700 px-6 py-4 text-sm text-slate-200 transition hover:border-brand-500">
              Login
            </Link>
          </div>
        </div>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="rounded-[32px] border border-slate-800 bg-slate-950/80 p-8 shadow-soft backdrop-blur-xl">
          <p className="text-sm uppercase tracking-[0.3em] text-brand-300">Dashboard preview</p>
          <div className="mt-6 space-y-4">
            <div className="rounded-[28px] bg-slate-900/80 p-5 text-slate-300">
              <div className="flex items-center justify-between gap-4 text-sm text-slate-400">
                <span>Balance</span>
                <span className="text-brand-100">₹ 124,880</span>
              </div>
              <h3 className="mt-3 text-3xl font-semibold text-white">₹ 78,320</h3>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[28px] bg-slate-900/80 p-5">
                <p className="text-sm text-slate-400">Income</p>
                <p className="mt-3 text-xl font-semibold text-white">₹ 144,000</p>
              </div>
              <div className="rounded-[28px] bg-slate-900/80 p-5">
                <p className="text-sm text-slate-400">Expenses</p>
                <p className="mt-3 text-xl font-semibold text-white">₹ 65,680</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
      <section className="grid gap-8 lg:grid-cols-2">
        {features.map((item) => {
          const Icon = item.icon;
          return (
            <motion.article key={item.title} whileHover={{ y: -5 }} className="rounded-[32px] border border-slate-800 bg-slate-950/80 p-8 shadow-soft">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-brand-500/15 text-brand-200">
                <Icon />
              </div>
              <h3 className="mt-5 text-xl font-semibold text-white">{item.title}</h3>
              <p className="mt-3 text-slate-400">{item.description}</p>
            </motion.article>
          );
        })}
      </section>
    </div>
  </div>
);

export default LandingPage;

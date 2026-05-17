import { NavLink } from 'react-router-dom';
import { FaChartPie, FaList, FaCog, FaHome, FaWallet, FaMoneyBillWave } from 'react-icons/fa';
import { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';

const navItems = [
  { label: 'Dashboard', to: '/dashboard', icon: FaChartPie },
  { label: 'Transactions', to: '/transactions', icon: FaList },
  { label: 'Analytics', to: '/analytics', icon: FaMoneyBillWave },
  { label: 'Settings', to: '/settings', icon: FaCog },
];

const Sidebar = () => {
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  return (
    <aside className="hidden lg:flex lg:w-80 flex-col gap-6 bg-slate-900/90 p-6 rounded-3xl shadow-soft backdrop-blur-xl">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-3 text-brand-100">
          <div className="rounded-2xl bg-brand-500/15 p-3 text-brand-300">
            <FaWallet />
          </div>
          <div>
            <p className="text-slate-300 text-sm">FinFlow</p>
            <h1 className="text-xl font-semibold text-white">Expense Tracker</h1>
          </div>
        </div>
      </div>
      <nav className="flex flex-col gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                  isActive ? 'bg-brand-500/20 text-brand-100' : 'text-slate-300 hover:bg-slate-800/80'
                }`
              }
            >
              <Icon className="text-lg" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
      <button
        type="button"
        onClick={() => setDarkMode(!darkMode)}
        className="mt-auto inline-flex items-center justify-center rounded-2xl border border-slate-700 bg-slate-950/50 px-4 py-3 text-sm text-slate-200 transition hover:border-brand-500 hover:text-brand-100"
      >
        {darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      </button>
      <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5 text-sm text-slate-300">
        <p className="text-slate-100 font-semibold">Premium insights</p>
        <p className="mt-2 text-sm leading-6">Track your finances with smart expense predictions and goal progress.</p>
      </div>
    </aside>
  );
};

export default Sidebar;

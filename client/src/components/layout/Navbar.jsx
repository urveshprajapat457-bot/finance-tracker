import { useContext } from 'react';
import { FaBell, FaSearch } from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-slate-800 bg-slate-950/90 p-5 shadow-soft">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-slate-900 p-3 text-brand-300">
          <FaSearch />
        </div>
        <div>
          <p className="text-slate-400 text-sm">Welcome back</p>
          <h2 className="text-xl font-semibold text-white">{user?.name || 'User'}</h2>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button
          type="button"
          className="rounded-2xl bg-slate-900 p-3 text-slate-300 transition hover:bg-brand-500/15"
        >
          <FaBell />
        </button>
        <button
          type="button"
          onClick={logout}
          className="rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-200 transition hover:border-brand-500 hover:text-brand-100"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;

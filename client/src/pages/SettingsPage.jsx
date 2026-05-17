import { useContext, useEffect, useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { toast } from 'react-toastify';

const SettingsPage = () => {
  const { user, setAuth } = useContext(AuthContext);
  const [profile, setProfile] = useState({ name: user?.name || '', email: user?.email || '' });
  const [password, setPassword] = useState({ currentPassword: '', newPassword: '' });
  const [budget, setBudget] = useState({ monthlyLimit: '', goalName: 'Monthly Savings' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setProfile({ name: user?.name || '', email: user?.email || '' });
  }, [user]);

  const handleProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', profile.name);
      formData.append('email', profile.email);
      const response = await api.put('/auth/profile', formData);
      setAuth({ token: localStorage.getItem('finflow_token'), user: response.data.user });
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Profile update failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put('/auth/password', password);
      setPassword({ currentPassword: '', newPassword: '' });
      toast.success('Password changed successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Password update failed');
    } finally {
      setLoading(false);
    }
  };

  const handleBudget = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/budgets', { monthlyLimit: Number(budget.monthlyLimit), goalName: budget.goalName });
      toast.success('Budget set successfully');
    } catch (error) {
      toast.error('Unable to save budget');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-6 text-white">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[280px_1fr]">
        <Sidebar />
        <main className="space-y-6">
          <Navbar />
          <div className="rounded-[32px] border border-slate-800 bg-slate-950/90 p-6 shadow-soft">
            <h1 className="text-2xl font-semibold text-white">Settings</h1>
            <p className="mt-2 text-slate-400">Update profile, change password, and manage your budget settings.</p>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <form onSubmit={handleProfile} className="rounded-[32px] border border-slate-800 bg-slate-950/90 p-6 shadow-soft space-y-5">
              <h2 className="text-xl font-semibold text-white">Profile settings</h2>
              <label className="block text-sm text-slate-300">
                Full name
                <input value={profile.name} onChange={(e) => setProfile((prev) => ({ ...prev, name: e.target.value }))} className="mt-3 w-full rounded-3xl border border-slate-700 bg-slate-900/70 px-4 py-4 text-white outline-none" required />
              </label>
              <label className="block text-sm text-slate-300">
                Email address
                <input value={profile.email} onChange={(e) => setProfile((prev) => ({ ...prev, email: e.target.value }))} className="mt-3 w-full rounded-3xl border border-slate-700 bg-slate-900/70 px-4 py-4 text-white outline-none" required />
              </label>
              <button type="submit" disabled={loading} className="rounded-3xl bg-brand-500 px-6 py-4 text-sm font-semibold text-white transition hover:bg-brand-400 disabled:cursor-not-allowed disabled:opacity-60">Save profile</button>
            </form>
            <form onSubmit={handlePassword} className="rounded-[32px] border border-slate-800 bg-slate-950/90 p-6 shadow-soft space-y-5">
              <h2 className="text-xl font-semibold text-white">Change password</h2>
              <label className="block text-sm text-slate-300">
                Current password
                <input value={password.currentPassword} onChange={(e) => setPassword((prev) => ({ ...prev, currentPassword: e.target.value }))} type="password" className="mt-3 w-full rounded-3xl border border-slate-700 bg-slate-900/70 px-4 py-4 text-white outline-none" required />
              </label>
              <label className="block text-sm text-slate-300">
                New password
                <input value={password.newPassword} onChange={(e) => setPassword((prev) => ({ ...prev, newPassword: e.target.value }))} type="password" className="mt-3 w-full rounded-3xl border border-slate-700 bg-slate-900/70 px-4 py-4 text-white outline-none" required />
              </label>
              <button type="submit" disabled={loading} className="rounded-3xl bg-brand-500 px-6 py-4 text-sm font-semibold text-white transition hover:bg-brand-400 disabled:cursor-not-allowed disabled:opacity-60">Update password</button>
            </form>
          </div>
          <form onSubmit={handleBudget} className="rounded-[32px] border border-slate-800 bg-slate-950/90 p-6 shadow-soft space-y-5">
            <h2 className="text-xl font-semibold text-white">Budget goals</h2>
            <label className="block text-sm text-slate-300">
              Monthly budget
              <input value={budget.monthlyLimit} onChange={(e) => setBudget((prev) => ({ ...prev, monthlyLimit: e.target.value }))} type="number" className="mt-3 w-full rounded-3xl border border-slate-700 bg-slate-900/70 px-4 py-4 text-white outline-none" required />
            </label>
            <label className="block text-sm text-slate-300">
              Goal name
              <input value={budget.goalName} onChange={(e) => setBudget((prev) => ({ ...prev, goalName: e.target.value }))} className="mt-3 w-full rounded-3xl border border-slate-700 bg-slate-900/70 px-4 py-4 text-white outline-none" />
            </label>
            <button type="submit" disabled={loading} className="rounded-3xl bg-brand-500 px-6 py-4 text-sm font-semibold text-white transition hover:bg-brand-400 disabled:cursor-not-allowed disabled:opacity-60">Save budget</button>
          </form>
        </main>
      </div>
    </div>
  );
};

export default SettingsPage;

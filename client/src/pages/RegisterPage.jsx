import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const RegisterPage = () => {
  const { setAuth } = useContext(AuthContext);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', form);
      setAuth(data);
      toast.success('Account created successfully');
      navigate('/dashboard');
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.errors?.[0]?.msg ||
        'Registration failed';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-app-gradient px-4 py-10 text-white">
      <div className="mx-auto flex max-w-4xl flex-col gap-10 rounded-[40px] border border-slate-800 bg-slate-950/90 p-8 shadow-soft md:p-14">
        <div className="space-y-3 text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-brand-300">Create your account</p>
          <h1 className="text-4xl font-semibold">Start managing your finances with ease</h1>
          <p className="text-slate-400">Register now and unlock dashboards, budgets and powerful expense analytics.</p>
        </div>
        <form onSubmit={handleSubmit} className="grid gap-6 sm:grid-cols-2">
          <label className="block text-sm text-slate-300">
            Full name
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="mt-3 w-full rounded-3xl border border-slate-700 bg-slate-900/70 px-4 py-4 text-white outline-none transition focus:border-brand-500"
              required
            />
          </label>
          <label className="block text-sm text-slate-300">
            Email address
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="mt-3 w-full rounded-3xl border border-slate-700 bg-slate-900/70 px-4 py-4 text-white outline-none transition focus:border-brand-500"
              required
            />
          </label>
          <label className="block text-sm text-slate-300">
            Password
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className="mt-3 w-full rounded-3xl border border-slate-700 bg-slate-900/70 px-4 py-4 text-white outline-none transition focus:border-brand-500"
              required
            />
          </label>
          <label className="block text-sm text-slate-300">
            Confirm password
            <input
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              className="mt-3 w-full rounded-3xl border border-slate-700 bg-slate-900/70 px-4 py-4 text-white outline-none transition focus:border-brand-500"
              required
            />
          </label>
          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-3xl bg-brand-500 px-6 py-4 text-sm font-semibold text-white transition hover:bg-brand-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Registering...' : 'Create account'}
            </button>
          </div>
        </form>
        <p className="text-center text-sm text-slate-400 sm:col-span-2">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-300 transition hover:text-white">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;

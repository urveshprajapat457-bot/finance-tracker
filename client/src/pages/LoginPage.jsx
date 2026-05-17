import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const LoginPage = () => {
  const { setAuth } = useContext(AuthContext);
  const [form, setForm] = useState({ email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await api.post('/auth/login', form);
      setAuth(data);
      toast.success('Login successful');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-app-gradient px-4 py-10 text-white">
      <div className="mx-auto flex max-w-4xl flex-col gap-10 rounded-[40px] border border-slate-800 bg-slate-950/90 p-8 shadow-soft md:p-14">
        <div className="space-y-3 text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-brand-300">Secure login</p>
          <h1 className="text-4xl font-semibold">Welcome back to FinFlow</h1>
          <p className="text-slate-400">Sign in to access your expense insights, budget dashboard, and reporting tools.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
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
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-3xl bg-brand-500 px-6 py-4 text-sm font-semibold text-white transition hover:bg-brand-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        <p className="mt-2 text-center text-sm text-slate-400">
          <Link to="/forgot-password" className="text-brand-300 transition hover:text-white">
            Forgot password?
          </Link>
        </p>
        <p className="text-center text-sm text-slate-400">
          Don’t have an account?{' '}
          <Link to="/register" className="text-brand-300 transition hover:text-white">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;

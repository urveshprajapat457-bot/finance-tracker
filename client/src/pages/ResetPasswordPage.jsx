import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (form.password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (!token) {
      toast.error('Missing reset token. Use the password reset link from your email.');
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post('/auth/reset-password', {
        token,
        password: form.password,
        confirmPassword: form.confirmPassword,
      });
      toast.success(data.message || 'Password updated successfully');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-app-gradient px-4 py-10 text-white">
      <div className="mx-auto max-w-3xl rounded-[40px] border border-slate-800 bg-slate-950/90 p-8 shadow-soft md:p-14">
        <div className="space-y-3 text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-brand-300">Reset password</p>
          <h1 className="text-4xl font-semibold">Choose a new secure password</h1>
          <p className="text-slate-400">Use the link from your email to set a new password and regain access to your account.</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-10 space-y-6">
          <label className="block text-sm text-slate-300">
            New password
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className="mt-3 w-full rounded-3xl border border-slate-700 bg-slate-900/70 px-4 py-4 text-white outline-none transition focus:border-brand-500"
              placeholder="Enter a strong password"
              required
            />
          </label>

          <label className="block text-sm text-slate-300">
            Confirm new password
            <input
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              className="mt-3 w-full rounded-3xl border border-slate-700 bg-slate-900/70 px-4 py-4 text-white outline-none transition focus:border-brand-500"
              placeholder="Repeat your new password"
              required
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-3xl bg-brand-500 px-6 py-4 text-sm font-semibold text-white transition hover:bg-brand-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Resetting password...' : 'Reset password'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Need a new reset link?{' '}
          <Link to="/forgot-password" className="text-brand-300 transition hover:text-white">
            Request again
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPasswordPage;

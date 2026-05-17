import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!email) {
      toast.error('Please enter your registered email');
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post('/auth/forgot-password', { email });
      toast.success(data.message || 'Reset instructions sent to your email');
      setEmail('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-app-gradient px-4 py-10 text-white">
      <div className="mx-auto max-w-3xl rounded-[40px] border border-slate-800 bg-slate-950/90 p-8 shadow-soft md:p-14">
        <div className="space-y-3 text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-brand-300">Forgot password</p>
          <h1 className="text-4xl font-semibold">Reset your account password</h1>
          <p className="text-slate-400">Enter your registered email and we'll send a secure link to reset your password.</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-10 space-y-6">
          <label className="block text-sm text-slate-300">
            Email address
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-3 w-full rounded-3xl border border-slate-700 bg-slate-900/70 px-4 py-4 text-white outline-none transition focus:border-brand-500"
              placeholder="you@example.com"
              required
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-3xl bg-brand-500 px-6 py-4 text-sm font-semibold text-white transition hover:bg-brand-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Sending reset link...' : 'Send reset link'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Remembered your password?{' '}
          <Link to="/login" className="text-brand-300 transition hover:text-white">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;

import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <div className="min-h-screen bg-slate-950 px-4 py-20 text-white">
    <div className="mx-auto max-w-3xl rounded-[40px] border border-slate-800 bg-slate-950/90 p-14 text-center shadow-soft">
      <p className="text-sm uppercase tracking-[0.35em] text-brand-300">404 error</p>
      <h1 className="mt-6 text-6xl font-bold">Page not found</h1>
      <p className="mt-4 text-slate-400">The page you are looking for does not exist or has been moved.</p>
      <Link to="/dashboard" className="mt-8 inline-flex rounded-3xl bg-brand-500 px-8 py-4 text-sm font-semibold text-white transition hover:bg-brand-400">
        Go back home
      </Link>
    </div>
  </div>
);

export default NotFoundPage;

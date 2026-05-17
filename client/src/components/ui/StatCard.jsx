const StatCard = ({ title, value, subtitle, accent }) => {
  return (
    <div className="rounded-[32px] border border-slate-800 bg-slate-950/90 p-6 shadow-soft transition hover:-translate-y-1">
      <p className="text-sm text-slate-400">{title}</p>
      <h3 className="mt-3 text-3xl font-semibold text-white">{value}</h3>
      <p className={`mt-4 text-sm ${accent ? 'text-brand-300' : 'text-slate-400'}`}>{subtitle}</p>
    </div>
  );
};

export default StatCard;

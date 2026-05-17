import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Tooltip, Legend);

const SummaryChart = ({ type, data, label }) => {
  if (type === 'bar') return <Bar data={data} options={chartOptions} className="rounded-3xl bg-slate-950/80 p-4" />;
  if (type === 'doughnut') return <Doughnut data={data} options={chartOptions} className="rounded-3xl bg-slate-950/80 p-4" />;
  return <Line data={data} options={chartOptions} className="rounded-3xl bg-slate-950/80 p-4" />;
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { labels: { color: '#cbd5e1' } },
    tooltip: { mode: 'index', intersect: false },
  },
  scales: {
    x: { ticks: { color: '#cbd5e1' }, grid: { color: 'rgba(148, 163, 184, 0.12)' } },
    y: { ticks: { color: '#cbd5e1' }, grid: { color: 'rgba(148, 163, 184, 0.12)' } },
  },
};

export default SummaryChart;

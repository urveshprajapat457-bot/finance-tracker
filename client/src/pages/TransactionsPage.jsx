import { useEffect, useMemo, useState } from 'react';
import { FaFilter, FaPlus, FaDownload } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { jsPDF } from 'jspdf';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import TransactionForm from '../components/modals/TransactionForm';
import BillScanner from '../components/ai/BillScanner';
import api from '../services/api';
import { formatCurrency, formatDate } from '../utils/format';

const categories = [
  'Food',
  'Travel',
  'Shopping',
  'Bills',
  'Entertainment',
  'Education',
  'Health',
  'Rent',
  'Fuel',
  'Groceries',
  'Clothing',
  'Utilities',
  'Other',
];

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [filters, setFilters] = useState({ search: '', type: '', category: '', paymentMethod: '', startDate: '', endDate: '' });
  const [meta, setMeta] = useState({ page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTransaction, setEditTransaction] = useState(null);

  const loadTransactions = async (page = 1) => {
    setLoading(true);
    try {
      const response = await api.get('/transactions', { params: { page, ...filters, limit: 12 } });
      setTransactions(response.data.transactions);
      setMeta({ page: response.data.page, pages: response.data.pages });
    } catch (error) {
      toast.error('Unable to load transactions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions(1);
  }, [filters]);

  const handleSave = async (data) => {
    try {
      if (editTransaction) {
        await api.put(`/transactions/${editTransaction._id}`, data);
        toast.success('Transaction updated');
      } else {
        await api.post('/transactions', data);
        toast.success('Transaction created');
      }
      setModalOpen(false);
      setEditTransaction(null);
      loadTransactions(meta.page);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to save transaction');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this transaction?')) return;
    try {
      await api.delete(`/transactions/${id}`);
      toast.success('Transaction deleted');
      loadTransactions(meta.page);
    } catch (error) {
      toast.error('Unable to delete transaction');
    }
  };

  const generateExpenseReport = () => {
    if (!transactions.length) {
      toast.info('No expenses available to export');
      return;
    }

    const totalAmount = transactions.reduce((sum, txn) => sum + Number(txn.amount || 0), 0);
    const categorySummary = transactions.reduce((summary, txn) => {
      const category = txn.category || 'Other';
      summary[category] = (summary[category] || 0) + Number(txn.amount || 0);
      return summary;
    }, {});

    const doc = new jsPDF({ unit: 'pt', format: 'letter' });
    doc.setFontSize(18);
    doc.text('Expense Report', 40, 50);
    doc.setFontSize(11);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 40, 70);
    doc.text(`Total expenses: ₹${totalAmount.toFixed(2)}`, 40, 90);

    let y = 120;
    doc.setFontSize(13);
    doc.text('Category summary', 40, y);
    y += 18;
    doc.setFontSize(10);
    Object.entries(categorySummary).forEach(([category, amount]) => {
      doc.text(`${category}: ₹${amount.toFixed(2)}`, 50, y);
      y += 15;
      if (y > 720) {
        doc.addPage();
        y = 40;
      }
    });

    y += 20;
    doc.setFontSize(13);
    doc.text('Expense details', 40, y);
    y += 18;
    doc.setFontSize(9);
    doc.text('Item / Shop / Category / Amount / Date', 40, y);
    y += 14;

    transactions.forEach((transaction) => {
      const line = `${transaction.itemName || transaction.title} | ${transaction.shopName || '-'} | ${transaction.category} | ₹${Number(transaction.amount).toFixed(2)} | ${formatDate(transaction.purchaseDate || transaction.date)}`;
      if (y > 750) {
        doc.addPage();
        y = 40;
      }
      doc.text(line, 40, y);
      y += 12;
    });

    doc.save('expense-report.pdf');
  };

  const filteredList = useMemo(() => transactions, [transactions]);

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-6 text-white">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[280px_1fr]">
        <Sidebar />
        <main className="space-y-6">
          <Navbar />
          <BillScanner onSave={handleSave} />
          <div className="rounded-[32px] border border-slate-800 bg-slate-950/90 p-6 shadow-soft">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-semibold text-white">Expense ledger</h1>
                <p className="text-sm text-slate-400">Track purchases, filter by category or date, and export your report.</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button type="button" onClick={generateExpenseReport} className="inline-flex items-center gap-2 rounded-3xl border border-slate-700 bg-slate-900/80 px-5 py-3 text-sm text-slate-200 transition hover:border-brand-500">
                  <FaDownload /> Download PDF
                </button>
                <button type="button" onClick={() => setModalOpen(true)} className="inline-flex items-center gap-2 rounded-3xl bg-brand-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-400">
                  <FaPlus /> Add purchase
                </button>
              </div>
            </div>
            <div className="mt-6 grid gap-4 lg:grid-cols-5">
              <input
                value={filters.search}
                onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
                placeholder="Search item or shop"
                className="rounded-3xl border border-slate-800 bg-slate-900/80 px-4 py-3 text-sm text-slate-200 outline-none"
              />
              <select
                value={filters.type}
                onChange={(e) => setFilters((prev) => ({ ...prev, type: e.target.value }))}
                className="rounded-3xl border border-slate-800 bg-slate-900/80 px-4 py-3 text-sm text-slate-200 outline-none"
              >
                <option value="">All types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
              <select
                value={filters.category}
                onChange={(e) => setFilters((prev) => ({ ...prev, category: e.target.value }))}
                className="rounded-3xl border border-slate-800 bg-slate-900/80 px-4 py-3 text-sm text-slate-200 outline-none"
              >
                <option value="">All categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters((prev) => ({ ...prev, startDate: e.target.value }))}
                className="rounded-3xl border border-slate-800 bg-slate-900/80 px-4 py-3 text-sm text-slate-200 outline-none"
              />
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters((prev) => ({ ...prev, endDate: e.target.value }))}
                className="rounded-3xl border border-slate-800 bg-slate-900/80 px-4 py-3 text-sm text-slate-200 outline-none"
              />
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setFilters({ search: '', type: '', category: '', paymentMethod: '', startDate: '', endDate: '' })}
                className="inline-flex items-center justify-center gap-2 rounded-3xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-sm text-slate-200 transition hover:border-brand-500"
              >
                <FaFilter /> Reset filters
              </button>
            </div>
          </div>
          <div className="rounded-[32px] border border-slate-800 bg-slate-950/90 p-6 shadow-soft">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm text-slate-300">
                <thead>
                  <tr>
                    <th className="px-4 py-4">Item</th>
                    <th className="px-4 py-4">Shop</th>
                    <th className="px-4 py-4">Category</th>
                    <th className="px-4 py-4">Amount</th>
                    <th className="px-4 py-4">Date</th>
                    <th className="px-4 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="6" className="px-4 py-8 text-center text-slate-400">Loading transactions...</td></tr>
                  ) : filteredList.length === 0 ? (
                    <tr><td colSpan="6" className="px-4 py-8 text-center text-slate-400">No transactions found.</td></tr>
                  ) : (
                    filteredList.map((transaction) => (
                      <tr key={transaction._id} className="border-t border-slate-800">
                        <td className="px-4 py-4 text-white">{transaction.itemName || transaction.title}</td>
                        <td className="px-4 py-4 text-slate-400">{transaction.shopName || '-'}</td>
                        <td className="px-4 py-4 text-slate-400">{transaction.category}</td>
                        <td className={`px-4 py-4 font-semibold ${transaction.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>{transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}</td>
                        <td className="px-4 py-4 text-slate-400">{formatDate(transaction.purchaseDate || transaction.date)}</td>
                        <td className="px-4 py-4">
                          <button type="button" onClick={() => { setEditTransaction(transaction); setModalOpen(true); }} className="mr-2 rounded-2xl bg-slate-800 px-4 py-2 text-sm text-slate-200 transition hover:bg-brand-500/15">Edit</button>
                          <button type="button" onClick={() => handleDelete(transaction._id)} className="rounded-2xl bg-rose-500/10 px-4 py-2 text-sm text-rose-300 transition hover:bg-rose-500/20">Delete</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 text-slate-400">
              <span>{meta.page} of {meta.pages} pages</span>
              <div className="flex gap-3">
                <button disabled={meta.page <= 1} type="button" onClick={() => loadTransactions(meta.page - 1)} className="rounded-3xl border border-slate-700 px-4 py-2 text-sm transition hover:border-brand-500 disabled:cursor-not-allowed disabled:opacity-50">Previous</button>
                <button disabled={meta.page >= meta.pages} type="button" onClick={() => loadTransactions(meta.page + 1)} className="rounded-3xl border border-slate-700 px-4 py-2 text-sm transition hover:border-brand-500 disabled:cursor-not-allowed disabled:opacity-50">Next</button>
              </div>
            </div>
          </div>
        </main>
      </div>
      {modalOpen && <TransactionForm initialData={editTransaction} onSubmit={handleSave} onClose={() => { setModalOpen(false); setEditTransaction(null); }} />}
    </div>
  );
};

export default TransactionsPage;

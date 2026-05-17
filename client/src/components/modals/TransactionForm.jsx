import { useEffect, useState } from 'react';

const initialValues = {
  itemName: '',
  amount: '',
  type: 'expense',
  category: 'Food',
  paymentMethod: 'Cash',
  shopName: '',
  purchaseDate: new Date().toISOString().slice(0, 10),
  notes: '',
};

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

const paymentMethods = ['Cash', 'UPI', 'Credit Card', 'Debit Card', 'Bank Transfer'];

const TransactionForm = ({ initialData, onSubmit, onClose }) => {
  const [formData, setFormData] = useState(initialValues);

  useEffect(() => {
    if (initialData) {
      setFormData({
        itemName: initialData.itemName || initialData.title || '',
        amount: initialData.amount?.toString() || '',
        type: initialData.type || 'expense',
        category: initialData.category || 'Food',
        paymentMethod: initialData.paymentMethod || 'Cash',
        shopName: initialData.shopName || '',
        purchaseDate: new Date(initialData.purchaseDate || initialData.date || Date.now()).toISOString().slice(0, 10),
        notes: initialData.notes || initialData.description || '',
      });
    }
  }, [initialData]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      ...formData,
      amount: Number(formData.amount),
      title: formData.itemName,
      date: formData.purchaseDate,
      purchaseDate: formData.purchaseDate,
      notes: formData.notes,
      description: formData.notes,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-2xl rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-soft">
        <div className="flex items-center justify-between gap-4 pb-6">
          <div>
            <h2 className="text-xl font-semibold text-white">{initialData ? 'Edit Purchase' : 'Add Purchase'}</h2>
            <p className="text-sm text-slate-400">Track an item purchased from a store or mart.</p>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 transition hover:text-white">Cancel</button>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm text-slate-300">
            Item name
            <input
              name="itemName"
              value={formData.itemName}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-white"
              required
            />
          </label>
          <label className="space-y-2 text-sm text-slate-300">
            Amount / Price
            <input
              name="amount"
              type="number"
              min="0"
              step="0.01"
              value={formData.amount}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-white"
              required
            />
          </label>
          <label className="space-y-2 text-sm text-slate-300">
            Category
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-white"
            >
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </label>
          <label className="space-y-2 text-sm text-slate-300">
            Shop / Mart name
            <input
              name="shopName"
              value={formData.shopName}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-white"
              required
            />
          </label>
          <label className="space-y-2 text-sm text-slate-300">
            Purchase date
            <input
              name="purchaseDate"
              type="date"
              value={formData.purchaseDate}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-white"
              required
            />
          </label>
          <label className="space-y-2 text-sm text-slate-300">
            Payment method
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-white"
            >
              {paymentMethods.map((method) => (
                <option key={method} value={method}>{method}</option>
              ))}
            </select>
          </label>
        </div>
        <label className="mt-4 block space-y-2 text-sm text-slate-300">
          Notes (optional)
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="w-full min-h-[120px] rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-white"
          />
        </label>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button type="submit" className="rounded-2xl bg-brand-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-400">Save Purchase</button>
          <button type="button" onClick={onClose} className="rounded-2xl border border-slate-700 px-6 py-3 text-sm text-slate-300 transition hover:border-brand-500">Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;

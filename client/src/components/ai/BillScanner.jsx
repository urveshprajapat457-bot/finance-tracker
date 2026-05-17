import { useEffect, useMemo, useState } from 'react';
import { FaCheckCircle, FaCloudUploadAlt, FaImage, FaTimes, FaUpload } from 'react-icons/fa';
import api from '../../services/api';
import { formatCurrency, formatDate } from '../../utils/format';

const acceptedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
const defaultFormState = {
  itemName: '',
  shopName: '',
  category: 'Shopping',
  amount: '',
  purchaseDate: new Date().toISOString().slice(0, 10),
  notes: '',
  receiptImage: '',
  AIExtracted: true,
};

const BillScanner = ({ onSave }) => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [formState, setFormState] = useState(defaultFormState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!file) {
      setPreviewUrl('');
      return undefined;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const handleFile = (selected) => {
    setError('');
    setAnalysis(null);
    if (!selected) return;
    if (!acceptedMimeTypes.includes(selected.type)) {
      setError('Please upload a JPG, PNG, WEBP or PDF receipt');
      return;
    }
    setFile(selected);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile) handleFile(droppedFile);
  };

  const analyzeReceipt = async () => {
    if (!file) {
      setError('Upload your receipt image first');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('receipt', file);

      const response = await api.post('/ai/analyze-bill', formData);
      const { extracted, insights, duplicate } = response.data;

      setFormState({
        itemName: extracted.itemName,
        shopName: extracted.shopName,
        category: extracted.category,
        amount: extracted.amount.toString(),
        purchaseDate: extracted.purchaseDate.slice(0, 10),
        notes: extracted.notes,
        receiptImage: extracted.receiptImage,
        AIExtracted: true,
      });
      setAnalysis({ ...extracted, insights, duplicate });
    } catch (err) {
      setError(err.response?.data?.message || 'Receipt analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await onSave({
        ...formState,
        amount: Number(formState.amount),
        type: 'expense',
      });
      setFile(null);
      setAnalysis(null);
      setFormState(defaultFormState);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to save scanned expense');
    }
  };

  const hasExtractedItems = useMemo(() => !!analysis?.items?.length, [analysis]);

  return (
    <section className="rounded-[32px] border border-slate-800 bg-slate-950/90 p-6 shadow-soft">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Scan Bill with AI</h2>
          <p className="mt-1 text-sm text-slate-400">Upload a receipt image and let Gemini extract expense details automatically.</p>
        </div>
        <button
          type="button"
          onClick={analyzeReceipt}
          disabled={loading || !file}
          className="inline-flex items-center gap-2 rounded-3xl bg-brand-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-400 disabled:opacity-50"
        >
          {loading ? 'Analyzing...' : <><FaCloudUploadAlt /> Analyze receipt</>}
        </button>
      </div>

      <div
        onDrop={handleDrop}
        onDragOver={(event) => event.preventDefault()}
        className="mt-6 rounded-3xl border-2 border-dashed border-slate-700 bg-slate-900/80 p-6 text-center transition hover:border-brand-500"
      >
        {previewUrl ? (
          <div className="mx-auto flex max-w-xs flex-col items-center gap-4">
            <img src={previewUrl} alt="Receipt preview" className="max-h-48 rounded-3xl object-contain" />
            <button
              type="button"
              onClick={() => setFile(null)}
              className="inline-flex items-center gap-2 rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-200 transition hover:border-brand-500"
            >
              <FaTimes /> Remove file
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 text-slate-400">
            <FaUpload className="text-4xl" />
            <p className="text-sm">Drag & drop a receipt or</p>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-3xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-slate-200 transition hover:border-brand-500">
              Choose file
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,application/pdf"
                className="hidden"
                onChange={(event) => handleFile(event.target.files?.[0])}
              />
            </label>
            <p className="text-xs text-slate-500">Supported: JPG, PNG, WEBP, PDF</p>
          </div>
        )}
      </div>

      {error && <p className="mt-4 text-sm text-rose-400">{error}</p>}

      {analysis && (
        <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_320px]">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5">
            <p className="text-sm uppercase tracking-[0.35em] text-brand-300">Extracted expense</p>
            <div className="mt-4 grid gap-4">
              <label className="block text-sm text-slate-300">
                Item name
                <input name="itemName" value={formState.itemName} onChange={handleChange} className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-white" />
              </label>
              <label className="block text-sm text-slate-300">
                Shop / Mart name
                <input name="shopName" value={formState.shopName} onChange={handleChange} className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-white" />
              </label>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block text-sm text-slate-300">
                  Amount
                  <input name="amount" value={formState.amount} type="number" onChange={handleChange} className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-white" />
                </label>
                <label className="block text-sm text-slate-300">
                  Category
                  <input name="category" value={formState.category} onChange={handleChange} className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-white" />
                </label>
              </div>
              <label className="block text-sm text-slate-300">
                Purchase date
                <input name="purchaseDate" value={formState.purchaseDate} type="date" onChange={handleChange} className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-white" />
              </label>
              <label className="block text-sm text-slate-300">
                Notes
                <textarea name="notes" value={formState.notes} onChange={handleChange} className="mt-2 w-full min-h-[100px] rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-white" />
              </label>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-base font-semibold text-white">AI insights</h3>
                {analysis.duplicate && <span className="rounded-full bg-rose-500/10 px-3 py-1 text-xs text-rose-300">Duplicate bill detected</span>}
              </div>
              <div className="mt-4 space-y-3 text-sm text-slate-300">
                {analysis.insights?.length ? (
                  analysis.insights.map((item, index) => <p key={index}>• {item}</p>)
                ) : (
                  <p>No additional insights available yet.</p>
                )}
              </div>
            </div>
            {hasExtractedItems && (
              <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <FaImage /> <span>Parsed items</span>
                </div>
                <div className="mt-4 space-y-3 text-sm text-slate-200">
                  {analysis.items.map((item, index) => (
                    <div key={index} className="rounded-3xl bg-slate-950/80 p-3">
                      <p className="font-medium text-white">{item.name}</p>
                      <p className="text-slate-400">₹{item.price} • {item.category || 'Uncategorized'}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={handleSave}
              className="w-full rounded-3xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
            >
              <FaCheckCircle /> Save scanned expense
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default BillScanner;

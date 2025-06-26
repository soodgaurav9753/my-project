'use client';

import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function AddExpensePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: '',
    date: null,
  });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/category');
        const data = await res.json();
        if (res.ok) {
          setCategories(data.categories || []);
        } else {
          console.error('Error fetching categories');
        }
      } catch (err) {
        console.error('Failed to fetch categories', err);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({ ...prev, date }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Failed to add expense');
        return;
      }

      toast.success('Expense Added Successfully!');
      setFormData({ title: '', amount: '', category: '', date: null });
      router.push('/');
    } catch (err) {
      console.error('Error:', err);
      toast.error('Something went wrong');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-950 text-white relative">
      {/* Back Button at top-left */}
      <div className="absolute top-6 right-6 z-10">
        <Link
          href="/"
          className="px-4 py-2 rounded-xl bg-purple-600/30 text-purple-300 border border-purple-500 hover:bg-purple-700/40 backdrop-blur-md shadow-lg"
        >
          ⬅️ Back to Dashboard
        </Link>
      </div>

      {/* Form center aligned */}
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="bg-black/30 backdrop-blur-lg p-10 rounded-3xl shadow-2xl w-full max-w-xl ring-1 ring-purple-500/20 mt-10">
          <h1 className="text-3xl font-bold mb-6 text-center">➕ Add Expense</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-2 text-sm text-gray-400">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full bg-black/40 border border-gray-700 text-white p-3 rounded-xl outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g. McDonald's"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm text-gray-400">Amount (₹)</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                className="w-full bg-black/40 border border-gray-700 text-white p-3 rounded-xl outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g. 300"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm text-gray-400">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-black/40 border border-gray-700 text-white p-3 rounded-xl outline-none focus:ring-2 focus:ring-purple-500"
                required
              >
                <option value="">📝 Select Category</option>
                {categories.map((cat, idx) => (
                  <option key={idx} value={cat} className="bg-gray-900 text-white">
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-2 text-sm text-gray-400">Date</label>
              <DatePicker
                selected={formData.date}
                onChange={handleDateChange}
                dateFormat="dd/MM/yyyy"
                className="w-full bg-black/40 border border-gray-700 text-white p-3 rounded-xl outline-none focus:ring-2 focus:ring-purple-500"
                placeholderText="Select date"
                showPopperArrow={false}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 transition-colors p-3 rounded-xl text-white font-bold"
            >
              ➕ Add Expense
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

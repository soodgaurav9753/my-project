'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function ViewAllExpenses() {
  const [expensesByYear, setExpensesByYear] = useState({});
  const [selectedYear, setSelectedYear] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await fetch('/api/expense');
        const data = await res.json();
        if (res.ok) {
          setExpensesByYear(data.expensesByYear);
          const years = Object.keys(data.expensesByYear).sort();
          setSelectedYear(years[years.length - 1]);
        } else {
          toast.error(data.error || 'Failed to fetch expenses');
        }
      } catch (err) {
        toast.error('Error fetching expenses');
      } finally {
        setLoading(false);
      }
    };
    fetchExpenses();
  }, []);

  const expenses = expensesByYear[selectedYear] || [];
  const years = Object.keys(expensesByYear).sort();

  const handleDelete = async (expense) => {
    const res = await fetch('/api/expense', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: expense.title,
        amount: expense.amount,
        date: expense.date,
      }),
    });

    if (res.ok) {
      const updated = expenses.filter(
        (e) =>
          !(
            e.title === expense.title &&
            e.date === expense.date &&
            e.amount === expense.amount
          )
      );
      setExpensesByYear({ ...expensesByYear, [selectedYear]: updated });
      toast.success('Deleted successfully');
    } else {
      const err = await res.json();
      toast.error(err.error || 'Failed to delete');
    }
  };

  const handleDownloadCSV = () => {
    const rows = [['Title', 'Category', 'Amount', 'Date']];
    expenses.forEach((e) => {
      rows.push([e.title, e.category, e.amount, e.date]);
    });
    const csvContent = rows.map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `expenses-${selectedYear}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-950 p-4 sm:p-8 text-white">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">📄 All Expenses</h1>
        <div className="flex flex-wrap gap-3">
          <Link href="/" className="px-4 py-2 rounded-xl bg-purple-600/30 text-purple-300 border border-purple-500 hover:bg-purple-700/40 backdrop-blur-md shadow-lg">
            ⬅️ Back to Dashboard
          </Link>
          <button onClick={handleDownloadCSV} className="px-4 py-2 rounded-xl bg-yellow-500/20 text-yellow-300 border border-yellow-500 hover:bg-yellow-600/30 backdrop-blur-md shadow-lg">
            📥 Download CSV
          </button>
        </div>
      </div>

      {/* Year Tabs */}
      <div className="flex overflow-x-auto gap-3 mb-6 scrollbar-hide">
        {years.map((year) => (
          <button
            key={year}
            onClick={() => setSelectedYear(year)}
            className={`whitespace-nowrap px-4 py-2 rounded-full font-medium transition-all ${
              selectedYear === year
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {year}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-gray-400">Loading expenses...</p>
      ) : expenses.length === 0 ? (
        <p className="text-gray-400">No expenses for {selectedYear}.</p>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden sm:block bg-black/30 backdrop-blur-lg ring-1 ring-purple-400/20 rounded-3xl p-6 shadow-xl">
            <h2 className="text-xl font-semibold mb-4">🧾 Expenses in {selectedYear}</h2>
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-purple-300 border-b border-purple-500/30">
                  <th className="py-2 px-3">#</th>
                  <th className="py-2 px-3">Title</th>
                  <th className="py-2 px-3">Category</th>
                  <th className="py-2 px-3">Amount</th>
                  <th className="py-2 px-3">Date</th>
                  <th className="py-2 px-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense, index) => (
                  <tr key={`${expense.title}-${expense.date}-${expense.amount}`} className="border-b border-gray-800 hover:bg-gray-800/40 transition">
                    <td className="py-3 px-3 text-gray-400">{index + 1}</td>
                    <td className="py-3 px-3">{expense.title}</td>
                    <td className="py-3 px-3 text-blue-300">{expense.category}</td>
                    <td className="py-3 px-3 text-red-400 font-semibold">₹ {expense.amount}</td>
                    <td className="py-3 px-3 text-gray-400">{expense.date}</td>
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => handleDelete(expense)}
                        className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg"
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="sm:hidden flex flex-col gap-4">
            {expenses.map((expense, index) => (
              <div key={index} className="bg-gray-800/60 backdrop-blur-lg rounded-xl p-4 shadow-xl ring-1 ring-purple-500/20">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold">{expense.title}</h3>
                  <span className="text-sm text-gray-400">{expense.date}</span>
                </div>
                <p className="text-sm text-blue-300 mb-1">Category: {expense.category}</p>
                <p className="text-sm text-red-400 font-bold">₹ {expense.amount}</p>
                <button
                  onClick={() => handleDelete(expense)}
                  className="mt-3 w-full bg-red-600 hover:bg-red-700 text-white rounded-lg py-2 text-sm"
                >
                  🗑️ Delete
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

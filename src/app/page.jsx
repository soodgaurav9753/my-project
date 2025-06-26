'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Sector,
} from 'recharts';

const COLORS = ['#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

export default function Dashboard() {
  const router = useRouter();
  const [categoryData, setCategoryData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [user, setUser] = useState('');
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [incomeIncrement, setIncomeIncrement] = useState('');
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [savingsData, setSavingsData] = useState([]);


  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180;
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;

    return (
      <g>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill="white" className="font-semibold text-sm">
          {payload.name}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 6}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <text x={sx} y={sy} fill="#ccc" textAnchor="middle" dominantBaseline="central" className="text-xs">
          {(percent * 100).toFixed(0)}%
        </text>
      </g>
    );
  };

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch('/api/home');
        if (!res.ok) return router.push('/login');

        const user = await res.json();
        setUser(user);
        setCategories(user.categories || []);

        const catMap = {};
        const monthMap = {};
        const allExpenses = user.expenses || [];

        const thisMonthExpenses = [];
        const thisYearExpenses = [];

        allExpenses.forEach((e) => {
          const dateObj = new Date(e.date);
          const month = dateObj.getMonth();
          const year = dateObj.getFullYear();

          // For pie chart: only current month
          if (month === currentMonth && year === currentYear) {
            catMap[e.category] = (catMap[e.category] || 0) + e.amount;
            thisMonthExpenses.push(e);
          }

          // For bar chart: all months in current year
          if (year === currentYear) {
            const monthName = dateObj.toLocaleString('default', { month: 'short' });
            monthMap[monthName] = (monthMap[monthName] || 0) + e.amount;
            thisYearExpenses.push(e);
          }
        });

        const pieData = Object.entries(catMap).map(([name, value]) => ({ name, value }));
        const barData = Object.entries(monthMap).map(([month, amount]) => ({ month, amount }));

        setCategoryData(pieData);
        setMonthlyData(barData);
        const savingsArr = barData.map(({ month, amount }) => ({
  month,
  savings: (user?.monthlyEarning || 0) - amount,
}));
setSavingsData(savingsArr);
        setExpenses(thisMonthExpenses.reverse());
      } catch (err) {
        toast.error('Error loading dashboard');
      }
    };

    fetchUserData();
  }, []);

  const totalExpense = categoryData.reduce((sum, item) => sum + item.value, 0);

  const handleIncomeUpdate = async () => {
    const incrementValue = parseFloat(incomeIncrement);
    if (isNaN(incrementValue) || incrementValue <= 0) return toast.error('Enter valid amount');

    try {
      const res = await fetch('/api/income', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ add: incrementValue }),
      });
      const data = await res.json();
      if (res.ok) {
        setUser({ ...user, monthlyEarning: data.newIncome });
        setShowIncomeModal(false);
        setIncomeIncrement('');
        toast.success('Income updated');
      } else {
        toast.error(data.error);
      }
    } catch (err) {
      toast.error('Server error');
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return toast.error('Enter category');
    try {
      const res = await fetch('/api/category', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategory }),
      });
      const data = await res.json();
      if (res.ok) {
        setCategories([...categories, newCategory]);
        setNewCategory('');
        toast.success('Category added');
      } else toast.error(data.error);
    } catch {
      toast.error('Server error');
    }
  };

  const handleDeleteCategory = async (name) => {
    try {
      const res = await fetch('/api/category', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (res.ok) {
        setCategories(categories.filter((cat) => cat !== name));
        toast.success('Deleted');
      } else {
        const data = await res.json();
        toast.error(data.error);
      }
    } catch {
      toast.error('Server error');
    }
  };

return (
<div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-950 pt-8 px-2 md:px-4 lg:px-6 text-white">


    <div className="max-w-7xl mx-auto">
      {/* Top Header with Logo and Buttons */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <img
          src="/logo.png"
          alt="Logo"
          className="h-32 w-[12.5rem] rounded-xl brightness-0 invert sepia hue-rotate-[180deg] saturate-[500%] drop-shadow-[0_0_40px_rgba(173,216,230,0.8)] transition-transform duration-300 hover:scale-105"
        />
        <div className="flex flex-wrap gap-3">
          <Link href="/add" className="px-5 py-2 rounded-xl bg-purple-600/30 text-purple-300 border border-purple-500 hover:bg-purple-700/40">➕ Add Expense</Link>
          <Link href="/expenses" className="px-5 py-2 rounded-xl bg-green-600/20 text-green-300 border border-green-500 hover:bg-green-700/30">📄 View All Expenses</Link>
          <button onClick={() => setShowCategoryModal(true)} className="px-5 py-2 rounded-xl bg-blue-600/20 text-blue-300 border border-blue-500 hover:bg-blue-700/30">➕ Add Category</button>
          <Link href="/year" className="px-5 py-2 rounded-xl bg-yellow-600/20 text-yellow-300 border border-yellow-500 hover:bg-yellow-700/30">📆 View Year Graph</Link>
          <Link href="/settings" className="px-5 py-2 rounded-xl bg-gray-600/20 text-gray-300 border border-gray-500 hover:bg-gray-700/30">⚙️ Settings</Link>
        </div>
      </div>

      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-black/30 p-6 rounded-3xl ring-1 ring-purple-500/20 shadow-xl">
          <p className="text-sm text-gray-400">Total Monthly Income</p>
          <h2 className="text-4xl font-bold text-green-400 mt-2">₹ {user?.monthlyEarning || 0}</h2>
          <button onClick={() => setShowIncomeModal(true)} className="mt-3 px-4 py-1 text-sm bg-green-700/30 text-green-300 border border-green-500 rounded-full">➕ Add to Income</button>
        </div>
        <div className="bg-black/30 p-6 rounded-3xl ring-1 ring-purple-500/20 shadow-xl">
          <p className="text-sm text-gray-400">Spent This Month</p>
          <h2 className="text-4xl font-bold text-purple-400 mt-2">₹ {totalExpense}</h2>
        </div>
        <div className="bg-black/30 p-6 rounded-3xl ring-1 ring-purple-500/20 shadow-xl">
          <p className="text-sm text-gray-400">Remaining Savings</p>
          {(() => {
            const income = user?.monthlyEarning || 0;
            const savings = income - totalExpense;
            let textColor = 'text-blue-400';
            let message = '';
            if (savings > 1000) {
              textColor = 'text-green-400';
              message = '💰 Nice profit!';
            } else if (savings > 0) {
              textColor = 'text-green-300';
              message = '🟢 Profit! Keep going!';
            } else if (savings === 0) {
              textColor = 'text-yellow-400';
              message = '⚠️ Break-even.';
            } else {
              textColor = 'text-red-500';
              message = '🔴 Loss! Be careful.';
            }

            return (
              <>
                <h2 className={`text-4xl font-bold mt-2 ${textColor}`}>₹ {savings.toFixed(2)}</h2>
                <p className="mt-2 text-sm italic text-gray-300">{message}</p>
              </>
            );
          })()}
        </div>
      </div>

      {/* Pie + Bar Chart */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-10">
        {/* Pie Chart */}
        <div className="xl:col-span-2 bg-black/40 p-6 rounded-3xl ring-1 ring-purple-400/30 shadow-xl w-full">
          <h2 className="text-xl font-semibold mb-4">📊 Category Breakdown (This Month)</h2>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                fill="#8884d8"
                dataKey="value"
                onMouseEnter={onPieEnter}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#222' }} itemStyle={{ color: '#fff' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="w-full xl:max-w-[500px] bg-black/40 p-6 rounded-3xl ring-1 ring-purple-400/30 shadow-xl">
          <h2 className="text-xl font-semibold mb-4">📅 Monthly Spend (This Year)</h2>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={monthlyData} barSize={40}>
              <XAxis dataKey="month" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip
                contentStyle={{ backgroundColor: '#111827', border: '1px solid #4B5563' }}
                itemStyle={{ color: '#E5E7EB' }}
                cursor={{ fill: '#374151' }}
              />
              <Bar dataKey="amount" radius={[10, 10, 0, 0]} fill="url(#gradient)" />
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a78bfa" />
                  <stop offset="100%" stopColor="#7c3aed" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Savings Chart */}
      <div className="mt-10 bg-black/40 p-7 rounded-3xl ring-1 ring-green-400/30 shadow-xl">
        <h2 className="text-xl font-semibold mb-4">💰 Monthly Savings (This Year)</h2>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={savingsData} barSize={40}>
            <XAxis dataKey="month" stroke="#ccc" />
            <YAxis stroke="#ccc" />
            <Tooltip
              contentStyle={{ backgroundColor: '#111827', border: '1px solid #4B5563' }}
              itemStyle={{ color: '#E5E7EB' }}
              cursor={{ fill: '#374151' }}
            />
            <Bar dataKey="savings" radius={[10, 10, 0, 0]} fill="url(#savingGradient)" />
            <defs>
              <linearGradient id="savingGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#34d399" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Expenses */}
      <div className="mt-10 bg-black/30 backdrop-blur-lg ring-1 ring-purple-400/20 rounded-3xl p-6 shadow-xl">
        <h2 className="text-xl font-semibold mb-4">🕓 Recent Expenses</h2>
        <ul className="divide-y divide-gray-700">
          {expenses.slice(0, 5).map((exp, idx) => (
            <li key={idx} className="py-4 flex justify-between">
              <span className="text-gray-300">{exp.title}</span>
              <span className="text-red-400 font-semibold">₹ {exp.amount}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>


      
{showIncomeModal && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-gray-900 p-6 rounded-2xl shadow-xl w-[90%] max-w-md">
      <h2 className="text-lg font-semibold text-white mb-4">Add to Monthly Income</h2>
      <input
        type="number"
        value={incomeIncrement}
        onChange={(e) => setIncomeIncrement(e.target.value)}
        placeholder="Enter amount (₹)"
        className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
      />
      <div className="flex justify-end gap-3 mt-4">
        <button
          onClick={() => setShowIncomeModal(false)}
          className="px-4 py-1 rounded bg-gray-700 text-white hover:bg-gray-600"
        >
          Cancel
        </button>
        <button
          onClick={handleIncomeUpdate}
          className="px-4 py-1 rounded bg-green-600 text-white hover:bg-green-500"
        >
          Save
        </button>
      </div>
    </div>
  </div>
)}
{showCategoryModal && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-gray-900 p-6 rounded-2xl shadow-xl w-[90%] max-w-md">
      <h2 className="text-lg font-semibold text-white mb-4">Manage Categories</h2>
      
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="New Category"
          className="flex-grow p-2 rounded bg-gray-800 text-white border border-gray-600"
        />
        <button
          onClick={handleAddCategory}
          className="px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-500"
        >
          Add
        </button>
      </div>

      <ul className="space-y-2 max-h-52 overflow-y-auto">
        {categories.map((cat, idx) => (
          <li key={idx} className="flex justify-between items-center bg-gray-800 px-3 py-2 rounded">
            <span className="text-white">{cat}</span>
            <button
              onClick={() => handleDeleteCategory(cat)}
              className="text-red-400 hover:text-red-300 text-xl font-bold"
            >
              &times;
            </button>
          </li>
        ))}
      </ul>

      <div className="flex justify-end gap-3 mt-4">
        <button
          onClick={() => setShowCategoryModal(false)}
          className="px-4 py-1 rounded bg-gray-700 text-white hover:bg-gray-600"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}

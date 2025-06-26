'use client';
import { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import Link from 'next/link';

export default function YearlyGraph() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchYearlyData = async () => {
      const res = await fetch('/api/expense/yearly');
      const json = await res.json();
      if (res.ok) setData(json.data);
      else alert(json.error || 'Failed to fetch yearly expenses');
    };

    fetchYearlyData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-950 p-8 text-white">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight">📈 Yearly Expense Overview</h1>
        <Link
          href="/"
          className="px-5 py-2 rounded-xl bg-purple-600/30 text-purple-300 border border-purple-500 hover:bg-purple-700/40 transition-all backdrop-blur-md shadow-lg hover:shadow-purple-500/40"
        >
          ⬅️ Back to Dashboard
        </Link>
      </div>

      <div className="bg-black/30 backdrop-blur-lg ring-1 ring-purple-500/20 rounded-3xl p-6 shadow-2xl">
        <h2 className="text-xl font-semibold mb-4">💹 Expenses Per Year</h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="year" stroke="#ccc" />
            <YAxis stroke="#ccc" />
            <Tooltip
              contentStyle={{ backgroundColor: '#1f1f1f', borderRadius: '8px', border: 'none' }}
              labelStyle={{ color: '#fff' }}
              itemStyle={{ color: '#fff' }}
            />
            <Line type="monotone" dataKey="amount" stroke="#a78bfa" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

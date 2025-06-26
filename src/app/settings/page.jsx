'use client'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SettingsPage() {
  const router = useRouter()
  const [user, setUser] = useState({ name: '', email: '' })
  const [loading, setLoading] = useState(true)
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [feedback, setFeedback] = useState('')
  const [showOTPModal, setShowOTPModal] = useState(false);
const [showNewPasswordModal, setShowNewPasswordModal] = useState(false);
const [resetEmail, setResetEmail] = useState('');
const [otp, setOtp] = useState('');
const [monthlyIncome, setMonthlyIncome] = useState('');

const [newResetPassword, setNewResetPassword] = useState('');


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/home')
        const data = await res.json()
        if (res.ok) {
          setUser({ name: data.name, email: data.email })
        } else {
          toast.error(data.error || 'Error fetching user')
        }
      } catch (err) {
        toast.error('Failed to load user')
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [])

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword) return toast.error('Fill all fields')
    try {
      const res = await fetch('/api/change-password', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldPassword, newPassword }),
      })
      const data = await res.json()
      if (res.ok) {
        toast.success('Password changed successfully')
        setOldPassword('')
        setNewPassword('')
      } else {
        toast.error(data.error || 'Failed to change password')
      }
    } catch {
      toast.error('Server error')
    }
  }
const handleUpdateIncome = async () => {
  if (!monthlyIncome || isNaN(monthlyIncome)) {
    toast.error('Enter a valid income');
    return;
  }

  try {
    const res = await fetch('/api/update-income', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ income: Number(monthlyIncome) }),
    });

    const data = await res.json();
    if (!res.ok) return toast.error(data.message || 'Failed to update income');

    toast.success('Monthly income updated!');
    setMonthlyIncome('');
  } catch (err) {
    toast.error('Error updating income');
  }
};

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' })
    router.push('/login')
  }

  const handleFeedbackSubmit = async () => {
    if (!feedback.trim()) return toast.error('Feedback cannot be empty')
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedback }),
      })
      if (res.ok) {
        toast.success('Feedback submitted!')
        setFeedback('')
      } else {
        toast.error('Failed to send feedback')
      }
    } catch {
      toast.error('Server error')
    }
  }
  const handleSendOTP = async () => {
  if (!resetEmail) return toast.error('Enter your registered email');
  try {
    const res = await fetch('/api/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: resetEmail }),
    });
    const data = await res.json();
    if (!res.ok) return toast.error(data.message || 'Failed to send OTP');
    toast.success('OTP sent to your email');
  } catch (err) {
    toast.error('Failed to send OTP');
  }
};

const handleVerifyOTP = async () => {
  try {
    const res = await fetch('/api/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: resetEmail, otp }),
    });
    const data = await res.json();
    if (!res.ok) return toast.error(data.message || 'OTP verification failed');

    toast.success('OTP verified!');
    setShowOTPModal(false);
    setShowNewPasswordModal(true);
  } catch (err) {
    toast.error('OTP verification failed');
  }
};

const handleResetPassword = async () => {
  try {
    const res = await fetch('/api/update-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: resetEmail, password: newResetPassword }),
    });
    const data = await res.json();
    if (!res.ok) return toast.error(data.message || 'Password reset failed');

    toast.success('Password changed successfully!');
    setResetEmail('');
    setOtp('');
    setNewResetPassword('');
    setShowNewPasswordModal(false);
  } catch (err) {
    toast.error('Error changing password');
  }
};


  const handleDownloadCSV = async () => {
    try {
      const res = await fetch('/api/expense')
      const data = await res.json()
      if (res.ok) {
        const rows = [['Title', 'Category', 'Amount', 'Date']]
        Object.values(data.expensesByYear).flat().forEach((e) => {
          rows.push([e.title, e.category, e.amount, e.date])
        })
        const csv = rows.map(r => r.join(',')).join('\n')
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `all-expenses.csv`
        a.click()
        URL.revokeObjectURL(url)
      } else {
        toast.error('Failed to download CSV')
      }
    } catch {
      toast.error('Something went wrong')
    }
  }

  if (loading) return <p className="text-gray-400 p-8">Loading...</p>

  return (
<div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-950 p-6 text-white space-y-10">
  <div className="flex justify-between items-center">
    <h1 className="text-4xl font-extrabold">⚙️ Settings</h1>
    <div>
      <Link
        href="/"
        className="px-4 py-2 rounded-xl bg-purple-600/30 text-purple-300 border border-purple-500 hover:bg-purple-700/40 backdrop-blur-md shadow-lg"
      >
        ⬅️ Back to Dashboard
      </Link>
    </div>
  </div>


      {/* User Info */}
      <div className="bg-black/30 p-6 rounded-xl ring-1 ring-purple-400/30 shadow-lg space-y-2">
        <h2 className="text-xl font-semibold mb-2">👤 User Info</h2>
        <p><span className="text-gray-400">Name:</span> {user.name}</p>
        <p><span className="text-gray-400">Email:</span> {user.email}</p>
      </div>

      {/* Change Password */}
      <div className="bg-black/30 p-6 rounded-xl ring-1 ring-blue-400/30 shadow-lg space-y-3">
        <h2 className="text-xl font-semibold mb-2">🔒 Change Password</h2>
        <input
          type="password"
          placeholder="Old Password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
        />
        <input
          type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
          />
          <button onClick={handleChangePassword} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mt-2">
            Update Password
          </button>
         <div className="text-center mt-4">
  <button
    onClick={() => setShowOTPModal(true)}
    className="bg-purple-700 hover:bg-purple-800 text-white font-medium px-4 py-2 rounded-xl transition-all shadow-md shadow-purple-500/20"
  >
    Forgot Password?
  </button>
</div>  
      </div>
      


      {/* Download CSV */}
      <div className="bg-black/30 p-6 rounded-xl ring-1 ring-yellow-400/30 shadow-lg space-y-2">
        <h2 className="text-xl font-semibold mb-2">📥 Export Expenses</h2>
        <button onClick={handleDownloadCSV} className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded">
          Download All Expenses CSV
        </button>
      </div>

      {/* Feedback */}
      <div className="bg-black/30 p-6 rounded-xl ring-1 ring-green-400/30 shadow-lg space-y-3">
        <h2 className="text-xl font-semibold mb-2">✉️ Feedback</h2>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600 min-h-[100px]"
          placeholder="Tell us what you think..."
        />
        <button onClick={handleFeedbackSubmit} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
          Submit Feedback
        </button>
      </div>

      {/* About */}
      <div className="bg-black/30 p-6 rounded-xl ring-1 ring-gray-400/30 shadow-lg">
        <h2 className="text-xl font-semibold mb-2">ℹ️ About</h2>
        <p className="text-gray-400">This app helps you track your expenses, visualize your budget, and improve your savings habits. Built with 💖 by Om.</p>
      </div>

      {/* Logout */}
      <div className="flex justify-end">
        <button onClick={handleLogout} className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white">
          🚪 Logout
        </button>
      </div>
      {/* OTP Modal */}
{/* OTP Modal */}
{showOTPModal && (
  <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
    <div className="bg-black/90 rounded-2xl p-6 w-full max-w-sm space-y-4 ring-1 ring-purple-500/30 shadow-lg">
      <h2 className="text-xl font-bold text-white">🔐 Forgot Password</h2>
      <input
        type="email"
        placeholder="Enter your registered email"
        value={resetEmail}
        onChange={(e) => setResetEmail(e.target.value)}
        className="w-full border border-purple-500/30 bg-gray-900 text-white px-4 py-2 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
      />
      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        className="w-full border border-purple-500/30 bg-gray-900 text-white px-4 py-2 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
      />
      <div className="flex justify-between gap-2 text-sm">
        <button onClick={handleSendOTP} className="text-blue-400 hover:underline">
          Resend OTP
        </button>
        <button onClick={() => setShowOTPModal(false)} className="text-gray-400 hover:underline">
          Cancel
        </button>
      </div>
      <button
        onClick={handleVerifyOTP}
        className="bg-purple-600 hover:bg-purple-700 transition-all text-white px-4 py-2 rounded-xl w-full font-semibold"
      >
        Verify OTP
      </button>
    </div>
  </div>
)}
{/* New Password Modal */}
{showNewPasswordModal && (
  <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
    <div className="bg-black/90 rounded-2xl p-6 w-full max-w-sm space-y-4 ring-1 ring-purple-500/30 shadow-lg">
      <h2 className="text-xl font-bold text-white">🔑 Set New Password</h2>
      <input
        type="password"
        placeholder="New password"
        value={newResetPassword}
        onChange={(e) => setNewResetPassword(e.target.value)}
        className="w-full border border-purple-500/30 bg-gray-900 text-white px-4 py-2 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
      />
      <button
        onClick={handleResetPassword}
        className="bg-purple-600 hover:bg-purple-700 transition-all text-white px-4 py-2 rounded-xl w-full font-semibold"
      >
        Update Password
      </button>
    </div>
  </div>
)}


    </div>
  )
}

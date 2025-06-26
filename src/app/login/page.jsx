'use client';

import { useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [showNewPasswordModal, setShowNewPasswordModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [otpCooldown, setOtpCooldown] = useState(false);
const [cooldownTime, setCooldownTime] = useState(0);

  const [resetEmail, setResetEmail] = useState('');

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Login failed');
        return;
      }

      toast.success('Login successful!');
      window.location.href = '/';
    } catch (err) {
      console.error('Login error:', err);
      toast.error('Something went wrong');
    }
  };

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
    setShowOTPModal(true);

    // Start cooldown
    setOtpCooldown(true);
    setCooldownTime(60); // 60 seconds cooldown

    const interval = setInterval(() => {
      setCooldownTime(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setOtpCooldown(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
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

  const handleChangePassword = async () => {
    try {
      const res = await fetch('/api/update-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail, password: newPassword }),
      });

      const data = await res.json();
      if (!res.ok) return toast.error(data.message || 'Password update failed');

      toast.success('Password changed successfully!');
      setShowNewPasswordModal(false);
      setResetEmail('');
      setOtp('');
      setNewPassword('');
    } catch (err) {
      toast.error('Error changing password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-gray-950 px-4 py-10">
      <div className="w-full max-w-md bg-black/30 backdrop-blur-lg border border-purple-500/20 rounded-3xl shadow-2xl p-8">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-extrabold text-white">🔐 Login</h1>
          <p className="text-gray-400 mt-2">Access your expense dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-black/40 text-white border border-purple-600 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-black/40 text-white border border-purple-600 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 transition-all py-3 rounded-xl text-white font-semibold shadow-md shadow-purple-500/30"
          >
            🚀 Log In
          </button>
        </form>

        <div className="text-center mt-4">
          <button
            onClick={() => setShowOTPModal(true)}
            className="text-sm text-purple-400 hover:underline"
          >
            Forgot Password?
          </button>
        </div>

        <p className="text-center text-gray-400 mt-6 text-sm">
          Don't have an account?{' '}
          <Link href="/sign" className="text-purple-400 hover:underline">
            Sign up here
          </Link>
        </p>
      </div>

      {/* OTP Modal */}
      {showOTPModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm space-y-4">
            <h2 className="text-xl font-bold">🔐 Forgot Password</h2>
            <input
              type="email"
              placeholder="Enter your registered email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              className="w-full border px-4 py-2 rounded-lg"
            />
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full border px-4 py-2 rounded-lg"
            />
            <div className="flex justify-between gap-2">
              <button
  onClick={!otpCooldown ? handleSendOTP : null}
  disabled={otpCooldown}
  className={`text-sm ${otpCooldown ? 'text-gray-400 cursor-not-allowed' : 'text-blue-500 hover:underline'}`}
>
  {otpCooldown ? `Resend OTP in ${cooldownTime}s` : 'send OTP'}
</button>

              <button
                onClick={() => setShowOTPModal(false)}
                className="text-sm text-gray-500 hover:underline"
              >
                Cancel
              </button>
            </div>
            <button
              onClick={handleVerifyOTP}
              className="bg-purple-600 text-white px-4 py-2 rounded-xl w-full"
            >
              Verify OTP
            </button>
          </div>
        </div>
      )}

      {/* New Password Modal */}
      {showNewPasswordModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm space-y-4">
            <h2 className="text-xl font-bold">🔑 Set New Password</h2>
            <input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border px-4 py-2 rounded-lg"
            />
            <button
              onClick={handleChangePassword}
              className="bg-purple-600 text-white px-4 py-2 rounded-xl w-full"
            >
              Update Password
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

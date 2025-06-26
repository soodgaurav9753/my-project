// ✅ FRONTEND SIGNUP PAGE
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import toast from 'react-hot-toast';


export default function SignUp() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [serverOtpHash, setServerOtpHash] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [extraData, setExtraData] = useState({
    monthlyEarning: "",
    occupation: "",
  });
  const [sendingOtp, setSendingOtp] = useState(false);

  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleExtraChange = (e) => {
    setExtraData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const sendOtp = async () => {
    const res = await fetch("/api/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: formData.email }),
    });
    const data = await res.json();
    if (res.ok) {
      setServerOtpHash(data.otpHash); // hashed otp
      setShowOTPModal(true);
      setResendTimer(60);
    } else {
      toast.error(data.message || "Failed to send OTP");
    }
  };

  const handleFirstSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
     if (sendingOtp) return; // prevent multiple clicks

  setSendingOtp(true);
    await sendOtp();
    setSendingOtp(false);
  };

  const handleVerifyOTP = async () => {
    const res = await fetch("/api/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ otp, otpHash: serverOtpHash }),
    });
    const data = await res.json();
    if (res.ok) {
      setShowOTPModal(false);
      setShowDetails(true);
    } else {
      toast.error(data.message || "Invalid OTP");
    }
  };

  const handleFinalSubmit = async () => {
    const res = await fetch("/api/sign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, ...extraData }),
    });

    const data = await res.json();
    if (res.ok) {
      toast.success("Account created successfully! ✅");
      window.location.href = "/login";
    } else {
      toast.error(data.message || "Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-black to-gray-900 px-4">
      <div className="w-full max-w-md bg-white/5 backdrop-blur-lg border border-purple-600/30 rounded-3xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">🚀 Sign Up</h2>

        {!showDetails ? (
          <form onSubmit={handleFirstSubmit} className="space-y-4">
            <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-black/40 text-white border border-gray-600" required />
            <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-black/40 text-white border border-gray-600" required />
            <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-black/40 text-white border border-gray-600" required />
            <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-black/40 text-white border border-gray-600" required />
            <button
  type="submit"
  disabled={sendingOtp}
  className={`w-full py-3 rounded-xl text-white font-semibold shadow-md ${
    sendingOtp
      ? 'bg-purple-400 cursor-not-allowed'
      : 'bg-purple-600 hover:bg-purple-700'
  }`}
>
  {sendingOtp ? 'Sending OTP...' : 'Continue ➡️'}
</button>
          </form>
        ) : (
          <div className="space-y-4">
            <input type="number" name="monthlyEarning" placeholder="Monthly Earning" value={extraData.monthlyEarning} onChange={handleExtraChange} className="w-full px-4 py-3 rounded-xl bg-black/40 text-white border border-gray-600" required />
            <input type="text" name="occupation" placeholder="Occupation" value={extraData.occupation} onChange={handleExtraChange} className="w-full px-4 py-3 rounded-xl bg-black/40 text-white border border-gray-600" required />
            <button onClick={handleFinalSubmit} className="w-full py-3 bg-green-600 hover:bg-green-700 rounded-xl text-white font-semibold shadow-md">Create Account ✅</button>
          </div>
        )}

        <p className="text-sm text-gray-400 mt-4 text-center">
          Already have an account? <Link href="/login" className="text-purple-400 hover:underline">Log In</Link>
        </p>

        {showOTPModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-gray-900 p-6 rounded-2xl shadow-2xl w-[90%] max-w-sm">
              <h2 className="text-xl text-white font-semibold mb-4 text-center">🔐 Verify Your Email</h2>
              <p className="text-sm text-gray-400 text-center mb-4">We’ve sent an OTP to <strong>{formData.email}</strong></p>
              <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter OTP" className="w-full p-3 bg-black/30 border border-gray-600 rounded-xl text-white" />
              <div className="flex justify-between items-center mt-4">
                <button onClick={() => setShowOTPModal(false)} className="px-4 py-1 rounded bg-gray-700 text-white hover:bg-gray-600">Cancel</button>
                <button onClick={handleVerifyOTP} className="px-4 py-1 rounded bg-green-600 text-white hover:bg-green-500">Verify</button>
              </div>
              <button disabled={resendTimer > 0} onClick={sendOtp} className="w-full mt-4 text-sm text-purple-400 hover:underline disabled:opacity-50 disabled:cursor-not-allowed">
                {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : "Resend OTP"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
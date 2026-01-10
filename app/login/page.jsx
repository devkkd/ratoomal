"use client";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/"); // redirect after login
      } else {
        alert(data.error || "Invalid credentials");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="bg-[#FBF7F0] flex flex-col items-center space-y-10 pt-10 p-1">
      {/* Spacer */}
      <div className="flex-grow flex flex-col items-center justify-center w-full max-w-md">
        <h1 className="text-4xl font-bold playfair mb-12 text-[#1A1A1A]">Login</h1>

        <form onSubmit={handleLogin} className="w-full space-y-6">
          {/* Email Field */}
          <div className="space-y-2">
            <label className="text-sm mona font-medium text-gray-700 block">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full px-4 py-3 mona rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-1 focus:ring-gray-400 transition-all placeholder:text-gray-300 placeholder:text-sm"
              required
            />
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label className="text-sm mona font-medium text-gray-700 block">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-3 mona rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-1 focus:ring-gray-400 transition-all placeholder:text-gray-300 placeholder:text-sm"
              required
            />
          </div>

          {/* Reset Password Link */}
          <div className="text-center">
            <button type="button" className="text-sm font-semibold mona border-black pb-0.5">
              Reset Password?
            </button>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-[#A39C94] text-white py-3.5 rounded-full font-medium flex items-center justify-center gap-2 hover:bg-[#8e877f] mona transition-colors"
          >
            Login <span>→</span>
          </button>

          {/* New Buyer Section */}
          <div className="pt-4 text-center">
            <p className="text-sm font-bold mona mb-1">New Buyer?</p>
            <p className="text-xs mona text-gray-500 mb-4">Verification required for first-time access.</p>
            <Link href="/signup">
              <button
                type="button"
                className="w-full bg-black text-white py-3.5 rounded-full font-medium flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors mona"
              >
                Request Business Access <span>→</span>
              </button>
            </Link>
          </div>
        </form>
      </div>

      {/* Footer */}
      <div className="w-full max-w-7xl flex flex-col md:flex-row justify-between items-center text-[10px] text-gray-500 gap-4 mt-8">
        <p className="text-center md:text-left mona">
          If you have received login credentials via email, please use them here to continue viewing detailed product information and submit inquiries.
        </p>
        <p>
          <span className="font-bold text-black mona">Need assistance?</span> Contact us at{" "}
          <a href="mailto:ratoomal@ratoomals.com" className="underline">ratoomal@ratoomals.com</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;

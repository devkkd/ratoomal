"use client";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Check if both fields are filled
  const isFormValid = email.trim() !== "" && password.trim() !== "";

const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include", // Important for cookies
      });

      const data = await res.json();

      if (res.ok) {
        // Store only email in localStorage (token is in httpOnly cookie)
        if (typeof window !== 'undefined') {
          localStorage.setItem("userEmail", email);
        }
        
        // Force a page reload to ensure all components update with new auth state
        window.location.href = "/";
      } else {
        alert(data.error || "Invalid credentials");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#FBF7F0] flex flex-col items-center space-y-10 pt-10 p-1">
      {/* Spacer */}
      <div className="flex-grow flex flex-col items-center justify-center w-full max-w-md">
        <h1 className="text-4xl font-bold playfair mb-12 text-[#1A1A1A]">Login</h1>

        <form onSubmit={handleLogin} className="w-full space-y-6">
          {/* Form Valid Indicator */}
          {/* {isFormValid && (
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-medium animate-pulse">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Ready to login
              </div>
            </div>
          )} */}
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
              className={`w-full px-4 py-3 mona rounded-lg border bg-white focus:outline-none focus:ring-1 transition-all placeholder:text-gray-300 placeholder:text-sm ${
                email.trim() !== "" 
                  ? 'border-[#C08237] focus:ring-[#C08237] bg-[#FFF6EB]' 
                  : 'border-gray-200 focus:ring-gray-400'
              }`}
              required
            />
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label className="text-sm mona font-medium text-gray-700 block">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className={`w-full px-4 py-3 pr-12 mona rounded-lg border bg-white focus:outline-none focus:ring-1 transition-all placeholder:text-gray-300 placeholder:text-sm ${
                  password.trim() !== "" 
                    ? 'border-[#C08237] focus:ring-[#C08237] bg-[#FFF6EB]' 
                    : 'border-gray-200 focus:ring-gray-400'
                }`}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors ${
                  password.trim() !== "" 
                    ? 'text-[#C08237] hover:text-[#a66f2e]' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {showPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>
          </div>

          {/* Reset Password Link */}
          {/* <div className="text-center">
            <button type="button" className="text-sm font-semibold mona border-black pb-0.5">
              Reset Password?
            </button>
          </div> */}

          {/* Login Button */}
          <button
            type="submit"
            disabled={!isFormValid || loading}
            className={`w-full py-3.5 rounded-full font-medium flex items-center justify-center gap-2 mona transition-all duration-300 ${
              isFormValid && !loading
                ? 'bg-[#C08237] text-white hover:bg-[#a66f2e] shadow-lg transform hover:scale-[1.02]'
                : 'bg-[#A39C94] text-white cursor-not-allowed opacity-70'
            }`}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Logging in...
              </>
            ) : (
              <>
                Login <span>→</span>
              </>
            )}
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

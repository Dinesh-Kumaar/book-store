import React from 'react';
import { Eye, Lock, Mail, ArrowRight, User } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router';
import { useDispatch } from 'react-redux'
import { loginSuccess } from '../../features/user/userSlice.js'
import { useState } from 'react';
import axios from 'axios';
import API from '../api'

export default function SignIn() {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  const returnTo = searchParams.get('returnTo');

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginType, setLoginType] = useState("user");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);
    try {
      const res = await API.post("/signin", {
        email,
        password,
      });
      if (res.data.token) {
        dispatch(
          loginSuccess({
            user: res.data.user,
            token: res.data.token
          })
        );
        const role = res.data.user?.role;
        window.alert(`Logged in successfully as ${role === 'admin' ? 'Admin' : 'User'}`);

        if (returnTo) {
          navigate(returnTo, { replace: true });
        } else if (role === "admin") {
          navigate("/admin/products", { replace: true });
        } else {
          navigate("/", { replace: true });
        }
      }
    } catch (error) {
      console.error('Login failed:', error);
      window.alert(error.response?.data?.message || "Login failed");
      setErrorMsg(error.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Background Glow Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Main Container Card */}
      <div className="relative w-full max-w-md bg-white/80 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-xl p-6 sm:p-8">

        {/* Card Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome back</h1>
          <p className="text-slate-500 text-sm mt-2">
            Enter your credentials to access your account
          </p>
        </div>
        <div className="flex bg-gray-100 p-1 rounded-lg mb-6">
          <button
            type="button"
            onClick={() => setLoginType("user")}
            className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${
              loginType === "user"
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Customer Login
          </button>
          <button
            type="button"
            onClick={() => setLoginType("admin")}
            className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${
              loginType === "admin"
                ? "bg-white text-indigo-500 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Admin Login 
          </button>
        </div>
        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded">
            {errorMsg}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Input Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="h-5 w-5" />
              </div>
              <input
                type="email"
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Password Input Field */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Password
              </label>
              <a
                href="#forgot"
                className="text-xs text-indigo-600 hover:text-indigo-500 transition-colors"
              >
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="h-5 w-5" />
              </div>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
              >
                <Eye className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Sign In Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-lg shadow-lg shadow-indigo-600/20 flex items-center justify-center space-x-2 transition-all duration-200 hover:shadow-indigo-500/30 active:scale-[0.99]"
          >
            {loading ? "Signing In..." : loginType === "admin" ? "Sign In as Admin" : "Sign In"}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-slate-400">Or</span>
          </div>
        </div>

        {/* New User Action / Sign Up Option */}
        <div className="text-center text-sm text-slate-500">
          Don't have an account?{' '}
          <button onClick={() => navigate('/signup')} className="text-indigo-600 hover:text-indigo-500 font-semibold transition-colors underline-offset-4 hover:underline">
            Create an account
          </button>
        </div>

      </div>
    </div>
  );
}
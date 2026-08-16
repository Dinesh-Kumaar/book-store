import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { loginSuccess, logout } from "../features/user/userSlice";
import {
  User,
  Mail,
  Shield,
  ShoppingBag,
  Package,
  LogOut,
  Edit2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Clock,
  Sparkles,
} from "lucide-react";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const token = localStorage.getItem("token");

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setMsg({ type: "", text: "" });
    const userId = user?._id || user?.id;
    if (!userId) return;

    setSaving(true);
    try {
      const res = await axios.put(
        `http://localhost:3000/update/${userId}`,
        { name, email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success && res.data.updatedUser) {
        dispatch(
          loginSuccess({
            user: res.data.updatedUser,
            token,
          })
        );
        setMsg({ type: "success", text: "Profile updated successfully!" });
        setIsEditing(false);
      } else {
        setMsg({ type: "error", text: res.data.message || "Failed to update profile" });
      }
    } catch (err) {
      console.error(err);
      setMsg({
        type: "error",
        text: err.response?.data?.message || "Failed to update profile.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/signin");
  };

  const getInitials = (nameStr) => {
    if (!nameStr) return "U";
    return nameStr
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8">
        {/* Profile Banner */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            {/* Avatar Circle */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-extrabold text-3xl flex items-center justify-center shadow-lg shadow-blue-600/20 border-4 border-white">
              {getInitials(user?.name)}
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl font-black text-slate-900">
                  {user?.name || "User Profile"}
                </h1>
                <span
                  className={`text-xs font-bold px-3 py-0.5 rounded-full uppercase tracking-wider ${
                    user?.role === "admin"
                      ? "bg-amber-100 text-amber-800 border border-amber-300"
                      : "bg-blue-100 text-blue-800 border border-blue-200"
                  }`}
                >
                  {user?.role || "Customer"}
                </span>
              </div>
              <p className="text-sm text-slate-500 font-medium">{user?.email}</p>
              <p className="text-xs text-slate-400">Account ID: {user?._id || user?.id}</p>
            </div>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold px-4 py-2.5 rounded-xl transition"
            >
              <Edit2 className="w-4 h-4" />
              {isEditing ? "Cancel Edit" : "Edit Profile"}
            </button>
          </div>
        </div>

        {/* Message Alert */}
        {msg.text && (
          <div
            className={`p-4 rounded-xl text-sm font-medium mb-6 flex items-center gap-2 ${
              msg.type === "success"
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {msg.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
            )}
            {msg.text}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Info Card / Edit Form */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
              <h2 className="text-lg font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Personal Information
              </h2>

              {isEditing ? (
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={saving}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl transition text-sm flex items-center gap-2 shadow-md shadow-blue-600/20"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-4 py-2.5 rounded-xl transition text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4 text-sm">
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-500 font-medium flex items-center gap-2">
                      <User className="w-4 h-4 text-blue-500" /> Full Name
                    </span>
                    <span className="font-bold text-slate-900">{user?.name || "N/A"}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-500 font-medium flex items-center gap-2">
                      <Mail className="w-4 h-4 text-blue-500" /> Email Address
                    </span>
                    <span className="font-semibold text-slate-900">{user?.email || "N/A"}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-500 font-medium flex items-center gap-2">
                      <Shield className="w-4 h-4 text-blue-500" /> Account Role
                    </span>
                    <span className="font-bold capitalize text-slate-900">
                      {user?.role || "Customer"}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
              <h2 className="text-lg font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" /> Quick Actions
              </h2>

              <button
                onClick={() => navigate(user?.role === "admin" ? "/admin/orders" : "/orders")}
                className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 font-semibold p-3.5 rounded-xl transition flex items-center justify-between text-sm group"
              >
                <span className="flex items-center gap-2.5">
                  <Package className="w-4 h-4 text-blue-600" />
                  {user?.role === "admin" ? "Order Management" : "My Orders"}
                </span>
                <span className="text-slate-400 group-hover:translate-x-1 transition">→</span>
              </button>

              <button
                onClick={() => navigate("/cart")}
                className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 font-semibold p-3.5 rounded-xl transition flex items-center justify-between text-sm group"
              >
                <span className="flex items-center gap-2.5">
                  <ShoppingBag className="w-4 h-4 text-blue-600" /> View Shopping Cart
                </span>
                <span className="text-slate-400 group-hover:translate-x-1 transition">→</span>
              </button>

              <div className="pt-2 border-t border-slate-100">
                <button
                  onClick={handleLogout}
                  className="w-full bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 font-bold p-3.5 rounded-xl transition flex items-center justify-center gap-2 text-sm"
                >
                  <LogOut className="w-4 h-4" /> Log Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProfilePage;
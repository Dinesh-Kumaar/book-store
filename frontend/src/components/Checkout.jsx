import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { clearCart } from "../features/cart/cartSlice";
import {
  User,
  Phone,
  MapPin,
  CreditCard,
  Banknote,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowLeft,
  ShoppingBag,
  Clock,
  Loader2,
} from "lucide-react";

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart.items);
  const { user } = useSelector((state) => state.user);

  const token = localStorage.getItem("token");

  // Form states
  const [userName, setUserName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [address, setAddress] = useState(user?.address || "");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  // Update inputs if user state loads asynchronously
  useEffect(() => {
    if (user) {
      if (!userName && user.name) setUserName(user.name);
      if (!phone && user.phone) setPhone(user.phone);
      if (!address && user.address) setAddress(user.address);
    }
  }, [user]);

  const parsePrice = (priceVal) => {
    if (typeof priceVal === "number") return priceVal;
    if (typeof priceVal === "string") {
      const cleaned = priceVal.replace(/[^0-9.]/g, "");
      return parseFloat(cleaned) || 0;
    }
    return 0;
  };

  const totalPrice = cart.reduce(
    (total, item) => total + parsePrice(item.price) * item.quantity,
    0
  );

  const handleAddOrder = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!userName.trim() || !phone.trim() || !address.trim()) {
      setErrorMsg("Please fill in all shipping and contact details.");
      return;
    }

    if (cart.length === 0) {
      setErrorMsg("Your cart is empty. Add items before checking out.");
      return;
    }

    setIsSubmitting(true);

    try {
      const addOrderPayload = {
        user: user?._id || user?.id,
        products: cart.map((item) => ({
          product: item._id || item.id,
          productName: item.title || item.name,
          quantity: item.quantity,
          price: parsePrice(item.price),
        })),
        totalPrice: totalPrice.toFixed(2),
        userName,
        phone,
        address,
        paymentMethod,
      };

      const res = await axios.post("http://localhost:5000/create-order", addOrderPayload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success || res.status === 201) {
        setOrderSuccess(res.data.order || addOrderPayload);
        dispatch(clearCart());
      } else {
        setErrorMsg(res.data.message || "Failed to place order");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(
        err.response?.data?.message || "Failed to place order. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
        {/* Step Progression Header */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4 text-sm font-semibold max-w-lg mx-auto mb-6">
            <div
              onClick={() => navigate("/cart")}
              className="flex items-center gap-2 text-slate-500 hover:text-blue-600 cursor-pointer"
            >
              <span className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">
                ✓
              </span>
              <span>Cart</span>
            </div>

            <div className="w-12 h-0.5 bg-blue-600" />

            <div className="flex items-center gap-2 text-blue-600">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                2
              </span>
              <span>Shipping & Payment</span>
            </div>

            <div className="w-12 h-0.5 bg-slate-200" />

            <div className="flex items-center gap-2 text-slate-400">
              <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-xs font-bold">
                3
              </span>
              <span>Confirmation</span>
            </div>
          </div>

          <h1 className="text-3xl font-extrabold text-slate-900 text-center tracking-tight">
            Checkout Details
          </h1>
          <p className="text-center text-slate-500 text-sm mt-1">
            Complete your order by providing your delivery information and payment preferences.
          </p>
        </div>

        {cart.length === 0 && !orderSuccess ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center max-w-md mx-auto my-8">
            <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h2 className="text-xl font-bold text-slate-900 mb-1">
              Your cart is empty
            </h2>
            <p className="text-slate-500 text-sm mb-6">
              You need items in your cart to proceed with checkout.
            </p>
            <button
              onClick={() => navigate("/")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl transition inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Go to Store
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Shipping & Payment Form */}
            <div className="lg:col-span-7">
              <form onSubmit={handleAddOrder} className="space-y-6">
                {errorMsg && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-4 rounded-xl flex items-center gap-2">
                    <span className="font-bold">Error:</span> {errorMsg}
                  </div>
                )}

                {/* Shipping Information Card */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
                  <h2 className="text-lg font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-600" />
                    Customer & Delivery Information
                  </h2>

                  <div>
                    <label
                      htmlFor="name"
                      className="block text-xs font-semibold text-slate-700 mb-1"
                    >
                      Full Name *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        id="name"
                        required
                        placeholder="John Doe"
                        className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-xs font-semibold text-slate-700 mb-1"
                    >
                      Phone Number *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Phone className="w-4 h-4" />
                      </div>
                      <input
                        type="tel"
                        id="phone"
                        required
                        placeholder="+1 (555) 000-0000"
                        className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="address"
                      className="block text-xs font-semibold text-slate-700 mb-1"
                    >
                      Shipping Address *
                    </label>
                    <div className="relative">
                      <div className="absolute top-3 left-3.5 pointer-events-none text-slate-400">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <textarea
                        id="address"
                        required
                        rows="3"
                        placeholder="123 Main Street, Apt 4B, City, Country, ZIP"
                        className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Method Card */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
                  <h2 className="text-lg font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                    Select Payment Method
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* COD Selector */}
                    <div
                      onClick={() => setPaymentMethod("COD")}
                      className={`cursor-pointer rounded-xl p-4 border-2 transition flex items-start gap-3 ${
                        paymentMethod === "COD"
                          ? "border-blue-600 bg-blue-50/50 text-blue-950"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                    >
                      <div
                        className={`p-2 rounded-lg ${
                          paymentMethod === "COD"
                            ? "bg-blue-600 text-white"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        <Banknote className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-sm flex items-center gap-1.5">
                          Cash on Delivery
                          {paymentMethod === "COD" && (
                            <CheckCircle2 className="w-4 h-4 text-blue-600 inline" />
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Pay cash upon package arrival
                        </p>
                      </div>
                    </div>

                    {/* Online Payment Selector */}
                    <div
                      onClick={() => setPaymentMethod("Online")}
                      className={`cursor-pointer rounded-xl p-4 border-2 transition flex items-start gap-3 ${
                        paymentMethod === "Online"
                          ? "border-blue-600 bg-blue-50/50 text-blue-950"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                    >
                      <div
                        className={`p-2 rounded-lg ${
                          paymentMethod === "Online"
                            ? "bg-blue-600 text-white"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-sm flex items-center gap-1.5">
                          Online Payment
                          {paymentMethod === "Online" && (
                            <CheckCircle2 className="w-4 h-4 text-blue-600 inline" />
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Cards, NetBanking, UPI
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/40 transition flex items-center justify-center gap-2 text-base"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Placing Your Order...
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5" />
                      Place Order (${totalPrice.toFixed(2)})
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Right Column: Order Review Sidebar */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sticky top-24 space-y-4">
                <h2 className="text-lg font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-blue-600" />
                  Order Summary ({cart.length} items)
                </h2>

                {/* Product List */}
                <div className="max-h-64 overflow-y-auto space-y-3 pr-1 divide-y divide-slate-100">
                  {cart.map((item, index) => {
                    const unitPrice = parsePrice(item.price);
                    return (
                      <div
                        key={item._id || item.id || index}
                        className="flex items-center gap-3 pt-2 first:pt-0"
                      >
                        <div className="w-14 h-14 bg-slate-100 rounded-lg overflow-hidden shrink-0 border border-slate-200 p-1">
                          <img
                            src={item.image}
                            alt={item.title || item.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-semibold text-slate-800 truncate">
                            {item.title || item.name}
                          </h4>
                          <p className="text-[11px] text-slate-500">
                            Qty: {item.quantity} × ${unitPrice.toFixed(2)}
                          </p>
                        </div>
                        <span className="text-xs font-bold text-slate-900">
                          ${(unitPrice * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Grand Total */}
                <div className="pt-4 border-t border-slate-100 flex justify-between items-baseline">
                  <span className="font-bold text-slate-900 text-lg">Total Price</span>
                  <span className="text-2xl font-black text-blue-600">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>

                {/* Guarantee box */}
                <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 text-xs text-slate-600 flex items-center gap-3">
                  <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
                  <div>
                    <p className="font-semibold text-slate-800">
                      Encrypted Checkout
                    </p>
                    <p className="text-[11px]">
                      Your payment & personal information are processed safely.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Order Success Modal */}
      {orderSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl max-w-lg w-full p-8 text-center space-y-6 transform animate-scale-up">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Order Placed Successfully!
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 mt-2">
                Thank you for your order!
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                We've received your request and are preparing your order.
              </p>
            </div>

            {/* Order Brief Info */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-left text-xs space-y-2">
              <div className="flex justify-between text-slate-600">
                <span>Customer Name:</span>
                <span className="font-bold text-slate-900">{orderSuccess.userName}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Phone:</span>
                <span className="font-semibold text-slate-900">{orderSuccess.phone}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Payment Method:</span>
                <span className="font-bold text-blue-600">{orderSuccess.paymentMethod}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Total Amount:</span>
                <span className="font-black text-slate-900">${orderSuccess.totalPrice}</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-700 pt-2 border-t border-slate-200 font-medium">
                <Clock className="w-4 h-4" /> Estimated Delivery: 3 - 5 Business Days
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => navigate(user?.role === "admin" ? "/admin/orders" : "/orders")}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-1.5 text-sm"
              >
                <ShoppingBag className="w-4 h-4" /> View My Orders
              </button>
              <button
                onClick={() => navigate("/")}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 rounded-xl transition text-sm"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Checkout;
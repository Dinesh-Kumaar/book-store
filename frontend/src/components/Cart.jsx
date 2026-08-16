import React from 'react'
import { useSelector, useDispatch } from 'react-redux';
import Navbar from './Navbar';
import Footer from './Footer';
import { useNavigate } from 'react-router';
import { increaseQuantity, decreaseQuantity, clearItem, clearCart, removeFromCart } from "../features/cart/cartSlice";
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ArrowLeft, ShieldCheck, Truck, RotateCcw } from "lucide-react";
const Cart = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const cartItems = useSelector((state) => state.cart.items);
    const parsePrice = (priceVal) => {
        if (typeof priceVal === "number") return priceVal;
        if (typeof priceVal === "string") {
            const parsed = priceVal.replace(/[^0-9.]/g, "");
            return parseFloat(parsed) || 0;
        }
        return 0;
    };

    const totalPrice = cartItems.reduce((sum, item) => {
        return sum + parsePrice(item.price) * item.quantity;
    }, 0);
    return (
        <>
            <Navbar />
            <div className="grow border-2 border-gray-800 rounded-lg bg-gray-50 p-5">
                <h2 className="mb-4 text-2xl font-bold">Your Cart</h2>

                {cartItems.length > 0 && (
                    <button
                        onClick={() => {
                            if (window.confirm("Are you sure you want to clear your cart?")) {
                                dispatch(clearCart());
                            }
                        }}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-lg transition"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                        Clear Cart
                    </button>
                )}

                {cartItems.length === 0 ? (
                    <p className="text-gray-600">Your cart is empty.</p>
                ) : (
                    <>
                        <ul className="list-none p-0">
                            {cartItems.map((item, index) => {
                                const unitPrice = parsePrice(item.price);
                                const unitTotPrice = unitPrice * item.quantity;
                                return (
                                    <li
                                        key={item.id}
                                        className="p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 hover:bg-slate-50/60 transition"
                                    >
                                        {/* Product Thumbnail */}
                                        <div className="w-24 h-24 sm:w-28 sm:h-28 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0 border border-slate-200 relative group">
                                            <img
                                                src={item.image}
                                                alt={item.title || item.name}
                                                className="w-full h-full object-contain p-2 group-hover:scale-105 transition duration-300"
                                            />
                                        </div>

                                        {/* Product Details */}
                                        <div className="flex-1 text-center sm:text-left min-w-0">
                                            <h3 className="font-bold text-slate-900 text-base sm:text-lg truncate line-clamp-1 mb-1">
                                                {item.title || item.name}
                                            </h3>
                                            <p className="text-sm font-semibold text-blue-600 mb-3">
                                                ${unitPrice.toFixed(2)}{" "}
                                                <span className="text-slate-400 font-normal text-xs">/ each</span>
                                            </p>

                                            {/* Mobile Stepper + Price */}
                                            <div className="flex items-center justify-between sm:justify-start gap-4">
                                                {/* Quantity Selector */}
                                                <div className="inline-flex items-center border border-slate-300 rounded-lg bg-white shadow-sm overflow-hidden">
                                                    <button
                                                        onClick={() => dispatch(decreaseQuantity(item.id))}
                                                        className="p-1.5 sm:p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition border-r border-slate-200"
                                                        title="Decrease quantity"
                                                    >
                                                        <Minus className="w-3.5 h-3.5" />
                                                    </button>
                                                    <span className="px-3 py-1 font-semibold text-sm text-slate-800 min-w-[36px] text-center">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => dispatch(increaseQuantity(item.id))}
                                                        className="p-1.5 sm:p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition border-l border-slate-200"
                                                        title="Increase quantity"
                                                    >
                                                        <Plus className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>

                                                {/* Remove button */}
                                                <button
                                                    onClick={() => dispatch(clearCart(item.id))}
                                                    className="text-slate-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition"
                                                    title="Remove item"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Line Price Total */}
                                        <div className="text-right sm:self-center flex sm:flex-col items-center justify-between w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                                            <span className="text-xs text-slate-400 sm:hidden">Total:</span>
                                            <span className="font-extrabold text-slate-900 text-lg sm:text-xl">
                                                ${unitTotPrice.toFixed(2)}
                                            </span>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>

                        <div className="pt-2">
                            <button
                                onClick={() => navigate("/")}
                                className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Continue Shopping
                            </button>
                        </div>
                        <div className="lg:col-span-4 space-y-6">
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sticky top-24">
                                <h2 className="text-lg font-bold text-slate-900 mb-6 pb-3 border-b border-slate-100">
                                    Order Summary
                                </h2>

                                {/* Total */}
                                <div className="flex justify-between items-baseline mb-6">
                                    <span className="text-lg font-bold text-slate-900">Total Price</span>
                                    <span className="text-3xl font-black text-blue-600">
                                        ${totalPrice.toFixed(2)}
                                    </span>
                                </div>

                                {/* Checkout Button */}
                                <button
                                    onClick={() => navigate("/checkout")}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 transition flex items-center justify-center gap-2 text-base group"
                                >
                                    Proceed to Checkout
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
                                </button>

                                {/* Trust Badges */}
                                <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-[11px] text-slate-500 font-medium">
                                    <div className="flex flex-col items-center gap-1">
                                        <ShieldCheck className="w-4 h-4 text-blue-600" />
                                        <span>Secure Checkout</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-1">
                                        <Truck className="w-4 h-4 text-blue-600" />
                                        <span>Fast Delivery</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-1">
                                        <RotateCcw className="w-4 h-4 text-blue-600" />
                                        <span>30-Day Returns</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
            <Footer />
        </>
    )
}

export default Cart;
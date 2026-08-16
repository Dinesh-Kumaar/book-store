import React from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router";
import { Link } from "react-router";
import { logout } from '../features/user/userSlice.js'
import { useDispatch } from "react-redux";
function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const cartItems = useSelector((state) => state.cart.items);
  const wishList = useSelector((state) => state.wishList.lists);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const { user } = useSelector((state) => state.user);
  const token = useSelector((state) => state.user.token);
  // const token = localStorage.getItem('token');
  // const user = JSON.parse(localStorage.getItem('user'));

  const cart = useSelector((state) => state.cart.items);

  const isAdmin = user?.role === "admin";

  const handleLogout = () => {
    // localStorage.removeItem('token');
    // localStorage.removeItem('user');
    dispatch(logout());
    navigate('/signin')
  }
  return (
    <nav className="bg-indigo-700 text-white flex justify-between items-center px-8 py-6 shadow-md">

      <ul className="flex gap-6 ">
        <li onClick={() => navigate("/")}><a href="#" className="hover:text-yellow-300 text-xl font-bold">Home</a></li>

        <li onClick={() => navigate("/")}><a href="#" className="hover:text-yellow-300 text-xl font-bold">Categories</a></li>
        <li><a href="#" className="hover:text-yellow-300 text-xl font-bold">Contact</a></li>
      </ul>
      <h2 className="text-2xl font-bold mr-6"><a href="#" className="hover:text-yellow-300"> Book Store</a></h2>
      <ul className="flex gap-6">
        {user && isAdmin && (
          <li
            onClick={() => navigate("/orders")}
            className={`cursor-pointer hover:text-blue-200 transition ${location.pathname === '/orders' ? 'underline font-semibold' : ''}`}
          >
            My orders
          </li>
        )}
        {isAdmin && (
          <div className="flex items-center gap-2">
            <div
              onClick={() => navigate("/admin/products")}
              className={`cursor-pointer bg-amber-400 hover:bg-amber-300 text-blue-950 px-3.5 py-1 rounded-lg font-bold transition flex items-center gap-1.5 shadow-sm ${location.pathname === '/admin/products' ? 'ring-2 ring-white' : ''
                }`}
            >
              <span>⚙️</span> Products
            </div>

            <div
              onClick={() => navigate("/admin/orders")}
              className={`cursor-pointer bg-amber-400 hover:bg-amber-300 text-blue-950 px-3.5 py-1 rounded-lg font-bold transition flex items-center gap-1.5 shadow-sm ${location.pathname === '/admin/orders' ? 'ring-2 ring-white' : ''
                }`}
            >
              <span>📦</span> Order Management
            </div>
          </div>
        )}
        <li>
          {user ? (
            <div
              onClick={() => navigate("/profile")}
              className={`flex items-center gap-1.5 bg-blue-700/80 hover:bg-blue-800 text-white px-3 py-1 rounded-lg border border-blue-400/40 cursor-pointer transition shadow-sm group ${location.pathname === '/profile' ? 'ring-2 ring-white font-bold' : ''
                }`}
              title="View Profile"
            >
              <span className="text-xs">👤</span>
              <span className="font-semibold text-sm max-w-[120px] truncate group-hover:underline">
                {user.name || "User"}
              </span>
            </div>
          ) : (
            <button
              onClick={() => navigate("/signin")}
              className="bg-white text-blue-700 font-semibold py-1.5 px-3 rounded-lg hover:bg-blue-50 transition text-sm shadow-sm"
            >
              Sign In
            </button>
          )}

        </li>


        <li>
          <button
            onClick={() => navigate('/wishlist')}
            className="hover:text-yellow-300 text-xl font-bold"
          >
            WishList({wishList.length})
          </button>
        </li>
        <li>
          <button
            onClick={() => navigate('/cart')}
            className="hover:text-yellow-300 text-xl font-bold"
          >
            Cart({cartCount})
          </button>
        </li>
        <li>

          {user && (
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white font-semibold py-1 px-2 rounded-lg"
            >
              Logout
            </button>
          )}
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
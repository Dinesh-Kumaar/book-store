import './App.css'
import Main from './components/Main'
import Cart from './components/Cart'
import ProductList from './components/ProductList'
import WishList from './components/WishList'
import SignUp from "./components/login/SignUp";
import SignIn from "./components/login/SignIn";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import axios from "axios";
import API from './api'
import { loginSuccess, logout } from "./features/user/userSlice";
import ProtectedRoute from './components/ProtectedRoutes';
import AdminProducts from './components/AdminProducts'
import AdminRoutes from './components/AdminRoutes'
import Checkout from './components/Checkout';
import OrderPage from "./components/OrderPage";
import ProfilePage from "./components/ProfilePage";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token");
      console.log("Token from localStorage:", token);

      if (!token) {
        return;
      }

      try {
        const res = await API.get("/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data.success && res.data.user) {
          dispatch(
            loginSuccess({
              user: res.data.user,
              token: token,
            }),
          );
        }
      } catch (err) {
        console.log(err);
        dispatch(logout());
      }
    };

    fetchUserProfile();
  }, [dispatch]);
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path='/wishlist' element={<WishList />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/orders" element={<OrderPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>
            <Route element={<AdminRoutes />}>
              <Route path="/admin/products" element={<AdminProducts />} />
              <Route path="/admin/orders" element={<OrderPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    </>
  )
}

export default App
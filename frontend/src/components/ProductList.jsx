import React, { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
// import products from '../data.js';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../features/cart/cartSlice.js';
import { addToList, removeFromList } from '../features/wishlist/wishListSlice.js';
import axios from 'axios';
import API from '../api'
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';
import { useNavigate } from 'react-router-dom';

const ProductList = () => {
    const navigate = useNavigate();x
    const dispatch = useDispatch();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const cart = useSelector((state) => state.cart.items);
    const wishList = useSelector((state) => state.wishList.lists);

    const { user, token } = useSelector((state) => state.user);
    const isAdmin = user?.role === "admin";
    const userToken = token || localStorage.getItem("token");

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const response = await API.get('/products');
                if (response.data.success) {
                    setProducts(response.data.products || []);
                } else {
                    setProducts(response.data || []);
                }
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const handleDeleteProduct = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        try {
            const res = await axios.delete(`http://localhost:3000/products/${id}`, {
                headers: {
                    Authorization: `Bearer ${userToken}`,
                },
            });
            if (res.data.success) {
                window.alert("Product deleted successfully");
                fetchProducts();
            }
        } catch (err) {
            console.error(err);
            window.alert(err.response?.data?.message || "Failed to delete product");
        }
    };

    const [activeStatus, setActiveStatus] = useState({});
    const handleToggle = (product) => {
        const isActive = !!activeStatus[product.id];
        setActiveStatus(prev => ({
            ...prev,
            [product._id]: !isActive
        }));
        if (isActive) {
            dispatch(removeFromList(product.id));
        } else {
            dispatch(addToList(product));
        }
    }

    return (
        <>
            <Navbar />
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Our Products</h1>
                {isAdmin && (
                    <button
                        onClick={() => navigate("/admin/products")}
                        className="bg-amber-400 hover:bg-amber-300 text-blue-950 font-bold px-4 py-2 rounded-lg shadow transition flex items-center gap-2"
                    >
                        <span>⚙️</span> Manage Products (Admin)
                    </button>
                )}
            </div>
            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                </div>
            ) : products.length === 0 ? (
                <p className="text-center text-gray-500 py-10">No products available.</p>
            ) : (
                <div className="p-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {products.map((product) => (
                        <div
                            key={product._id}
                            className="w-full border border-gray-200 rounded-xl p-4 shadow hover:shadow-lg transition"
                        >
                            <div
                                style={{ backgroundImage: `url(${product.imageUrl})` }}
                                className="relative bg-cover bg-center bg-no-repeat w-full h-100 rounded-lg"
                            >
                                <div className="bg-white rounded-4xl p-2 absolute bottom-0 right-0 m-3">

                                    <button onClick={() => handleToggle(product)} >
                                        <Heart
                                            className={`${activeStatus[product.id] && 'fill-current text-red-500'}`}
                                            size={20}
                                        />
                                    </button>
                                </div>

                            </div>

                            <div className="mt-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-3xl font-semibold">{product.name}</h3>
                                    <p className="text-black-600 font-bold text-2xl">
                                        ₹{product.price}
                                    </p>
                                </div>
                                <div className="mt-2 flex  gap-2 justify-between items-center">
                                    <div className="flex flex-col items-start space-x-2">
                                        <span className="text-gray-700 text-lg font-semibold">Author:</span>
                                        <span className="text-gray-700 text-lg font-semibold">Genre:</span>
                                    </div>

                                    <div className="flex flex-col items-end space-x-2">
                                        <p className="text-black-600 text-2xl font-semibold">{product.author}</p>
                                        <p className="text-black-600 text-2xl font-medium">{product.genre}</p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => dispatch(addToCart(product))}
                                    className="mt-4 w-full rounded-lg bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 active:scale-95 transition"
                                >
                                    Add to Cart
                                </button>
                                {isAdmin && (
                                    <div className="flex gap-2 pt-1 border-t border-gray-100">
                                        <button
                                            onClick={() => navigate("/admin/products")}
                                            className="flex-1 bg-amber-100 text-amber-800 hover:bg-amber-200 font-semibold py-1.5 rounded-lg text-xs transition"
                                        >
                                            Edit (Admin)
                                        </button>
                                        <button
                                            onClick={() => handleDeleteProduct(id)}
                                            className="flex-1 bg-red-100 text-red-800 hover:bg-red-200 font-semibold py-1.5 rounded-lg text-xs transition"
                                        >
                                            Delete (Admin)
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
            < Footer />
        </>
    )
}

export default ProductList
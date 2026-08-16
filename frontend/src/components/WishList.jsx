import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Navbar from './Navbar';
import Footer from './Footer';
import { addToCart } from '../features/cart/cartSlice';
const WishList = () => {
  const dispatch = useDispatch();
  const wishListItems = useSelector((state) => state.wishList.lists);

  return (
    <>
      <Navbar />
      <div className='grow'>
        <h1>My WishList - {wishListItems.length}</h1>
        {wishListItems.length === 0 ? (
          <p className="text-gray-600">Your cart is empty.</p>
        ) : (
          <>
            <div className="p-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {wishListItems.map((product) => (
                <div
                  key={product.id}
                  className="w-full border border-gray-200 rounded-xl p-4 shadow hover:shadow-lg transition"
                >
                  <div
                    style={{ backgroundImage: `url(${product.imageUrl})` }}
                    className="relative bg-cover bg-center bg-no-repeat w-full h-100 rounded-lg"
                  >
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
                      Move to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      <Footer />
    </>
  )
}

export default WishList
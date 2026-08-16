import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import cartReducer from './features/cart/cartSlice.js'
import wishListReducer from './features/wishlist/wishListSlice.js'
import userReducer from './features/user/userSlice.js'

const store = configureStore({
  reducer:{
    cart: cartReducer,
    wishList: wishListReducer,
    user: userReducer
  }
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
  <Provider store={store}>
    <App />
  </Provider>
  </StrictMode>
)

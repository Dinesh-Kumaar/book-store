import { createSlice } from "@reduxjs/toolkit";

const storedCart = localStorage.getItem("cart");

const initialState = {
    items: storedCart ? JSON.parse(storedCart) : [],
}

const cartToLocalStorage = (items) => {
    localStorage.setItem("cart", JSON.stringify(items));
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart(state, action) {
            const product = action.payload;
            const productId = product._id;
            const existingItem = state.items.find((item) => item._id === productId);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                state.items.push({
                    ...action.payload,
                    quantity: 1
                });
            }
            cartToLocalStorage(state.items);
        },
        removeFromCart(state, action) {

            state.items = state.items.filter((item) => item._id !== action.payload);
            cartToLocalStorage(state.items);

        },


        // INCREASEQUANTITY AND DECREASEQUANTITY
        increaseQuantity(state, action) {
            const item = state.items.find((item) => item.id === action.payload);

            if (item) {
                item.quantity++;
            }
            cartToLocalStorage(state.items);
        },

        decreaseQuantity(state, action) {
            const item = state.items.find((item) => item.id === action.payload);

            if (item) {
                item.quantity--;

                if (item.quantity === 0) {
                    state.items = state.items.filter(
                        (item) => item.id !== action.payload,
                    );
                }
            }
            cartToLocalStorage(state.items);
        },

        clearItem: (state, action) => {
            state.items = state.items.filter((item) => item.id !== action.payload);
            cartToLocalStorage(state.items);
        },
        clearCart: (state) => {
            state.items = [];
            cartToLocalStorage(state.items);
        },

    }
})
export const { addToCart, removeFromCart, increaseQuantity, decreaseQuantity, clearItem, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
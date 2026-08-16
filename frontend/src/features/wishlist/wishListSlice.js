import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    lists: []
};

const wishListSlice = createSlice({
    name: "wishList",
    initialState,
    reducers: {
        addToList(state, action) {
            const existingList = state.lists.find((list) => list.id === action.payload.id);
            if (existingList) {
                existingList.quantity += 1;
            } else {
                state.lists.push({
                    ...action.payload,
                    quantity: 1
                });
            }
        },
        removeFromList(state, action) {
            state.lists = state.lists.filter((list) => list.id !== action.payload);
        },
    }
})
export const {addToList, removeFromList} = wishListSlice.actions;
export default wishListSlice.reducer;
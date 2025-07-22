import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: [],
  cartQuantity: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
   setCartItems: (state, action) => {
    state.cartItems = action.payload;
      state.cartQuantity = action.payload.reduce(
        (total, item) => total + (item.quantity || 1),
        0
      );
}
,
    addToCart: (state, action) => {
      const product = action.payload;
      const existingIndex = state.cartItems.findIndex((item) => item._id === product._id);
      if (existingIndex >= 0) {
        state.cartItems[existingIndex].quantity += product.quantity || 1;
      } 
      else {
        state.cartItems.push({ ...product, quantity: product.quantity || 1 });
      }
      state.cartQuantity = state.cartItems.reduce(
        (total, item) => total + (item.quantity || 1),
        0
      );
      // localStorage is handled in HandleAddToCart component
    },
    updateQuantity: (state, action) => {
      const { productID, quantity } = action.payload;
      const item = state.cartItems.find(i => i._id === productID);
      if (item) {
        item.quantity = Math.max(1, quantity); // Ensure quantity doesn't go below 1
      }
      state.cartQuantity = state.cartItems.reduce(
        (total, item) => total + (item.quantity || 1),
        0
      );
      localStorage.setItem("cart", JSON.stringify(state.cartItems));
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(i => i._id !== action.payload);
      state.cartQuantity = state.cartItems.reduce(
        (total, item) => total + (item.quantity || 1),
        0
      );
      // localStorage is handled in AddToCart component
    },
    clearCart: state => {
      state.cartItems = [];
      state.cartQuantity = 0;
      localStorage.removeItem("cart");
    },

  },
});

export const {
  setCartItems,
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart,
  setCart
} = cartSlice.actions;

export default cartSlice.reducer;

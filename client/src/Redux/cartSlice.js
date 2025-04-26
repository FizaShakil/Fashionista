import {createSlice} from '@reduxjs/toolkit'

const loadCartFromLocalStorage = () => {
  try {
    const serializedCart = localStorage.getItem('cart');
    if (serializedCart === null) {
      return { items: [] }; // no cart saved yet
    }
    return { items: JSON.parse(serializedCart) }; // Ensure the cart is wrapped in { items: [] }
  } catch (e) {
    console.warn("Could not load cart from localStorage", e);
    return { items: [] };
  }
};

const saveCartToLocalStorage = (items) => {
  try {
    const serializedCart = JSON.stringify(items);
    localStorage.setItem('cart', serializedCart);
  } catch (e) {
    console.warn("Could not save cart to localStorage", e);
  }
};

const initialState = loadCartFromLocalStorage();

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers:{
          addToCart: (state, action) => {
          const product = action.payload;
          const existingProduct = state.items.find(item => item.id === product.id);
  
        if (existingProduct) {
          // Product already in cart ➔ increase quantity
          existingProduct.quantity += 1;
        } else {
          // Product not in cart ➔ add it with quantity: 1
          state.items.push({ ...product, quantity: 1 });
        }
        saveCartToLocalStorage(state.items); 
          },

          removeFromCart: (state, action) => {
            state.items = state.items.filter(item => item.id !== action.payload);
            saveCartToLocalStorage(state.items); 
          },

          incrementQuantity: (state, action) => {
            const item = state.items.find(item => item.id === action.payload);
            if (item) item.quantity += 1;
            saveCartToLocalStorage(state.items); 
          },
          
          decrementQuantity: (state, action) => {
            const item = state.items.find(item => item.id === action.payload);
            if (item && item.quantity > 1) item.quantity -= 1;
            saveCartToLocalStorage(state.items); 
          },
        },
})

export const {addToCart, removeFromCart, incrementQuantity, decrementQuantity} = cartSlice.actions
export default cartSlice.reducer
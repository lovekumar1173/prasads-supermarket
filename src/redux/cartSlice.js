import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  isDrawerOpen: false,
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      const exists = state.items.some((item) => item.id === product.id);
      if (!exists) {
        state.items.push(product);
      }
    },
    removeFromCart: (state, action) => {
      const targetId =
        typeof action.payload === 'object' && action.payload !== null
          ? action.payload.id
          : action.payload;
      state.items = state.items.filter((item) => item.id !== targetId);
    },
    toggleCart: (state) => {
      state.isDrawerOpen = !state.isDrawerOpen;
    },
    openCart: (state) => {
      state.isDrawerOpen = true;
    },
    closeCart: (state) => {
      state.isDrawerOpen = false;
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  toggleCart,
  openCart,
  closeCart,
  clearCart,
} = cartSlice.actions;

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartCount = (state) => state.cart.items.length;
export const selectCartTotal = (state) =>
  state.cart.items.reduce((sum, item) => sum + (Number(item.price) || 0), 0);
export const selectIsCartOpen = (state) => state.cart.isDrawerOpen;
export const selectIsInCart = (productId) => (state) =>
  state.cart.items.some((item) => item.id === productId);

export default cartSlice.reducer;

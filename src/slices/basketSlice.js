import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

export const basketSlice = createSlice({
  name: "basket",
  initialState,
  reducers: {
    // Actions
    addToBasket: (state, action) => {
      state.items = [...state.items, action.payload]
    },
    removeFromBasket: (state, action) => {
      const index = state.items.findIndex(basketItem => basketItem.SKU === action.payload.SKU)
      let newBasket = [...state.items];
      if (index >= 0) {
        // Item exists in the basket...remove...
        newBasket.splice(index, 1);
      } else {
        console.warn(`Can't remove product (id: ${action.payload.SKU})as its not in the basket.`)
      }
      state.items = newBasket;
    },
  },
});

export const { addToBasket, removeFromBasket } = basketSlice.actions;

// Selectors - This is how we pull information from the Global store slice
export const selectBasketItems = (state) => state.basket.items;
export const selectBasketTotal = (state) => 
state.basket.items.reduce((total,item)=>total + item.price, 0)
export default basketSlice.reducer;

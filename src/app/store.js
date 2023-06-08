import { configureStore } from "@reduxjs/toolkit";
import basketReducer from "../slices/basketSlice";
import collectionReducer from '../slices/collectionSlice';

// Global Store
export const store = configureStore({
  reducer: {
    basket: basketReducer,
    collection: collectionReducer,
  },
});

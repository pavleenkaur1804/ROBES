import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    items: [],
};

export const collectionSlice = createSlice({
    name: "collection",
    initialState,
    reducers: {
        // Actions
        addToCollection: (state, action) => {
            state.items = [...state.items, action.payload]
        },
        removeFromCollection: (state, action) => {
            const index = state.items.findIndex(collectionItem => collectionItem.SKU === action.payload.SKU)
            let newCollection = [...state.items];
            if (index >= 0) {
                // Item exists in the collection...remove...
                newCollection.splice(index, 1);
            } else {
                console.warn(`Can't remove product (SKU: ${action.payload.SKU})as its not in the collection.`)
            }
            state.items = newCollection;
        },
    },
});

export const { addToCollection, removeFromCollection } = collectionSlice.actions;

// Selectors - This is how we pull information from the Global store slice
export const selectCollectionItems = (state) => state.collection.items;
export const selectCollectionTotal = (state) =>
    state.collection.items.reduce((total, item) => total + item.price, 0)
export default collectionSlice.reducer;

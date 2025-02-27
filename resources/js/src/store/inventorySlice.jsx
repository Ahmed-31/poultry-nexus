import {createAsyncThunk, createSlice, createSelector} from '@reduxjs/toolkit';
import {addInventory, deleteInventory, getInventory, updateInventory} from '../services/inventoryService';

// Async thunk to fetch inventory data
export const fetchInventory = createAsyncThunk('inventory/fetchInventory', async () => {
    return await getInventory();
});

// Async thunk to add an inventory item
export const addInventoryItem = createAsyncThunk('inventory/addInventoryItem', async (data) => {
    return await addInventory(data);
});

// Async thunk to update an inventory item
export const updateInventoryItem = createAsyncThunk('inventory/updateInventoryItem', async ({id, data}) => {
    return await updateInventory(id, data);
});

// Async thunk to delete an inventory item
export const removeInventoryItem = createAsyncThunk('inventory/removeInventoryItem', async (id) => {
    await deleteInventory(id);
    return id; // Return the deleted item's ID
});

// Slice definition
const inventorySlice = createSlice({
    name: 'inventory',
    initialState: {
        items: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchInventory.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchInventory.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchInventory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(addInventoryItem.fulfilled, (state, action) => {
                state.items.push(action.payload);
            })
            .addCase(updateInventoryItem.fulfilled, (state, action) => {
                state.items = state.items.map((item) =>
                    item.id === action.payload.id ? action.payload : item
                );
            })
            .addCase(removeInventoryItem.fulfilled, (state, action) => {
                state.items = state.items.filter((item) => item.id !== action.payload);
            });
    },
});

export const selectInventory = createSelector(
    (state) => state.inventory.items,
    (items) => items
);

export default inventorySlice.reducer;

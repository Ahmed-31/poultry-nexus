import {createAsyncThunk, createSlice, createSelector} from '@reduxjs/toolkit';
import {addWarehouse, deleteWarehouse, getWarehouses, getWarehousesTable, updateWarehouse} from '../services/warehouseService';

export const fetchWarehouses = createAsyncThunk('warehouse/fetchWarehouses', async () => {
    return await getWarehouses();
});

export const fetchWarehousesTable = createAsyncThunk('warehouse/fetchWarehousesTable', async () => {
    return await getWarehousesTable();
});

export const addWarehouseItem = createAsyncThunk('warehouse/addWarehouseItem', async (data) => {
    return await addWarehouse(data);
});

// Async thunk to update an warehouse item
export const updateWarehouseItem = createAsyncThunk('warehouse/updateWarehouseItem', async ({id, data}) => {
    return await updateWarehouse(id, data);
});

// Async thunk to delete an warehouse item
export const removeWarehouseItem = createAsyncThunk('warehouse/removeWarehouseItem', async (id) => {
    await deleteWarehouse(id);
    return id; // Return the deleted item's ID
});

const warehouseSlice = createSlice({
    name: 'warehouse',
    initialState: {
        items: [],
        dataTable: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchWarehouses.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchWarehousesTable.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchWarehouses.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchWarehousesTable.fulfilled, (state, action) => {
                state.loading = false;
                state.dataTable = action.payload;
            })
            .addCase(fetchWarehouses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(fetchWarehousesTable.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(addWarehouseItem.fulfilled, (state, action) => {
                state.items.push(action.payload);
            })
            .addCase(updateWarehouseItem.fulfilled, (state, action) => {
                state.items = state.items.map((item) =>
                    item.id === action.payload.id ? action.payload : item
                );
            })
            .addCase(removeWarehouseItem.fulfilled, (state, action) => {
                state.items = state.items.filter((item) => item.id !== action.payload);
            });
    },
});

export const warehousesSelector = createSelector(
    (state) => state.warehouses.items,
    (items) => items,
);

export default warehouseSlice.reducer;

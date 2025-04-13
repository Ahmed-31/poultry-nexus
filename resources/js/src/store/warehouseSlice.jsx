import {createAsyncThunk, createSlice, createSelector} from '@reduxjs/toolkit';
import {createWarehouse, deleteWarehouse, getWarehouses, getWarehousesTable, updateWarehouse} from '../services/warehouseService';

export const fetchWarehouses = createAsyncThunk('warehouse/fetchWarehouses', async (_, {rejectWithValue}) => {
    try {
        return await getWarehouses();
    } catch (e) {
        return rejectWithValue(e.response?.data || e.message);
    }
});

export const fetchWarehousesTable = createAsyncThunk('warehouse/fetchWarehousesTable', async (_, {rejectWithValue}) => {
    try {
        return await getWarehousesTable();
    } catch (e) {
        return rejectWithValue(e.response?.data || e.message);
    }
});

export const addWarehouse = createAsyncThunk('warehouse/addWarehouse', async ({data}, {rejectWithValue}) => {
    try {
        return await createWarehouse(data);
    } catch (e) {
        return rejectWithValue(e.response?.data || e.message);
    }
});

export const editWarehouse = createAsyncThunk('warehouse/editWarehouse', async ({id, data}, {rejectWithValue}) => {
    try {
        return await updateWarehouse(id, data);
    } catch (e) {
        return rejectWithValue(e.response?.data || e.message);
    }
});

export const removeWarehouse = createAsyncThunk('warehouse/removeWarehouse', async ({id}, {rejectWithValue}) => {
    try {
        await deleteWarehouse(id);
        return id;
    } catch (e) {
        return rejectWithValue(e.response?.data || e.message);
    }
});

const warehouseSlice = createSlice({
    name: 'warehouse',
    initialState: {
        list: [],
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
                state.list = action.payload;
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
            .addCase(addWarehouse.fulfilled, (state, action) => {
                state.list.push(action.payload);
            })
            .addCase(editWarehouse.fulfilled, (state, action) => {
                state.list = state.list.map((item) =>
                    item.id === action.payload.id ? action.payload : item
                );
            })
            .addCase(removeWarehouse.fulfilled, (state, action) => {
                state.list = state.list.filter((item) => item.id !== action.payload);
            });
    },
});

export const warehousesSelector = createSelector(
    (state) => state.warehouses.list,
    (list) => list,
);

export default warehouseSlice.reducer;

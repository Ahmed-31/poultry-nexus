import {createAsyncThunk, createSelector, createSlice} from '@reduxjs/toolkit';
import {
    addStock,
    deleteStock,
    getStock,
    getStockTable,
    updateStock,
    issueStock,
    transferStock,
    adjustStock
} from '../services/stockService';

export const fetchStock = createAsyncThunk('stock/fetchStock', async (_, {rejectWithValue}) => {
    try {
        return await getStock();
    } catch (e) {
        return rejectWithValue(e.response?.data || e.message);
    }
});

export const fetchStockTable = createAsyncThunk('stock/fetchStockTable', async (_, {rejectWithValue}) => {
    try {
        return await getStockTable();
    } catch (e) {
        return rejectWithValue(e.response?.data || e.message);
    }
});

export const addStockItem = createAsyncThunk('stock/addStockItem', async ({data}, {rejectWithValue}) => {
    try {
        return await addStock(data);
    } catch (e) {
        return rejectWithValue(e.response?.data || e.message);
    }
});

export const updateStockItem = createAsyncThunk('stock/updateStockItem', async ({id, data}, {rejectWithValue}) => {
    try {
        return await updateStock(id, data);
    } catch (e) {
        return rejectWithValue(e.response?.data || e.message);
    }
});

export const removeStockItem = createAsyncThunk('stock/removeStockItem', async ({id}, {rejectWithValue}) => {
    try {
        await deleteStock(id);
        return id;
    } catch (e) {
        return rejectWithValue(e.response?.data || e.message);
    }
});

export const issueStockItem = createAsyncThunk(
    "stock/issueStockItem",
    async ({id, data}, {rejectWithValue}) => {
        try {
            return await issueStock(id, data);
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const transferStockItem = createAsyncThunk(
    "stock/transferStockItem",
    async ({id, data}, {rejectWithValue}) => {
        try {
            return await transferStock(id, data);
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const adjustStockItem = createAsyncThunk(
    'stock/adjustStockItem',
    async ({id, data}, {rejectWithValue}) => {
        try {
            return await adjustStock(id, data);
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

const stockSlice = createSlice({
    name: 'stock',
    initialState: {
        list: [],
        dataTable: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchStock.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchStock.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchStock.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(fetchStockTable.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchStockTable.fulfilled, (state, action) => {
                state.loading = false;
                state.dataTable = action.payload;
            })
            .addCase(fetchStockTable.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(addStockItem.fulfilled, (state, action) => {
                state.list.push(action.payload);
            })
            .addCase(updateStockItem.fulfilled, (state, action) => {
                state.list = state.list.map((item) =>
                    item.id === action.payload.id ? action.payload : item
                );
            })
            .addCase(removeStockItem.fulfilled, (state, action) => {
                state.list = state.list.filter((item) => item.id !== action.payload);
            })
            .addCase(issueStockItem.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(issueStockItem.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.list = state.list.filter(item => item.id !== action.meta.arg.id);
            })
            .addCase(issueStockItem.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })
            .addCase(transferStockItem.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(transferStockItem.fulfilled, (state, action) => {
                state.status = "succeeded";
            })
            .addCase(transferStockItem.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })
            .addCase(adjustStockItem.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(adjustStockItem.fulfilled, (state, action) => {
                state.status = "succeeded";
                const updated = action.payload;
                state.list = state.list.map(item =>
                    item.id === updated.id ? updated : item
                );
            })
            .addCase(adjustStockItem.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            });
    },
});

export const selectStock = createSelector(
    (state) => state.stock.list,
    (list) => list
);

export default stockSlice.reducer;

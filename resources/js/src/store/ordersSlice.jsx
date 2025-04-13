import {createSlice, createAsyncThunk, createSelector} from '@reduxjs/toolkit';
import {
    getOrders,
    getOrder,
    addOrder,
    updateOrder,
    deleteOrder,
    getOrdersTable
} from '../services/orderService';

export const fetchOrders = createAsyncThunk('orders/fetchOrders', async (_, {rejectWithValue}) => {
    try {
        return await getOrders();
    } catch (e) {
        return rejectWithValue(e.response?.data || e.message);
    }
});

export const fetchOrder = createAsyncThunk('orders/fetchOrder', async ({id}, {rejectWithValue}) => {
    try {
        return await getOrder(id);
    } catch (e) {
        return rejectWithValue(e.response?.data || e.message);
    }
});

export const fetchOrdersTable = createAsyncThunk('orders/fetchOrdersTable', async (_, {rejectWithValue}) => {
    try {
        return await getOrdersTable();
    } catch (e) {
        return rejectWithValue(e.response?.data || e.message);
    }
});

export const createOrder = createAsyncThunk('orders/addOrder', async ({order}, {rejectWithValue}) => {
    try {
        return await addOrder(order);
    } catch (e) {
        return rejectWithValue(e.response?.data || e.message);
    }
});

export const editOrder = createAsyncThunk('orders/editOrder', async ({id, order}, {rejectWithValue}) => {
    try {
        return await updateOrder(id, order);
    } catch (e) {
        return rejectWithValue(e.response?.data || e.message);
    }
});

export const removeOrder = createAsyncThunk('orders/removeOrder', async ({id}, {rejectWithValue}) => {
    try {
        await deleteOrder(id);
        return id;
    } catch (e) {
        return rejectWithValue(e.response?.data || e.message);
    }
});

const ordersSlice = createSlice({
    name: 'orders',
    initialState: {
        list: [],
        dataTable: [],
        order: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchOrders.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchOrder.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchOrdersTable.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.order = action.payload;
            })
            .addCase(fetchOrdersTable.fulfilled, (state, action) => {
                state.loading = false;
                state.dataTable = action.payload;
            })
            .addCase(fetchOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(fetchOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(fetchOrdersTable.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.list.push(action.payload);
            })
            .addCase(editOrder.fulfilled, (state, action) => {
                state.list = state.list.map((order) =>
                    order.id === action.payload.id ? action.payload : order
                );
            })
            .addCase(removeOrder.fulfilled, (state, action) => {
                state.list = state.list.filter((order) => order.id !== action.payload);
            });
    },
});

export const ordersSelector = createSelector(
    (state) => state.orders.list,
    (list) => list,
);

export default ordersSlice.reducer;

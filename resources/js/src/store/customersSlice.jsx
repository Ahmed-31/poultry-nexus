import {createSlice, createAsyncThunk, createSelector} from '@reduxjs/toolkit';
import {
    getCustomers,
    getCustomer,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    getCustomersTable
} from '../services/customersService';

export const fetchCustomers = createAsyncThunk('customers/fetchCustomers', async (_, {rejectWithValue}) => {
    try {
        return await getCustomers();
    } catch (e) {
        return rejectWithValue(e.response?.data || e.message);
    }
});

export const fetchCustomer = createAsyncThunk('customers/fetchCustomer', async ({id}, {rejectWithValue}) => {
    try {
        return await getCustomer(id);
    } catch (e) {
        return rejectWithValue(e.response?.data || e.message);
    }
});

export const fetchCustomersTable = createAsyncThunk('customers/fetchCustomersTable', async (_, {rejectWithValue}) => {
    try {
        return await getCustomersTable();
    } catch (e) {
        return rejectWithValue(e.response?.data || e.message);
    }
});

export const createCustomer = createAsyncThunk('customers/addCustomer', async ({customer}, {rejectWithValue}) => {
    try {
        return await addCustomer(customer);
    } catch (e) {
        return rejectWithValue(e.response?.data || e.message);
    }
});

export const editCustomer = createAsyncThunk('customers/editCustomer', async ({id, customer}, {rejectWithValue}) => {
    try {
        return await updateCustomer(id, customer);
    } catch (e) {
        return rejectWithValue(e.response?.data || e.message);
    }
});

export const removeCustomer = createAsyncThunk('customers/removeCustomer', async ({id}, {rejectWithValue}) => {
    try {
        await deleteCustomer(id);
        return id;
    } catch (e) {
        return rejectWithValue(e.response?.data || e.message);
    }
});

const customersSlice = createSlice({
    name: 'customers',
    initialState: {
        list: [],
        dataTable: [],
        customer: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCustomers.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchCustomer.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchCustomersTable.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchCustomers.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchCustomer.fulfilled, (state, action) => {
                state.loading = false;
                state.customer = action.payload;
            })
            .addCase(fetchCustomersTable.fulfilled, (state, action) => {
                state.loading = false;
                state.dataTable = action.payload;
            })
            .addCase(fetchCustomers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(fetchCustomer.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(fetchCustomersTable.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(createCustomer.fulfilled, (state, action) => {
                state.list.push(action.payload);
            })
            .addCase(editCustomer.fulfilled, (state, action) => {
                state.list = state.list.map((customer) =>
                    customer.id === action.payload.id ? action.payload : customer
                );
            })
            .addCase(removeCustomer.fulfilled, (state, action) => {
                state.list = state.list.filter((customer) => customer.id !== action.payload);
            });
    },
});

export const customersSelector = createSelector(
    (state) => state.customers.list,
    (list) => list,
);

export default customersSlice.reducer;

import {createSlice, createAsyncThunk, createSelector} from '@reduxjs/toolkit';
import {
    getProductBundles,
    getProductBundlesTable,
    createProductBundle,
    updateProductBundle,
    deleteProductBundle
} from '../services/productBundleService.jsx';

export const fetchProductBundles = createAsyncThunk('productBundles/fetchProductBundles', async (_, {rejectWithValue}) => {
    try {
        return await getProductBundles();
    } catch (e) {
        return rejectWithValue(e.response?.data || e.message);
    }
});

export const fetchProductBundlesTable = createAsyncThunk('productBundles/fetchProductBundlesTable', async (_, {rejectWithValue}) => {
    try {
        return await getProductBundlesTable();
    } catch (e) {
        return rejectWithValue(e.response?.data || e.message);
    }
});

export const addProductBundle = createAsyncThunk('products/addProductBundle', async ({productBundle}, {rejectWithValue}) => {
    try {
        return await createProductBundle(productBundle);
    } catch (e) {
        return rejectWithValue(e.response?.data || e.message);
    }
});

export const editProductBundle = createAsyncThunk('products/editProductBundle', async ({id, productBundle}, {rejectWithValue}) => {
    try {
        return await updateProductBundle(id, productBundle);
    } catch (e) {
        return rejectWithValue(e.response?.data || e.message);
    }
});

export const removeProductBundle = createAsyncThunk('products/removeProductBundle', async ({id}, {rejectWithValue}) => {
    try {
        await deleteProductBundle(id);
        return id;
    } catch (e) {
        return rejectWithValue(e.response?.data || e.message);
    }
});

const productBundlesSlice = createSlice({
    name: 'productBundles',
    initialState: {
        list: [],
        dataTable: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProductBundles.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchProductBundlesTable.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchProductBundles.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchProductBundlesTable.fulfilled, (state, action) => {
                state.loading = false;
                state.dataTable = action.payload;
            })
            .addCase(fetchProductBundles.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(fetchProductBundlesTable.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(addProductBundle.fulfilled, (state, action) => {
                state.list.push(action.payload);
            })
            .addCase(editProductBundle.fulfilled, (state, action) => {
                state.list = state.list.map((productBundle) =>
                    productBundle.id === action.payload.id ? action.payload : productBundle
                );
            })
            .addCase(removeProductBundle.fulfilled, (state, action) => {
                state.list = state.list.filter((productBundle) => productBundle.id !== action.payload);
            });
    },
});

export const productBundlesSelector = createSelector(
    (state) => state.productBundles.list,
    (list) => list,
);

export default productBundlesSlice.reducer;

import {createSlice, createAsyncThunk, createSelector} from '@reduxjs/toolkit';
import {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductsTable,
    importProducts
} from '../services/productService';

export const fetchProducts = createAsyncThunk('products/fetchProducts', async (_, {rejectWithValue}) => {
    try {
        return await getProducts();
    } catch (e) {
        return rejectWithValue(e.response?.data || e.message);
    }
});

export const fetchProductsTable = createAsyncThunk('products/fetchProductsTable', async (_, {rejectWithValue}) => {
    try {
        return await getProductsTable();
    } catch (e) {
        return rejectWithValue(e.response?.data || e.message);
    }
});

export const addProduct = createAsyncThunk('products/addProduct', async ({product}, {rejectWithValue}) => {
    try {
        return await createProduct(product);
    } catch (e) {
        return rejectWithValue(e.response?.data || e.message);
    }
});

export const editProduct = createAsyncThunk('products/editProduct', async ({id, product}, {rejectWithValue}) => {
    try {
        return await updateProduct(id, product);
    } catch (e) {
        return rejectWithValue(e.response?.data || e.message);
    }
});

export const removeProduct = createAsyncThunk('products/removeProduct', async ({id}, {rejectWithValue}) => {
    try {
        await deleteProduct(id);
        return id;
    } catch (e) {
        return rejectWithValue(e.response?.data || e.message);
    }
});

export const uploadProducts = createAsyncThunk(
    'products/uploadProducts',
    async (formData, {rejectWithValue}) => {
        try {
            const response = await importProducts(formData);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || 'Upload failed.');
        }
    }
);

const productsSlice = createSlice({
    name: 'products',
    initialState: {
        list: [],
        dataTable: [],
        uploading: false,
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchProductsTable.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchProductsTable.fulfilled, (state, action) => {
                state.loading = false;
                state.dataTable = action.payload;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(fetchProductsTable.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(addProduct.fulfilled, (state, action) => {
                state.list.push(action.payload);
            })
            .addCase(editProduct.fulfilled, (state, action) => {
                state.list = state.list.map((product) =>
                    product.id === action.payload.id ? action.payload : product
                );
            })
            .addCase(removeProduct.fulfilled, (state, action) => {
                state.list = state.list.filter((product) => product.id !== action.payload);
            })
            .addCase(uploadProducts.pending, (state) => {
                state.uploading = true;
            })
            .addCase(uploadProducts.fulfilled, (state) => {
                state.uploading = false;
            })
            .addCase(uploadProducts.rejected, (state, action) => {
                state.uploading = false;
                state.error = action.payload || 'Upload failed.';
            });
    },
});

export const productsSelector = createSelector(
    (state) => state.products.list,
    (list) => list,
);

export default productsSlice.reducer;

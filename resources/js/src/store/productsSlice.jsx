import {createSlice, createAsyncThunk, createSelector} from '@reduxjs/toolkit';
import {getProducts, createProduct, updateProduct, deleteProduct, getProductsTable} from '../services/productService';

// Async actions
export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
    return await getProducts();
});

export const fetchProductsTable = createAsyncThunk('products/fetchProductsTable', async () => {
    return await getProductsTable();
});

export const addProduct = createAsyncThunk('products/addProduct', async (product) => {
    return await createProduct(product);
});

export const editProduct = createAsyncThunk('products/editProduct', async ({id, product}) => {
    return await updateProduct(id, product);
});

export const removeProduct = createAsyncThunk('products/removeProduct', async (id) => {
    await deleteProduct(id);
    return id;
});

// Slice definition
const productsSlice = createSlice({
    name: 'products',
    initialState: {
        list: [],
        dataTable: [],
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
            });
    },
});

export const productsSelector = createSelector(
    (state) => state.products.list,
    (list) => list,
);

export default productsSlice.reducer;

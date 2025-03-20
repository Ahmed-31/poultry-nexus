import {createSlice, createAsyncThunk, createSelector} from '@reduxjs/toolkit';
import {getCategories, createCategory, updateCategory, deleteCategory, getCategoriesTable} from '../services/categoryService.jsx';

// Async actions
export const fetchCategories = createAsyncThunk('categories/fetchCategories', async () => {
    return await getCategories();
});

export const fetchCategoriesTable = createAsyncThunk('categories/fetchCategoriesTable', async () => {
    return await getCategoriesTable();
});

export const addProduct = createAsyncThunk('categories/addProduct', async (category) => {
    return await createCategory(category);
});

export const editProduct = createAsyncThunk('categories/editProduct', async ({id, category}) => {
    return await updateCategory(id, category);
});

export const removeProduct = createAsyncThunk('categories/removeProduct', async (id) => {
    await deleteCategory(id);
    return id;
});

// Slice definition
const categoriesSlice = createSlice({
    name: 'categories',
    initialState: {
        list: [],
        dataTable: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategories.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchCategoriesTable.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchCategoriesTable.fulfilled, (state, action) => {
                state.loading = false;
                state.dataTable = action.payload;
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(fetchCategoriesTable.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(addProduct.fulfilled, (state, action) => {
                state.list.push(action.payload);
            })
            .addCase(editProduct.fulfilled, (state, action) => {
                state.list = state.list.map((category) =>
                    category.id === action.payload.id ? action.payload : category
                );
            })
            .addCase(removeProduct.fulfilled, (state, action) => {
                state.list = state.list.filter((category) => category.id !== action.payload);
            });
    },
});

export const categoriesSelector = createSelector(
    (state) => state.categories.list,
    (list) => list,
);

export default categoriesSlice.reducer;

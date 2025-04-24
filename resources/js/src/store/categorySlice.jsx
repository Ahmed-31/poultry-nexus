import {createSlice, createAsyncThunk, createSelector} from '@reduxjs/toolkit';
import {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    getCategoriesTable
} from '../services/categoryService.jsx';

export const fetchCategories = createAsyncThunk('categories/fetchCategories', async (_, {rejectWithValue}) => {
    try {
        return await getCategories();
    } catch (e) {
        return rejectWithValue(e.response?.data || e.message);
    }
});

export const fetchCategoriesTable = createAsyncThunk('categories/fetchCategoriesTable', async (_, {rejectWithValue}) => {
    try {
        return await getCategoriesTable();
    } catch (e) {
        return rejectWithValue(e.response?.data || e.message);
    }
});

export const addCategory = createAsyncThunk('categories/addCategory', async ({category}, {rejectWithValue}) => {
    try {
        return await createCategory(category);
    } catch (e) {
        return rejectWithValue(e.response?.data || e.message);
    }
});

export const editCategory = createAsyncThunk('categories/editCategory', async ({id, category}, {rejectWithValue}) => {
    try {
        return await updateCategory(id, category);
    } catch (e) {
        return rejectWithValue(e.response?.data || e.message);
    }
});

export const removeCategory = createAsyncThunk('categories/removeCategory', async ({id}, {rejectWithValue}) => {
    try {
        await deleteCategory(id);
        return id;
    } catch (e) {
        return rejectWithValue(e.response?.data || e.message);
    }
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
            .addCase(addCategory.fulfilled, (state, action) => {
                state.list.push(action.payload);
            })
            .addCase(editCategory.fulfilled, (state, action) => {
                state.list = state.list.map((category) =>
                    category.id === action.payload.id ? action.payload : category
                );
            })
            .addCase(removeCategory.fulfilled, (state, action) => {
                state.list = state.list.filter((category) => category.id !== action.payload);
            });
    },
});

export const categoriesSelector = createSelector(
    (state) => state.categories.list,
    (list) => list,
);

export default categoriesSlice.reducer;

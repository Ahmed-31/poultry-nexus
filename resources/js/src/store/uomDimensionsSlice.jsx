import {createAsyncThunk, createSlice, createSelector} from '@reduxjs/toolkit';
import {addUomDimension, deleteUomDimension, getUomDimensions, getUomDimensionsTable, updateUomDimension} from '../services/uomDimensionsService.jsx';

export const fetchUomDimensions = createAsyncThunk('uomDimension/fetchUomDimensions', async (_, {rejectWithValue}) => {
    try {
        return await getUomDimensions();
    } catch (e) {
        return rejectWithValue(e.response?.data || e.message);
    }
});

export const fetchUomDimensionsTable = createAsyncThunk('uomDimension/fetchUomDimensionsTable', async (_, {rejectWithValue}) => {
    try {
        return await getUomDimensionsTable();
    } catch (e) {
        return rejectWithValue(e.response?.data || e.message);
    }
});

export const addUomDimensionItem = createAsyncThunk('uomDimension/addUomDimensionItem', async ({data}, {rejectWithValue}) => {
    try {
        return await addUomDimension(data);
    } catch (e) {
        return rejectWithValue(e.response?.data || e.message);
    }
});

export const updateUomDimensionItem = createAsyncThunk('uomDimension/updateUomDimensionItem', async ({id, data}, {rejectWithValue}) => {
    try {
        return await updateUomDimension(id, data);
    } catch (e) {
        return rejectWithValue(e.response?.data || e.message);
    }
});

export const removeUomDimensionItem = createAsyncThunk('uomDimension/removeUomDimensionItem', async ({id}, {rejectWithValue}) => {
    try {
        await deleteUomDimension(id);
        return id;
    } catch (e) {
        return rejectWithValue(e.response?.data || e.message);
    }
});

const uomDimensionsSlice = createSlice({
    name: 'uomDimensions',
    initialState: {
        list: [],
        dataTable: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUomDimensions.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUomDimensionsTable.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUomDimensions.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchUomDimensionsTable.fulfilled, (state, action) => {
                state.loading = false;
                state.dataTable = action.payload;
            })
            .addCase(fetchUomDimensions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(fetchUomDimensionsTable.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(addUomDimensionItem.fulfilled, (state, action) => {
                state.list.push(action.payload);
            })
            .addCase(updateUomDimensionItem.fulfilled, (state, action) => {
                state.list = state.list.map((item) =>
                    item.id === action.payload.id ? action.payload : item
                );
            })
            .addCase(removeUomDimensionItem.fulfilled, (state, action) => {
                state.list = state.list.filter((item) => item.id !== action.payload);
            });
    },
});

export const uomDimensionsSelector = createSelector(
    (state) => state.uomDimensions.list,
    (list) => list,
);

export default uomDimensionsSlice.reducer;

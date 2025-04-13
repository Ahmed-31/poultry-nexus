import {createAsyncThunk, createSlice, createSelector} from '@reduxjs/toolkit';
import {addUom, deleteUom, getUoms, getUomsTable, updateUom} from '../services/uomService';

export const fetchUoms = createAsyncThunk('uom/fetchUoms', async (_, {rejectWithValue}) => {
    try {
        return await getUoms();
    } catch (e) {
        return rejectWithValue(e.response?.data || e.message);
    }
});

export const fetchUomsTable = createAsyncThunk('uom/fetchUomsTable', async (_, {rejectWithValue}) => {
    try {
        return await getUomsTable();
    } catch (e) {
        return rejectWithValue(e.response?.data || e.message);
    }
});

export const addUomItem = createAsyncThunk('uom/addUomItem', async ({data}, {rejectWithValue}) => {
    try {
        return await addUom(data);
    } catch (e) {
        return rejectWithValue(e.response?.data || e.message);
    }
});

export const updateUomItem = createAsyncThunk('uom/updateUomItem', async ({id, data}, {rejectWithValue}) => {
    try {
        return await updateUom(id, data);
    } catch (e) {
        return rejectWithValue(e.response?.data || e.message);
    }
});

export const removeUomItem = createAsyncThunk('uom/removeUomItem', async ({id}, {rejectWithValue}) => {
    try {
        await deleteUom(id);
        return id;
    } catch (e) {
        return rejectWithValue(e.response?.data || e.message);
    }
});

const uomSlice = createSlice({
    name: 'uom',
    initialState: {
        list: [],
        dataTable: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUoms.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUomsTable.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUoms.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchUomsTable.fulfilled, (state, action) => {
                state.loading = false;
                state.dataTable = action.payload;
            })
            .addCase(fetchUoms.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(fetchUomsTable.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(addUomItem.fulfilled, (state, action) => {
                state.list.push(action.payload);
            })
            .addCase(updateUomItem.fulfilled, (state, action) => {
                state.list = state.list.map((item) =>
                    item.id === action.payload.id ? action.payload : item
                );
            })
            .addCase(removeUomItem.fulfilled, (state, action) => {
                state.list = state.list.filter((item) => item.id !== action.payload);
            });
    },
});

export const uomsSelector = createSelector(
    (state) => state.uoms.list,
    (list) => list,
);

export default uomSlice.reducer;

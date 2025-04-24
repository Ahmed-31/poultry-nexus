import {createAsyncThunk, createSlice, createSelector} from '@reduxjs/toolkit';
import {addUomGroup, deleteUomGroup, getUomGroups, getUomGroupsTable, updateUomGroup} from '../services/uomGroupService';

export const fetchUomGroups = createAsyncThunk('uom/fetchUomGroups', async (_, {rejectWithValue}) => {
    try {
        return await getUomGroups();
    } catch (e) {
        return rejectWithValue(e.response?.data || e.message);
    }
});

export const fetchUomGroupsTable = createAsyncThunk('uom/fetchUomGroupsTable', async (_, {rejectWithValue}) => {
    try {
        return await getUomGroupsTable();
    } catch (e) {
        return rejectWithValue(e.response?.data || e.message);
    }
});

export const createUomGroup = createAsyncThunk('uom/addUomGroup', async ({data}, {rejectWithValue}) => {
    try {
        return await addUomGroup(data);
    } catch (e) {
        return rejectWithValue(e.response?.data || e.message);
    }
});

export const editUomGroup = createAsyncThunk('uom/updateUomGroup', async ({id, data}, {rejectWithValue}) => {
    try {
        return await updateUomGroup(id, data);
    } catch (e) {
        return rejectWithValue(e.response?.data || e.message);
    }
});

export const removeUomGroup = createAsyncThunk('uom/removeUomGroup', async ({id}, {rejectWithValue}) => {
    try {
        await deleteUomGroup(id);
        return id;
    } catch (e) {
        return rejectWithValue(e.response?.data || e.message);
    }
});

const uomGroupSlice = createSlice({
    name: 'uomGroup',
    initialState: {
        list: [],
        dataTable: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUomGroups.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUomGroupsTable.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUomGroups.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchUomGroupsTable.fulfilled, (state, action) => {
                state.loading = false;
                state.dataTable = action.payload;
            })
            .addCase(fetchUomGroups.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(fetchUomGroupsTable.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(createUomGroup.fulfilled, (state, action) => {
                state.list.push(action.payload);
            })
            .addCase(editUomGroup.fulfilled, (state, action) => {
                state.list = state.list.map((item) =>
                    item.id === action.payload.id ? action.payload : item
                );
            })
            .addCase(removeUomGroup.fulfilled, (state, action) => {
                state.list = state.list.filter((item) => item.id !== action.payload);
            });
    },
});

export const uomGroupsSelector = createSelector(
    (state) => state.uomGroups.list,
    (list) => list,
);

export default uomGroupSlice.reducer;

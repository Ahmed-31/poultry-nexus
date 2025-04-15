import {createSlice, createAsyncThunk, createSelector} from '@reduxjs/toolkit';
import {
    getStockReservations,
    getStockReservationsTable,
    getStockReservation,
} from '@/src/services/stockReservationsService';

export const fetchStockReservations = createAsyncThunk(
    'stockReservations/fetch',
    async ({params = {}}, {rejectWithValue}) => {
        try {
            const response = await getStockReservations(params);
            return response.data;
        } catch (e) {
            return rejectWithValue(e.response?.data || e.message);
        }
    }
);

export const fetchStockReservation = createAsyncThunk(
    'stockReservations/fetchSingle',
    async (id, {rejectWithValue}) => {
        try {
            return await getStockReservation(id);
        } catch (e) {
            return rejectWithValue(e.response?.data || e.message);
        }
    }
);

export const fetchStockReservationsTable = createAsyncThunk(
    'stockReservationsTable/fetch',
    async (params = {}, {rejectWithValue}) => {
        try {
            return await getStockReservationsTable(params);
        } catch (e) {
            return rejectWithValue(e.response?.data || e.message);
        }
    }
);

const stockReservationsSlice = createSlice({
    name: 'stockReservations',
    initialState: {
        list: [],
        dataTable: [],
        selected: null,
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchStockReservations.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchStockReservations.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchStockReservations.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(fetchStockReservationsTable.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchStockReservationsTable.fulfilled, (state, action) => {
                state.loading = false;
                state.dataTable = action.payload;
            })
            .addCase(fetchStockReservationsTable.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(fetchStockReservation.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.selected = null;
            })
            .addCase(fetchStockReservation.fulfilled, (state, action) => {
                state.loading = false;
                state.selected = action.payload;
            })
            .addCase(fetchStockReservation.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});

export const stockReservationsSelector = createSelector(
    (state) => state.stockReservations.list,
    (list) => list,
);

export const selectedReservationSelector = (state) => state.stockReservations.selected;

export default stockReservationsSlice.reducer;

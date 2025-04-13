import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import {getStockMovements, getStockMovementsTable, createStockMovement} from "@/src/services/stockMovementService.jsx";

export const fetchStockMovements = createAsyncThunk('stockMovements/fetchStockMovements', async (_, {rejectWithValue}) => {
    try {
        return await getStockMovements();
    } catch (e) {
        return rejectWithValue(e.response?.data || e.message);
    }
});

export const fetchStockMovementsTable = createAsyncThunk('products/fetchStockMovementsTable', async (_, {rejectWithValue}) => {
    try {
        return await getStockMovementsTable();
    } catch (e) {
        return rejectWithValue(e.response?.data || e.message);
    }
});

export const addStockMovement = createAsyncThunk('stockMovements/addStockMovement', async ({stockMovement}, {rejectWithValue}) => {
    try {
        return await createStockMovement(stockMovement);
    } catch (e) {
        return rejectWithValue(e.response?.data || e.message);
    }
});

const stockMovementsSlice = createSlice({
    name: "stockMovements",
    initialState: {
        list: [],
        dataTable: [],
        loading: false,
        error: false
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchStockMovements.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchStockMovements.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchStockMovements.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(fetchStockMovementsTable.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchStockMovementsTable.fulfilled, (state, action) => {
                state.loading = false;
                state.dataTable = action.payload;
            })
            .addCase(fetchStockMovementsTable.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(addStockMovement.fulfilled, (state, action) => {
                state.list.push(action.payload);
            })
    }
});

export default stockMovementsSlice.reducer;

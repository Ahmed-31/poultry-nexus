import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import {getStockMovements, createStockMovement} from "@/src/services/stockMovementService.jsx";

export const fetchStockMovements = createAsyncThunk('stockMovements/fetchStockMovements', async () => {
    return await getStockMovements();
});

export const addStockMovement = createAsyncThunk('stockMovements/addStockMovement', async (stockMovement) => {
    return await createStockMovement(stockMovement);
});

const stockMovementsSlice = createSlice({
    name: "stockMovements",
    initialState: {
        list: [],
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
            .addCase(addStockMovement.fulfilled, (state, action) => {
                state.list.push(action.payload);
            })
    }
});

export default stockMovementsSlice.reducer;

import {configureStore} from '@reduxjs/toolkit';
import inventoryReducer from './inventorySlice';
import productsReducer from './productsSlice';
import stockMovementsReducer from './stockMovementsSlice';
import warehousesReducer from './warehouseSlice';

const store = configureStore({
    reducer: {
        inventory: inventoryReducer,
        products: productsReducer,
        stockMovements: stockMovementsReducer,
        warehouses: warehousesReducer
    },
});

export default store;

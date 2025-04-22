import {configureStore} from '@reduxjs/toolkit';
import stockReducer from './stockSlice';
import productsReducer from './productsSlice';
import stockMovementsReducer from './stockMovementsSlice';
import warehousesReducer from './warehouseSlice';
import uomsReducer from './uomSlice';
import categoryReducer from './categorySlice';
import uomDimensionsReducer from './uomDimensionsSlice';
import productBundlesReducer from './productBundlesSlice.jsx';
import ordersReducer from './ordersSlice';
import customersReducer from './customersSlice';
import stockReservationsReducer from './stockReservationsSlice';
import languageReducer from './languageSlice';

const store = configureStore({
    reducer: {
        stock: stockReducer,
        products: productsReducer,
        stockMovements: stockMovementsReducer,
        warehouses: warehousesReducer,
        uoms: uomsReducer,
        categories: categoryReducer,
        uomDimensions: uomDimensionsReducer,
        productBundles: productBundlesReducer,
        orders: ordersReducer,
        customers: customersReducer,
        stockReservations: stockReservationsReducer,
        language: languageReducer,
    },
});

export default store;
